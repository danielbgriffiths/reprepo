// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::composition_meta::CompositionFilterItem;
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub async fn get_names(
    state: State<'_, Arc<Mutex<AppState>>>,
    field: String,
    specialization: String,
    author_meta_ids: Vec<i32>
) -> Result<Vec<CompositionFilterItem>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::composition_meta::select_names(&app_state, field, specialization, author_meta_ids) {
        Ok(names) => Ok(names),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}