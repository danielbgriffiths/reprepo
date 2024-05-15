// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Selectable};

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::RoleName"]
pub enum RoleName {
    Student,
    Teacher,
    Institution,
    Professional,
    Parent
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::role)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Role {
    pub id: i32,

    pub name: RoleName,

    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}
