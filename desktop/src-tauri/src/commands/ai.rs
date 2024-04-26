// External Usages
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::author_meta::AuthorCompositionMeta;
use crate::state::AppState;


// AuthorCompositionMeta
#[tauri::command]
pub async fn generate_author_composition_meta(_state: State<'_, Arc<Mutex<AppState>>>, _field: String, _specialization: String) -> Result<(), LocalError> {
    return Ok(());
}