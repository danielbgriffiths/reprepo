-- Your SQL goes here

CREATE TABLE IF NOT EXISTS commit (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    record_id INTEGER NOT NULL,
    notes VARCHAR(5000) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_record
       FOREIGN KEY (record_id)
           REFERENCES "record" (id)
           ON DELETE CASCADE
);