-- Your SQL goes here

CREATE TABLE IF NOT EXISTS auth_account (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    auth_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    is_root BOOLEAN NOT NULL DEFAULT false,
    access_token VARCHAR(2000) DEFAULT null,
    refresh_token VARCHAR(2000) DEFAULT null,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_auth
       FOREIGN KEY (auth_id)
           REFERENCES auth (id)
           ON DELETE CASCADE,

    CONSTRAINT fk_account
        FOREIGN KEY (account_id)
            REFERENCES account (id)
            ON DELETE CASCADE
);