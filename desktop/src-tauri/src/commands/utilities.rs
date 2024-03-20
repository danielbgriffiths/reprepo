use crate::models::commands::{CommandError, CommandErrorType, CommandResponse};

#[tauri::command]
pub fn get_env(name: &str) -> CommandResponse<String> {
    match std::env::var(String::from(name)) {
        Ok(env_var) => CommandResponse {
            data: Some(env_var),
            error: None
        },
        Err(e) => CommandResponse {
            data: None,
            error: Some(CommandError {
                message: format!("Error getting env var: {}", e),
                error_type: Some(CommandErrorType::Process),
            })
        },
    }
}