// External Usages
use oauth2;
use reqwest;
use oauth2::{AuthUrl, ClientId, ClientSecret, RedirectUrl, RevocationUrl, TokenUrl};
use oauth2::{TokenResponse};
use oauth2::{AuthorizationCode, CsrfToken, PkceCodeChallenge, Scope};
use url::Url;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use oauth2::basic::{BasicClient};
use std::env;
use diesel::{RunQueryDsl};
use tauri::State;
use diesel::prelude::*;
use jsonwebtoken::{encode, Header, EncodingKey};

// Local Usages
use crate::state::AppState;
use crate::models::user::{CreateOAuthUser, GoogleOAuthUserTokenBody, OauthProvider, AuthedSignatureClaims, User};
use crate::schema::users::dsl::users;
use crate::schema::users::{id};

#[tauri::command]
pub fn create_google_oauth(app_state: State<AppState>) -> Option<String> {
    let google_client_id = ClientId::new(
        env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID environment variable."),
    );
    let google_client_secret = ClientSecret::new(
        env::var("GOOGLE_CLIENT_SECRET")
            .expect("Missing the GOOGLE_CLIENT_SECRET environment variable."),
    );
    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
        .expect("Invalid authorization endpoint URL");
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
        .expect("Invalid token endpoint URL");

    let google_oauth_client = BasicClient::new(google_client_id, Some(google_client_secret), auth_url, Some(token_url))
        .set_redirect_uri(
            RedirectUrl::new("http://localhost:8080".to_string()).expect("Invalid redirect URL"),
        )
        .set_revocation_uri(
            RevocationUrl::new("https://oauth2.googleapis.com/revoke".to_string())
                .expect("Invalid revocation endpoint URL"),
        );

    let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, csrf_state) = google_oauth_client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/calendar".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/plus.me".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.email".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/user.phonenumbers.read".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/user.gender.read".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/user.birthday.read".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/user.addresses.read".to_string(),
        ))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.profile".to_string(),
        ))
        .set_pkce_challenge(pkce_code_challenge)
        .url();

    println!("Open this URL in your browser:\n{authorize_url}\n");

    let (code, state) = {
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
    };

    let token_response = google_oauth_client
        .exchange_code(code.clone())
        .set_pkce_verifier(pkce_code_verifier)
        .request(&oauth2::reqwest::http_client);

    println!("Google returned the following code:\n{}\n", code.secret());
    println!(
        "Google returned the following state:\n{} (expected `{}`)\n",
        state.secret(),
        csrf_state.secret()
    );
    println!(
        "Google returned the following token:\n{:?}\n",
        token_response
    );

    let unwrapped_token = token_response.unwrap();

    let oauth_access_token = unwrapped_token.access_token();
    let oauth_refresh_token = unwrapped_token.refresh_token();

    println!("Bearer {}", oauth_access_token.secret());

    let reqwest_client = reqwest::blocking::Client::new();
    let wrapped_response = reqwest_client
        .get("https://www.googleapis.com/oauth2/v1/userinfo")
        .header(reqwest::header::AUTHORIZATION,  format!("Bearer {}", oauth_access_token.secret()))
        .header(reqwest::header::CONTENT_TYPE,  "application/json".to_string())
        .header(reqwest::header::ACCEPT,  "application/json".to_string())
        .send();

    println!(
        "Wrapped Response:\n{:?}\n",
        wrapped_response
    );

    let wrapped_json = wrapped_response
        .unwrap()
        .json::<GoogleOAuthUserTokenBody>();

    match wrapped_json {
        Ok(response) => {
            println!(
                "User information in token response:\n{:?}\n",
                response.id
            );

            let db_connection = &mut app_state.pool.get().unwrap();

            let new_user = CreateOAuthUser {
                first_name: &response.given_name,
                last_name: &response.family_name,
                email: &response.email,
                avatar: &response.picture,
                access_token: &oauth_access_token.secret(),
                refresh_token: &oauth_refresh_token.unwrap().secret(),
                locale: &response.locale,
                provider: &OauthProvider::Google,
            };

            let user_id = diesel::insert_into(users)
                .values(&new_user)
                .returning(id)
                .get_result::<i32>(db_connection)
                .unwrap();

            println!(
                "USer inserted:\n{:?}\n",
                user_id
            );

            let user = users
                .find(user_id)
                .select(User::as_select())
                .first(db_connection)
                .expect("Error loading users");

            println!(
                "user returned:\n{:?}\n",
                user.first_name
            );

            let claims = AuthedSignatureClaims {
                id: user.id,
                email: user.email,
                exp: 1735689600, // TODO: 01-01-2025
            };

            let authed_signature_secret = env::var("AUTHED_SIGNATURE_SECRET")
                .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

            Some(encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret(authed_signature_secret.as_ref())
            ).unwrap())
        },
        Err(e) => {
            println!(
                "e:\n{:?}\n",
                e
            );

            None
        }
    }
}

#[tauri::command]
pub fn remove_google_oauth(user_id: i32, app_state: State<AppState>) {

    let db_connection = &mut app_state.pool.get().unwrap();

    let _user = users
        .find(user_id)
        .select(User::as_select())
        .first(db_connection)
        .expect("Error loading users");


    // let new_refresh_token: Option<&RefreshToken> = match user.refresh_token {
    //     Some(token) => &RefreshToken::new(token),
    //     None => match user.access_token {
    //         Some(token) => &RefreshToken::new(token),
    //         None => None
    //     }
    // };
    //
    // match new_refresh_token {
    //     Some(token) => {
    //         let google_client_id = ClientId::new(
    //             env::var("GOOGLE_CLIENT_ID").expect("Missing the GOOGLE_CLIENT_ID environment variable."),
    //         );
    //         let google_client_secret = ClientSecret::new(
    //             env::var("GOOGLE_CLIENT_SECRET")
    //                 .expect("Missing the GOOGLE_CLIENT_SECRET environment variable."),
    //         );
    //         let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
    //             .expect("Invalid authorization endpoint URL");
    //         let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())
    //             .expect("Invalid token endpoint URL");
    //
    //         let google_oauth_client = BasicClient::new(
    //             google_client_id,
    //             Some(google_client_secret),
    //             auth_url,
    //             Some(token_url)
    //         )
    //             .set_redirect_uri(
    //                 RedirectUrl::new("http://localhost:8080".to_string()).expect("Invalid redirect URL"),
    //             )
    //             .set_revocation_uri(
    //                 RevocationUrl::new("https://oauth2.googleapis.com/revoke".to_string())
    //                     .expect("Invalid revocation endpoint URL"),
    //             );
    //
    //         google_oauth_client
    //             .revoke_token(token.into())
    //             .unwrap()
    //             .request(&oauth2::reqwest::http_client)
    //             .expect("Failed to revoke token");
    //     },
    //     _ => Option::None,
    // };
}