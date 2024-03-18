// External Usages
use diesel::PgConnection;
use diesel::r2d2::ConnectionManager;
use diesel::r2d2::Pool;

pub struct AppState {
    pub pool: Pool<ConnectionManager<PgConnection>>,
}