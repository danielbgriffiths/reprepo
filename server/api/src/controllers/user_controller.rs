// External Usages
use actix_web::web;
use actix_web::web::Data;

// Local Usages
use crate::libs::error::ApiError;
use crate::models::user::{User};
use crate::state::AppData;
use crate::data::user_data;

pub async fn get_users(app_data: Data<AppData>, user_ids: web::Path<Vec<i32>>) -> Result<web::Json<Vec<User>>, ApiError> {
    let users = user_data::select_users_by_id(&app_data.db, user_ids.into_inner()).await?;
    Ok(web::Json(users))
}