use diesel::prelude::*;

#[derive(Debug)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::CheckpointStatus"]
pub enum CheckpointStatus {
    Started,
    Learning,
    Studied,
    Memorized,
    Learned,
    PersonalRecording,
    ProfessionalRecording,
    Masterclass,
    StudioRecital,
    PublicRecital,
    Taught,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::checkpoint)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Checkpoint {
    pub id: i32,
    pub record_id: i32,
    pub status: CheckpointStatus,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::checkpoint)]
pub struct CreateCheckpoint<'a> {
    pub record_id: &'a i32,
    pub status: &'a CheckpointStatus,
}