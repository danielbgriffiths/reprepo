// External Usages
use tauri::State;

// local Usages
use crate::libs::error::LocalError;
use crate::models::record::{CreateRecord, Record};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub fn get_records(app_state: State<AppState>, target_repository_id: i32) -> Result<Vec<Record>, LocalError> {
    match services::record::select_records(&app_state, &target_repository_id) {
        Ok(records) => Ok(records),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn create_record(app_state: State<AppState>, new_record: CreateRecord) -> Result<i32, LocalError> {
    match services::record::create_record(&app_state, &new_record) {
        Ok(record_id) => Ok(record_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}