// External Usages
use diesel::QueryResult;
use diesel::prelude::*;
use diesel;

// Local Usages
use crate::models::record::{Record, CreateRecord};
use crate::schema::record;
use crate::state::AppState;

pub fn select_records(app_state: &AppState, target_repository_id: &i32) -> QueryResult<Vec<Record>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    record::table
        .filter(record::repository_id.eq(target_repository_id))
        .select(Record::as_select())
        .get_results::<Record>(db_connection)
}

pub fn create_record(app_state: &AppState, new_record: &CreateRecord) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(record::table)
        .values(new_record)
        .returning(record::id)
        .get_result::<i32>(db_connection)
}