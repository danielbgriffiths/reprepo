//
// External Usages
//

use std::sync::Mutex;
use diesel::PgConnection;

pub struct AppState {
    pub db_connection: Mutex<Option<PgConnection>>,
}