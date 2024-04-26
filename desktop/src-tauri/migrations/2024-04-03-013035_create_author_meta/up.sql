-- Your SQL goes here

CREATE TABLE IF NOT EXISTS author_meta (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    full_name VARCHAR(212) NOT NULL,
    first_name VARCHAR(70) NOT NULL,
    last_name VARCHAR(70) NOT NULL,
    middle VARCHAR(70) DEFAULT NULL,
    born_at DATE DEFAULT NULL,
    died_at DATE DEFAULT NULL,
    birth_country VARCHAR(100) DEFAULT NULL,
    birth_region VARCHAR(100) DEFAULT NULL,
    birth_city VARCHAR(100) DEFAULT NULL,
    nationality VARCHAR(50) DEFAULT NULL,
    gender VARCHAR(10) DEFAULT NULL,
    author_summary VARCHAR(5000) DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);