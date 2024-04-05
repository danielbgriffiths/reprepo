// External Usages
use tauri::State;

// local Usages
use crate::libs::error::LocalError;
use crate::models::commit::{CreateCommit, Commit};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub fn get_commits(app_state: State<AppState>, target_record_id: i32) -> Result<Vec<Commit>, LocalError> {
    match services::commit::select_commits(&app_state, &target_record_id) {
        Ok(records) => Ok(records),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn create_commit(app_state: State<AppState>, new_commit: CreateCommit) -> Result<i32, LocalError> {
    match services::commit::create_commit(&app_state, &new_commit) {
        Ok(record_id) => Ok(record_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}