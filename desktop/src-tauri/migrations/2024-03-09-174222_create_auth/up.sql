-- Your SQL goes here

CREATE TYPE OAUTH_PROVIDER AS ENUM (
    'email',
    'google',
    'github',
    'instagram',
    'pinterest'
);

CREATE TABLE IF NOT EXISTS "auth" (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT null,
    provider OAUTH_PROVIDER NOT NULL DEFAULT 'email',
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CHECK (CHAR_LENGTH(email) > 6)
);