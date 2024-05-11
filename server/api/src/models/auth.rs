// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};
use chrono;

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::OauthProvider"]
pub enum OauthProvider {
    Email,
    Google,
    Instagram,
    Pinterest,
}

pub struct AuthClaims {
    pub id: i32,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub email: String,
    pub provider: OauthProvider,
    pub password: Option<String>,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::auth)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Auth {
    pub id: i32,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}