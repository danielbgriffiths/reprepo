// Local Usages
use crate::libs::error::LocalError;
use crate::libs::file::{upload_file_to_s3, delete_file_from_s3, get_file_from_s3};

#[tauri::command]
pub async fn upload_file(base64: String, original_file_name: String) -> Result<String, LocalError> {
    match upload_file_to_s3(base64, original_file_name).await {
        Ok(res) => Ok(res),
        Err(e) => Err(e)
    }
}

#[tauri::command]
pub async fn delete_file(uri: String) -> Result<bool, LocalError> {
    match delete_file_from_s3(uri).await {
        Ok(res) => Ok(res),
        Err(e) => Err(e)
    }
}

#[tauri::command]
pub async fn get_file(file_path: String) -> Result<String, LocalError> {
    match get_file_from_s3(file_path).await {
        Ok(res) => Ok(res),
        Err(e) => Err(e)
    }
}
