// External Usages
use diesel::{insert_into, QueryResult};
use tauri::State;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

use crate::models::auth_account::{AuthAccount, AuthFieldsFromAuthAccount, CreateAuthAccount};
use crate::schema::auth_account;
use crate::state::AppState;

pub fn select_auth_fields_from_account(app_state: &State<AppState>, target_account_id: &i32, target_auth_id: &i32) -> QueryResult<AuthFieldsFromAuthAccount> {
    let db_connection = &mut app_state.pool.get().unwrap();

    auth_account::table
        .filter(auth_account::account_id.eq(target_account_id))
        .filter(auth_account::auth_id.eq(target_auth_id))
        .select(AuthFieldsFromAuthAccount::as_select())
        .get_result::<AuthFieldsFromAuthAccount>(db_connection)
}

pub fn remove_auth_account_tokens(app_state: &State<AppState>, target_account_id: &i32, target_auth_id: &i32) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::update(auth_account::table)
        .filter(
            auth_account::account_id.eq(target_account_id)
                .and(auth_account::auth_id.eq(target_auth_id))
        )
        .set((
            auth_account::access_token.eq(None::<String>),
            auth_account::refresh_token.eq(None::<String>)
        ))
        .returning(auth_account::id)
        .get_result::<i32>(db_connection)
}

pub fn create_auth_account(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, new_auth_account: &CreateAuthAccount) -> QueryResult<i32> {
    insert_into(auth_account::table)
        .values(new_auth_account)
        .returning(auth_account::id)
        .get_result::<i32>(db_connection)
}

pub fn select_auth_account(app_state: &State<AppState>, target_account_id: &i32, target_auth_id: &i32) -> QueryResult<AuthAccount> {
    let db_connection = &mut app_state.pool.get().unwrap();

    auth_account::table
        .filter(auth_account::account_id.eq(target_account_id))
        .filter(auth_account::auth_id.eq(target_auth_id))
        .select(AuthAccount::as_select())
        .get_result::<AuthAccount>(db_connection)
}