use diesel::PgConnection;
use crate::models::user::User;
use crate::schema::users::*;
use crate::schema::users::dsl::users;

pub fn get_user(db_connection: &mut PgConnection) -> User {
    users
        .find(1)
        .select(User::as_select())
        .first(db_connection)
        .optional()
}