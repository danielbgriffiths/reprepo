// Third Party Usages
use std::collections::HashMap;
use chrono::{Datelike, NaiveDate};

// Local Usages
use crate::models::commit::Commit;

#[derive(Debug, Clone)]
pub struct CommitCalendarDay {
    date: NaiveDate,
    density: i32,
    count: i32,
}

#[derive(Debug, Clone)]
pub struct CommitCalendarHeader {
    count: i32, // Weeks in month
}

#[derive(Debug, Clone)]
pub struct CommitCalendarRow {
    days: Vec<CommitCalendarDay>,
}

#[derive(Debug, Clone)]
pub struct CommitCalendar {
    headers: Vec<CommitCalendarHeader>,
    rows: Vec<CommitCalendarRow>,
}



pub fn hash_map_commits_by_date(commits: Vec<Commit>) -> HashMap<NaiveDate, Vec<Commit>> {
    let mut map: HashMap<NaiveDate, Vec<Commit>>  = HashMap::new();

    for commit in commits {
        let naive_date = commit.created_at.date();
        map.entry(naive_date).or_insert_with(Vec::new).push(commit);
    }

    map
}

// Function to calculate the number of days in a given month
fn days_in_month(year: i32, month: u32) -> i32 {
    NaiveDate::from_ymd_opt(year, month, 1)
        .and_then(|date| date.with_day(1)?.with_month(month + 1))
        .map(|date| (date - chrono::Duration::days(1)).day() as i32)
        .unwrap_or(0)
}

// Function to calculate the density of commits based on the count
fn calculate_density(count: usize) -> i32 {
    match count {
        0 => 0,
        1..=4 => 1,
        5..=9 => 2,
        10..=14 => 3,
        15..=19 => 4,
        _ => 5,
    }
}

pub fn generate_commit_calendar_table(year: i32, commits: HashMap<NaiveDate, Vec<Commit>>) -> CommitCalendar {
    let headers = (1..=12)
        .map(|month| CommitCalendarHeader { count: days_in_month(year, month) / 7 })
        .collect::<Vec<_>>();

    let mut rows = Vec::new();
    for day_of_week in 0..7 {
        let mut days = Vec::new();
        let mut current_date = NaiveDate::from_ymd(year, 1, 1);
        let mut current_month = 1;

        while current_month <= 12 {
            while current_date.month() == current_month {
                if current_date.weekday().num_days_from_monday() == day_of_week {
                    let commits_for_date = commits.get(&current_date).unwrap_or(&vec![]);
                    let density = calculate_density(commits_for_date.len());

                    days.push(CommitCalendarDay {
                        date: current_date,
                        density,
                        count: commits_for_date.len() as i32,
                    });
                }
                current_date = current_date.succ();
            }
            current_month += 1;
            current_date = NaiveDate::from_ymd(year, current_month, 1);
        }

        rows.push(CommitCalendarRow { days });
    }

    CommitCalendar { headers, rows }
}