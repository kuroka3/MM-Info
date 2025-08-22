-- AlterTable
ALTER TABLE "public"."Song" ADD COLUMN     "anotherName" TEXT[] DEFAULT ARRAY[]::TEXT[];
