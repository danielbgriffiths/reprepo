// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//
// Declarations
//

pub mod models;
pub mod database;
pub mod schema;
pub mod layout;
pub mod commands;
pub mod state;

//
// External Usages
//

use tauri::{State, AppHandle, Manager};

//
// Local Usages
//

use crate::layout::menu::create_menu;
use crate::commands::user::get_user;
use crate::commands::user::create_user;
use crate::database::connection::establish_connection;
use crate::state::{AppState, ServiceAccess};

fn main() {
    let menu = create_menu();

    tauri::Builder::default()
        .menu(menu)
        .setup(|app| {
            let handle: AppHandle = app.app_handle();
            let app_state: State<AppState> = handle.state();
            let connection = establish_connection();
            *app_state.db.lock().unwrap() = Some(connection);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_user, create_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
