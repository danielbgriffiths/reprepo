// External Usages
use tauri::{State, Window};
use std::env;
use chrono::Utc;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use std::sync::Arc;
use tokio::sync::Mutex;


// Local Usages
use crate::models::user::{AuthenticatedUser, User, PartialOnboardingUser, UserOnboardingChangesPayload};
use crate::models::auth::{AuthedSignatureClaims};
use crate::state::{AppState};
use crate::services::user::{
    async_proc_fetch_resize_upload_update,
    select_account_users,
    select_authenticated_user,
    select_user,
    update_user_onboarding_partial
};
use crate::libs::error::LocalError;
use crate::libs::file::{CropperData, upload_file_to_s3};

#[tauri::command]
pub async fn get_users(state: State<'_, Arc<Mutex<AppState>>>, account_id: Option<i32>) -> Result::<Vec<User>, LocalError> {
    if !account_id.is_some() {
        return Ok(Vec::new())
    }

    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match select_account_users(&app_state, &account_id.unwrap()) {
        Ok(users) => Ok(users),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn get_authenticated_user(
    state: State<'_, Arc<Mutex<AppState>>>,
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
            let state_guard = state
                .inner()
                .lock()
                .await;
            let app_state = &*state_guard;

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

pub async fn upload_avatar(
    app_state: &AppState,
    user_id: i32,
    user_changes_avatar: Option<String>
) -> Result::<Option<String>, LocalError> {
    let user = select_user(&app_state, &user_id)
        .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    if let Some(avatar_ase64) = user_changes_avatar {
        let uploaded_avatar_s3_path = match upload_file_to_s3(
            avatar_ase64,
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

        return Ok(uploaded_avatar_s3_path)
    }

    return Ok(None)
}

#[tauri::command]
pub async fn update_user_onboarding(
    state: State<'_, Arc<Mutex<AppState>>>,
    user_id: i32,
    user_changes: UserOnboardingChangesPayload
) -> Result::<User, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let avatar = match upload_avatar(&app_state, user_id, user_changes.avatar).await {
        Ok(avatar) => Ok(avatar),
        Err(e) => Err(LocalError::ProcessError { message: e.to_string() })
    }?;

    let partial_user = PartialOnboardingUser {
        age: user_changes.age,
        locale: user_changes.locale.clone(),
        is_onboarded: true,
        avatar,
    };

    match update_user_onboarding_partial(&app_state, &user_id, partial_user) {
        Ok(user) => Ok(user),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub fn async_proc_avatar_resize(
    state: State<'_, Arc<Mutex<AppState>>>,
    window: Window,
    user_id: i32,
    file_path: String,
    event_key: Box<str>,
    cropper_data: CropperData
) {
    let state_arc = state.inner().clone();
    let window_arc = Arc::new(Mutex::new(window));

    tokio::spawn(async move {
        let state_guard = state_arc
            .lock()
            .await;
        let window_guard = window_arc
            .lock()
            .await;

        if let Err(e) = async_proc_fetch_resize_upload_update(
            &*state_guard,
            &*window_guard,
            user_id,
            file_path,
            event_key,
            cropper_data
        ).await {
            println!("Error processing file: {}", e);
        }
    });
}