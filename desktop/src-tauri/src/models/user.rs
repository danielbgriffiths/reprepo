// External Usages
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Selectable};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::OauthProvider"]
pub enum OauthProvider {
    Email,
    Google,
    Instagram,
    Pinterest,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub password: Option<String>,
    pub age: Option<i32>,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub avatar: Option<String>,
    pub provider: OauthProvider,
    pub locale: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::users)]
pub struct CreateEmailUser<'a> {
    pub first_name: &'a String,
    pub last_name: &'a String,
    pub email: &'a String,
    pub password: &'a String,
    pub age: &'a i32,
    pub avatar: &'a String,
    pub locale: &'a String,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::users)]
pub struct CreateOAuthUser<'a> {
    pub first_name: &'a String,
    pub last_name: &'a String,
    pub email: &'a String,
    pub access_token: &'a String,
    pub refresh_token: &'a String,
    pub avatar: &'a String,
    pub locale: &'a String,
    pub provider: &'a OauthProvider,
}

#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::users)]
pub struct UserSummary {
    pub id: i32,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub avatar: Option<String>,
    pub provider: OauthProvider,
    pub locale: String,
}

#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::users)]
pub struct UserCore {
    pub id: i32,
    pub email: String,
}