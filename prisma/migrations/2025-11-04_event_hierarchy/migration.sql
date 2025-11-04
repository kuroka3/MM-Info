CREATE TABLE IF NOT EXISTS series (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  note TEXT
);

CREATE TABLE IF NOT EXISTS event (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  year INT,
  slug VARCHAR(200) UNIQUE,
  seriesId INT NULL REFERENCES series(id)
);

ALTER TABLE public."Concert" ADD COLUMN IF NOT EXISTS "eventId" INT NULL;
CREATE INDEX IF NOT EXISTS idx_concert_eventId ON public."Concert"("eventId");
ALTER TABLE public."Concert" ADD CONSTRAINT fk_concert_event FOREIGN KEY ("eventId") REFERENCES event(id);
