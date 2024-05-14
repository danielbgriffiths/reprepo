CREATE TABLE IF NOT EXISTS user_subscription (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    user_id INTEGER NOT NULL,
    subscription_id INTEGER NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT true,
    started_at TIMESTAMP NOT NULL DEFAULT now(),
    expires_at TIMESTAMP DEFAULT null,
    cancelled_at TIMESTAMP DEFAULT null,
    renew_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_subscription
        FOREIGN KEY (subscription_id)
            REFERENCES subscription (id)
            ON DELETE CASCADE
);