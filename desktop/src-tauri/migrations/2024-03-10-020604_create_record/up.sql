-- Your SQL goes here

CREATE TABLE IF NOT EXISTS record (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artist_profile_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_artist_profile
        FOREIGN KEY (artist_profile_id)
            REFERENCES artist_profile (id)
            ON DELETE CASCADE
);