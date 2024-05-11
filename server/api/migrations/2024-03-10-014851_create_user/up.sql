-- Your SQL goes here

CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    auth_id INTEGER NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INTEGER DEFAULT null,
    avatar VARCHAR(255) DEFAULT null,
    locale VARCHAR(10) NOT NULL DEFAULT 'en-US',
    is_onboarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CHECK (age > 0),
    CHECK (CHAR_LENGTH(first_name) > 2),
    CHECK (CHAR_LENGTH(last_name) > 2),

    CONSTRAINT fk_auth
        FOREIGN KEY (auth_id)
            REFERENCES auth (id)
            ON DELETE CASCADE
);