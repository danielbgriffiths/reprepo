// External Usages
use tauri::{State};
use std::env;
use chrono::Utc;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};


// Local Usages
use crate::models::user::{AuthenticatedUser, User, PartialOnboardingUser, UserOnboardingChangesPayload};
use crate::models::auth::{AuthedSignatureClaims};
use crate::state::{AppState};
use crate::services::user::{select_account_users, select_authenticated_user, select_user, update_user_onboarding_partial};
use crate::libs::error::LocalError;
use crate::libs::file::{resize_image, upload_file_to_s3};

#[tauri::command]
pub fn get_users(app_state: State<AppState>, account_id: Option<i32>) -> Result::<Vec<User>, LocalError> {
    if !account_id.is_some() {
        return Ok(Vec::new())
    }

    match select_account_users(&app_state, &account_id.unwrap()) {
        Ok(users) => Ok(users),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn get_authenticated_user(
    app_state: State<AppState>,
    authed_signature: Option<String>,
    account_id: Option<i32>
) -> Result::<AuthenticatedUser, LocalError> {
    if !account_id.is_some() {
        return Err(LocalError::ProcessError { message: "No account id provided".to_string() })
    }

    if !authed_signature.is_some() {
        return Err(LocalError::ProcessError { message: "No auth signature provided".to_string() })
    }

    let authed_signature_secret_env = env::var("AUTHED_SIGNATURE_SECRET")
        .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

    let authed_signature_result = decode::<AuthedSignatureClaims>(
        &authed_signature.unwrap(),
        &DecodingKey::from_secret(authed_signature_secret_env.as_ref()),
        &Validation::new(Algorithm::HS256)
    );

    match authed_signature_result {
        Ok(authed_signature) => {
            match select_authenticated_user(&app_state, &authed_signature.claims.id, &account_id.unwrap()) {
                Ok(authenticated_user) => {
                    if authed_signature.claims.email == authenticated_user.auth.email &&
                        authed_signature.claims.account_id == authenticated_user.auth_account.account_id {
                        return Ok(authenticated_user)
                    }

                    return Err(LocalError::ProcessError {
                        message: format!(
                            "stored/token mismatch: {}/{}",
                            authed_signature.claims.email,
                            authenticated_user.auth.email
                        )
                    })
                },
                Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
            }
        },
        Err(e) => Err(LocalError::ExternalError { message: e.to_string() })
    }
}

pub async fn resize_and_upload_avatar(
    app_state: &State<'_, AppState>,
    user_id: i32,
    user_changes: UserOnboardingChangesPayload
) -> Result::<Option<String>, LocalError> {
    let user = select_user(&app_state, &user_id)
        .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    if let (Some(base64_data), Some(cropper_data)) = (user_changes.avatar, user_changes.cropper_data) {
        let resized_avatar = resize_image(
            base64_data,
            cropper_data
        )?;

        let uploaded_avatar = match upload_file_to_s3(
            resized_avatar,
            format!(
                "{}_{}-avatar-{}.png",
                user.first_name,
                user.last_name,
                Utc::now().timestamp(),
            )
        ).await {
            Ok(uploaded_avatar) => Ok(Some(uploaded_avatar)),
            Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
        }?;

        return Ok(uploaded_avatar)
    }

    return Ok(None)
}

#[tauri::command]
pub async fn update_user_onboarding(
    app_state: State<'_, AppState>,
    user_id: i32,
    user_changes: UserOnboardingChangesPayload
) -> Result::<User, LocalError> {
    let partial_user = PartialOnboardingUser {
        age: user_changes.age,
        locale: user_changes.locale.clone(),
        is_onboarded: true,
        avatar: None,
    };

    let avatar = match resize_and_upload_avatar(&app_state, user_id, user_changes).await {
        Ok(avatar) => Ok(avatar),
        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
    }?;

    match update_user_onboarding_partial(&app_state, &user_id, partial_user, avatar) {
        Ok(user) => Ok(user),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}