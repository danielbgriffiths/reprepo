// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "artist_field"))]
    pub struct ArtistField;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "artist_specialization"))]
    pub struct ArtistSpecialization;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "checkpoint_status"))]
    pub struct CheckpointStatus;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "media_type"))]
    pub struct MediaType;
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::ArtistField;
    use super::sql_types::ArtistSpecialization;

    artist_profile (id) {
        id -> Int4,
        user_id -> Int4,
        field -> ArtistField,
        specialization -> ArtistSpecialization,
        is_private -> Bool,
        start_date -> Timestamp,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::CheckpointStatus;

    checkpoint (id) {
        id -> Int4,
        record_id -> Int4,
        status -> CheckpointStatus,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::MediaType;

    media (id) {
        id -> Int4,
        user_id -> Int4,
        #[max_length = 255]
        label -> Varchar,
        #[max_length = 255]
        file_name -> Varchar,
        #[max_length = 255]
        file_path -> Varchar,
        #[max_length = 255]
        media_uri -> Varchar,
        is_private -> Bool,
        media_type -> MediaType,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    media_checkpoint (id) {
        id -> Int4,
        media_id -> Int4,
        checkpoint_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    media_record (id) {
        id -> Int4,
        media_id -> Int4,
        record_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    musician_repertoire (id) {
        id -> Int4,
        user_id -> Int4,
        #[max_length = 255]
        composer -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        mvmt -> Nullable<Int4>,
        n -> Nullable<Int4>,
        op -> Nullable<Int4>,
        kvv -> Nullable<Int4>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    musician_repertoire_record (id) {
        id -> Int4,
        musician_repertoire_id -> Int4,
        record_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    record (id) {
        id -> Int4,
        artist_profile_id -> Int4,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        #[max_length = 100]
        first_name -> Varchar,
        #[max_length = 100]
        last_name -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        age -> Nullable<Int4>,
        created_at -> Timestamp,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(artist_profile -> users (user_id));
diesel::joinable!(checkpoint -> record (record_id));
diesel::joinable!(media -> users (user_id));
diesel::joinable!(media_checkpoint -> checkpoint (checkpoint_id));
diesel::joinable!(media_checkpoint -> media (media_id));
diesel::joinable!(media_record -> media (media_id));
diesel::joinable!(media_record -> record (record_id));
diesel::joinable!(musician_repertoire -> users (user_id));
diesel::joinable!(musician_repertoire_record -> musician_repertoire (musician_repertoire_id));
diesel::joinable!(musician_repertoire_record -> record (record_id));
diesel::joinable!(record -> artist_profile (artist_profile_id));

diesel::allow_tables_to_appear_in_same_query!(
    artist_profile,
    checkpoint,
    media,
    media_checkpoint,
    media_record,
    musician_repertoire,
    musician_repertoire_record,
    record,
    users,
);
