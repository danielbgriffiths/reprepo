// External Usages
use diesel::prelude::*;
use tauri::{State};


// Local Usages
use crate::models::user::User;
use crate::schema::users::dsl::users;
use crate::state::{AppState};

#[tauri::command]
pub fn get_user(state: State<AppState>, name: &str) -> String {
    let db_connection = &mut state.db_connection;

    match db_connection {
        Some(_db_connection) => {
            let result = users
                .find(1)
                .select(User::as_select())
                .first(_db_connection)
                .expect("Error loading users");

            format!("Hi {}! We fetched, {} users.", name, result.first_name)
        },
        None => format!("Hi {}!", name),
    }
}

#[tauri::command]
pub fn create_user(name: &str) -> String {
    format!("Hi {}!", name)
}