// External Imports
use diesel::prelude::*;


#[derive(Debug, Queryable, Selectable)]
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

#[derive(Insertable)]
#[diesel(table_name = crate::schema::repository)]
pub struct CreateRepository<'a> {
    pub user_id: &'a i32,
    pub name: &'a String,
    pub field: &'a String,
    pub specialization: &'a String,
    pub is_private: &'a bool,
    pub avatar: &'a String,
    pub start_date: &'a chrono::NaiveDateTime,
}