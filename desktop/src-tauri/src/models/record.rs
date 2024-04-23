// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::record)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Record {
    pub id: i32,
    pub user_id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub author: String,
    pub category: String,
    pub authored_at: chrono::NaiveDate,
    pub started_at: chrono::NaiveDate,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::record)]
pub struct CreateRecord {
    pub user_id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub author: String,
    pub category: String,
    pub authored_at: chrono::NaiveDate,
    pub started_at: chrono::NaiveDate,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRecordPayload {
    pub user_id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub name: String,
    pub author: String,
    pub started_at: String,
}

pub trait IntoRecord {
    fn into_record(self) -> Result<CreateRecord, chrono::ParseError>;
}

impl crate::models::record::IntoRecord for CreateRecordPayload {
    fn into_record(self) -> Result<CreateRecord, chrono::ParseError> {
        let started_at = chrono::NaiveDate::parse_from_str(&self.started_at, "%Y-%m-%d")?;
        let authored_at = chrono::NaiveDate::parse_from_str(&self.started_at, "%Y-%m-%d")?;

        Ok(CreateRecord {
            user_id: self.user_id,
            repository_id: self.repository_id,
            parent_id: self.parent_id,
            name: self.name,
            author: self.author,
            category: "Romantic".to_string(),
            started_at,
            authored_at,
        })
    }
}