// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::record)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Record {
    pub id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub author: String,
    pub category: String,
    pub authored_at: Option<chrono::NaiveDateTime>,
    pub started_at: Option<chrono::NaiveDateTime>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::record)]
pub struct CreateRecord {
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub author: String,
    pub category: String,
    pub authored_at: Option<chrono::NaiveDateTime>,
    pub started_at: Option<chrono::NaiveDateTime>,
}
