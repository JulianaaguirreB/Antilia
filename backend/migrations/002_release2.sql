ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0;

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  type TEXT NOT NULL CHECK (type IN ('fisica', 'digital')),
  description TEXT NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, user_id)
);
CREATE INDEX idx_spaces_owner ON spaces(user_id, archived_at, created_at);

ALTER TABLE tasks DROP CONSTRAINT tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('pendiente', 'en_progreso', 'completada', 'archivada'));
ALTER TABLE tasks ADD COLUMN space_id UUID;
ALTER TABLE tasks ADD COLUMN due_at TIMESTAMPTZ;
ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE tasks ADD COLUMN digital_kind TEXT NOT NULL DEFAULT 'general' CHECK (digital_kind IN ('general', 'correo', 'archivo'));
ALTER TABLE tasks ADD COLUMN reference_url TEXT;
ALTER TABLE tasks ADD CONSTRAINT tasks_owner_space_fk FOREIGN KEY (space_id, user_id) REFERENCES spaces(id, user_id);
CREATE INDEX idx_tasks_owner_updated ON tasks(user_id, updated_at, id);

CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL CHECK (ends_at > starts_at),
  notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 1000),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_shifts_owner_starts ON shifts(user_id, starts_at);

CREATE TABLE email_verifications (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE password_resets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  message TEXT NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('once', 'daily')),
  local_time TIME,
  timezone TEXT NOT NULL DEFAULT 'America/Bogota' CHECK (timezone = 'America/Bogota'),
  next_run_at TIMESTAMPTZ NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((schedule_type = 'daily' AND local_time IS NOT NULL) OR (schedule_type = 'once' AND local_time IS NULL))
);
CREATE INDEX idx_reminders_due ON reminders(next_run_at) WHERE enabled;
CREATE INDEX idx_reminders_owner ON reminders(user_id, created_at);

CREATE TABLE reminder_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'missed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_id TEXT,
  error_code TEXT,
  sent_at TIMESTAMPTZ,
  UNIQUE(reminder_id, scheduled_for)
);
