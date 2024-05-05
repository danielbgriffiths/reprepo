// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::author_meta::{AuthorFilterItem};
use crate::state::AppState;
use crate::services;

#[tauri::command]
pub async fn get_authors(state: State<'_, Arc<Mutex<AppState>>>, field: String, specialization: String) -> Result<Vec<AuthorFilterItem>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::author_meta::select_authors(&app_state, field, specialization) {
        Ok(authors) => Ok(authors),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}