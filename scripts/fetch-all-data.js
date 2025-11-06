const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient({
  log: ['query'],
});

async function main() {
  console.log('Fetching all data from database...\n');

  try {
    // Force disconnect and reconnect
    await prisma.$disconnect();
    await prisma.$connect();

    const setlists = await prisma.$queryRaw`SELECT * FROM "Setlist" ORDER BY id`;
    console.log(`✓ Setlists: ${setlists.length}`);
    console.log(setlists.map(s => `  ${s.id}: ${s.name}`).join('\n'));

    const songs = await prisma.$queryRaw`SELECT * FROM "Song" ORDER BY id`;
    console.log(`\n✓ Songs: ${songs.length}`);

    const setlistSongs = await prisma.$queryRaw`SELECT * FROM "SetlistSong" ORDER BY "setlistId", "order"`;
    console.log(`✓ SetlistSongs: ${setlistSongs.length}`);

    const concerts = await prisma.$queryRaw`SELECT * FROM "Concert" ORDER BY id`;
    console.log(`✓ Concerts: ${concerts.length}`);

    const venues = await prisma.$queryRaw`SELECT * FROM "Venue" ORDER BY id`;
    console.log(`✓ Venues: ${venues.length}`);

    const events = await prisma.$queryRaw`SELECT * FROM event ORDER BY id`;
    console.log(`✓ Events: ${events.length}`);

    const series = await prisma.$queryRaw`SELECT * FROM series ORDER BY id`;
    console.log(`✓ Series: ${series.length}`);

    const dump = {
      setlists,
      songs,
      setlistSongs,
      concerts,
      venues,
      events,
      series,
    };

    fs.writeFileSync('production-dump.json', JSON.stringify(dump, null, 2));
    console.log('\n✅ Data saved to production-dump.json');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
