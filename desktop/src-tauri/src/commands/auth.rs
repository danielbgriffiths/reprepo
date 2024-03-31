// External Usages
use oauth2;
use reqwest;
use oauth2::{AccessToken, AuthUrl, Client, ClientId, ClientSecret, RedirectUrl, RevocationUrl, StandardRevocableToken, TokenUrl};
use oauth2::{TokenResponse};
use oauth2::{AuthorizationCode, CsrfToken, PkceCodeChallenge, Scope};
use url::Url;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use oauth2::basic::{BasicClient, BasicErrorResponse, BasicRevocationErrorResponse, BasicTokenIntrospectionResponse, BasicTokenResponse, BasicTokenType};
use std::env;
use diesel::result::Error;
use diesel::{Connection};
use tauri::State;
use jsonwebtoken::{encode, Header, EncodingKey};
use webbrowser;

// Local Usages
use crate::state::AppState;
use crate::libs::error::LocalError;
use crate::models::auth::{GoogleOAuthUserTokenBody, AuthedSignatureClaims, OauthProvider, AllAuthFields, CreateAuth};
use crate::models::auth_account::{CreateAuthAccount, PartialCreateAuthAccount};
use crate::models::user::{CreateUser, PartialCreateUser};
use crate::services::account::{create_account_if_not_exists};
use crate::services::auth::{select_auth_core, create_auth_if_not_exists_by_email, select_auth_fields_from_auth};
use crate::services::auth_account::{create_auth_account_if_not_exists, remove_auth_account_tokens, select_auth_fields_from_account};
use crate::services::user::create_user_if_not_exists;

fn get_google_oauth_client() -> Client<
    BasicErrorResponse,
    BasicTokenResponse,
    BasicTokenType,
    BasicTokenIntrospectionResponse,
    StandardRevocableToken,
    BasicRevocationErrorResponse
> {
    let google_client_id_env = env::var("GOOGLE_CLIENT_ID")
        .expect("Missing the GOOGLE_CLIENT_ID environment variable.");
    let google_client_secret_env = env::var("GOOGLE_CLIENT_SECRET")
        .expect("Missing the GOOGLE_CLIENT_SECRET environment variable.");
    let google_auth_url_env = env::var("GOOGLE_AUTH_URL")
        .expect("Missing the GOOGLE_AUTH_URL environment variable.");
    let google_token_url_env = env::var("GOOGLE_TOKEN_URL")
        .expect("Missing the GOOGLE_TOKEN_URL environment variable.");
    let google_token_revoke_url_env = env::var("GOOGLE_TOKEN_REVOKE_URL")
        .expect("Missing the GOOGLE_TOKEN_REVOKE_URL environment variable.");
    let oauth_redirect_url_env = env::var("OAUTH_REDIRECT_URL")
        .expect("Missing the OAUTH_REDIRECT_URL environment variable.");

    let auth_url = AuthUrl::new(google_auth_url_env)
        .expect("Invalid authorization endpoint URL");
    let token_url = TokenUrl::new(google_token_url_env)
        .expect("Invalid token endpoint URL");
    let redirect_url = RedirectUrl::new(oauth_redirect_url_env)
        .expect("Invalid redirect URL");
    let google_token_revoke_url = RevocationUrl::new(google_token_revoke_url_env)
        .expect("Invalid revocation endpoint URL");

     BasicClient::new(
         ClientId::new(google_client_id_env),
         Some(ClientSecret::new(google_client_secret_env)),
         auth_url,
         Some(token_url)
     )
        .set_redirect_uri(redirect_url)
        .set_revocation_uri(google_token_revoke_url)
}

fn create_oauth_redirect_listener() -> (AuthorizationCode, CsrfToken) {
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();

    let Some(mut stream) = listener.incoming().flatten().next() else {
        panic!("listener terminated without accepting a connection");
    };

    let mut reader = BufReader::new(&stream);

    let mut request_line = String::new();
    reader.read_line(&mut request_line).unwrap();

    let redirect_url = request_line.split_whitespace().nth(1).unwrap();
    let url = Url::parse(&("http://localhost".to_string() + redirect_url)).unwrap();

    let code = url
        .query_pairs()
        .find(|(key, _)| key == "code")
        .map(|(_, code)| AuthorizationCode::new(code.into_owned()))
        .unwrap();

    let state = url
        .query_pairs()
        .find(|(key, _)| key == "state")
        .map(|(_, state)| CsrfToken::new(state.into_owned()))
        .unwrap();

    let message = "Go back to your terminal :)";
    let response = format!(
        "HTTP/1.1 200 OK\r\ncontent-length: {}\r\n\r\n{}",
        message.len(),
        message
    );
    stream.write_all(response.as_bytes()).unwrap();

    (code, state)
}

