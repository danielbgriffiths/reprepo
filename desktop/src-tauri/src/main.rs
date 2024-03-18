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

// Local Usages
use crate::layout::menu::create_menu;
use crate::commands::user::{get_user_summaries, get_authenticated_user_summary};
use crate::commands::utilities::get_env;
use crate::commands::auth::{create_google_oauth, remove_google_oauth};
use crate::database::connection::get_connection_pool;
use crate::services::stronghold::create_stronghold_plugin;
use crate::state::{AppState};

fn main() {
    let menu = create_menu();

    let pool = get_connection_pool();

    let stronghold_plugin = create_stronghold_plugin();

    let app_state = AppState { pool };

    tauri::Builder::default()
        .plugin(stronghold_plugin.build())
        .menu(menu)
        .manage(app_state)
        .invoke_handler(
            tauri::generate_handler![
                get_user_summaries,
                get_authenticated_user_summary,
                create_google_oauth,
                remove_google_oauth,
                get_env
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
