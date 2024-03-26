// External Usages
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Selectable};

// Local Usages
use crate::models::auth::{AuthCore};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub auth_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub age: Option<i32>,
    pub avatar: Option<String>,
    pub locale: String,
    pub is_onboarded: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::user)]
pub struct CreateUser<'a> {
    pub auth_id: &'a i32,
    pub first_name: &'a String,
    pub last_name: &'a String,
    pub avatar: &'a String,
    pub locale: &'a String,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::user)]
pub struct PartialCreateUser<'a> {
    pub first_name: &'a String,
    pub last_name: &'a String,
    pub avatar: &'a String,
    pub locale: &'a String,
}

#[derive(Debug, Insertable, AsChangeset)]
#[diesel(table_name = crate::schema::user)]
pub struct UpdateUser {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub avatar: Option<String>,
    pub locale: Option<String>,
    pub age: Option<i32>,
    pub is_onboarded: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthenticatedUser {
    pub user: User,
    pub auth: AuthCore,
}