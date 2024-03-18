// External Usages
use diesel::prelude::*;
use tauri::{State};
use std::env;
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};


// Local Usages
use crate::models::user::{User, UserSummary, AuthedSignatureClaims};
use crate::schema::users::dsl::users;
use crate::state::{AppState};

#[tauri::command]
pub fn get_user_summaries(state: State<AppState>) -> Vec<UserSummary> {
    let db_connection = &mut state.pool.get().unwrap();

    let result = users
        .select(User::as_select())
        .get_results(db_connection);

    match result {
        Ok(users_vector) => {
            let mut user_summaries: Vec<UserSummary> = Vec::new();
            for user in users_vector {
                user_summaries.push(UserSummary {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    provider: user.provider,
                    locale: user.locale,
                    avatar: user.avatar,
                });
            }
            user_summaries
        },
        Err(_e) => Vec::new()
    }
}

#[tauri::command]
pub fn get_authenticated_user_summary(authed_signature: Option<String>, state: State<AppState>) -> Option<UserSummary> {
    match authed_signature {
        Some(signature) => {
            let authed_signature_secret = env::var("AUTHED_SIGNATURE_SECRET")
                .expect("Missing the AUTHED_SIGNATURE_SECRET environment variable.");

            let static_user_partial = decode::<AuthedSignatureClaims>(
                &signature,
                &DecodingKey::from_secret(authed_signature_secret.as_ref()),
                &Validation::new(Algorithm::HS256)
            );

            match static_user_partial {
                Ok(token_data) => {
                    let db_connection = &mut state.pool.get().unwrap();

                    let fetched_user = users.find(token_data.claims.id).select(User::as_select()).get_result(db_connection).unwrap();

                    if token_data.claims.id == fetched_user.id && token_data.claims.email == fetched_user.email {
                        return Some(UserSummary {
                            id: fetched_user.id,
                            email: fetched_user.email,
                            first_name: fetched_user.first_name,
                            last_name: fetched_user.last_name,
                            provider: fetched_user.provider,
                            locale: fetched_user.locale,
                            avatar: fetched_user.avatar,
                        })
                    }

                    return None
                },
                Err(e) => {
                    println!("Error: {}", e);
                    None
                }
            }
        },
        None => None
    }
}