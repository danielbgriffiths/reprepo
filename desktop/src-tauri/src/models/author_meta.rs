// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::composition_meta::{CompositionMeta, GeneratedCompositionMeta};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::author_meta)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct AuthorMeta {
    pub id: i32,
    pub full_name: String,
    pub first_name: String,
    pub last_name: String,
    pub middle: Option<String>,
    pub born_at: Option<chrono::NaiveDate>,
    pub died_at: Option<chrono::NaiveDate>,
    pub birth_country: Option<String>,
    pub birth_region: Option<String>,
    pub birth_city: Option<String>,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub author_summary: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::author_meta)]
pub struct CreateAuthorMeta {
    pub full_name: String,
    pub first_name: String,
    pub last_name: String,
    pub middle: Option<String>,
    pub born_at: Option<chrono::NaiveDate>,
    pub died_at: Option<chrono::NaiveDate>,
    pub birth_country: Option<String>,
    pub birth_region: Option<String>,
    pub birth_city: Option<String>,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub author_summary: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeneratedAuthorMeta {
    pub full_name: String,
    pub first_name: String,
    pub last_name: String,
    pub middle: Option<String>,
    pub born_at: Option<String>,
    pub died_at: Option<String>,
    pub birth_country: Option<String>,
    pub birth_region: Option<String>,
    pub birth_city: Option<String>,
    pub nationality: Option<String>,
    pub gender: Option<String>,
    pub author_summary: Option<String>,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::author_meta)]
pub struct AuthorFilterItem {
    pub id: i32,
    pub full_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthorCompositionMeta {
    pub author_meta: AuthorMeta,
    pub composition_meta: CompositionMeta,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneratedAuthorCompositionMeta {
    pub author_meta: GeneratedAuthorMeta,
    pub composition_meta: GeneratedCompositionMeta,
}

pub trait IntoAuthorMeta {
    fn into_author_meta(self) -> Result<CreateAuthorMeta, chrono::ParseError>;
}

impl crate::models::author_meta::IntoAuthorMeta for GeneratedAuthorMeta {
    fn into_author_meta(self) -> Result<CreateAuthorMeta, chrono::ParseError> {
        let born_at = chrono::NaiveDate::parse_from_str(&self.born_at.unwrap(), "%Y-%m-%d")?;
        let died_at = chrono::NaiveDate::parse_from_str(&self.died_at.unwrap(), "%Y-%m-%d")?;

        Ok(CreateAuthorMeta {
            full_name: self.full_name,
            first_name: self.first_name,
            last_name: self.last_name,
            middle: self.middle,
            born_at: Some(born_at),
            died_at: Some(died_at),
            birth_country: self.birth_country,
            birth_region: self.birth_region,
            birth_city: self.birth_city,
            nationality: self.nationality,
            gender: self.gender,
            author_summary: self.author_summary,
        })
    }
}