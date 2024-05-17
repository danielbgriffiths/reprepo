// External Usages
use actix_web::{HttpRequest, web};
use actix_web::web::Data;
use std::env;
use chrono::Utc;
use jsonwebtoken::{Algorithm, decode, DecodingKey, Validation};

// Local Usages
use crate::libs::error::ApiError;
use crate::services::user_service;
use crate::data::user_data;
use crate::models::user::{ApiClaims, User, LoginGoogleOAuthBody};
use crate::state::AppData;

pub async fn login_google_oauth(
    app_data: Data<AppData>,
    user_id: web::Path<Option<i32>>,
    body: web::Json<LoginGoogleOAuthBody>
) -> Result<web::Json<User>, ApiError> {
    let user = user_service::create_or_confirm_user(app_data.clone(), user_id.into_inner(), body).await?;
    let (access_token, refresh_token) = user_service::create_claims(&user).await?;
    user_data::update_tokens(&app_data.db, &user.id, access_token, refresh_token).await?;

    Ok(web::Json(user))
}

pub async fn refresh_token(req: HttpRequest) -> Result<web::Json<User>, ApiError> {
    let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let bearer_token = req.headers().get("Authorization")
        .and_then(|header| header.to_str().ok())
        .and_then(|header| if header.starts_with("Bearer ") { Some(&header[7..]) } else { None })
        .ok_or(ApiError::Authentication("No Bearer token found".to_string()))?;

    let decoded_api_claims = decode::<ApiClaims>(
        &bearer_token,
        &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
        &Validation::new(Algorithm::HS256)
    )
        .map_err(|e| ApiError::Authentication(e.to_string()))?;


    if decoded_api_claims.claims.exp < Utc::now().timestamp() {
        return Err(ApiError::ExpiredJWT("JWT is expired".to_string()))
    }

    let app_data = req.app_data::<Data<AppData>>();

    if let Some(data) = app_data {
        let user = user_data::select_by_id(
            &data.db,
            decoded_api_claims.claims.sub,
        )
            .await?;

        let (access_token, refresh_token) = user_service::create_claims(&user).await?;

        let updated_user = user_data::update_tokens(&data.db, &user.id, access_token, refresh_token).await?;

        return Ok(web::Json(updated_user))
    }

    return Err(ApiError::Authentication("Unable to get app data!".to_string()))
}

pub async fn get_user(app_data: Data<AppData>) -> Result<web::Json<User>, ApiError> {
    let user_guard = app_data.user.lock().await;

    if let Some(user) = user_guard.as_ref() {
        Ok(web::Json(user.clone()))
    } else {
        Err(ApiError::Unauthorized("Could not find authenticated user".to_string()))
    }
}

pub async fn logout(app_data: Data<AppData>) -> Result<String, ApiError> {
    let user_guard = app_data.user.lock().await;

    if let Some(user) = user_guard.as_ref() {
        if !user.access_token.is_some() && !user.refresh_token.is_some() {
           return Err(ApiError::Unauthorized("Could not log out".to_string()))
        }

        user_data::remove_tokens(&app_data.db, &user.id).await?;

        return Ok("Logged out".to_string())
    }

    Err(ApiError::Unauthorized("Could not log out".to_string()))
}