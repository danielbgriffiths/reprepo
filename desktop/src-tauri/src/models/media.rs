use diesel::prelude::*;

#[derive(Debug)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::MediaType"]
pub enum MediaType {
    Video,
    Audio,
    Document,
    Image,
    ExternalVideo,
    ExternalAudio,
    ExternalImage,
    ExternalDocument,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::media)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Media {
    pub id: i32,
    pub user_id: i32,
    pub media_type: MediaType,
    pub label: String,
    pub file_name: String,
    pub file_path: String,
    pub media_uri: String,
    pub is_private: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::media)]
pub struct CreateMedia<'a> {
    pub user_id: &'a i32,
    pub media_type: &'a MediaType,
    pub label: &'a String,
    pub file_name: &'a String,
    pub file_path: &'a String,
    pub media_uri: &'a String,
    pub is_private: &'a bool,
}