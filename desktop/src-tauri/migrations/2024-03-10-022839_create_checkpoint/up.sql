-- Your SQL goes here

CREATE TYPE CHECKPOINT_STATUS AS ENUM (
    'started',
    'learning',
    'studied',
    'memorized',
    'learned',
    'personal_recording',
    'professional_recording',
    'masterclass',
    'studio_recital',
    'public_recital',
    'taught'
);

CREATE TABLE IF NOT EXISTS checkpoint (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    status CHECKPOINT_STATUS NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_record
        FOREIGN KEY (record_id)
            REFERENCES record (id)
            ON DELETE CASCADE
);