// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::commit::{CreateCommit, Commit};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub async fn get_commits(state: State<'_, Arc<Mutex<AppState>>>, target_record_id: i32) -> Result<Vec<Commit>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::commit::select_commits(&app_state, &target_record_id) {
        Ok(records) => Ok(records),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn create_commit(state: State<'_, Arc<Mutex<AppState>>>, new_commit: CreateCommit) -> Result<i32, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::commit::create_commit(&app_state, &new_commit) {
        Ok(record_id) => Ok(record_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}