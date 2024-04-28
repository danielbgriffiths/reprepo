// External Usages
use serde::{Deserialize, Serialize};

pub enum ProgressEvent {
    Started,
    InProgress(i32),
    Failed(String),
    Completed,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProgressEventResponse {
    state: &'static str,
    percentage: Option<i32>,
    message: Option<String>,
}

impl ProgressEvent {
    pub fn get(&self) -> ProgressEventResponse {
        match self {
            ProgressEvent::Started => ProgressEventResponse {
                state: "started",
                percentage: None,
                message: None,
            },
            ProgressEvent::InProgress(percentage) => ProgressEventResponse {
                state: "in-progress",
                percentage: Some(*percentage),
                message: None,
            },
            ProgressEvent::Failed(message) => ProgressEventResponse {
                state: "failed",
                percentage: None,
                message: Some(message.clone()),
            },
            ProgressEvent::Completed => ProgressEventResponse {
                state: "completed",
                percentage: None,
                message: None,
            },
        }
    }
}