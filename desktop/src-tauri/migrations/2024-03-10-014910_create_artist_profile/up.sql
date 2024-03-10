-- Your SQL goes here

CREATE TYPE ARTIST_FIELD AS ENUM (
    'musician',
    'dancer',
    'visual_artist'
);

CREATE TYPE ARTIST_SPECIALIZATION AS ENUM (
    'piano',
    'violin',
    'cello',
    'voice',
    'guitar',
    'graphic_designer',
    'fine_art',
    'film',
    'ballet',
    'hip_hop',
    'exotic_dance'
);

CREATE TABLE IF NOT EXISTS artist_profile (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    field ARTIST_FIELD NOT NULL,
    specialization ARTIST_SPECIALIZATION NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMP NOT NULL DEFAULT now(),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

INSERT INTO artist_profile VALUES (
    DEFAULT,
    1,
    'musician',
    'piano',
    false
);