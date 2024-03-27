// External Usages
use tauri::{State};
use std::env;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use crate::models::commands::{CommandError, CommandErrorType, CommandResponse};


// Local Usages
use crate::models::user::{AuthenticatedUser, User};
use crate::models::auth::{AuthedSignatureClaims};
use crate::state::{AppState};
use crate::services::user::{select_account_users, select_authenticated_user};

#[tauri::command]
pub fn get_users(app_state: State<AppState>, account_id: Option<i32>) -> CommandResponse::<Vec<User>> {
    if !account_id.is_some() {
        return CommandResponse::<Vec<User>> {
            data: Some(Vec::new()),
            error: None
        }
    }

    match select_account_users(&app_state, &account_id.unwrap()) {
        Ok(users) => CommandResponse::<Vec<User>> {
            data: Some(users),
            error: None
        },
        Err(e) => CommandResponse::<Vec<User>> {
            data: Some(Vec::new()),
            error: Some(CommandError {
                message: format!("Error selecting account users: {}", e),
                error_type: Some(CommandErrorType::Database)
            })
        }
    }
}

#[tauri::command]
pub fn get_authenticated_user(app_state: State<AppState>, authed_signature: Option<String>, account_id: Option<i32>) -> CommandResponse::<AuthenticatedUser> {
    if !account_id.is_some() {
        return CommandResponse::<AuthenticatedUser> {
            data: None,
            error: Some(CommandError {
                message: "No account id provided".to_string(),
                error_type: Some(CommandErrorType::Process)
            })
        }
    }

    if !authed_signature.is_some() {
        return CommandResponse::<AuthenticatedUser> {
            data: None,
            error: Some(CommandError {
                message: "No auth signature provided".to_string(),
                error_type: Some(CommandErrorType::Process)
            })
        }
    }

    let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let authed_signature_result = decode::<AuthedSignatureClaims>(
        &authed_signature.unwrap(),
        &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
        &Validation::new(Algorithm::HS256)
    );

    match authed_signature_result {
        Ok(authed_signature) => {
            match select_authenticated_user(&app_state, &authed_signature.claims.id, &account_id.unwrap()) {
                Ok(authenticated_user) => {
                    if authed_signature.claims.email == authenticated_user.auth.email &&
                        authed_signature.claims.account_id == authenticated_user.auth_account.account_id {
                        return CommandResponse::<AuthenticatedUser> {
                            data: Some(authenticated_user),
                            error: None
                        }
                    }

                    return CommandResponse::<AuthenticatedUser> {
                        data: None,
                        error: Some(CommandError {
                            message: format!(
                                "Token data did not match stored data:\nclaims.email={},user.email={}\nclaims.acount_id={},user.account_id={}",
                                authed_signature.claims.email,
                                authenticated_user.auth.email,
                                authed_signature.claims.account_id,
                                authenticated_user.auth_account.account_id
                            ),
                            error_type: Some(CommandErrorType::Process)
                        })
                    }
                },
                Err(e) => CommandResponse::<AuthenticatedUser> {
                    data: None,
                    error: Some(CommandError {
                        message: format!("Error selecting authenticated user: {}", e),
                        error_type: Some(CommandErrorType::Database)
                    })
                }
            }
        },
        Err(e) => CommandResponse::<AuthenticatedUser> {
            data: None,
            error: Some(CommandError {
                message: format!("Error decoding token: {}", e),
                error_type: Some(CommandErrorType::External)
            })
        }
    }
}