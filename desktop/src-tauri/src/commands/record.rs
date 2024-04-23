// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::record::{CreateRecordPayload, IntoRecord, Record};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub async fn get_records(state: State<'_, Arc<Mutex<AppState>>>, target_repository_id: i32) -> Result<Vec<Record>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::record::select_records(&app_state, &target_repository_id) {
        Ok(records) => Ok(records),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn get_record(state: State<'_, Arc<Mutex<AppState>>>, target_record_id: i32) -> Result<Record, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::record::select_record(&app_state, &target_record_id) {
        Ok(records) => Ok(records),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn create_record(state: State<'_, Arc<Mutex<AppState>>>, new_record: CreateRecordPayload) -> Result<i32, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let record = new_record
        .into_record()
        .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

    match services::record::create_record(&app_state, &record) {
        Ok(record_id) => Ok(record_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}