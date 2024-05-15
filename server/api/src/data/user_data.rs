// External Usages
use diesel::{ExpressionMethods, OptionalExtension, PgConnection, QueryDsl, RunQueryDsl, SelectableHelper};
use diesel::r2d2::{ConnectionManager, PooledConnection};
use actix_web::web;

// Local Usages
use crate::state::DbPool;
use crate::models::user::{CreateUser, User};
use crate::schema::user;
use crate::libs::error::ApiError;

pub async fn select_users_by_id(db: &DbPool, user_ids: Vec<i32>) -> Result<Vec<User>, ApiError> {
    let res: Vec<User> = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        user::table
            .filter(user::id.eq_any(user_ids))
            .returning(User::as_select())
            .get_result::<User>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub async fn select_by_id(db: &DbPool, target_id: i32) -> Result<User, ApiError> {
    let res: User = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        user::table
            .find(target_id)
            .returning(User::as_select())
            .get_result::<User>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub fn create_user_transaction_sync(db_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, create_user: &CreateUser) -> Result<i32, ApiError> {
    let user_id = user::table
        .filter(user::email.eq(create_user.clone().email))
        .select(user::id)
        .first::<i32>(db_connection)
        .optional()?;

    if let Some(id) = user_id {
        return Ok(id);
    }

    let user_id = diesel::insert_into(user::table)
        .values(create_user)
        .returning(user::id)
        .get_result::<i32>(db_connection)?;

    return Ok(user_id)
}

pub async fn update_tokens(db: &DbPool, target_id: &i32, access_token: String, refresh_token: String) -> Result<User, ApiError> {
    let res: User = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        user::table
            .filter(user::id.eq(target_id))
            .set((
                user::access_token.eq(access_token),
                user::refresh_token.eq(refresh_token)
            ))
            .returning(User::as_select())
            .get_result::<User>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}

pub async fn remove_tokens(db: &DbPool, target_id: &i32) -> Result<i32, ApiError> {
    let res: i32 = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        user::table
            .filter(user::id.eq(target_id))
            .set((
                user::access_token.eq(None::<String>),
                user::refresh_token.eq(None::<String>)
            ))
            .returning(user::id)
            .get_result::<i32>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}