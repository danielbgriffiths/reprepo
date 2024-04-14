// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::user::{AuthenticatedUser, CreateUser, PartialOnboardingUser, User};
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

    diesel::update(user::table.find(user_id))
        .set(&PartialOnboardingUser {
            age: partial_user.age,
            avatar: uploaded_avatar,
            locale: partial_user.locale,
            is_onboarded: true,
        })
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