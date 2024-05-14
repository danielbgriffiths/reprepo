CREATE TYPE OAUTH_PROVIDER AS ENUM (
    'email',
    'google',
    'github',
    'instagram',
    'pinterest'
);

CREATE TABLE IF NOT EXISTS "user" (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT null,
    provider OAUTH_PROVIDER NOT NULL DEFAULT 'email',
    access_token VARCHAR(2000) DEFAULT null,
    refresh_token VARCHAR(2000) DEFAULT null,
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
    CHECK (CHAR_LENGTH(email) > 6)
);