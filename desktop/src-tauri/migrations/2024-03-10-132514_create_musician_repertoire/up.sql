-- Your SQL goes here

CREATE TABLE IF NOT EXISTS musician_repertoire (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    composer VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    mvmt INTEGER DEFAULT NULL,
    n INTEGER DEFAULT NULL,
    op INTEGER DEFAULT NULL,
    kvv INTEGER DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);