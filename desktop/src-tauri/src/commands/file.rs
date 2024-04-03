// Local Usages
use crate::libs::error::LocalError;
use crate::libs::file::{upload_file_to_s3, delete_file_from_s3};

#[tauri::command]
pub async fn upload_file(base64: String, file_name: String) -> Result<String, LocalError> {
    match upload_file_to_s3(&base64, file_name).await {
        Ok(res) => Ok(res),
        Err(e) => Err(LocalError::ExternalError { message: e })
    }
}

#[tauri::command]
pub async fn delete_file(file_name: String) -> Result<bool, LocalError> {
    match delete_file_from_s3(file_name).await {
        Ok(res) => Ok(res),
        Err(e) => Err(LocalError::ExternalError { message: e })
    }
}
