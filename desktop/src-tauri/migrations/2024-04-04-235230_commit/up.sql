-- Your SQL goes here

CREATE TABLE IF NOT EXISTS commit (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    title VARCHAR(200) DEFAULT NULL,
    notes VARCHAR(8000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_record
       FOREIGN KEY (record_id)
           REFERENCES "record" (id)
           ON DELETE CASCADE
);