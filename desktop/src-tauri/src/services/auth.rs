// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};


// Local Usages
use crate::models::auth::{AuthCore, AuthFieldsFromAuth, CreateAuth};
use crate::schema::auth;
use crate::state::AppState;


pub fn select_auth_fields_from_auth(app_state: &State<AppState>, target_auth_id: &i32) -> QueryResult<AuthFieldsFromAuth> {
    let db_connection = &mut app_state.pool.get().unwrap();

    auth::table
        .find(target_auth_id)
        .select(AuthFieldsFromAuth::as_select())
        .get_result::<AuthFieldsFromAuth>(db_connection)
}

pub fn select_auth_core(app_state: &State<AppState>, target_auth_id: &i32) -> QueryResult<AuthCore> {
    let db_connection = &mut app_state.pool.get().unwrap();

    auth::table
        .find(target_auth_id)
        .select(AuthCore::as_select())
        .get_result::<AuthCore>(db_connection)
}

pub fn create_auth_if_not_exists_by_email(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, new_auth: &CreateAuth) -> QueryResult<i32> {
    let existing_auth_id = auth::table
        .filter(auth::email.eq(&new_auth.email))
        .select(auth::id)
        .first::<i32>(db_connection)
        .optional()?;

    if let Some(id) = existing_auth_id {
        return Ok(id);
    }

    diesel::insert_into(auth::table)
        .values(new_auth)
        .returning(auth::id)
        .get_result::<i32>(db_connection)
}