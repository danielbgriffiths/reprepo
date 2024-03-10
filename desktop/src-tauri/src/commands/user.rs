//
// External Usages
//
use diesel::prelude::*;

//
// Local Usages
//
use crate::database::connection::establish_connection;
use crate::models::user::User;
use crate::schema::users::age;
use crate::schema::users::dsl::users;

#[tauri::command]
pub fn greet(name: &str) -> String {
    let connection = &mut establish_connection();

    let results = users
        .filter(age.eq(31))
        .limit(5)
        .select(User::as_select())
        .load(connection)
        .expect("Error loading users");

    format!("Hi {}! We fetched, {} users.", name, results.len())
}