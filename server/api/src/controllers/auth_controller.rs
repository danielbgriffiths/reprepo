// External Usages
use actix_web::web;
use actix_web::web::Data;

// Local Usages
use crate::libs::error::ApiError;
use crate::services::auth_service;
use crate::models::user::{GoogleOAuthTokenClaims, User};
use crate::state::AppData;

pub async fn login_google_oauth(
    app_data: Data<AppData>,
    web::Path(user_id): web::Path<Option<i32>>,
    body: web::Json<GoogleOAuthTokenClaims>
) -> Result<web::Json<User>, ApiError> {
    let user = auth_service::create_or_confirm_user(app_data, user_id, body).await?;
    let (access_token, refresh_token) = auth_service::create_claims(&user)?;
    user_data::update_tokens(&app_data.db, &user.id, access_token, refresh_token).await?;

    Ok(web::Json(user))
}

pub async fn get_user(app_data: Data<AppData>) -> Result<web::Json<User>, ApiError> {
    let user = app_data.user.lock().unwrap();
    Ok(web::Json(user))
}

pub async fn logout(app_data: Data<AppData>) -> Result<String, ApiError> {
    let user = app_data.user.lock().unwrap();

    if !user.access_token.is_some() && !user.refresh_token.is_some() {
        return Ok(None)
    }

    user_data::remove_tokens(&app_data.db, &user).await?;

    Ok("Logged out".to_string())
}