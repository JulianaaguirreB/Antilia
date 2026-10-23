CREATE TABLE IF NOT EXISTS landing_metrics (
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Bogota')::date,
  event text NOT NULL CHECK (event IN ('visit','try_app','download_options','download_android','iphone_web','download_ipa')),
  device text NOT NULL CHECK (device IN ('desktop','android','iphone')),
  source text NOT NULL CHECK (source IN ('directo','whatsapp','instagram','qr','otro')),
  total integer NOT NULL DEFAULT 0 CHECK (total >= 0),
  PRIMARY KEY (day, event, device, source)
);
