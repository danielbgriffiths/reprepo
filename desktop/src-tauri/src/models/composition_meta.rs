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
    pub piece_title: String,
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
    pub full_title: String,
    pub piece_title: String,
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeneratedCompositionMeta {
    pub id: Option<i32>,
    pub author_meta_id: Option<i32>,
    pub genre: String,
    pub written_at: Option<String>,
    pub full_title: String,
    pub piece_title: String,
    pub set_title: Option<String>,
    pub number_in_set: Option<i32>,
    pub movement: Option<i32>,
    pub opus: Option<i32>,
    pub kvv: Option<i32>,
    pub n: Option<i32>,
    pub variation: Option<i32>,
    pub key: Option<String>,
    pub work_summary: Option<String>,
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::composition_meta)]
#[serde(rename_all = "camelCase")]
pub struct CompositionFilterItem {
    pub id: i32,
    pub full_title: String,
}

pub trait IntoCompositionMeta {
    fn into_composition_meta(self, author_meta_id: i32) -> Result<CreateCompositionMeta, chrono::ParseError>;
}

impl crate::models::composition_meta::IntoCompositionMeta for GeneratedCompositionMeta {
    fn into_composition_meta(self, author_meta_id: i32) -> Result<CreateCompositionMeta, chrono::ParseError> {
        let written_at = chrono::NaiveDate::parse_from_str(&self.written_at.unwrap(), "%Y-%m-%d")?;

        Ok(CreateCompositionMeta {
            author_meta_id,
            genre: self.genre,
            written_at: Some(written_at),
            full_title: self.full_title,
            piece_title: self.piece_title,
            set_title: self.set_title,
            number_in_set: self.number_in_set,
            movement: self.movement,
            opus: self.opus,
            kvv: self.kvv,
            n: self.n,
            variation: self.variation,
            key: self.key,
            work_summary: self.work_summary,
        })
    }
}

pub trait IntoGeneratedCompositionMeta {
    fn into_generated_composition_meta(self) -> Result<GeneratedCompositionMeta, chrono::ParseError>;
}

impl crate::models::composition_meta::IntoGeneratedCompositionMeta for CompositionMeta {
    fn into_generated_composition_meta(self) -> Result<GeneratedCompositionMeta, chrono::ParseError> {
        Ok(GeneratedCompositionMeta {
            id: Some(self.id),
            author_meta_id: Some(self.author_meta_id),
            genre: self.genre,
            written_at: self.written_at.map(|date| date.format("%Y-%m-%d").to_string()),
            full_title: self.full_title,
            piece_title: self.piece_title,
            set_title: self.set_title,
            number_in_set: self.number_in_set,
            movement: self.movement,
            opus: self.opus,
            kvv: self.kvv,
            n: self.n,
            variation: self.variation,
            key: self.key,
            work_summary: self.work_summary,
            created_at: Some(self.created_at),
            updated_at: self.updated_at,
            deleted_at: self.deleted_at,
        })
    }
}