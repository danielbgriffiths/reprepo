// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "oauth_provider"))]
    pub struct OauthProvider;
}

diesel::table! {
    account (id) {
        id -> Int4,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::OauthProvider;

    auth (id) {
        id -> Int4,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password -> Nullable<Varchar>,
        provider -> OauthProvider,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    auth_account (id) {
        id -> Int4,
        auth_id -> Int4,
        account_id -> Int4,
        is_root -> Bool,
        #[max_length = 2000]
        access_token -> Nullable<Varchar>,
        #[max_length = 2000]
        refresh_token -> Nullable<Varchar>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    author_meta (id) {
        id -> Int4,
        #[max_length = 212]
        full_name -> Varchar,
        #[max_length = 70]
        first_name -> Varchar,
        #[max_length = 70]
        last_name -> Varchar,
        #[max_length = 70]
        middle -> Nullable<Varchar>,
        born_at -> Nullable<Date>,
        died_at -> Nullable<Date>,
        #[max_length = 100]
        birth_country -> Nullable<Varchar>,
        #[max_length = 100]
        birth_region -> Nullable<Varchar>,
        #[max_length = 100]
        birth_city -> Nullable<Varchar>,
        #[max_length = 50]
        nationality -> Nullable<Varchar>,
        #[max_length = 10]
        gender -> Nullable<Varchar>,
        #[max_length = 5000]
        author_summary -> Nullable<Varchar>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    commit (id) {
        id -> Int4,
        record_id -> Int4,
        #[max_length = 200]
        title -> Nullable<Varchar>,
        #[max_length = 8000]
        notes -> Varchar,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    composition_meta (id) {
        id -> Int4,
        author_meta_id -> Int4,
        #[max_length = 50]
        genre -> Varchar,
        written_at -> Nullable<Date>,
        #[max_length = 250]
        full_title -> Varchar,
        #[max_length = 200]
        piece_title -> Varchar,
        #[max_length = 200]
        set_title -> Nullable<Varchar>,
        number_in_set -> Nullable<Int4>,
        movement -> Nullable<Int4>,
        opus -> Nullable<Int4>,
        kvv -> Nullable<Int4>,
        n -> Nullable<Int4>,
        variation -> Nullable<Int4>,
        #[max_length = 10]
        key -> Nullable<Varchar>,
        #[max_length = 5000]
        work_summary -> Nullable<Varchar>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    record (id) {
        id -> Int4,
        user_id -> Int4,
        repository_id -> Int4,
        parent_id -> Nullable<Int4>,
        author_meta_id -> Int4,
        composition_meta_id -> Int4,
        started_at -> Date,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    repository (id) {
        id -> Int4,
        user_id -> Int4,
        #[max_length = 50]
        name -> Varchar,
        #[max_length = 50]
        field -> Varchar,
        #[max_length = 50]
        specialization -> Varchar,
        #[max_length = 2000]
        description -> Nullable<Varchar>,
        social_links -> Array<Nullable<Text>>,
        is_private -> Bool,
        start_date -> Date,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    user (id) {
        id -> Int4,
        auth_id -> Int4,
        #[max_length = 30]
        first_name -> Varchar,
        #[max_length = 50]
        last_name -> Varchar,
        age -> Nullable<Int4>,
        #[max_length = 255]
        avatar -> Nullable<Varchar>,
        #[max_length = 10]
        locale -> Varchar,
        is_onboarded -> Bool,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(auth_account -> account (account_id));
diesel::joinable!(auth_account -> auth (auth_id));
diesel::joinable!(commit -> record (record_id));
diesel::joinable!(composition_meta -> author_meta (author_meta_id));
diesel::joinable!(record -> author_meta (author_meta_id));
diesel::joinable!(record -> composition_meta (composition_meta_id));
diesel::joinable!(record -> repository (repository_id));
diesel::joinable!(record -> user (user_id));
diesel::joinable!(repository -> user (user_id));
diesel::joinable!(user -> auth (auth_id));

diesel::allow_tables_to_appear_in_same_query!(
    account,
    auth,
    auth_account,
    author_meta,
    commit,
    composition_meta,
    record,
    repository,
    user,
);
