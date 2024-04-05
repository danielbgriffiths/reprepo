// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;

// Local Usages
use crate::models::commit::{Commit, CreateCommit};
use crate::schema::commit;
use crate::state::AppState;

pub fn select_commits(app_state: &State<AppState>, target_record_id: &i32) -> QueryResult<Vec<Commit>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    commit::table
        .filter(commit::record_id.eq(target_record_id))
        .select(Commit::as_select())
        .get_results::<Commit>(db_connection)
}

pub fn create_commit(app_state: &State<AppState>, new_commit: &CreateCommit) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(commit::table)
        .values(new_commit)
        .returning(commit::id)
        .get_result::<i32>(db_connection)
}