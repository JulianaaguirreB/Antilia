CREATE TABLE gmail_connections (
 user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 email TEXT NOT NULL,
 refresh_token TEXT NOT NULL,
 next_page TEXT,
 last_synced_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE gmail_oauth_states (
 state_hash TEXT PRIMARY KEY,
 user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_version INTEGER NOT NULL,
 verifier TEXT NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE gmail_messages (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID NOT NULL REFERENCES gmail_connections(user_id) ON DELETE CASCADE,
 gmail_id TEXT NOT NULL,
 thread_id TEXT NOT NULL,
 subject TEXT NOT NULL,
 sender TEXT NOT NULL,
 snippet TEXT NOT NULL DEFAULT '',
 received_at TIMESTAMPTZ NOT NULL,
 category TEXT NOT NULL CHECK(category IN ('trabajo','proyectos','reuniones','documentos','otros')),
 reason TEXT NOT NULL,
 manual_category BOOLEAN NOT NULL DEFAULT false,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(user_id,gmail_id)
);
CREATE INDEX gmail_messages_owner_date ON gmail_messages(user_id,received_at DESC,id);

CREATE FUNCTION clear_gmail_on_email_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.email IS DISTINCT FROM OLD.email THEN
  DELETE FROM gmail_oauth_states WHERE user_id=NEW.id;
  DELETE FROM gmail_connections WHERE user_id=NEW.id;
 END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER users_email_gmail_cleanup AFTER UPDATE OF email ON users FOR EACH ROW EXECUTE FUNCTION clear_gmail_on_email_change();
