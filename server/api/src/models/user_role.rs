// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::user_role)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct UserRole {
    pub id: i32,

    pub user_id: i32,
    pub role_id: i32,

    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Insertable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::user_role)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct CreateUserRole {
    pub user_id: i32,
    pub role_id: i32,
}