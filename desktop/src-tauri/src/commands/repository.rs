// External Usages
use tauri::State;

// local Usages
use crate::models::commands::{CommandError, CommandErrorType, CommandResponse};
use crate::models::repository::{CreateRepository, Repository};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub fn get_repositories(app_state: State<AppState>, user_id: i32) -> CommandResponse<Vec<Repository>> {
    match services::repository::select_user_repositories(&app_state, &user_id) {
        Ok(repositories) => CommandResponse::<Vec<Repository>> {
            data: Some(repositories),
            error: None,
        },
        Err(e) => CommandResponse::<Vec<Repository>> {
            data: None,
            error: Some(CommandError {
                message: e,
                error_type: Some(CommandErrorType::Database)
            })
        }
    }
}

#[tauri::command]
pub fn create_repository(app_state: State<AppState>, user_id: i32, new_repository: CreateRepository) -> CommandResponse<i32> {
    match services::repository::create_repository(&app_state, &new_repository) {
        Ok(repository_id) => CommandResponse::<i32> {
            data: Some(repository_id),
            error: None,
        },
        Err(e) => CommandResponse::<i32> {
            data: None,
            error: Some(CommandError {
                message: e,
                error_type: Some(CommandErrorType::Database)
            })
        }
    }
}