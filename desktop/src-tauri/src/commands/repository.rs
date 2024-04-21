// External Usages
use tauri::State;
use std::sync::{Arc};
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::repository::{CreateRepositoryPayload, IntoRepository, Repository};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub async fn get_repositories(state: State<'_, Arc<Mutex<AppState>>>, user_id: i32) -> Result<Vec<Repository>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::repository::select_repositories(&app_state, &user_id) {
        Ok(repositories) => Ok(repositories),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn create_repository(state: State<'_, Arc<Mutex<AppState>>>, new_repository: CreateRepositoryPayload) -> Result<i32, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let repository = new_repository
        .into_repository()
        .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

    match services::repository::create_repository(&app_state, repository) {
        Ok(repository_id) => Ok(repository_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn get_repository(state: State<'_, Arc<Mutex<AppState>>>, target_repository_id: i32) -> Result<Repository, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::repository::get_repository(&app_state, &target_repository_id) {
        Ok(repository) => Ok(repository),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}