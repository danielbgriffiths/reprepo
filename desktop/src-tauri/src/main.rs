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

//
// Usages
//

use crate::layout::menu::create_menu;
use crate::commands::user::greet;

fn main() {
    let menu = create_menu();

    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
