// External Usages
use tauri::State;

// local Usages
use crate::libs::error::LocalError;
use crate::models::repository::{CreateRepository, Repository};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub fn get_repositories(app_state: State<AppState>, user_id: i32) -> Result<Vec<Repository>, LocalError> {
    match services::repository::select_repositories(&app_state, &user_id) {
        Ok(repositories) => Ok(repositories),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn create_repository(app_state: State<AppState>, new_repository: CreateRepository) -> Result<i32, LocalError> {
    match services::repository::create_repository(&app_state, &new_repository) {
        Ok(repository_id) => Ok(repository_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn get_repository(app_state: State<AppState>, target_repository_id: i32) -> Result<Repository, LocalError> {
    match services::repository::get_repository(&app_state, &target_repository_id) {
        Ok(repository) => Ok(repository),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}