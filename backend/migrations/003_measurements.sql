CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  search_minutes INTEGER NOT NULL CHECK (search_minutes BETWEEN 0 AND 1440),
  misplaced_items INTEGER NOT NULL CHECK (misplaced_items BETWEEN 0 AND 10000),
  clear_width_cm NUMERIC(7,2) CHECK (clear_width_cm > 0 AND clear_width_cm <= 10000),
  notes TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_measurements_owner_date ON measurements(user_id,created_at DESC);
