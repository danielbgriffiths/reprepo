// External Usages
use tauri::{AppHandle, State, Window};
use async_openai::{types::{CreateChatCompletionRequestArgs, ChatCompletionResponseFormat, ChatCompletionResponseFormatType}, Client};
use std::fs::read_to_string;
use std::sync::Arc;
use async_openai::types::ChatCompletionRequestUserMessageArgs;
use tokio::sync::Mutex;

// local Usages
use crate::libs::event::ProgressEvent;
use crate::libs::error::LocalError;
use crate::models::author_meta::{GeneratedAuthorCompositionMeta, IntoGeneratedAuthorMeta};
use crate::models::composition_meta::IntoGeneratedCompositionMeta;
use crate::services::author_meta::select_author_meta_by_generated;
use crate::services::composition_meta::select_composition_meta_by_generated;
use crate::state::AppState;

#[tauri::command]
pub async fn generate_author_composition_meta(
    state: State<'_, Arc<Mutex<AppState>>>,
    app_handle: AppHandle,
    window: Window,
    field: Box<str>,
    specialization: Box<str>,
    name: Box<str>,
    author: Box<str>,
    event_key: String,
) -> Result<GeneratedAuthorCompositionMeta, LocalError> {
    window.emit(&event_key, ProgressEvent::Started.get()).unwrap();

    let resource_path = app_handle.path_resolver()
        .resolve_resource("prompts/author_composition_meta.txt")
        .expect("failed to resolve resource");

    window.emit(&event_key, ProgressEvent::InProgress(90).get()).unwrap();

    let contents = read_to_string(resource_path)
        .map_err(|e| {
            window.emit(&event_key, ProgressEvent::Failed(e.to_string()).get()).unwrap();
            LocalError::ProcessError { message: e.to_string() }
        })?;

    window.emit(&event_key, ProgressEvent::InProgress(80).get()).unwrap();

    let modified_contents = contents
        .replace("{{author}}", &author)
        .replace("{{name}}", &name)
        .replace("{{field}}", &field)
        .replace("{{specialization}}", &specialization);

    window.emit(&event_key, ProgressEvent::InProgress(60).get()).unwrap();

    let client = Client::new();

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-4-turbo")
        .n(1)
        .messages([
            ChatCompletionRequestUserMessageArgs::default()
                .content(modified_contents)
                .build()
                .map_err(|e| {
                    window.emit(&event_key, ProgressEvent::Failed(e.to_string()).get()).unwrap();
                    LocalError::ExternalError { message: e.to_string() }
                })?
                .into()
        ])
        .response_format(ChatCompletionResponseFormat{
            r#type: ChatCompletionResponseFormatType::JsonObject
        })
        .max_tokens(4096_u16)
        .build()
        .map_err(|e| {
            window.emit(&event_key, ProgressEvent::Failed(e.to_string()).get()).unwrap();
            LocalError::ExternalError { message: e.to_string() }
        })?;

    window.emit(&event_key, ProgressEvent::InProgress(50).get()).unwrap();

    let response = client
        .chat()
        .create(request)
        .await
        .map_err(|e| {
            window.emit(&event_key, ProgressEvent::Failed(e.to_string()).get()).unwrap();
            LocalError::ExternalError { message: e.to_string() }
        })?;

    window.emit(&event_key, ProgressEvent::InProgress(10).get()).unwrap();

    let choice = response.choices.first().expect("Choice").clone();

    let stringed: &str = &choice.message.content.unwrap();

    window.emit(&event_key, ProgressEvent::InProgress(1).get()).unwrap();

    let result: GeneratedAuthorCompositionMeta = serde_json::from_str(stringed)
        .map_err(|e| {
            window.emit(&event_key, ProgressEvent::Failed(e.to_string()).get()).unwrap();
            LocalError::ExternalError { message: e.to_string() }
        })?;

    window.emit(&event_key, ProgressEvent::Completed.get()).unwrap();

    let state_guard = state
        .inner()
        .lock()
        .await;
    let app_state = &*state_guard;

    let author_meta = select_author_meta_by_generated(&app_state, &result.author_meta)
        .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?;

    let composition_meta = select_composition_meta_by_generated(&app_state, &result.composition_meta)
        .map_err(|e| LocalError::DatabaseError { message: e.to_string() })?;

    if let (Some(author_meta), Some(composition_meta)) = (author_meta, composition_meta) {
        if composition_meta.author_meta_id == author_meta.id {
            return Ok(GeneratedAuthorCompositionMeta {
                author_meta: author_meta.into_generated_author_meta().unwrap(),
                composition_meta: composition_meta.into_generated_composition_meta().unwrap(),
            });
        }
    }

    return Ok(result)
}