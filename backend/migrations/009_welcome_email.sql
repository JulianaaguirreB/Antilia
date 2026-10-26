ALTER TABLE users ADD COLUMN welcome_email_sent_at timestamptz;
ALTER TABLE users ADD COLUMN welcome_email_attempted_at timestamptz;
