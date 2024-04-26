// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::composition_meta)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct CompositionMeta {
    pub id: i32,
    pub author_meta_id: i32,
    pub genre: String,
    pub written_at: Option<chrono::NaiveDate>,
    pub full_title: String,
    pub piece_title: Option<String>,
    pub set_title: Option<String>,
    pub number_in_set: Option<i32>,
    pub movement: Option<i32>,
    pub opus: Option<i32>,
    pub kvv: Option<i32>,
    pub n: Option<i32>,
    pub variation: Option<i32>,
    pub key: Option<String>,
    pub work_summary: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::composition_meta)]
pub struct CreateCompositionMeta {
    pub author_meta_id: i32,
    pub genre: String,
    pub written_at: Option<chrono::NaiveDate>,
    pub full_title: Option<String>,
    pub piece_title: Option<String>,
    pub set_title: Option<String>,
    pub number_in_set: Option<i32>,
    pub movement: Option<i32>,
    pub opus: Option<i32>,
    pub kvv: Option<i32>,
    pub n: Option<i32>,
    pub variation: Option<i32>,
    pub key: Option<String>,
    pub work_summary: Option<String>,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::composition_meta)]
pub struct CompositionFilterItem {
    pub id: i32,
    pub full_name: String,
}
