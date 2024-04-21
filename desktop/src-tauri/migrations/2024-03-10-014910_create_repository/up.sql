-- Your SQL goes here

CREATE TABLE IF NOT EXISTS repository (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER NOT NULL,
    name VARCHAR(50) NOT NULL,
    field VARCHAR(50) NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    description VARCHAR(2000) DEFAULT null,
    social_links text[] NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT false,
    start_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE
);