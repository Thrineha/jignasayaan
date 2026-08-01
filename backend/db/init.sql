-- Jignasayaan core schema.
-- Runs automatically on first container start (mounted into
-- /docker-entrypoint-initdb.d by docker-compose).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schools (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    city          TEXT NOT NULL,
    state         TEXT NOT NULL,
    contact_name  TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registrations (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name      TEXT NOT NULL,
    student_age       SMALLINT NOT NULL CHECK (student_age BETWEEN 10 AND 25),
    student_gender    TEXT,
    guardian_name     TEXT NOT NULL,
    guardian_phone    TEXT NOT NULL,
    guardian_email    TEXT NOT NULL,
    school_id         UUID REFERENCES schools(id),
    school_name_raw   TEXT NOT NULL, -- free-text fallback if school not yet in system
    grade             TEXT,
    emergency_contact TEXT NOT NULL,
    medical_notes     TEXT,
    status            TEXT NOT NULL DEFAULT 'pending_payment'
                      CHECK (status IN ('pending_payment', 'confirmed', 'cancelled')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_school ON registrations(school_id);

-- Placeholder for future authenticated users (school/volunteer/admin roles).
-- Passwords are NEVER stored in plaintext -- password_hash only, set via
-- bcrypt/argon2 at the application layer.
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'school', 'volunteer')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS live_counters (
    key         TEXT PRIMARY KEY,
    value       INTEGER NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO live_counters (key, value) VALUES
    ('students_registered', 0),
    ('seats_left', 1080),
    ('schools_joined', 0),
    ('colleges_joined', 0),
    ('districts_covered', 0)
ON CONFLICT (key) DO NOTHING;
