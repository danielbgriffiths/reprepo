// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::auth_account::AuthFieldsFromAuthAccount;

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
#[diesel(table_name = crate::schema::auth)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Auth {
    pub id: i32,
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::auth)]
pub struct CreateAuth<'a> {
    pub email: &'a String,
    pub password: Option<String>,
    pub provider: &'a OauthProvider,
}


#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::auth)]
pub struct AuthCore {
    pub id: i32,
    pub email: String,
}

#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::auth)]
pub struct AuthFieldsFromAuth {
    pub password: Option<String>,
    pub provider: OauthProvider,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthedSignatureClaims {
    pub id: i32,
    pub email: String,
    pub account_id: i32,
    pub exp: i64,
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

#[derive(Debug)]
pub struct AllAuthFields {
    pub auth_fields_from_auth: AuthFieldsFromAuth,
    pub auth_fields_from_auth_account: AuthFieldsFromAuthAccount,
}
