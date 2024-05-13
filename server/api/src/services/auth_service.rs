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
use crate::models::auth::{Auth, CreateAuth, IntoAuthClaims, LoginGoogleOAuthBody, WithUser};
use crate::models::user::{AddAuthId, AuthUser, PartialCreateUser};
use crate::schema::sql_types::OauthProvider;
use crate::state::{AppData, DbPool};
use crate::data::auth_data;
use crate::data::user_data;
use crate::libs::error::ApiError;

pub fn get_standard_revocable_token(auth: &Auth) -> Option<StandardRevocableToken> {
    auth.refresh_token.as_ref()
        .or_else(|| auth.access_token.as_ref())
        .map(|token| StandardRevocableToken::from(AccessToken::new(token.to_owned())))
}

fn create_auth_and_user_transaction(
    db: &DbPool,
    create_auth: CreateAuth,
    create_user: PartialCreateUser
) -> Result<(i32, i32), ApiError> {
    let db_connection = &mut db.get().unwrap();

    db_connection.transaction(|db_connection| {
        let auth_id = auth_data::create_auth(db_connection, &create_auth)?;
        let user_id = user_data::create_user(db_connection, &create_user.add_auth_id(auth_id).unwrap())?;
        Ok((auth_id, user_id))
    })
}

pub async fn create_or_confirm_auth_and_user(
    app_data: Data<AppData>,
    user_id: Option<i32>,
    body: web::Json<LoginGoogleOAuthBody>
) -> Result<AuthUser, ApiError> {
    let token_claims = body.token_claims.clone();

    if user_id.is_some() {
        let user = user_data::select_by_id(&app_data.db, user_id.unwrap()).await?;
        let auth = auth_data::select_by_id(&app_data.db, user.auth_id).await?;

        if auth.email != token_claims.email {
            return Err(ApiError::GoogleOAuth(format!("auth/token mismatch. {}/{}", auth.email, token_claims.email)))
        }

        return Ok(auth.with_user(user).unwrap());
    }

    let (created_auth_id, created_user_id) = create_auth_and_user_transaction(
        &app_data.db,
        CreateAuth {
            email: token_claims.email,
            password: None,
            provider: OauthProvider::Google,
        },
        PartialCreateUser {
            first_name: token_claims.given_name,
            last_name: token_claims.family_name,
            avatar: token_claims.picture,
            locale: token_claims.locale,
        },
    )?;

    let user = user_data::select_by_id(&app_data.db, created_user_id).await?;
    let auth = auth_data::select_by_id(&app_data.db, created_auth_id).await?;

    Ok(auth.with_user(user).unwrap())
}

pub async fn create_auth_claims_tokens(auth: &Auth) -> Result<(String, String), ApiError> {
    let authed_signature_secret = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let defaults = &Header::default();
    let signature = &EncodingKey::from_secret(authed_signature_secret.as_ref());

    let claims = auth.clone().into_auth_claims(Utc::now() + Duration::minutes(15), "access".to_string());
    let refresh_claims = auth.clone().into_auth_claims(Utc::now() + Duration::days(7), "refresh".to_string());

    let access_token = encode(defaults, &claims, signature)
        .map_err(|e| ApiError::GoogleOAuth(e.to_string()))?;
    let refresh_token = encode(defaults, &refresh_claims, signature)
        .map_err(|e| ApiError::GoogleOAuth(e.to_string()))?;

    Ok((access_token, refresh_token))
}
