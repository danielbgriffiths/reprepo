// External Usages
use diesel::{PgConnection, QueryResult, RunQueryDsl};
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::composition_meta::CreateCompositionMeta;
use crate::schema::composition_meta;

pub fn create_composition_meta(transaction_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, composition_meta: &CreateCompositionMeta) -> QueryResult<i32> {
    diesel::insert_into(composition_meta::table)
        .values(composition_meta)
        .returning(composition_meta::id)
        .get_result::<i32>(transaction_connection)
}