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
    pub description: Option<String>,
    pub social_links: Vec<Option<String>>,
    pub start_date: chrono::NaiveDate,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable, serde::Serialize, serde::Deserialize, Debug)]
#[diesel(table_name = crate::schema::repository)]
pub struct CreateRepository {
    pub user_id: i32,
    pub name: String,
    pub field: String,
    pub specialization: String,
    pub is_private: bool,
    pub description: Option<String>,
    pub social_links: Vec<Option<String>>,
    pub start_date: chrono::NaiveDate,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct CreateRepositoryPayload {
    pub user_id: i32,
    pub name: String,
    pub field: String,
    pub specialization: String,
    pub is_private: bool,
    pub description: Option<String>,
    pub start_date: String,
}

pub trait IntoRepository {
    fn into_repository(self) -> Result<CreateRepository, chrono::ParseError>;
}

impl IntoRepository for CreateRepositoryPayload {
    fn into_repository(self) -> Result<CreateRepository, chrono::ParseError> {
        let start_date = chrono::NaiveDate::parse_from_str(&self.start_date, "%Y-%m-%d")?;

        Ok(CreateRepository {
            user_id: self.user_id,
            name: self.name,
            field: self.field,
            specialization: self.specialization,
            is_private: self.is_private,
            description: self.description,
            social_links: Vec::new(),
            start_date,
        })
    }
}