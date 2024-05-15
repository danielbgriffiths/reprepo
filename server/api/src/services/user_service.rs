// External Usages
use oauth2::{AccessToken, StandardRevocableToken};
use std::env;
use actix_web::web;
use actix_web::web::Data;
use chrono::{Utc, Duration};
use diesel::Connection;
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::prelude::*;

// Local Usages
use crate::models::user::{CreateUser, IntoApiClaims, LoginGoogleOAuthBody, User};
use crate::schema::sql_types::OauthProvider;
use crate::state::{AppData, DbPool};
use crate::data::user_data;
use crate::libs::error::ApiError;

pub fn get_standard_revocable_token(user: &User) -> Option<StandardRevocableToken> {
    user.refresh_token.as_ref()
        .or_else(|| user.access_token.as_ref())
        .map(|token| StandardRevocableToken::from(AccessToken::new(token.to_owned())))
}

fn create_user_transaction(
    db: &DbPool,
    create_user: CreateUser
) -> Result<i32, ApiError> {
    let db_connection = &mut db.get().unwrap();

    db_connection.transaction(|db_connection| {
        let user_id = user_data::create_user(db_connection, &create_user)?;
        Ok(user_id)
    })
}

pub async fn create_or_confirm_user(
    app_data: Data<AppData>,
    user_id: Option<i32>,
    body: web::Json<LoginGoogleOAuthBody>
) -> Result<User, ApiError> {
    let token_claims = body.clone().claims;
    let role = body.clone().role;

    if user_id.is_some() {
        let user = user_data::select_by_id(&app_data.db, user_id.unwrap()).await?;

        if user.email != token_claims.email {
            return Err(ApiError::GoogleOAuth(format!("auth/token mismatch. {}/{}", user.email, token_claims.email)))
        }

        return Ok(user);
    }

    let created_user_id = create_user_transaction(
        &app_data.db,
        CreateUser {
            email: token_claims.email,
            password: None,
            provider: OauthProvider::Google,
            first_name: token_claims.given_name,
            last_name: token_claims.family_name,
            avatar: token_claims.picture,
            locale: token_claims.locale,
            role
        },
    )?;

    let user = user_data::select_by_id(&app_data.db, created_user_id).await?;

    Ok(user)
}

pub async fn create_claims(user: &User) -> Result<(String, String), ApiError> {
    let authed_signature_secret = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let defaults = &Header::default();
    let signature = &EncodingKey::from_secret(authed_signature_secret.as_ref());

    let claims = user.clone().into_api_claims(Utc::now() + Duration::minutes(15), "access".to_string());
    let refresh_claims = user.clone().into_api_claims(Utc::now() + Duration::days(7), "refresh".to_string());

    let access_token = encode(defaults, &claims, signature)
        .map_err(|e| ApiError::GoogleOAuth(e.to_string()))?;
    let refresh_token = encode(defaults, &refresh_claims, signature)
        .map_err(|e| ApiError::GoogleOAuth(e.to_string()))?;

    Ok((access_token, refresh_token))
}
