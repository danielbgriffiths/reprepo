// External Usages
use diesel::QueryResult;

// Local Usages
use crate::models::auth::{Auth, AuthClaims};
use crate::state::DbPool;

pub async fn select_with_validated_claims(db: &DbPool, auth_claims: AuthClaims) -> QueryResult<Auth> {

}