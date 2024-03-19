// External Usages
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum CommandErrorType {
    External,
    Process,
    Database,
    Unavailable
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandError {
    pub message: String,
    pub error_type: Option<CommandErrorType>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommandResponse<T> {
    pub data: Option<T>,
    pub error: Option<CommandError>
}