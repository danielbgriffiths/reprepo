// External Usages
use serde::{Deserialize, Serialize};
use diesel::{Queryable, Selectable};

// Local Usages
use crate::models::user::OauthProvider;

#[derive(Debug, Selectable, Serialize, Deserialize, PartialEq, Queryable)]
#[diesel(table_name = crate::schema::users)]
pub struct UserAuthenticationFields {
    pub password: Option<String>,
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub provider: OauthProvider,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthedSignatureClaims {
    pub id: i32,
    pub email: String,
    pub exp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleOAuthUserTokenBody {
    pub email: String,
    pub family_name: String,
    pub given_name: String,
    pub locale: String,
    pub name: String,
    pub picture: String,
    pub id: String,
    pub verified_email: bool
}