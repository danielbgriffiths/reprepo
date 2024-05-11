// External Usages
use actix_web::web;

// Local Usages
use crate::libs::error::ApiError;

pub async fn login() -> Result<web::Json<()>, ApiError> {
    Ok(web::Json({}))
}

pub async fn logout() -> Result<web::Json<()>, ApiError> {
    Ok(web::Json({}))
}