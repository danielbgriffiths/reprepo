// External Usages
use diesel::QueryResult;
use diesel::prelude::*;
use diesel;

// Local Usages
use crate::models::repository::{Repository, CreateRepository};
use crate::schema::repository;
use crate::state::AppState;

pub fn select_repositories(app_state: &AppState, target_user_id: &i32) -> QueryResult<Vec<Repository>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .filter(repository::user_id.eq(target_user_id))
        .select(Repository::as_select())
        .get_results::<Repository>(db_connection)
}

pub fn create_repository(app_state: &AppState, new_repository: &CreateRepository) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(repository::table)
        .values(new_repository)
        .returning(repository::id)
        .get_result::<i32>(db_connection)
}

pub fn get_repository(app_state: &AppState, target_repository_id: &i32) -> QueryResult<Repository> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .find(target_repository_id)
        .select(Repository::as_select())
        .get_result::<Repository>(db_connection)
}