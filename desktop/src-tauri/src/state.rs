//
// External Usages
//

use std::sync::Mutex;
use diesel::PgConnection;
use oauth2::basic::{BasicErrorResponse, BasicRevocationErrorResponse, BasicTokenIntrospectionResponse, BasicTokenResponse, BasicTokenType};
use oauth2::{Client, EndpointNotSet, EndpointSet, StandardRevocableToken};

pub struct AppState {
    pub db_connection: Mutex<Option<PgConnection>>,
    pub google_oauth_client: Client<
        BasicErrorResponse,
        BasicTokenResponse,
        BasicTokenType,
        BasicTokenIntrospectionResponse,
        StandardRevocableToken,
        BasicRevocationErrorResponse,
        EndpointSet,
        EndpointNotSet,
        EndpointNotSet,
        EndpointSet,
        EndpointSet
    >
}