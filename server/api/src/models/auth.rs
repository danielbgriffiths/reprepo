// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Insertable, Queryable, Selectable};
use chrono;

// Local Usages
use crate::libs::error::ApiError;
use crate::models::user::{AuthUser, User};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[derive(diesel_derive_enum::DbEnum)]
#[ExistingTypePath = "crate::schema::sql_types::OauthProvider"]
pub enum OauthProvider {
    Email,
    Google,
    Instagram,
    Pinterest,
}

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize, Clone)]
#[diesel(table_name = crate::schema::auth)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Auth {
    pub id: i32,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

pub trait WithUser {
    fn with_user(self, user: User) -> Result<AuthUser, ApiError>;
}

impl crate::models::auth::WithUser for Auth {
    fn with_user(self, user: User) -> Result<AuthUser, ApiError> {
        Ok(AuthUser {
            user,
            auth: self,
        })
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthClaims {
    pub id: i32,
    pub email: String,
    pub provider: OauthProvider,
    pub password: Option<String>,
    pub exp: i64,
    pub token_type: String,
}

pub trait IntoAuthClaims {
    fn into_auth_claims(self, exp: chrono::DateTime<chrono::Utc>, token_type: String) -> Result<AuthClaims, ApiError>;
}

impl crate::models::auth::IntoAuthClaims for Auth {
    fn into_auth_claims(self, exp: chrono::DateTime<chrono::Utc>, token_type: String) -> Result<AuthClaims, ApiError> {
        Ok(AuthClaims {
            id: self.id,
            email: self.email,
            provider: self.provider,
            password: self.password,
            exp: exp.timestamp(),
            token_type,
        })
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
    pub verified_email: bool
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginGoogleOAuthBody {
    pub token_claims: GoogleOAuthTokenClaims,
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Debug, Insertable)]
#[diesel(table_name = crate::schema::auth)]
pub struct CreateAuth {
    pub email: String,
    pub password: Option<String>,
    pub provider: OauthProvider,
}
