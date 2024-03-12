use diesel::PgConnection;
use tauri::{AppHandle, State, Manager};

pub struct AppState {
    pub db: std::sync::Mutex<Option<PgConnection>>,
}
