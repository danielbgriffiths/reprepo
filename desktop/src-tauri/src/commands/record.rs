// External Usages
use tauri::State;
use std::sync::Arc;
use diesel::Connection;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::author_meta::IntoAuthorMeta;
use crate::models::composition_meta::IntoCompositionMeta;
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

    let db_connection = &mut app_state.pool.get().unwrap();

    let record_id = db_connection.transaction(|transaction_connection| {
        let author_meta = new_record
            .clone()
            .author_meta
            .into_author_meta()
            .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

        let author_meta_id = services::author_meta::create_author_meta(
            transaction_connection,
            &author_meta
        )
            .map_err(|e| LocalError::DatabaseError {message: e.to_string()})?;

        // create author meta if not exists

        let composition_meta = new_record
            .clone()
            .composition_meta
            .into_composition_meta(author_meta_id)
            .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

        let composition_meta_id = services::composition_meta::create_composition_meta(
            transaction_connection,
            &composition_meta
        )
            .map_err(|e| LocalError::DatabaseError {message: e.to_string()})?;

        // create composition meta if not exists

        let record = new_record
            .into_record(author_meta_id.clone(), composition_meta_id.clone())
            .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

        services::record::create_record(transaction_connection, &record)
            .map_err(|e| LocalError::DatabaseError {message: e.to_string()})
    }).map_err(|e| LocalError::DatabaseError {message: e.to_string()})?;

    return Ok(record_id)
}