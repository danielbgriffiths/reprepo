// External Usages
use actix_web::web;
use actix_web::web::Data;

// Local Usages
use crate::libs::error::ApiError;
use crate::services::auth_service;
use crate::data::auth_data;
use crate::models::auth::LoginGoogleOAuthBody;
use crate::models::user::AuthUser;
use crate::state::AppData;

pub async fn login_google_oauth(
    app_data: Data<AppData>,
    web::Path(user_id): web::Path<Option<i32>>,
    body: web::Json<LoginGoogleOAuthBody>
) -> Result<web::Json<AuthUser>, ApiError> {
    let auth_user = auth_service::create_or_confirm_auth_and_user(app_data, user_id, body).await?;
    let (auth_token, refresh_token) = auth_service::create_auth_claims_tokens(&auth_user.auth)?;
    auth_data::update_auth_tokens(&app_data.db, &auth_user.auth.id, auth_token, refresh_token).await?;

    Ok(web::Json(auth_user))
}

pub async fn logout(app_data: Data<AppData>) -> Result<String, ApiError> {
    let auth_claims = app_data.auth_claims.lock().unwrap();

    let auth = auth_data::select_by_id(&app_data.db, auth_claims.id).await?;

    if !auth.access_token.is_some() && !auth.refresh_token.is_some() {
        return Ok(None)
    }

    if let Some(standard_revocable_token) = auth_service::get_standard_revocable_token(&auth) {
        let result = auth_data::remove_auth_account_tokens(&app_data.db, &auth_claims).await;

        return match result {
            Ok(_) => Ok(standard_revocable_token),
            Err(e) => Ok(standard_revocable_token),
        }
    }

    Err(ApiError::Authentication("Unable to get revocable token for logout".to_string()))
}