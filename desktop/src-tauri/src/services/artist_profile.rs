// External Usages
use diesel::{QueryResult, RunQueryDsl};
use tauri::State;
use diesel::prelude::*;

// Local Usages
use crate::state::AppState;
use crate::models::artist_profile::{ArtistProfile, CreateArtistProfile};
use crate::schema::artist_profile::dsl::artist_profile;
use crate::schema::artist_profile::id;

pub fn _create_artist_profile(app_state: &State<AppState>, new_artist_profile: &CreateArtistProfile) -> QueryResult<i32> {
    let db_connection = &mut app_state.pool.get().unwrap();

    diesel::insert_into(artist_profile)
        .values(new_artist_profile)
        .returning(id)
        .get_result::<i32>(db_connection)
}

pub fn _select_artist_profile(app_state: &State<AppState>, artist_profile_id: &i32) -> QueryResult<ArtistProfile> {
    let db_connection = &mut app_state.pool.get().unwrap();

    artist_profile
        .find(artist_profile_id)
        .select(ArtistProfile::as_select())
        .get_result::<ArtistProfile>(db_connection)
}