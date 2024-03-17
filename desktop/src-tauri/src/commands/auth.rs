// External Usages
use oauth2;
use reqwest;
use oauth2::{AccessToken, AuthUrl, ClientId, ClientSecret, HttpRequest, RedirectUrl, RevocationUrl, TokenUrl};
use oauth2::{StandardRevocableToken, TokenResponse};
use oauth2::{AuthorizationCode, CsrfToken, PkceCodeChallenge, Scope};
use url::Url;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpListener;
use oauth2::basic::{BasicClient, BasicTokenResponse};
use std::env;
use diesel::{Insertable, RunQueryDsl};
use tauri::State;
use diesel::prelude::*;

// Local Usages
use crate::state::AppState;
use crate::models::user::{OAuthUser};
use crate::schema::users::dsl::users;
use crate::schema::users::{email, first_name, last_name};

#[tauri::command]
pub fn create_google_oauth(app_state: State<AppState>) -> BasicTokenResponse {
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

    let token: &AccessToken = unwrapped_token.access_token();

    println!(
        "Google returned the following token SERVET:\n{:?}\n",
        token
    );

    let response: OAuthUser = reqwest::get("https://www.googleapis.com/oauth2/v1/userinfo".to_string())
        .header(reqwest::header::AUTHORIZATION, format!("Bearer {:?}", token))
        .header(reqwest::header::CONTENT_TYPE, "application/json")
        .header(reqwest::header::ACCEPT, "application/json")
        .send()
        .unwrap();

    let user = users.insert_into(users)
        .values(
            first_name.eq(response.given_name),
            last_name.eq(response.family_name),
            email.eq(response.email),
            avatar.eq(response.picture),
            access_token.eq(token),
            refresh_token.eq(unwrapped_token.refresh_token()),
            locale.eq(response.locale),
            provider.eq("google".to_string()),
        )
        .execute(&mut app_state.db_connection)
        .expect("Error inserting user");

    return unwrapped_token
}

#[tauri::command]
pub fn remove_google_oauth(token_response: BasicTokenResponse, app_state: AppState) {
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

    let token_to_revoke: StandardRevocableToken = match token_response.refresh_token() {
        Some(token) => token.into(),
        None => token_response.access_token().into(),
    };

    google_oauth_client
        .revoke_token(token_to_revoke)
        .unwrap()
        .request(&oauth2::reqwest::http_client)
        .expect("Failed to revoke token");
}


// fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
//   headers: {
//     Authorization: `Bearer ${tokenResponse.access_token}`,
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("data: ", data);
//   })
//   .catch((error) => {
//     console.error("Error: ", error);
//   });