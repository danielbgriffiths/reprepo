// External Imports
use diesel::prelude::*;

#[derive(Debug)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::ArtistField"]
pub enum ArtistField {
    Musician,
    Dancer,
    VisualArtist,
}

#[derive(Debug)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::ArtistSpecialization"]
pub enum ArtistSpecialization {
    Piano,
    Violin,
    Cello,
    Voice,
    Guitar,
    GraphicDesigner,
    FineArt,
    Film,
    Ballet,
    HipHop,
    ExoticDance,
}

#[derive(Debug, Queryable, Selectable)]
#[diesel(table_name = crate::schema::artist_profile)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct ArtistProfile {
    pub id: i32,
    pub user_id: i32,
    pub field: ArtistField,
    pub specialization: ArtistSpecialization,
    pub is_private: bool,
    pub start_date: chrono::NaiveDateTime,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::artist_profile)]
pub struct CreateArtistProfile<'a> {
    pub user_id: &'a i32,
    pub field: &'a ArtistField,
    pub specialization: &'a ArtistSpecialization,
    pub is_private: &'a bool,
    pub start_date: &'a chrono::NaiveDateTime,
}