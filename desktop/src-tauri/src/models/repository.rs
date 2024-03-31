// External Imports
use diesel::prelude::*;
use serde;


#[derive(Debug, Queryable, Selectable, serde::Serialize, serde::Deserialize)]
#[diesel(table_name = crate::schema::repository)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Repository {
    pub id: i32,
    pub name: String,
    pub user_id: i32,
    pub field: String,
    pub specialization: String,
    pub is_private: bool,
    pub avatar: Option<String>,
    pub start_date: chrono::NaiveDateTime,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable, serde::Serialize, serde::Deserialize)]
#[diesel(table_name = crate::schema::repository)]
pub struct CreateRepository {
    pub user_id: i32,
    pub name: String,
    pub field: String,
    pub specialization: String,
    pub is_private: bool,
    pub avatar: String,
    pub start_date: chrono::NaiveDateTime,
}