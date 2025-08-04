/*
  Warnings:

  - The primary key for the `SetlistSong` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SetlistSong` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SetlistSong" DROP CONSTRAINT "SetlistSong_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SetlistSong_pkey" PRIMARY KEY ("setlistId", "order");
