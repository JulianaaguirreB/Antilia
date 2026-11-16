ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS lumi_style jsonb NOT NULL DEFAULT '{"outfit":"none","hair":"none","hat":"none"}'::jsonb;
