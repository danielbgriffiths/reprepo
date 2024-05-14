// External Usages
use actix_web::{web, App, HttpServer, Responder};
use actix_web_httpauth::middleware::HttpAuthentication;
use tokio::sync::Mutex;
use std::sync::Arc;

// Local Usages
mod routes;
mod middleware;
mod data;
mod state;
mod models;
mod libs;
mod controllers;
mod schema;
mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let app_data = web::Data::new(state::AppData {
            user: Arc::new(Mutex::new(None)),
            db: state::establish_connection(),
        });

        let auth = HttpAuthentication::bearer(middleware::auth_validator::middleware);

        App::new()
            .app_data(app_data.clone())
            .service(web::scope("/v1").configure(routes::api_v1::public_routes))
            .service(web::scope("/v1").wrap(auth).configure(routes::api_v1::private_routes))
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}