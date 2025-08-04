/*
  Warnings:

  - The primary key for the `SetlistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."SetlistSong" DROP CONSTRAINT "SetlistSong_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SetlistSong_pkey" PRIMARY KEY ("id");
