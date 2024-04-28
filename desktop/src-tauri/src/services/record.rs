// External Usages
use diesel::QueryResult;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

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

pub fn select_record(app_state: &AppState, target_record_id: &i32) -> QueryResult<Record> {
    let db_connection = &mut app_state.pool.get().unwrap();

    record::table
        .find(target_record_id)
        .select(Record::as_select())
        .get_result::<Record>(db_connection)
}

pub fn create_record(transaction_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, new_record: &CreateRecord) -> QueryResult<i32> {
    diesel::insert_into(record::table)
        .values(new_record)
        .returning(record::id)
        .get_result::<i32>(transaction_connection)
}