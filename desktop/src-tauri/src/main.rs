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
use tauri::{App, LogicalSize, Manager};
use std::error::Error;

// Local Usages
use crate::layout::menu::create_menu;
use crate::commands::user::{get_users, get_authenticated_user, update_user_onboarding};
use crate::commands::utilities::get_env;
use crate::commands::auth::{create_google_oauth, logout};
use crate::commands::file::{upload_file, delete_file};
use crate::commands::repository::{get_repositories, create_repository};
use crate::database::connection::get_connection_pool;
use crate::services::stronghold::create_stronghold_plugin;
use crate::state::{AppState};

fn setup_window_constraints(app: &mut App) -> Result<(), Box<dyn Error>> {
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
}

fn main() {
    tauri::Builder::default()
        .plugin(create_stronghold_plugin().build())
        .menu(create_menu())
        .manage(AppState { pool: get_connection_pool() })
        .invoke_handler(
            tauri::generate_handler![
                // Users
                get_users,
                get_authenticated_user,
                update_user_onboarding,

                // Auth
                create_google_oauth,
                logout,

                // General
                get_env,
                upload_file,
                delete_file,

                // Repositories
                get_repositories,
                create_repository
            ]
        )
        .setup(setup_window_constraints)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
