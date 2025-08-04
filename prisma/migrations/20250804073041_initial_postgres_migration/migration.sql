-- CreateTable
CREATE TABLE "public"."Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "slug" TEXT,
    "videoId" TEXT,
    "summary" TEXT,
    "lyrics" JSONB,
    "spotify" TEXT,
    "youtube" TEXT,
    "thumbnail" TEXT,
    "part" TEXT[],

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Concert" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "hidden" BOOLEAN,
    "venueId" TEXT,
    "setlistId" TEXT,

    CONSTRAINT "Concert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Setlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SetlistSong" (
    "setlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SetlistSong_pkey" PRIMARY KEY ("setlistId","order")
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "public"."Song"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_key" ON "public"."Venue"("name");

-- AddForeignKey
ALTER TABLE "public"."Concert" ADD CONSTRAINT "Concert_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "public"."Setlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Concert" ADD CONSTRAINT "Concert_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetlistSong" ADD CONSTRAINT "SetlistSong_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "public"."Setlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SetlistSong" ADD CONSTRAINT "SetlistSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
