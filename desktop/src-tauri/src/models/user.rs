use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::OauthProvider"]
pub enum OauthProvider {
    Email,
    Google,
    Instagram,
    Pinterest,
}

#[derive(Queryable, Selectable, Serialize, Deserialize)]
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

#[derive(Insertable)]
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

#[derive(Insertable)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleOAuthUserTokenBody {
    pub email: String,
    pub family_name: String,
    pub given_name: String,
    pub locale: String,
    pub name: String,
    pub picture: String,
    pub id: String,
    pub verified_email: bool
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSummary {
    pub id: i32,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub avatar: Option<String>,
    pub provider: OauthProvider,
    pub locale: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthedSignatureClaims {
    pub id: i32,
    pub email: String,
    pub exp: i64,
}