CREATE TABLE IF NOT EXISTS teacher_student (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    teacher_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT true,
    started_at TIMESTAMP NOT NULL DEFAULT now(),
    ended_at TIMESTAMP DEFAULT null,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT NULL,

    CONSTRAINT fk_teacher
        FOREIGN KEY (teacher_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
            REFERENCES "user" (id)
            ON DELETE CASCADE
);