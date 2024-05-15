// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};

// Local Usages
use crate::models::role::RoleName;

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::OauthProvider"]
pub enum OauthProvider {
    Email,
    Google,
    Instagram,
    Pinterest,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct User {
    pub id: i32,

    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
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

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::user)]
pub struct CreateUser {
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
    pub first_name: String,
    pub last_name: String,
    pub avatar: String,
    pub locale: String,
    pub role: RoleName,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiClaims {
    pub sub: i32,
    pub exp: i64,
    pub provider: OauthProvider,
    pub token_type: String,
}

pub trait IntoApiClaims {
    fn into_api_claims(self, exp: i64, token_type: String) -> ApiClaims;
}

impl crate::models::user::IntoApiClaims for User {
    fn into_api_claims(self, exp: chrono::DateTime<chrono::Utc>, token_type: String) -> ApiClaims {
        ApiClaims {
            sub: self.id,
            exp: exp.timestamp(),
            provider: self.provider,
            token_type,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GoogleOAuthTokenClaims {
    pub email: String,
    pub family_name: String,
    pub given_name: String,
    pub locale: String,
    pub name: String,
    pub picture: String,
    pub id: String,
    pub verified_email: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginGoogleOAuthBody {
    pub claims: GoogleOAuthTokenClaims,
    pub role: RoleName,
}