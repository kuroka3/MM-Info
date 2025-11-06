-- AlterTable: Make songId nullable and add type and text fields
ALTER TABLE "SetlistSong"
  ALTER COLUMN "songId" DROP NOT NULL,
  ADD COLUMN "type" TEXT NOT NULL DEFAULT 'song',
  ADD COLUMN "text" TEXT;
