CREATE TABLE IF NOT EXISTS subscription (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    name VARCHAR(100) NOT NULL,
    available_role ROLE_NAME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

INSERT INTO subscription (name, available_role) VALUES ('connect', 'student');
INSERT INTO subscription (name, available_role) VALUES ('connect', 'teacher');
INSERT INTO subscription (name, available_role) VALUES ('connect', 'professional');
INSERT INTO subscription (name, available_role) VALUES ('connect', 'institution');

INSERT INTO subscription (name, available_role) VALUES ('connect-pro', 'student');
INSERT INTO subscription (name, available_role) VALUES ('connect-pro', 'teacher');
INSERT INTO subscription (name, available_role) VALUES ('connect-pro', 'professional');
INSERT INTO subscription (name, available_role) VALUES ('connect-pro', 'institution');