-- Your SQL goes here

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INTEGER DEFAULT null,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CHECK (age > 0),
    CHECK (CHAR_LENGTH(first_name) > 2),
    CHECK (CHAR_LENGTH(last_name) > 2),
    CHECK (CHAR_LENGTH(email) > 6)
);

INSERT INTO users VALUES (
    DEFAULT,
    'Daniel',
    'Griffiths',
    'danielbgriffiths@protonmail.com',
    'FAKE_PASSWORD',
    31
);