fn create_or_find_account_auth_user_records(
    app_state: &State<AppState>,
    target_account_id: &Option<i32>,
    new_auth: CreateAuth,
    partial_new_auth_account: PartialCreateAuthAccount,
    partial_new_user: PartialCreateUser
) -> Result<(i32, i32), Error> {
    let db_connection = &mut app_state.pool.get().unwrap();

    db_connection.transaction(|db_connection| {
        let account_id = create_account_if_not_exists(db_connection, &target_account_id).unwrap();
        let auth_id = create_auth_if_not_exists_by_email(db_connection, &new_auth).unwrap();
        let _auth_account_id_result = create_auth_account_if_not_exists(db_connection, &CreateAuthAccount {
            auth_id: &auth_id,
            account_id: &account_id,
            access_token: partial_new_auth_account.access_token,
            refresh_token: partial_new_auth_account.refresh_token
        });
        let _user_id_result = create_user_if_not_exists(db_connection, &CreateUser {
            auth_id: &auth_id,
            first_name: &partial_new_user.first_name,
            last_name: &partial_new_user.last_name,
            avatar: &partial_new_user.avatar,
            locale: &partial_new_user.locale,
        });
        Ok((auth_id, account_id))
    })
}

#[tauri::command]
pub fn create_google_oauth(app_state: State<AppState>, existing_account_id: Option<i32>, existing_auth_id: Option<i32>) -> Result::<(String, i32), LocalError> {
    let google_oauth_client = get_google_oauth_client();

    let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, _csrf_state) = google_oauth_client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("https://www.googleapis.com/auth/calendar".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/plus.me".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.email".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/user.phonenumbers.read".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/user.gender.read".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/user.birthday.read".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/user.addresses.read".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.profile".to_string()))
        .set_pkce_challenge(pkce_code_challenge)
        .url();

    if !webbrowser::open(&authorize_url.to_string()).is_ok() {
        return Err(LocalError::ProcessError { message: "Unable to open web browser".to_string() })
    }

    let (code, _csrf_state) = create_oauth_redirect_listener();

    let basic_token_response = google_oauth_client
        .exchange_code(code.clone())
        .set_pkce_verifier(pkce_code_verifier)
        .request(&oauth2::reqwest::http_client)
        .unwrap();

    let google_user_info_url_env = env::var("GOOGLE_USER_INFO_URL")
        .expect("Missing the GOOGLE_USER_INFO_URL environment variable.");

    let user_info_response_result = reqwest::blocking::Client::new()
        .get(google_user_info_url_env)
        .header(reqwest::header::AUTHORIZATION,  format!("Bearer {}", basic_token_response.access_token().secret()))
        .header(reqwest::header::CONTENT_TYPE,  "application/json".to_string())
        .header(reqwest::header::ACCEPT,  "application/json".to_string())
        .send();

    match user_info_response_result {
        Ok(user_info_response) => {
            let user_info_token_body_result = user_info_response.json::<GoogleOAuthUserTokenBody>();

            match user_info_token_body_result {
                Ok(user_info_token_body) => {

                    if existing_auth_id.is_some() {
                        let auth_core_result = select_auth_core(&app_state, &existing_auth_id.unwrap());
                        let auth_core = auth_core_result.unwrap();
                        if auth_core.email != user_info_token_body.email {
                            return Err(LocalError::ProcessError {
                                message: format!("auth/token mismatch. {}/{}", auth_core.email, user_info_token_body.email)
                            })
                        }
                    }

                    let auth_creation_result: Result<(i32, i32), Error> = match existing_auth_id {
                        Some(auth_id) => Ok((auth_id, existing_account_id.unwrap())),
                        None => create_or_find_account_auth_user_records(
                            &app_state,
                            &existing_account_id,
                            CreateAuth {
                                email: &user_info_token_body.email,
                                password: None,
                                provider: &OauthProvider::Google,
                            },
                            PartialCreateAuthAccount {
                                access_token: Some(basic_token_response.access_token().secret().clone()),
                                refresh_token: Some(basic_token_response.refresh_token().unwrap().secret().clone()),
                            },
                            PartialCreateUser {
                                first_name: &user_info_token_body.given_name,
                                last_name: &user_info_token_body.family_name,
                                avatar: &user_info_token_body.picture,
                                locale: &user_info_token_body.locale,
                            },
                        )
                    };

                    match auth_creation_result {
                        Ok((auth_id, account_id)) => {
                            match select_auth_core(&app_state, &auth_id) {
                                Ok(auth_core) => {
                                    let claims = AuthedSignatureClaims {
                                        id: auth_core.id,
                                        email: auth_core.email,
                                        account_id,
                                        exp: 1735689600, // TODO: 01-01-2025
                                    };

                                    let authed_signature_secret = env::var("AUTHED_SIGNATURE_SECRET")
                                        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

                                    let token_result = encode(
                                        &Header::default(),
                                        &claims,
                                        &EncodingKey::from_secret(authed_signature_secret.as_ref())
                                    );

                                    match token_result {
                                        Ok(token) => Ok((token, account_id)),
                                        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
                                    }
                                },
                                Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
                            }
                        },
                        Err(e) => Err(LocalError::DatabaseError { message: e.to_string()  })
                    }
                },
                Err(e) => Err(LocalError::ExternalError { message: e.to_string() })
            }
        },
        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
    }
}

