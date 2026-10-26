ALTER TABLE desks ADD COLUMN model TEXT NOT NULL DEFAULT 'recta' CHECK (model IN ('recta','cajonera','esquina'));
ALTER TABLE desks ADD COLUMN height_cm NUMERIC(6,2) NOT NULL DEFAULT 75 CHECK (height_cm BETWEEN 30 AND 130);
