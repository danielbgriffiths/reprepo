// External Usages
use std::env;
use base64::{Engine as _, engine::{general_purpose}};
use std::io::Cursor;
use std::num::NonZeroU32;
use rusoto_core::{HttpClient, Region};
use rusoto_credential::{DefaultCredentialsProvider};
use rusoto_s3::{PutObjectRequest, S3Client, S3, DeleteObjectRequest, StreamingBody, GetObjectRequest};
use tokio::io::AsyncReadExt;
use serde::{Deserialize, Serialize};
use fast_image_resize;
use image;
use tauri::Window;

// Local Usages
use crate::libs::error::LocalError;

#[derive(Debug, Serialize, Deserialize)]
pub struct CropperData {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
    pub rotate: u32,
    pub scale_x: u32,
    pub scale_y: u32,
}

fn get_bytes_from_base64(base64_data: String) -> Result<StreamingBody, LocalError> {
    match general_purpose::STANDARD.decode(base64_data.split(',').last().unwrap())  {
        Ok(decoded_bytes) => Ok(decoded_bytes.into()),
        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
    }
}

pub async fn upload_file_to_s3(base64_data: String, file_name: String) -> Result<String, LocalError> {
    let aws_s3_bucket = env::var("AWS_S3_BUCKET")
        .expect("Missing the AWS_S3_BUCKET environment variable.");
    let aws_s3_region = env::var("AWS_S3_REGION")
        .expect("Missing the AWS_S3_REGION environment variable.");

    let streaming_bytes: StreamingBody = get_bytes_from_base64(base64_data)?;

    let region = Region::Custom {
        name: aws_s3_region.to_owned(),
        endpoint: "https://s3.us-east-1.amazonaws.com".to_owned(),
    };

    let s3_client = S3Client::new_with(
        HttpClient::new().expect("failed to create request dispatcher"),
        DefaultCredentialsProvider::new().unwrap(),
        region,
    );

    let put_request = PutObjectRequest {
        bucket: aws_s3_bucket.to_string(),
        key: file_name.clone(),
        body: Some(streaming_bytes),
        ..Default::default()
    };

    s3_client
        .put_object(put_request).await
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    Ok(file_name)
}

pub async fn delete_file_from_s3(file_name: String) -> Result<bool, LocalError> {
    let aws_s3_bucket = env::var("AWS_S3_BUCKET")
        .expect("Missing the AWS_S3_BUCKET environment variable.");
    let aws_s3_region = env::var("AWS_S3_REGION")
        .expect("Missing the AWS_S3_REGION environment variable.");

    let region = Region::Custom {
        name: aws_s3_region.to_owned(),
        endpoint: "https://s3.us-east-1.amazonaws.com".to_owned(),
    };

    let s3_client = S3Client::new_with(
        HttpClient::new().expect("failed to create request dispatcher"),
        DefaultCredentialsProvider::new().unwrap(),
        region,
    );

    let delete_request = DeleteObjectRequest {
        bucket: aws_s3_bucket.to_string(),
        key: file_name.clone(),
        ..Default::default()
    };

    s3_client
        .delete_object(delete_request).await
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    Ok(true)
}

pub async fn get_file_from_s3(file_path: String) -> Result<Vec<u8>, LocalError> {
    let aws_s3_bucket = env::var("AWS_S3_BUCKET")
        .expect("Missing the AWS_S3_BUCKET environment variable.");
    let aws_s3_region = env::var("AWS_S3_REGION")
        .expect("Missing the AWS_S3_REGION environment variable.");

    let region = Region::Custom {
        name: aws_s3_region.to_owned(),
        endpoint: "https://s3.us-east-1.amazonaws.com".to_owned(),
    };

    let s3_client = S3Client::new_with(
        HttpClient::new().expect("failed to create request dispatcher"),
        DefaultCredentialsProvider::new().unwrap(),
        region,
    );

    let get_object_request = GetObjectRequest {
        bucket: aws_s3_bucket,
        key: file_path.clone(),
        ..Default::default()
    };

    let result = s3_client
        .get_object(get_object_request)
        .await
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    let mut image_data = Vec::new();

    if let Some(file_stream) = result.body {
        file_stream
            .into_async_read()
            .read_to_end(&mut image_data)
            .await
            .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

        return Ok(image_data)
    }

    return Err(LocalError::ExternalError { message: format!("Unable to find file {}", file_path) })
}

pub fn resize_image(base64_data: String, cropper_data: CropperData, window: Window, event_key: String) -> Result<Vec<u8>, LocalError> {
    let image_data = general_purpose::STANDARD
        .decode(
            base64_data
                .split(',')
                .last()
                .unwrap()
        )
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    window.emit(&event_key, "{state: 'in-progress', percentage: 90}").unwrap();

    let image = image::load_from_memory(&image_data)
        .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    window.emit(&event_key, "{state: 'in-progress', percentage: 80}").unwrap();

    let src_image = fast_image_resize::Image::from_vec_u8(
        NonZeroU32::new(image.width()).unwrap(),
        NonZeroU32::new(image.height()).unwrap(),
        image.to_rgba8().into_raw(),
        fast_image_resize::PixelType::U8x4,
    ).map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    let src_image_view = src_image.view();

    window.emit(&event_key, "{state: 'in-progress', percentage: 70}").unwrap();

    let mut dst_image = fast_image_resize::Image::new(
        NonZeroU32::try_from(cropper_data.width).unwrap(),
        NonZeroU32::try_from(cropper_data.height).unwrap(),
        fast_image_resize::pixels::PixelType::U8x4,
    );

    let mut dst_image_view = dst_image.view_mut();

    window.emit(&event_key, "{state: 'in-progress', percentage: 60}").unwrap();

    let mut resizer = fast_image_resize::Resizer::new(
        fast_image_resize::ResizeAlg::Convolution(fast_image_resize::FilterType::CatmullRom),
    );
    resizer.resize(&src_image_view, &mut dst_image_view).unwrap();

    window.emit(&event_key, "{state: 'in-progress', percentage: 30}").unwrap();

    let final_image = image::ImageBuffer::<image::Rgba<u8>, Vec<u8>>::from_raw(
        cropper_data.width,
        cropper_data.height,
        dst_image.buffer().to_vec(),
    ).ok_or(LocalError::ProcessError { message: "Error converting image to buffer".to_string() })?;

    window.emit(&event_key, "{state: 'in-progress', percentage: 20}").unwrap();

    let mut buffer = Cursor::new(Vec::new());

    image::DynamicImage::ImageRgba8(final_image).write_to(&mut buffer, image::ImageFormat::Png)
        .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    window.emit(&event_key, "{state: 'in-progress', percentage: 10}").unwrap();

    Ok(buffer.into_inner())
}