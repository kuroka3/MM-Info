-- Align Concert table with new time zone fields and optional relations
ALTER TABLE "public"."Concert"
  ALTER COLUMN "date" TYPE DATE USING "date"::DATE,
  ALTER COLUMN "venueId" DROP NOT NULL,
  ALTER COLUMN "eventId" DROP NOT NULL;

ALTER TABLE "public"."Concert"
  ADD COLUMN IF NOT EXISTS "timeOffset" TEXT,
  ADD COLUMN IF NOT EXISTS "showTimeUTC" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "doorTimeUTC" TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS "vipTimeUTC" TIMESTAMPTZ;
