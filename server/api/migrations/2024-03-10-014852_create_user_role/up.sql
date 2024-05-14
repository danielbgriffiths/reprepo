CREATE TABLE IF NOT EXISTS user_role (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    user_id INTEGER DEFAULT null,
    role_id INTEGER DEFAULT null,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
            REFERENCES "role" (id)
            ON DELETE CASCADE
);