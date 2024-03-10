use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::media_checkpoint)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct MediaCheckpoint {
    pub id: i32,
    pub checkpoint_id: i32,
    pub media_id: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::media_checkpoint)]
pub struct CreateMediaCheckpoint<'a> {
    pub checkpoint_id: &'a i32,
    pub media_id: &'a i32,
}