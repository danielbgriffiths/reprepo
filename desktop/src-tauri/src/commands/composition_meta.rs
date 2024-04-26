// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::composition_meta::CompositionFilterItem;
use crate::state::AppState;

#[tauri::command]
pub async fn get_names(
    _state: State<'_, Arc<Mutex<AppState>>>,
    _field: String,
    _specialization: String,
    _author_meta_ids: Vec<i32>
) -> Result<Vec<CompositionFilterItem>, LocalError> {
    return Ok(Vec::new());
}