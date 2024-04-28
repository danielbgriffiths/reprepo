// External Usages
use diesel::{PgConnection, QueryResult, RunQueryDsl};
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::author_meta::CreateAuthorMeta;
use crate::schema::author_meta;

pub fn create_author_meta(transaction_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, author_meta: &CreateAuthorMeta) -> QueryResult<i32> {
    diesel::insert_into(author_meta::table)
        .values(author_meta)
        .returning(author_meta::id)
        .get_result::<i32>(transaction_connection)
}