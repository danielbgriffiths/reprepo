// External Usages
use diesel::QueryResult;
use tauri::{State, Window};
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};
use base64::{Engine as _, engine::{general_purpose}};
use chrono::Utc;

// Local Usages
use crate::libs::error::LocalError;
use crate::libs::file::{CropperData, get_file_from_s3, resize_image, upload_file_to_s3};
use crate::models::user::{AuthenticatedUser, CreateUser, PartialOnboardingUser, User, AvatarChanges};
use crate::state::AppState;
use crate::schema::user;
use crate::schema::auth_account;
use crate::services::auth::select_auth_core;
use crate::services::auth_account::select_auth_account;

pub fn select_account_users(app_state: &State<AppState>, target_account_id: &i32) -> QueryResult<Vec<User>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    user::table
        .inner_join(
            auth_account::table.on(
                user::auth_id.eq(auth_account::auth_id)
            )
        )
        .filter(auth_account::account_id.eq(target_account_id))
        .select(user::all_columns)
        .load::<User>(db_connection)
}

pub fn select_authenticated_user(app_state: &State<AppState>, target_user_id: &i32, account_id: &i32) -> QueryResult<AuthenticatedUser> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let result: User = user::table
        .find(target_user_id)
        .get_result(db_connection)?;

    let auth_id = result.auth_id;

    Ok(AuthenticatedUser {
        user: result,
        auth: select_auth_core(&app_state, &auth_id)?,
        auth_account: select_auth_account(&app_state, &account_id, &auth_id)?
    })
}

pub fn create_user_if_not_exists(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, new_user: &CreateUser) -> QueryResult<i32> {
    let user_id = user::table
        .filter(user::auth_id.eq(new_user.auth_id))
        .select(user::id)
        .first::<i32>(db_connection)
        .optional()?;

    if let Some(id) = user_id {
        return Ok(id);
    }

    diesel::insert_into(user::table)
        .values(new_user)
        .returning(user::id)
        .get_result::<i32>(db_connection)
}

pub fn update_user_onboarding_partial(
    app_state: &State<AppState>,
    user_id: &i32,
    partial_user: PartialOnboardingUser,
    uploaded_avatar: Option<String>
) -> QueryResult<User> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let partial_user_changes = &PartialOnboardingUser {
        age: partial_user.age,
        avatar: uploaded_avatar,
        locale: partial_user.locale,
        is_onboarded: true,
    };

    diesel::update(user::table.find(user_id))
        .set(partial_user_changes)
        .returning(User::as_select())
        .get_result::<User>(db_connection)
}

pub fn select_user(app_state: &State<AppState>, user_id: &i32) -> QueryResult<User> {
    let db_connection = &mut app_state.pool.get().unwrap();

    user::table
        .find(&user_id)
        .select(User::as_select())
        .get_result::<User>(db_connection)
}

pub async fn async_proc_fetch_resize_upload_update(
    app_state: &State<'_, AppState>,
    window: &Window,
    user_id: i32,
    file_path: String,
    event_key: Box<str>,
    cropper_data: CropperData
) -> Result<String, LocalError> {
    let db_connection = &mut app_state.pool.get().unwrap();

    //
    // Get User
    //

    let user_result = select_user(app_state, &user_id);

    if let Err(e) = user_result {
        return Err(LocalError::DatabaseError { message: e.to_string() })
    }

    let user = user_result.unwrap();

    //
    // Get File
    //

    let bytes_result = get_file_from_s3(file_path.clone())
        .await;

    if let Err(e) = bytes_result {
        return Err(LocalError::ExternalError { message: e.to_string() })
    }

    let bytes = bytes_result.unwrap();

    window.emit(&event_key, "{state: 'started'}").unwrap();

    //
    // Resize Image
    //

    let resized_bytes_result = resize_image(
        general_purpose::STANDARD.encode(bytes),
        cropper_data,
        window.clone(),
        event_key.clone().into()
    );

    if let Err(e) = resized_bytes_result {
        window.emit(&event_key, "{state: 'failed', error: e.to_string()}").unwrap();
        return Err(e)
    }

    let resized_bytes = resized_bytes_result.unwrap();

    window.emit(&event_key, "{state: 'in-progress', percentage: 5}").unwrap();

    //
    // Upload Resized Image
    //

    let resized_file_path_result = upload_file_to_s3(
        general_purpose::STANDARD.encode(resized_bytes),
        format!(
            "{}_{}-avatar-{}.png",
            user.first_name,
            user.last_name,
            Utc::now().timestamp(),
        )
    )
        .await;

    if let Err(e) = resized_file_path_result {
        window.emit(&event_key, "{state: 'failed', error: e.to_string()}").unwrap();
        return Err(e)
    }

    let resized_file_path = resized_file_path_result.unwrap();

    window.emit(&event_key, "{state: 'in-progress', percentage: 1}").unwrap();

    //
    // Update User Avatar
    //

    let avatar_changes = AvatarChanges {
        avatar: Some(resized_file_path.clone()),
    };

    let updated_user = diesel::update(user::table.find(user_id))
        .set(&avatar_changes)
        .returning(user::id)
        .get_result::<i32>(db_connection);

    if let Err(e) = updated_user {
        window.emit(&event_key, "{state: 'failed', error: 'e.to_string()'}").unwrap();
        return Err(LocalError::DatabaseError { message: e.to_string() })
    }

    window.emit(&event_key, "{state: 'completed'}").unwrap();

    //
    // Return Resized Path
    //

    Ok(resized_file_path)
}