// External Usages
use diesel::QueryResult;
use tauri::State;
use diesel::prelude::*;
use diesel;

// Local Usages
use crate::models::user::{CreateOAuthUser, UserCore, UserSummary};
use crate::models::auth::{UserAuthenticationFields};
use crate::schema::users::dsl::users;
use crate::schema::users::{access_token, id, refresh_token};
use crate::state::AppState;

pub fn select_user_summaries(app_state: &State<AppState>) -> QueryResult<Vec<UserSummary>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let user_summaries = users
        .select(UserSummary::as_select())
        .get_results::<UserSummary>(db_connection);

    user_summaries
}

pub fn select_user_summary(app_state: &State<AppState>, user_id: &i32) -> QueryResult<UserSummary> {
    let db_connection = &mut app_state.pool.get().unwrap();

    users
        .find(user_id)
        .select(UserSummary::as_select())
        .get_result::<UserSummary>(db_connection)
}

pub fn select_user_core(app_state: &State<AppState>, user_id: &i32) -> QueryResult<UserCore> {
    let db_connection = &mut app_state.pool.get().unwrap();

    users
        .find(user_id)
        .select(UserCore::as_select())
        .first::<UserCore>(db_connection)
}

pub fn select_user_authentication_fields(app_state: &State<AppState>, user_id: &i32) -> QueryResult<UserAuthenticationFields> {
    let db_connection = &mut app_state.pool.get().unwrap();

    users
        .find(user_id)
        .select(UserAuthenticationFields::as_select())
        .first::<UserAuthenticationFields>(db_connection)
}

pub fn create_user(app_state: &State<AppState>, new_user: &CreateOAuthUser) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(users)
        .values(new_user)
        .returning(id)
        .get_result::<i32>(db_connection)
}

pub fn update_user_access_tokens_null(app_state: &State<AppState>, user_id: &i32) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::update(users)
        .filter(id.eq(user_id))
        .set((access_token.eq(None::<String>), refresh_token.eq(None::<String>)))
        .returning(id)
        .get_result::<i32>(db_connection)
}