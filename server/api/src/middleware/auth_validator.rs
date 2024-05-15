// External Usages
use std::env;
use actix_web::dev::ServiceRequest;
use actix_web::web::Data;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use chrono::Utc;

// Local Usages
use crate::libs::error::ApiError;
use crate::data::user_data;
use crate::models::user::ApiClaims;
use crate::state::AppData;

pub async fn middleware(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, ApiError> {
    let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let decoded_api_claims = decode::<ApiClaims>(
        &credentials.token(),
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

        let mut user = data.user.lock().unwrap();
        *user = Some(user);

        return Ok(req)
    }

    return Err(ApiError::Authentication("Unable to get app data!"))
}