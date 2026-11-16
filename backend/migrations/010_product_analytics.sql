CREATE TABLE analytics_config (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  started_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO analytics_config(singleton) VALUES(true);
CREATE TABLE analytics_user_state (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tracking_since timestamptz NOT NULL DEFAULT now(),
  registered_at timestamptz,
  first_space_at timestamptz,
  first_completed_at timestamptz,
  last_seen_day date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Bogota')::date,
  audience text NOT NULL DEFAULT 'public' CHECK(audience IN ('public','test'))
);
CREATE TABLE analytics_events (
  id bigserial PRIMARY KEY,
  event text NOT NULL CHECK(event IN ('landing_visit','registration','activation','return')),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Bogota')::date,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_id uuid,
  source text NOT NULL DEFAULT 'directo' CHECK(source IN ('directo','whatsapp','instagram','qr','otro')),
  device text NOT NULL DEFAULT 'desktop' CHECK(device IN ('desktop','android','iphone')),
  audience text NOT NULL DEFAULT 'public' CHECK(audience IN ('public','test')),
  CHECK((event='landing_visit' AND user_id IS NULL AND session_id IS NOT NULL) OR (event<>'landing_visit' AND user_id IS NOT NULL))
);
CREATE UNIQUE INDEX analytics_visits_once ON analytics_events(session_id) WHERE event='landing_visit';
CREATE UNIQUE INDEX analytics_milestones_once ON analytics_events(event,user_id) WHERE event IN ('registration','activation');
CREATE UNIQUE INDEX analytics_returns_once ON analytics_events(user_id,day) WHERE event='return';
CREATE INDEX analytics_events_day ON analytics_events(day,event);
CREATE INDEX analytics_events_session ON analytics_events(session_id) WHERE session_id IS NOT NULL;
CREATE TABLE analytics_exclusions (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK(reason IN ('team','test')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
