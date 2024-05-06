use std::collections::HashSet;
// External Usages
use tauri::State;
use std::sync::{Arc};
use chrono::{Datelike, NaiveDateTime};
use tokio::sync::Mutex;

// local Usages
use crate::libs::error::LocalError;
use crate::models::repository::{CreateRepositoryPayload, IntoRepository, Repository};
use crate::libs::calendar::{hash_map_commits_by_date, generate_commit_calendar_table, CommitCalendar};
use crate::services;
use crate::state::AppState;

#[tauri::command]
pub async fn get_repositories(state: State<'_, Arc<Mutex<AppState>>>, user_id: i32) -> Result<Vec<Repository>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::repository::select_repositories(&app_state, &user_id) {
        Ok(repositories) => Ok(repositories),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn create_repository(state: State<'_, Arc<Mutex<AppState>>>, new_repository: CreateRepositoryPayload) -> Result<i32, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let repository = new_repository
        .into_repository()
        .map_err(|e| LocalError::ProcessError {message: e.to_string()})?;

    match services::repository::create_repository(&app_state, repository) {
        Ok(repository_id) => Ok(repository_id),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn get_repository(state: State<'_, Arc<Mutex<AppState>>>, target_repository_id: i32) -> Result<Repository, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    match services::repository::get_repository(&app_state, &target_repository_id) {
        Ok(repository) => Ok(repository),
        Err(e) => Err(LocalError::DatabaseError { message: e.to_string() })
    }
}

#[tauri::command]
pub async fn get_commit_calendar(
    state: State<'_, Arc<Mutex<AppState>>>,
    target_repository_id: i32,
    year: i32
) -> Result<CommitCalendar, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let commits = services::repository::select_commits_by_year(&app_state, &target_repository_id, &year)
        .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?;

    Ok(
        generate_commit_calendar_table(
            year,
            hash_map_commits_by_date(commits)
        )
    )
}

#[tauri::command]
pub async fn get_years_list(state: State<'_, Arc<Mutex<AppState>>>, target_repository_id: i32) -> Result<Vec<i32>, LocalError> {
    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let all_commit_years: Vec<NaiveDateTime> = services::repository::get_years(&app_state, &target_repository_id)
        .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?;

    let unique_years: HashSet<i32> = all_commit_years
        .iter()
        .map(|&date_time| date_time.year())
        .collect();

    Ok(unique_years.into_iter().collect())
}