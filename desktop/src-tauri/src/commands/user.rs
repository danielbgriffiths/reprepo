// External Usages
use tauri::{State};
use std::env;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use crate::models::commands::{CommandError, CommandErrorType, CommandResponse};


// Local Usages
use crate::models::user::{UserSummary};
use crate::models::auth::{AuthedSignatureClaims};
use crate::state::{AppState};
use crate::services::user::{select_user_summaries, select_user_summary};

#[tauri::command]
pub fn get_user_summaries(app_state: State<AppState>) -> CommandResponse::<Vec<UserSummary>> {
    match select_user_summaries(&app_state) {
        Ok(user_summaries) => CommandResponse::<Vec<UserSummary>> {
            data: Some(user_summaries),
            error: None
        },
        Err(e) => CommandResponse::<Vec<UserSummary>> {
            data: Some(Vec::new()),
            error: Some(CommandError {
                message: format!("Error selecting user summaries: {}", e),
                error_type: Some(CommandErrorType::Database)
            })
        }
    }
}

#[tauri::command]
pub fn get_authenticated_user_summary(authed_signature: Option<String>, app_state: State<AppState>) -> CommandResponse::<UserSummary> {
    match authed_signature {
        Some(signature) => {
            let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
                .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

            let authed_signature_result = decode::<AuthedSignatureClaims>(
                &signature,
                &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
                &Validation::new(Algorithm::HS256)
            );

            match authed_signature_result {
                Ok(authed_signature) => {
                    match select_user_summary(&app_state) {
                        Ok(user_summary) => {
                            if authed_signature.claims.id == user_summary.id && authed_signature.claims.email == user_summary.email {
                                return CommandResponse::<UserSummary> {
                                    data: Some(user_summary),
                                    error: None
                                }
                            }

                            return CommandResponse::<UserSummary> {
                                data: None,
                                error: Some(CommandError {
                                    message: "Token data did not match stored data".to_string(),
                                    error_type: Some(CommandErrorType::Process)
                                })
                            }
                        },
                        Err(e) => CommandResponse::<UserSummary> {
                            data: None,
                            error: Some(CommandError {
                                message: format!("Error selecting user summary: {}", e),
                                error_type: Some(CommandErrorType::Database)
                            })
                        }
                    }
                },
                Err(e) => CommandResponse::<UserSummary> {
                    data: None,
                    error: Some(CommandError {
                        message: format!("Error decoding token: {}", e),
                        error_type: Some(CommandErrorType::External)
                    })
                }
            }
        },
        None => CommandResponse::<UserSummary> {
            data: None,
            error: Some(CommandError {
                message: "No auth signature provided".to_string(),
                error_type: Some(CommandErrorType::Process)
            })
        }
    }
}