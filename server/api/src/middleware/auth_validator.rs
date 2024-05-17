// External Usages
use std::env;
use actix_web::dev::ServiceRequest;
use actix_web::Error as ActixError;
use actix_web::web::Data;
use actix_web::error;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use chrono::Utc;

// Local Usages
use crate::data::user_data;
use crate::models::user::ApiClaims;
use crate::state::AppData;

pub async fn middleware(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (ActixError, ServiceRequest)> {
    let authed_signature_secret_env = match env::var("AUTHED_SIGNATURE_SECRET") {
        Ok(env) => env,
        Err(_) => return Err((error::ErrorInternalServerError("Cannot find secret"), req))
    };

    let token = credentials.token();
    let decoded_api_claims = match decode::<ApiClaims>(
        token,
        &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
        &Validation::new(Algorithm::HS256)
    ) {
        Ok(claims) => claims,
        Err(_) => return Err((error::ErrorUnauthorized("Unable to decode token"), req))
    };


    if decoded_api_claims.claims.exp < Utc::now().timestamp() {
        return Err((error::ErrorUnauthorized("JWT Expired"), req));
    }

    let app_data = match req.app_data::<Data<AppData>>() {
        Some(data) => data,
        None => return Err((error::ErrorUnauthorized("Cannot access app data"), req))
    };

    let selected_user = match user_data::select_by_id(&app_data.db, decoded_api_claims.claims.sub).await {
        Ok(user) => user,
        Err(_) => return Err((error::ErrorUnauthorized("Cannot access user"), req))
    };

    {
        let mut user = app_data.user.lock().await;
        *user = Some(selected_user);
    }

    Ok(req)
}