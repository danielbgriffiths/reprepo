-- Your SQL goes here

CREATE TABLE IF NOT EXISTS record (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    repository_id INTEGER NOT NULL,
    parent_id INTEGER DEFAULT NULL,
    name VARCHAR(50) NOT NULL,
    author VARCHAR(50) NOT NULL,
    authored_at DATE NOT NULL,
    started_at DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_repository
        FOREIGN KEY (repository_id)
            REFERENCES "repository" (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_record
        FOREIGN KEY (parent_id)
            REFERENCES "record" (id)
            ON DELETE CASCADE
);