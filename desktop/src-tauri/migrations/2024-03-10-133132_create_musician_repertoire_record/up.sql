-- Your SQL goes here

CREATE TABLE IF NOT EXISTS musician_repertoire_record (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    musician_repertoire_id INTEGER NOT NULL,
    record_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_musician_repertoire
        FOREIGN KEY (musician_repertoire_id)
            REFERENCES musician_repertoire (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_record
        FOREIGN KEY (record_id)
            REFERENCES record (id)
            ON DELETE CASCADE
);