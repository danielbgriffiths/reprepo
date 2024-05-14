// External Usages
use actix_web::web;

// Local Usages
use crate::controllers::{user_controller, auth_controller};

pub fn public_routes(mut cfg: web::ServiceConfig) {
    cfg
        .service(
            web::scope("user")
                .route("/auth", web::get().to(auth_controller::get_user))
                .route("/{user_ids}", web::get().to(user_controller::get_users))
        ).service(
            web::scope("auth")
                .route("/login-google-oauth/{user_id}", web::post().to(auth_controller::login_google_oauth))
                .route("/login-google-oauth", web::post().to(auth_controller::login_google_oauth))
    );
}

pub fn private_routes(mut cfg: web::ServiceConfig) {
    cfg
        .service(
            web::scope("auth")
                .route("logout", web::get().to(auth_controller::logout))
        );
}