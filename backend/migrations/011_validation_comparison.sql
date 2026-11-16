CREATE TABLE validation_protocols (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title varchar(120) NOT NULL,
 prepared_on date NOT NULL,
 evidence_ref varchar(80) NOT NULL,
 tasks jsonb NOT NULL CHECK(jsonb_typeof(tasks)='array' AND jsonb_array_length(tasks) BETWEEN 3 AND 5),
 created_by uuid NOT NULL REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE validation_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 protocol_id uuid NOT NULL REFERENCES validation_protocols(id),
 release text NOT NULL CHECK(release IN ('R1','R2')),
 participant_code varchar(5) NOT NULL CHECK(participant_code ~ '^P[0-9]{2,4}$'),
 session_on date NOT NULL,
 evidence_ref varchar(80) NOT NULL,
 segment_confirmed boolean NOT NULL,
 independent boolean NOT NULL,
 unassisted boolean NOT NULL,
 consent boolean NOT NULL,
 results jsonb NOT NULL CHECK(jsonb_typeof(results)='array' AND jsonb_array_length(results) BETWEEN 3 AND 5),
 sus jsonb NOT NULL CHECK(jsonb_typeof(sus)='array' AND jsonb_array_length(sus)=10),
 sus_score numeric(5,2) NOT NULL CHECK(sus_score BETWEEN 0 AND 100),
 excluded_at timestamptz,
 exclusion_reason varchar(300),
 created_by uuid NOT NULL REFERENCES users(id),
 updated_by uuid NOT NULL REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(protocol_id,release,participant_code)
);
CREATE INDEX validation_sessions_protocol ON validation_sessions(protocol_id,release);
CREATE TABLE validation_session_revisions (
 id bigserial PRIMARY KEY,
 session_id uuid NOT NULL REFERENCES validation_sessions(id),
 previous_data jsonb NOT NULL,
 changed_by uuid NOT NULL REFERENCES users(id),
 changed_at timestamptz NOT NULL DEFAULT now()
);
