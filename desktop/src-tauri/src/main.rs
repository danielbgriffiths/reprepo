// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Declarations
pub mod models;
pub mod database;
pub mod schema;
pub mod layout;
pub mod commands;
pub mod state;
pub mod services;

// External Usages
use std::sync::Mutex;

// Local Usages
use crate::layout::menu::create_menu;
use crate::commands::user::{get_user, create_user};
use crate::commands::utilities::get_env;
use crate::commands::auth::create_google_oauth;
use crate::database::connection::establish_connection;
use crate::services::google_oauth::create_google_oauth_client;
use crate::services::stronghold::create_stronghold_plugin;
use crate::state::{AppState};

fn main() {
    let menu = create_menu();

    let db_connection = Mutex::new(Some(establish_connection()));

    let google_oauth_client = create_google_oauth_client();

    let stronghold_plugin = create_stronghold_plugin();

    let app_state = AppState { db_connection, google_oauth_client };

    tauri::Builder::default()
        .plugin(stronghold_plugin.build())
        .menu(menu)
        .manage(app_state)
        .invoke_handler(
            tauri::generate_handler![
                get_user,
                create_user,
                create_google_oauth,
                get_env
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
