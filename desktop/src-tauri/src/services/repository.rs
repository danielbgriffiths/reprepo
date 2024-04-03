// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;

// Local Usages
use crate::models::repository::{Repository, CreateRepository};
use crate::schema::repository;
use crate::state::AppState;

pub fn select_user_repositories(app_state: &State<AppState>, target_user_id: &i32) -> QueryResult<Vec<Repository>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .filter(repository::user_id.eq(target_user_id))
        .select(Repository::as_select())
        .get_results::<Repository>(db_connection)
}

pub fn create_repository(app_state: &State<AppState>, new_repository: &CreateRepository) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(repository::table)
        .values(new_repository)
        .returning(repository::id)
        .get_result::<i32>(db_connection)
}