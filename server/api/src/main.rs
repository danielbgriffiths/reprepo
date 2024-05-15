// External Usages
use actix_web::{web, App, HttpServer};
use actix_web_httpauth::middleware::HttpAuthentication;
use tokio::sync::Mutex;
use std::sync::Arc;
use std::fs::File;
use std::io::BufReader;

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
    let mut certs_file = BufReader::new(File::open("cert.pem").unwrap());
    let mut key_file = BufReader::new(File::open("key.pem").unwrap());

    let tls_certs = rustls_pemfile::certs(&mut certs_file)
        .collect::<Result<Vec<_>, _>>()
        .unwrap();
    let tls_key = rustls_pemfile::pkcs8_private_keys(&mut key_file)
        .next()
        .unwrap()
        .unwrap();

    let tls_config = rustls::ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(tls_certs, rustls::pki_types::PrivateKeyDer::Pkcs8(tls_key))
        .unwrap();

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
        .bind_rustls(("127.0.0.1", 8443), tls_config.into())?
        .run()
        .await
}