// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::auth::Auth;
use crate::libs::error::ApiError;
use crate::libs::locale::find_valid_locale;

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,
    pub auth_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub age: Option<i32>,
    pub avatar: Option<String>,
    pub locale: String,
    pub is_onboarded: bool,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthUser {
    pub user: User,
    pub auth: Auth,
}

pub trait WithAuth {
    fn with_auth(self, auth: Auth) -> Result<AuthUser, ApiError>;
}

impl crate::models::user::WithAuth for User {
    fn with_auth(self, auth: Auth) -> Result<AuthUser, ApiError> {
        Ok(AuthUser {
            user: self,
            auth,
        })
    }
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::user)]
pub struct CreateUser {
    pub auth_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub avatar: String,
    pub locale: String,
}

#[derive(Debug)]
#[diesel(table_name = crate::schema::user)]
pub struct PartialCreateUser {
    pub first_name: String,
    pub last_name: String,
    pub avatar: String,
    pub locale: String,
}

pub trait AddAuthId {
    fn add_auth_id(self, auth_id: i32) -> Result<CreateUser, ApiError>;
}

impl crate::models::user::AddAuthId for PartialCreateUser {
    fn add_auth_id(self, auth_id: i32) -> Result<CreateUser, ApiError> {
        Ok(CreateUser {
            first_name: self.first_name,
            last_name: self.last_name,
            avatar: self.avatar,
            locale: find_valid_locale(&self.locale),
            auth_id,
        })
    }
}