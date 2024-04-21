// External Usages
use diesel::QueryResult;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

use crate::models::account::{Account};
use crate::schema::account;
use crate::state::AppState;


pub fn select_account(app_state: &AppState, target_account_id: &Option<i32>) -> QueryResult<Account> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let existing_account_id = match target_account_id {
        Some(id) => id,
        None => return Err(diesel::result::Error::NotFound),
    };

    account::table
        .find(existing_account_id)
        .get_result(db_connection)
}

pub fn create_account(app_state: &AppState) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(account::table)
        .default_values()
        .returning(account::id)
        .get_result::<i32>(db_connection)
}

pub fn create_account_if_not_exists(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, target_account_id: &Option<i32>) -> QueryResult<i32> {
    if let Some(id) = target_account_id {
        let existing_account = account::table
            .filter(account::id.eq(id))
            .select(account::id)
            .first::<i32>(db_connection)
            .optional()?;

        if let Some(existing_id) = existing_account {
            return Ok(existing_id);
        }
    }

    diesel::insert_into(account::table)
        .default_values()
        .returning(account::id)
        .get_result(db_connection)
}