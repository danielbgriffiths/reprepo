// External Usages
use actix_web::web;

// Local Usages
use crate::libs::error::ApiError;

pub async fn get_users() -> Result<web::Json<()>, ApiError> {
    Ok(web::Json({}))
}

pub async fn get_authenticated_user() -> Result<web::Json<()>, ApiError> {
    Ok(web::Json({}))
}