fn select_all_auth_fields(app_state: &State<AppState>, target_account_id: &i32, target_auth_id: &i32) -> Result<AllAuthFields, LocalError> {
    Ok(AllAuthFields {
        auth_fields_from_auth_account: select_auth_fields_from_account(app_state, target_account_id, target_auth_id)
            .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?,
        auth_fields_from_auth: select_auth_fields_from_auth(app_state, target_auth_id)
            .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?,
    })
}

fn has_access_tokens(auth_fields: &AllAuthFields) -> bool {
    auth_fields.auth_fields_from_auth_account.access_token.is_some() ||
        auth_fields.auth_fields_from_auth_account.refresh_token.is_some()
}

fn get_standard_revocable_token(auth_fields: &AllAuthFields) -> Option<StandardRevocableToken> {
    auth_fields.auth_fields_from_auth_account.refresh_token.as_ref()
        .or_else(|| auth_fields.auth_fields_from_auth_account.access_token.as_ref())
        .map(|token| StandardRevocableToken::from(AccessToken::new(token.to_owned())))
}

fn logout_google_oauth(
    app_state: State<AppState>,
    account_id: &i32,
    auth_id: &i32,
    auth_fields: &AllAuthFields
) -> Result::<bool, LocalError> {
    if !has_access_tokens(&auth_fields) {
        return Ok(true)
    }

    match get_standard_revocable_token(&auth_fields) {
        Some(standard_revocable_token) => {
            let revoke_response_result = get_google_oauth_client()
                .revoke_token(standard_revocable_token)
                .unwrap()
                .request(&oauth2::reqwest::http_client);

            match revoke_response_result {
                Ok(_revoke_response) => {
                    match remove_auth_account_tokens(&app_state, &account_id, &auth_id) {
                        Ok(_auth_account_id) => Ok(true),
                        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
                    }
                },
                Err(e) => Err(LocalError::ExternalError { message: e.to_string() })
            }
        },
        None => Err(LocalError::ProcessError { message: "Unable to get revocable token".to_string() }),
    }
}

#[tauri::command]
pub fn logout(app_state: State<AppState>, account_id: i32, auth_id: i32) -> Result::<bool, LocalError> {
    let all_auth_fields = select_all_auth_fields(&app_state, &account_id, &auth_id)?;

    match all_auth_fields.auth_fields_from_auth.provider {
        OauthProvider::Email => Err(LocalError::UnavailableError { message: "Email auth is not configured".to_string() }),
        OauthProvider::Google => logout_google_oauth(app_state, &account_id, &auth_id, &all_auth_fields),
        OauthProvider::Pinterest => Err(LocalError::UnavailableError { message: "Pinterest auth is not configured".to_string() }),
        OauthProvider::Instagram => Err(LocalError::UnavailableError { message: "Instagram auth is not configured".to_string() }),
    }
}