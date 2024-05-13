// External Usages
use actix_web::web;
use diesel::prelude::*;
use diesel;
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::auth::{Auth, CreateAuth};
use crate::state::DbPool;
use crate::schema::auth;
use crate::libs::error::ApiError;

pub async fn select_by_id_and_email(db: &DbPool, target_id: i32, target_email: String) -> Result<Auth, ApiError> {
    let res: Auth = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        auth::table
            .filter(auth::id.eq(target_id).and(auth::email.eq(target_email)))
            .returning(Auth::as_select())
            .get_result::<Auth>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub async fn select_by_id(db: &DbPool, target_id: i32) -> Result<Auth, ApiError> {
    let res: Auth = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        auth::table
            .find(target_id)
            .returning(Auth::as_select())
            .get_result::<Auth>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub async fn remove_auth_account_tokens(db: &DbPool, target_id: &i32) -> Result<i32, ApiError> {
    let res: i32 = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        auth::table
            .filter(auth::id.eq(target_id))
            .set((
                auth::access_token.eq(None::<String>),
                auth::refresh_token.eq(None::<String>)
            ))
            .returning(Auth::as_select())
            .get_result::<Auth>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub async fn update_auth_tokens(db: &DbPool, target_id: &i32, access_token: String, refresh_token: String) -> Result<Auth, ApiError> {
    let res: Auth = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        auth::table
            .filter(auth::id.eq(target_id))
            .set((
                auth::access_token.eq(access_token),
                auth::refresh_token.eq(refresh_token)
            ))
            .returning(Auth::as_select())
            .get_result::<Auth>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub fn create_auth(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, create_auth: &CreateAuth) -> Result<i32, ApiError> {
    let existing_auth_id = auth::table
        .filter(auth::email.eq(&create_auth.email))
        .select(auth::id)
        .first::<i32>(db_connection)
        .optional()?;

    if let Some(id) = existing_auth_id {
        return Ok(id);
    }

    let auth_id = diesel::insert_into(auth::table)
        .values(create_auth)
        .returning(auth::id)
        .get_result::<i32>(db_connection)?;

    return Ok(auth_id)
}