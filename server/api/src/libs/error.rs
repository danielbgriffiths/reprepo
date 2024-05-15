// External Usages
use serde::Serialize;
use diesel::result::Error as DieselError;
use thiserror::Error;
use actix_web::{HttpResponse, ResponseError};
use actix_web::http::StatusCode;

pub struct ErrorResponse {
    pub message: String,
}

#[derive(Debug, Serialize)]
pub enum ApiErrorType {
    // Authentication
    Authentication,
    Unauthorized,
    ExpiredJWT,

    // Data
    Database,
    DataNotFound,

    // External
    GoogleOAuth,
    OpenAI,
    AWS,

    // Flow
    Lock,
    Library,
    Internal,
    Unavailable,
}

#[derive(Error, Debug, Serialize)]
pub enum ApiError {
    #[error("api-error: Authentication: {0}")]
    Authentication(String),
    #[error("api-error: Unauthorized: {0}")]
    Unauthorized(String),
    #[error("api-error: ExpiredJWT: {0}")]
    ExpiredJWT(String),

    #[error("api-error: Database: {0}")]
    Database(String),
    #[error("api-error: DataNotFound: {0}")]
    DataNotFound(String),

    #[error("api-error: GoogleOAuth: {0}")]
    GoogleOAuth(String),
    #[error("api-error: OpenAI: {0}")]
    OpenAI(String),
    #[error("api-error: AWS: {0}")]
    AWS(String),

    #[error("api-error: Library: {0}")]
    Library(String),
    #[error("api-error: Internal: {0}")]
    Internal(String),
    #[error("api-error: Lock: {0}")]
    Lock(String),
    #[error("api-error: Unavailable: {0}")]
    Unavailable(String),
}

struct ApiErrorWrapper {
    error: String,
}

impl From<DieselError> for ApiError {
    fn from(error: DieselError) -> Self {
        match error {
            DieselError::NotFound => ApiError::DataNotFound("Record not found".to_string()),
            DieselError::QueryBuilderError(err) => ApiError::Database(format!("QueryBuilderError: {}", err)),
            _ => ApiError::Database("Unknown:".to_string()),
        }
    }
}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        match *self {
            ApiError::Authentication(_) => StatusCode::BAD_REQUEST,
            ApiError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            ApiError::Database(_) => StatusCode::BAD_REQUEST,
            ApiError::DataNotFound(_) => StatusCode::NOT_FOUND,
            ApiError::GoogleOAuth(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::OpenAI(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::AWS(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Library(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
            ApiError::Lock(_) => StatusCode::LOCKED,
            ApiError::Unavailable(_) => StatusCode::BAD_REQUEST,
            ApiError::ExpiredJWT(_) => StatusCode::UNAUTHORIZED,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .content_type("application/json")
            .body(self.to_string())
    }
}

impl ApiError {
    fn error_type(&self) -> ApiErrorType {
        match self {
            ApiError::Authentication(_) => ApiErrorType::Authentication,
            ApiError::Unauthorized(_) => ApiErrorType::Unauthorized,
            ApiError::Database(_) => ApiErrorType::Database,
            ApiError::DataNotFound(_) => ApiErrorType::DataNotFound,
            ApiError::GoogleOAuth(_) => ApiErrorType::GoogleOAuth,
            ApiError::OpenAI(_) => ApiErrorType::OpenAI,
            ApiError::AWS(_) => ApiErrorType::AWS,
            ApiError::Library(_) => ApiErrorType::Library,
            ApiError::Internal(_) => ApiErrorType::Internal,
            ApiError::Lock(_) => ApiErrorType::Lock,
            ApiError::Unavailable(_) => ApiErrorType::Unavailable,
            ApiError::ExpiredJWT(_) => ApiErrorType::ExpiredJWT,
        }
    }
}

