// External Usages
use diesel::{BoolExpressionMethods, ExpressionMethods, JoinOnDsl, OptionalExtension, PgConnection, QueryDsl, QueryResult, RunQueryDsl, SelectableHelper};
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::composition_meta::{CompositionFilterItem, CompositionMeta, CreateCompositionMeta, GeneratedCompositionMeta};
use crate::schema::{composition_meta, record, repository};
use crate::state::AppState;

pub fn create_composition_meta(transaction_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, composition_meta: &CreateCompositionMeta) -> QueryResult<i32> {
    diesel::insert_into(composition_meta::table)
        .values(composition_meta)
        .returning(composition_meta::id)
        .get_result::<i32>(transaction_connection)
}

pub fn select_names(app_state: &AppState, field: String, specialization: String, author_meta_ids: Vec<i32>) -> QueryResult<Vec<CompositionFilterItem>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .filter(
            repository::field.eq(&field)
                .or(repository::specialization.eq(&specialization))
        )
        .inner_join(record::table.on(record::repository_id.eq(repository::id)))
        .inner_join(composition_meta::table.on(composition_meta::id.eq(record::composition_meta_id)))
        .filter(composition_meta::author_meta_id.eq_any(author_meta_ids))
        .select(CompositionFilterItem::as_select())
        .load::<CompositionFilterItem>(db_connection)
}

pub fn select_composition_meta_by_generated(app_state: &AppState, generated_composition_meta: &GeneratedCompositionMeta) -> QueryResult<Option<CompositionMeta>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let piece_title = generated_composition_meta.piece_title.clone();

    composition_meta::table
        .filter(
            composition_meta::piece_title.eq(piece_title)
        )
        .select(CompositionMeta::as_select())
        .first::<CompositionMeta>(db_connection)
        .optional()
}