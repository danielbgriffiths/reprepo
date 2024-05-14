DROP TYPE IF EXISTS ROLE_NAME;
CREATE TYPE ROLE_NAME AS ENUM (
    'student',
    'teacher',
    'professional',
    'institution',
    'parent'
);


CREATE TABLE IF NOT EXISTS role (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    name ROLE_NAME NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Insert the 'student' role
INSERT INTO role (name) VALUES ('student');

-- Insert the 'teacher' role
INSERT INTO role (name) VALUES ('teacher');

-- Insert the 'professional' role
INSERT INTO role (name) VALUES ('professional');

-- Insert the 'institution' role
INSERT INTO role (name) VALUES ('institution');

-- Insert the 'parent' role
INSERT INTO role (name) VALUES ('parent');