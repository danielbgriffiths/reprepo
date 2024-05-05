// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::commit)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Commit {
    pub id: i32,
    pub record_id: i32,
    pub title: Option<String>,
    pub notes: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::commit)]
pub struct CreateCommit {
    pub record_id: i32,
    pub title: Option<String>,
    pub notes: String,
}
