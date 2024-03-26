-- Your SQL goes here

CREATE TABLE IF NOT EXISTS repository (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    field VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    avatar VARCHAR(255) DEFAULT null,
    is_private BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMP NOT NULL DEFAULT now(),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE
);