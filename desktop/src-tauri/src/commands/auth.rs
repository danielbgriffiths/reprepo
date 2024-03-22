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
use tauri::State;
use jsonwebtoken::{encode, Header, EncodingKey};

// Local Usages
use crate::state::AppState;
use crate::models::user::{CreateOAuthUser, OauthProvider};
use crate::models::auth::{GoogleOAuthUserTokenBody, AuthedSignatureClaims, UserAuthenticationFields};
use crate::models::commands::{CommandErrorType, CommandError, CommandResponse};
use crate::services::user::{create_user, select_user_core, update_user_access_tokens_null, select_user_authentication_fields};

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

#[tauri::command]
pub fn create_google_oauth(app_state: State<AppState>, existing_user_id: Option<i32>) -> CommandResponse::<String> {
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

    use webbrowser;

    if !webbrowser::open(&authorize_url.to_string()).is_ok() {
        return CommandResponse::<String> {
            data: None,
            error: Some(CommandError {
                message: "Unable to open web browser".to_string(),
                error_type: Some(CommandErrorType::Process),
            })
        }
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

                    if existing_user_id.is_some() {
                        let existing_user_core = select_user_core(&app_state, &existing_user_id.unwrap()).unwrap();
                        if existing_user_core.email != user_info_token_body.email {
                            return CommandResponse::<String> {
                                data: None,
                                error: Some(CommandError {
                                    message: format!("Existing user core does not match token. Existing: {}, Token: {}", existing_user_core.email, user_info_token_body.email),
                                    error_type: Some(CommandErrorType::Process)
                                })
                            }
                        }
                    }

                    let user_id = match existing_user_id {
                        Some(user_id) => Ok(user_id),
                        None => create_user(&app_state, &CreateOAuthUser {
                            first_name: &user_info_token_body.given_name,
                            last_name: &user_info_token_body.family_name,
                            email: &user_info_token_body.email,
                            avatar: &user_info_token_body.picture,
                            access_token: &basic_token_response.access_token().secret(),
                            refresh_token: &basic_token_response.refresh_token().unwrap().secret(),
                            locale: &user_info_token_body.locale,
                            provider: &OauthProvider::Google,
                        })
                    };

                    match user_id {
                        Ok(user_id) => {
                            match select_user_core(&app_state, &user_id) {
                                Ok(user) => {
                                    let claims = AuthedSignatureClaims {
                                        id: user.id,
                                        email: user.email,
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
                                        Ok(token) => CommandResponse::<String> {
                                            data: Some(token),
                                            error: None,
                                        },
                                        Err(e) => CommandResponse::<String> {
                                            data: None,
                                            error: Some(CommandError {
                                                message: format!("Error encoding token: {}", e),
                                                error_type: Some(CommandErrorType::Process)
                                            })
                                        }
                                    }
                                },
                                Err(e) => CommandResponse::<String> {
                                    data: None,
                                    error: Some(CommandError {
                                        message: format!("Error getting created user: {}", e),
                                        error_type: Some(CommandErrorType::Database)
                                    })
                                }
                            }
                        },
                        Err(e) => CommandResponse::<String> {
                            data: None,
                            error: Some(CommandError {
                                message: format!("Error creating user: {}", e),
                                error_type: Some(CommandErrorType::Database)
                            })
                        }
                    }
                },
                Err(e) => CommandResponse::<String> {
                    data: None,
                    error: Some(CommandError {
                        message: format!("Error parsing user info response JSON: {}", e),
                        error_type: Some(CommandErrorType::External)
                    })
                }
            }
        },
        Err(e) => CommandResponse::<String> {
            data: None,
            error: Some(CommandError {
                message: format!("Error fetching user info response: {}", e),
                error_type: Some(CommandErrorType::Process)
            })
        }
    }
}

fn logout_google_oauth(app_state: State<AppState>, user_id: i32, auth_fields: UserAuthenticationFields) -> CommandResponse::<bool> {
    if !auth_fields.access_token.is_some() && !auth_fields.refresh_token.is_some() {
        return CommandResponse::<bool> {
            data: Some(true),
            error: None
        }
    }

    let standard_revocable_token_option = match auth_fields.refresh_token {
        Some(authed_refresh_token) => Some(StandardRevocableToken::from(AccessToken::new(authed_refresh_token.to_owned()))),
        None => match auth_fields.access_token {
            Some(authed_access_token) => Some(StandardRevocableToken::from(AccessToken::new(authed_access_token.to_owned()))),
            None => None
        }
    };

    match standard_revocable_token_option {
        Some(standard_revocable_token) => {
            let google_oauth_client = get_google_oauth_client();

            let revoke_response_result = google_oauth_client
                .revoke_token(standard_revocable_token)
                .unwrap()
                .request(&oauth2::reqwest::http_client);

            match revoke_response_result {
                Ok(_revoke_response) => {
                    match update_user_access_tokens_null(&app_state, &user_id) {
                        Ok(_user_id) => CommandResponse::<bool> {
                            error: None,
                            data: Some(true)
                        },
                        Err(_e) => CommandResponse::<bool> {
                            error: Some(CommandError {
                                message: "Unable to update user data".to_string(),
                                error_type: Some(CommandErrorType::Database)
                            }),
                            data: None
                        }
                    }
                },
                Err(_e) => CommandResponse::<bool> {
                    error: Some(CommandError {
                        message: "Unable revoke oauth token".to_string(),
                        error_type: Some(CommandErrorType::External)
                    }),
                    data: None
                }
            }
        },
        None => CommandResponse::<bool> {
            error: Some(CommandError {
                message: "Unable to get revocable token".to_string(),
                error_type: Some(CommandErrorType::Process)
            }),
            data: None
        },
    }
}

#[tauri::command]
pub fn logout(user_id: i32, app_state: State<AppState>) -> CommandResponse::<bool> {
    match select_user_authentication_fields(&app_state, &user_id) {
        Ok(user_authentication_fields) => {
            match user_authentication_fields.provider {
                OauthProvider::Email => CommandResponse::<bool> {
                    error: Some(CommandError {
                        message: "Email auth is not configured".to_string(),
                        error_type: Some(CommandErrorType::Unavailable)
                    }),
                    data: None
                },
                OauthProvider::Google => logout_google_oauth(app_state, user_id, user_authentication_fields),
                OauthProvider::Pinterest => CommandResponse::<bool> {
                    error: Some(CommandError {
                        message: "Pinterest OAuth is not configured".to_string(),
                        error_type: Some(CommandErrorType::Unavailable)
                    }),
                    data: None
                },
                OauthProvider::Instagram => CommandResponse::<bool> {
                    error: Some(CommandError {
                        message: "Instagram OAuth is not configured".to_string(),
                        error_type: Some(CommandErrorType::Unavailable)
                    }),
                    data: None
                }
            }
        },
        Err(e) => CommandResponse::<bool> {
            error: Some(CommandError {
                message: format!("Unable to select user: {}", e),
                error_type: Some(CommandErrorType::Database)
            }),
            data: None
        }
    }
}