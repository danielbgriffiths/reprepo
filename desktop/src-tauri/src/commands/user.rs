//
// External Usages
//

use diesel::prelude::*;
use tauri::{AppHandle, Manager, State};

//
// Local Usages
//

use crate::models::user::User;
use crate::schema::users::age;
use crate::schema::users::dsl::users;
use crate::state::{AppState};

#[tauri::command]
pub fn get_user(app_handle: AppHandle, name: &str) -> String {
    let app_state = app_handle.state::<AppState>();
    let db = &mut app_state.db.into_inner().unwrap();

    match db {
        Some(x) => {
            let results = users
                .filter(age.eq(31))
                .limit(5)
                .select(User::as_select())
                .load(x)
                .expect("Error loading users");

            format!("Hi {}! We fetched, {} users.", name, results.len())
        },
        None    => format!("Hi {}!", name),
    }
}

#[tauri::command]
pub fn create_user(app_handle: AppHandle, name: &str) -> String {
    format!("Hi {}!", name)
}