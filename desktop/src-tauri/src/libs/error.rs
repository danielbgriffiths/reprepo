use serde;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub enum LocalErrorType {
    External,
    Process,
    Database,
    Unavailable
}

#[derive(thiserror::Error, Debug)]
pub enum LocalError {
    #[error("local error: External: {message}")]
    ExternalError { message: String },
    #[error("local error: Process: {message}")]
    ProcessError { message: String },
    #[error("local error: Database: {message}")]
    DatabaseError { message: String },
    #[error("local error: Unavailable: {message}")]
    UnavailableError { message: String },
}

#[derive(serde::Serialize)]
struct LocalErrorWrapper {
    error: String,
}

impl serde::Serialize for LocalError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::ser::Serializer,
    {
        let error_message = match self {
            LocalError::ExternalError { message } => {
                format!("local error: {:?}: {}", LocalErrorType::External, message)
            },
            LocalError::ProcessError { message } => {
                format!("local error: {:?}: {}", LocalErrorType::Process, message)
            },
            LocalError::DatabaseError { message } => {
                format!("local error: {:?}: {}", LocalErrorType::Database, message)
            },
            LocalError::UnavailableError { message } => {
                format!("local error: {:?}: {}", LocalErrorType::Unavailable, message)
            },
        };

        let wrapper = LocalErrorWrapper {
            error: error_message.to_string(),
        };

        wrapper.serialize(serializer)
    }
}