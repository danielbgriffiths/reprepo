// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::composition_meta::CompositionMeta;

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