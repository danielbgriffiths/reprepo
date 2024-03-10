-- Your SQL goes here

CREATE TYPE MEDIA_TYPE AS ENUM (
    'video',
    'audio',
    'document',
    'image',
    'external_video',
    'external_audio',
    'external_image',
    'external_document'
);

CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    label VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    media_uri VARCHAR(255) NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false,
    media_type MEDIA_TYPE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    UNIQUE (file_name, file_path),
    CHECK (file_path IS NOT NULL OR media_uri IS NOT NULL),

    CONSTRAINT fk_users
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);