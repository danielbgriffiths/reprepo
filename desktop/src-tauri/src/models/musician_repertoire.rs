use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::musician_repertoire)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct MusicianRepertoire {
    pub id: i32,
    pub user_id: i32,
    pub composer: String,
    pub name: String,
    pub mvmt: Option<i32>,
    pub n: Option<i32>,
    pub op: Option<i32>,
    pub kvv: Option<i32>,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::musician_repertoire)]
pub struct CreateMusicianRepertoire<'a> {
    pub user_id: &'a i32,
    pub composer: &'a String,
    pub name: &'a String,
    // TODO: Make these Option<al>
    pub mvmt: &'a i32,
    pub n: &'a i32,
    pub op: &'a i32,
    pub kvv: &'a i32,
}