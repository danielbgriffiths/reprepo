// External Usages
use tauri::{AppHandle, State};
use std::sync::Arc;
use tokio::sync::Mutex;
use async_openai::{types::{CreateChatCompletionRequestArgs, ChatCompletionResponseFormat, ChatCompletionResponseFormatType}, Client};
use std::fs::read_to_string;
use async_openai::types::ChatCompletionRequestUserMessageArgs;

// local Usages
use crate::libs::error::LocalError;
use crate::models::author_meta::GeneratedAuthorCompositionMeta;
use crate::state::AppState;

#[tauri::command]
pub async fn generate_author_composition_meta(
    app_handle: AppHandle,
    _state: State<'_, Arc<Mutex<AppState>>>,
    field: Box<str>,
    specialization: Box<str>,
    name: Box<str>,
    author: Box<str>
) -> Result<GeneratedAuthorCompositionMeta, LocalError> {
    let resource_path = app_handle.path_resolver()
        .resolve_resource("prompts/author_composition_meta.txt")
        .expect("failed to resolve resource");

    let contents = read_to_string(resource_path)
        .map_err(|e| LocalError::ProcessError { message: e.to_string() })?;

    let modified_contents = contents
        .replace("{{author}}", &author)
        .replace("{{name}}", &name)
        .replace("{{field}}", &field)
        .replace("{{specialization}}", &specialization);

    let client = Client::new();

    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-4-turbo")
        .n(1)
        .messages([
            ChatCompletionRequestUserMessageArgs::default()
                .content(modified_contents)
                .build()
                .map_err(|e| LocalError::ExternalError { message: e.to_string() })?
                .into()
        ])
        .response_format(ChatCompletionResponseFormat{
            r#type: ChatCompletionResponseFormatType::JsonObject
        })
        .max_tokens(4096_u16)
        .build()
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    let response = client
        .chat()
        .create(request)
        .await
        .map_err(|e| LocalError::ExternalError { message: e.to_string() })?;

    let choice = response.choices.first().expect("Choice").clone();

    let stringed: &str = &choice.message.content.unwrap();

    let result: Result<GeneratedAuthorCompositionMeta, LocalError> = serde_json::from_str(stringed)
        .map_err(|e| LocalError::ExternalError { message: e.to_string() });

    print!("{:?}", result);

    return result
}