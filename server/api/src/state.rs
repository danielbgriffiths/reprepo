use std::sync::Arc;
// External Usages
use tokio::sync::Mutex;
use diesel::{PgConnection, r2d2};
use diesel::r2d2::ConnectionManager;
use dotenvy;

// Local Usages
use crate::models::auth::AuthClaims;

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn establish_connection() -> DbPool {
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let manager = ConnectionManager::<PgConnection>::new(database_url);

    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}

pub struct AppData {
    pub auth_claims: Arc<Mutex<Option<AuthClaims>>>,
    pub db: DbPool,
}
