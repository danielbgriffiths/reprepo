use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::record)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Record {
    pub id: i32,
    pub artist_profile_id: i32,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::record)]
pub struct CreateRecord<'a> {
    pub artist_profile_id: &'a i32,
}