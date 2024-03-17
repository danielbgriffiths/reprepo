// External Usages
use diesel::PgConnection;

pub struct AppState {
    pub db_connection: PgConnection,
}