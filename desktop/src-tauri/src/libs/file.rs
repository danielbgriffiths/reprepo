// External Usages
use std::env;
use base64::{Engine as _, engine::{general_purpose}};
use rusoto_core::{HttpClient, Region};
use rusoto_credential::{DefaultCredentialsProvider};
use rusoto_s3::{PutObjectRequest, S3Client, S3, DeleteObjectRequest, StreamingBody};

fn get_bytes_from_base64(base64_data: &String) -> Result<StreamingBody, String> {
    match general_purpose::STANDARD.decode(base64_data.split(',').last().unwrap())  {
        Ok(decoded_bytes) => Ok(decoded_bytes.into()),
        Err(e) => Err(e.to_string())
    }
}

pub async fn upload_file_to_s3(base64_data: &String, file_name: String) -> Result<String, String> {
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

    s3_client.put_object(put_request).await.map_err(|e| e.to_string())?;

    Ok(file_name)
}

pub async fn delete_file_from_s3(file_name: String) -> Result<bool, String> {
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

    s3_client.delete_object(delete_request).await.map_err(|e| e.to_string())?;

    Ok(true)
}