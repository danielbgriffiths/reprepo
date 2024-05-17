// External Usages
use diesel::{PgConnection, RunQueryDsl};
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::libs::error::ApiError;
use crate::schema::user_role;
use crate::models::user_role::CreateUserRole;

pub fn create_user_role_transaction_sync(
    db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>,
    user_id: i32,
    role_id: i32
) -> Result<i32, ApiError> {
    diesel::insert_into(user_role::table)
        .values(
            CreateUserRole {
                user_id,
                role_id,
            }
        )
        .returning(user_role::id)
        .get_result::<i32>(db_connection)
        .map_err(|e| ApiError::Database(e.to_string()))
}