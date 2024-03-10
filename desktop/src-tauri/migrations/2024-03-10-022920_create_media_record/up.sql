-- Your SQL goes here

CREATE TABLE IF NOT EXISTS media_record (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    media_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_media
        FOREIGN KEY (media_id)
            REFERENCES media (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_record
        FOREIGN KEY (record_id)
            REFERENCES record (id)
            ON DELETE CASCADE
);