import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('Dumping all data from production database...\n');

  const songs = await prisma.song.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${songs.length} songs`);

  const setlists = await prisma.setlist.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${setlists.length} setlists`);

  const setlistSongs = await prisma.setlistSong.findMany({
    orderBy: [{ setlistId: 'asc' }, { order: 'asc' }],
  });
  console.log(`✓ Found ${setlistSongs.length} setlist songs`);

  const concerts = await prisma.concert.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${concerts.length} concerts`);

  const venues = await prisma.venue.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${venues.length} venues`);

  const events = await prisma.event.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${events.length} events`);

  const series = await prisma.series.findMany({
    orderBy: { id: 'asc' },
  });
  console.log(`✓ Found ${series.length} series`);

  const eventSongVariations = await prisma.eventSongVariation.findMany({
    orderBy: [{ eventId: 'asc' }, { songSlug: 'asc' }],
  });
  console.log(`✓ Found ${eventSongVariations.length} event song variations`);

  const dump = {
    songs,
    setlists,
    setlistSongs,
    concerts,
    venues,
    events,
    series,
    eventSongVariations,
  };

  fs.writeFileSync('production-dump.json', JSON.stringify(dump, null, 2));
  console.log('\n✅ Data dumped to production-dump.json');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
