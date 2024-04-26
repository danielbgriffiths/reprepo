-- Your SQL goes here

CREATE TABLE IF NOT EXISTS composition_meta (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    author_meta_id INTEGER NOT NULL,

    genre VARCHAR(50) NOT NULL,
    written_at DATE DEFAULT NULL,
    full_title VARCHAR(250) NOT NULL,
    piece_title VARCHAR(200) NOT NULL,
    set_title VARCHAR(200) DEFAULT NULL,
    number_in_set INTEGER DEFAULT NULL,
    movement INTEGER DEFAULT NULL,
    opus INTEGER DEFAULT NULL,
    kvv INTEGER DEFAULT NULL,
    n INTEGER DEFAULT NULL,
    variation INTEGER DEFAULT NULL,
    key VARCHAR(10) DEFAULT NULL,
    work_summary VARCHAR(5000) DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_author_meta
        FOREIGN KEY (author_meta_id)
            REFERENCES "author_meta" (id)
            ON DELETE CASCADE
);