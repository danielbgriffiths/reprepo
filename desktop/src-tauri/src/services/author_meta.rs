// External Usages
use diesel::{BoolExpressionMethods, JoinOnDsl, PgConnection, QueryDsl, QueryResult, RunQueryDsl, SelectableHelper, ExpressionMethods, OptionalExtension};
use diesel::r2d2::{ConnectionManager, PooledConnection};

// Local Usages
use crate::models::author_meta::{AuthorFilterItem, AuthorMeta, CreateAuthorMeta, GeneratedAuthorMeta};
use crate::schema::{author_meta, composition_meta, record, repository};
use crate::state::AppState;

pub fn create_author_meta(transaction_connection: &mut PooledConnection<ConnectionManager<PgConnection>>, author_meta: &CreateAuthorMeta) -> QueryResult<i32> {
    diesel::insert_into(author_meta::table)
        .values(author_meta)
        .returning(author_meta::id)
        .get_result::<i32>(transaction_connection)
}

pub fn select_authors(app_state: &AppState, field: String, specialization: String) -> QueryResult<Vec<AuthorFilterItem>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    repository::table
        .inner_join(
            record::table.on(
                record::repository_id.eq(repository::id)
            )
        )
        .inner_join(
            composition_meta::table.on(
                composition_meta::id.eq(record::composition_meta_id)
            )
        )
        .inner_join(
            author_meta::table.on(
                author_meta::id.eq(composition_meta::author_meta_id)
            )
        )
        .filter(
            repository::field.eq(field)
                .or(repository::specialization.eq(specialization))
        )
        .select(AuthorFilterItem::as_select())
        .load::<AuthorFilterItem>(db_connection)
}

pub fn select_author_meta_by_generated(app_state: &AppState, generated_author_meta: &GeneratedAuthorMeta) -> QueryResult<Option<AuthorMeta>> {
    let db_connection = &mut app_state.pool.get().unwrap();

    let first_name = generated_author_meta.first_name.clone();
    let last_name = generated_author_meta.last_name.clone();

    author_meta::table
        .filter(
            author_meta::first_name.eq(first_name)
                .and(author_meta::last_name.eq(last_name))
        )
        .select(AuthorMeta::as_select())
        .first::<AuthorMeta>(db_connection)
        .optional()
}