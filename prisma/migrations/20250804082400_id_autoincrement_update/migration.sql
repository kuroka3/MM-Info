/*
  Warnings:

  - The primary key for the `Concert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Concert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `venueId` column on the `Concert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `setlistId` column on the `Concert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Setlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Setlist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SetlistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Song` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Song` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Venue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Venue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `setlistId` on the `SetlistSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `songId` on the `SetlistSong` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Concert" DROP CONSTRAINT "Concert_setlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Concert" DROP CONSTRAINT "Concert_venueId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SetlistSong" DROP CONSTRAINT "SetlistSong_setlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SetlistSong" DROP CONSTRAINT "SetlistSong_songId_fkey";

-- AlterTable
ALTER TABLE "public"."Concert" DROP CONSTRAINT "Concert_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "venueId",
ADD COLUMN     "venueId" INTEGER,
DROP COLUMN "setlistId",
ADD COLUMN     "setlistId" INTEGER,
ADD CONSTRAINT "Concert_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Setlist" DROP CONSTRAINT "Setlist_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Setlist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."SetlistSong" DROP CONSTRAINT "SetlistSong_pkey",
DROP COLUMN "setlistId",
ADD COLUMN     "setlistId" INTEGER NOT NULL,
DROP COLUMN "songId",
ADD COLUMN     "songId" INTEGER NOT NULL,
ADD CONSTRAINT "SetlistSong_pkey" PRIMARY KEY ("setlistId", "order");

-- AlterTable
ALTER TABLE "public"."Song" DROP CONSTRAINT "Song_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Song_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Venue" DROP CONSTRAINT "Venue_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Venue_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Concert" ADD CONSTRAINT "Concert_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "public"."Setlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Concert" ADD CONSTRAINT "Concert_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetlistSong" ADD CONSTRAINT "SetlistSong_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "public"."Setlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetlistSong" ADD CONSTRAINT "SetlistSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
