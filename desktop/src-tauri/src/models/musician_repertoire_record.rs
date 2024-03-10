use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::musician_repertoire_record)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct MusicianRepertoireRecord {
    pub id: i32,
    pub record_id: i32,
    pub musician_repertoire_id: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::musician_repertoire_record)]
pub struct CreateMusicianRepertoireRecord<'a> {
    pub record_id: &'a i32,
    pub musician_repertoire_id: &'a i32,
}