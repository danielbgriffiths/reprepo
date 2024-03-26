// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::user::{AuthenticatedUser, CreateUser, UpdateUser, User};
use crate::state::AppState;
use crate::schema::user;
use crate::schema::auth_account;
use crate::services::auth::select_auth_core;

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

pub fn select_authenticated_user(app_state: &State<AppState>, target_user_id: &i32) -> QueryResult<AuthenticatedUser> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let result: User = user::table
        .find(target_user_id)
        .get_result(db_connection)?;

    let auth_id = result.auth_id;

    Ok(AuthenticatedUser {
        user: result,
        auth: select_auth_core(&app_state, &auth_id)?,
    })
}

pub fn create_user(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, new_user: &CreateUser) -> QueryResult<i32> {
    diesel::insert_into(user::table)
        .values(new_user)
        .returning(user::id)
        .get_result::<i32>(db_connection)
}

pub fn update_user(app_state: &State<AppState>, user_id: &i32, user_changes: &UpdateUser) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::update(user::table.find(user_id))
        .set(user_changes)
        .returning(user::id)
        .get_result::<i32>(db_connection)
}