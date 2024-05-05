// External Usages
use diesel::QueryResult;
use diesel::prelude::*;
use diesel;
use chrono::{NaiveDate, NaiveDateTime};

// Local Usages
use crate::models::repository::{Repository, CreateRepository};
use crate::models::commit::Commit;
use crate::schema::{commit, record, repository};
use crate::state::AppState;

pub fn select_repositories(app_state: &AppState, target_user_id: &i32) -> QueryResult<Vec<Repository>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .filter(repository::user_id.eq(target_user_id))
        .select(Repository::as_select())
        .get_results::<Repository>(db_connection)
}

pub fn create_repository(app_state: &AppState, new_repository: CreateRepository) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(repository::table)
        .values(&new_repository)
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

pub fn select_commits_by_year(app_state: &AppState, target_repository_id: &i32, target_year: &i32) -> QueryResult<Vec<Commit>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .inner_join(record::table.on(record::repository_id.eq(repository::id)))
        .inner_join(commit::table.on(commit::record_id.eq(record::id)))
        .filter(repository::id.eq(target_repository_id))
        .filter(commit::created_at.gt(NaiveDate::from_ymd_opt(*target_year, 1, 1).unwrap().and_hms_opt(0, 0, 0).unwrap()))
        .select(Commit::as_select())
        .load::<Commit>(db_connection)
}

pub fn get_years(app_state: &AppState, target_repository_id: &i32) -> QueryResult<Vec<NaiveDateTime>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .inner_join(record::table.on(record::repository_id.eq(repository::id)))
        .inner_join(commit::table.on(commit::record_id.eq(record::id)))
        .filter(repository::id.eq(target_repository_id))
        .select(commit::created_at)
        .load::<NaiveDateTime>(db_connection)
}