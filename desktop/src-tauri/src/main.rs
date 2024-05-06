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
mod libs;

// External Usages
use tauri::{App, LogicalSize, Manager};
use std::error::Error;
use std::sync::Arc;
use tokio::sync::Mutex;

// Local Usages
use crate::layout::menu::create_menu;
use crate::commands::user::{get_users, get_authenticated_user, update_user_onboarding, async_proc_avatar_resize};
use crate::commands::utilities::get_env;
use crate::commands::auth::{create_google_oauth, logout};
use crate::commands::file::{upload_file, delete_file, get_file};
use crate::commands::repository::{get_repositories, create_repository, get_repository, get_years_list, get_commit_calendar};
use crate::commands::record::{get_records, create_record, get_record};
use crate::commands::commit::{get_commits, create_commit};
use crate::commands::author_meta::get_authors;
use crate::commands::composition_meta::get_names;
use crate::commands::ai::generate_author_composition_meta;
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
        .manage(Arc::new(Mutex::new(AppState { pool: get_connection_pool() })))
        .invoke_handler(
            tauri::generate_handler![
                // User
                get_users,
                get_authenticated_user,
                update_user_onboarding,
                async_proc_avatar_resize,

                // Auth
                create_google_oauth,
                logout,

                // General
                get_env,

                // File
                upload_file,
                delete_file,
                get_file,

                // Repository
                get_repositories,
                create_repository,
                get_repository,
                get_years_list,
                get_commit_calendar,

                // Record
                get_records,
                create_record,
                get_record,

                // Commit
                get_commits,
                create_commit,

                // AI
                generate_author_composition_meta,

                // Author Meta
                get_authors,

                // Composition Meta
                get_names,
            ]
        )
        .setup(setup_window_constraints)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
