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
use tauri::{LogicalSize, Manager};

// Local Usages
use crate::layout::menu::create_menu;
use crate::commands::user::{get_user_summaries, get_authenticated_user_summary};
use crate::commands::utilities::get_env;
use crate::commands::auth::{create_google_oauth, logout};
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
                logout,
                get_env
            ]
        )
        .setup(|app| {
            match app.get_window(&"main".to_string()) {
                Some(main_window) => {
                    let _min_size = main_window.set_min_size(Some(LogicalSize {
                        width: 1100,
                        height: 800,
                    }));

                    Ok(())
                },
                None => Ok(())
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
