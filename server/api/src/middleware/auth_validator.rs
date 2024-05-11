// External Usages
use std::env;
use actix_web::dev::ServiceRequest;
use actix_web::web::Data;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};

// Local Usages
use crate::libs::error::ApiError;
use crate::services::auth_service;
use crate::models::auth::AuthClaims;
use crate::state::AppData;

pub async fn middleware(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, ApiError> {
    let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let decoded_auth_claims = decode::<AuthClaims>(
        &credentials.token(),
        &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
        &Validation::new(Algorithm::HS256)
    )
        .map_err(|e| ApiError::Authentication(e.to_string()))?;

    let app_data = req.app_data::<Data<AppData>>();

    if let Some(data) = app_data {
        let auth = auth_service::select_with_validated_claims(&data.db, decoded_auth_claims.claims)
            .map_err(|e| ApiError::Authentication(e.to_string()))?;

        let mut auth_claims = data.auth_claims.lock().unwrap();
        *auth_claims = Some(auth.into_claims());

        return Ok(req)
    }

    return Err(ApiError::Authentication("Unable to get app data!"))
}