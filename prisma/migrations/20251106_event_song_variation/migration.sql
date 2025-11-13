-- CreateTable
CREATE TABLE "EventSongVariation" (
    "eventId" INTEGER NOT NULL,
    "songSlug" TEXT NOT NULL,
    "isHigawari" BOOLEAN NOT NULL DEFAULT false,
    "isLocationgawari" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventSongVariation_pkey" PRIMARY KEY ("eventId","songSlug")
);

-- Migrate existing data from SetlistSong to EventSongVariation
INSERT INTO "EventSongVariation" ("eventId", "songSlug", "isHigawari", "isLocationgawari")
SELECT DISTINCT
  c."eventId",
  s.slug,
  COALESCE(ss.higawari, false),
  COALESCE(ss.locationgawari, false)
FROM "SetlistSong" ss
JOIN "Song" s ON ss."songId" = s.id
JOIN "Concert" c ON ss."setlistId" = c."setlistId"
WHERE c."eventId" IS NOT NULL
  AND s.slug IS NOT NULL
  AND (ss.higawari = true OR ss.locationgawari = true)
ON CONFLICT ("eventId", "songSlug") DO UPDATE
SET "isHigawari" = EXCLUDED."isHigawari" OR "EventSongVariation"."isHigawari",
    "isLocationgawari" = EXCLUDED."isLocationgawari" OR "EventSongVariation"."isLocationgawari";

-- AddForeignKey
ALTER TABLE "Concert" ADD CONSTRAINT "Concert_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSongVariation" ADD CONSTRAINT "EventSongVariation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSongVariation" ADD CONSTRAINT "EventSongVariation_songSlug_fkey" FOREIGN KEY ("songSlug") REFERENCES "Song"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "idx_event_song_variation_eventid" ON "EventSongVariation"("eventId");

-- CreateIndex
CREATE INDEX "idx_event_song_variation_songslug" ON "EventSongVariation"("songSlug");

-- AlterTable (Remove columns from SetlistSong)
ALTER TABLE "SetlistSong" DROP COLUMN IF EXISTS "higawari";
ALTER TABLE "SetlistSong" DROP COLUMN IF EXISTS "locationgawari";

-- AlterTable (Add higawariLabel to Setlist)
ALTER TABLE "Setlist" ADD COLUMN IF NOT EXISTS "higawariLabel" TEXT;
