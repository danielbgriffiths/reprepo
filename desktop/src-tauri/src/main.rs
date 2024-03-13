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
pub mod services;

//
// External Usages
//

use std::sync::Mutex;

//
// Local Usages
//

use crate::layout::menu::create_menu;
use crate::commands::user::get_user;
use crate::commands::user::create_user;
use crate::database::connection::establish_connection;
use crate::state::{AppState};

fn main() {
    let menu = create_menu();

    let db_connection = Mutex::new(Some(establish_connection()));

    tauri::Builder::default()
        .menu(menu)
        .manage(AppState { db_connection })
        .invoke_handler(tauri::generate_handler![get_user, create_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
