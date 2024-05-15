// External Usages
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use actix_web::web;

// Local Usages
use crate::state::DbPool;
use crate::libs::error::ApiError;
use crate::models::role::{Role, RoleName};
use crate::schema::role;

pub async fn select_by_names(db: &DbPool, names: Vec<RoleName>) -> Result<Vec<Role>, ApiError> {
    let res: Vec<Role> = web::block(move || {
        let db_connection = &mut db.get().unwrap();

        role::table
            .filter(role::name.eq_any(names))
            .returning(Role::as_select())
            .get_results::<Role>(db_connection)
    })
        .await
        .map_err(|e| ApiError::Database(e.to_string()))?;

    Ok(res)
}
