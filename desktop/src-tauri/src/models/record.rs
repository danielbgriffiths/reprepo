// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::author_meta::GeneratedAuthorMeta;
use crate::models::composition_meta::GeneratedCompositionMeta;

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::record)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Record {
    pub id: i32,
    pub user_id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub author_meta_id: i32,
    pub composition_meta_id: i32,
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
    pub author_meta_id: i32,
    pub composition_meta_id: i32,
    pub started_at: chrono::NaiveDate,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateRecordPayload {
    pub user_id: i32,
    pub repository_id: i32,
    pub parent_id: Option<i32>,
    pub author_meta: GeneratedAuthorMeta,
    pub composition_meta: GeneratedCompositionMeta,
    pub started_at: String,
}

pub trait IntoRecord {
    fn into_record(self, author_meta_id: i32, composition_meta_id: i32) -> Result<CreateRecord, chrono::ParseError>;
}

impl crate::models::record::IntoRecord for CreateRecordPayload {
    fn into_record(self, author_meta_id: i32, composition_meta_id: i32) -> Result<CreateRecord, chrono::ParseError> {
        let started_at = chrono::NaiveDate::parse_from_str(&self.started_at, "%Y-%m-%d")?;

        Ok(CreateRecord {
            user_id: self.user_id,
            repository_id: self.repository_id,
            parent_id: self.parent_id,
            author_meta_id,
            composition_meta_id,
            started_at,
        })
    }
}