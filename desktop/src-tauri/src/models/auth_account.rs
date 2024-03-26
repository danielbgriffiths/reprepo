// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::auth_account)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AuthAccount {
    pub id: i32,
    pub account_id: i32,
    pub auth_id: i32,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::auth_account)]
pub struct CreateAuthAccount<'a> {
    pub account_id: &'a i32,
    pub auth_id: &'a i32,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::auth_account)]
pub struct PartialCreateAuthAccount {
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
}

#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::auth_account)]
pub struct AuthFieldsFromAuthAccount {
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
}