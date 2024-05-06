// Third Party Usages
use std::collections::HashMap;
use chrono::{Datelike, NaiveDate};
use serde::{Deserialize, Serialize};

// Local Usages
use crate::models::commit::Commit;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitCalendarDay {
    pub date: NaiveDate,
    pub density: i32,
    pub count: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitCalendarHeader {
    pub count: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitCalendarRow {
    pub days: Vec<CommitCalendarDay>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitCalendar {
    pub headers: Vec<CommitCalendarHeader>,
    pub rows: Vec<CommitCalendarRow>,
}



pub fn hash_map_commits_by_date(commits: Vec<Commit>) -> HashMap<NaiveDate, Vec<Commit>> {
    let mut map: HashMap<NaiveDate, Vec<Commit>>  = HashMap::new();

    for commit in commits {
        let naive_date = commit.created_at.date();
        map.entry(naive_date).or_insert_with(Vec::new).push(commit);
    }

    map
}

fn days_in_month(year: i32, month: u32) -> i32 {
    NaiveDate::from_ymd_opt(year, month, 1)
        .and_then(|date| date.with_day(1)?.with_month(month + 1))
        .map(|date| (date - chrono::Duration::try_days(1).unwrap()).day() as i32)
        .unwrap_or(0)
}

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
        let mut current_date = NaiveDate::from_ymd_opt(year, 1, 1).unwrap();
        let mut current_month = 1;

        while current_month <= 12 {
            while current_date.month() == current_month {
                if current_date.weekday().num_days_from_monday() == day_of_week {
                    let commits_for_date = commits.get(&current_date).cloned().unwrap_or_default();
                    let density = calculate_density(commits_for_date.len());

                    days.push(CommitCalendarDay {
                        date: current_date,
                        density,
                        count: commits_for_date.len() as i32,
                    });
                }
                current_date = current_date.succ_opt().unwrap();
            }
            current_month += 1;

            if let Some(next_current_date)  = NaiveDate::from_ymd_opt(year, current_month, 1) {
                current_date = next_current_date;
            }
        }

        rows.push(CommitCalendarRow { days });
    }

    CommitCalendar { headers, rows }
}