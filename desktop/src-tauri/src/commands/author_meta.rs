// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::author_meta::{AuthorFilterItem};
use crate::state::AppState;

#[tauri::command]
pub async fn get_authors(_state: State<'_, Arc<Mutex<AppState>>>, _field: String, _specialization: String) -> Result<Vec<AuthorFilterItem>, LocalError> {
    return Ok(Vec::new());
}