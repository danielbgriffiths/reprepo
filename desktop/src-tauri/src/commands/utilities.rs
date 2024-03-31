// Local Usages
use crate::libs::error::LocalError;

#[tauri::command]
pub fn get_env(name: &str) -> Result<String, LocalError> {
    match std::env::var(String::from(name)) {
        Ok(env_var) => Ok(env_var),
        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
    }
}