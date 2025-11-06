import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkExpoConcerts() {
  console.log('🔍 Checking all concerts in database...\n');

  const concerts = await prisma.concert.findMany({
    include: {
      venue: true,
      event: true,
    },
    orderBy: [
      { eventId: 'asc' },
      { date: 'asc' },
    ],
  });

  console.log(`Total concerts: ${concerts.length}\n`);

  console.log('=== MIKU EXPO 2025 Asia (eventId = 2) ===');
  const expoConcerts = concerts.filter(c => c.eventId === 2);

  if (expoConcerts.length === 0) {
    console.log('⚠️  No EXPO concerts found!\n');
  } else {
    expoConcerts.forEach(concert => {
      console.log(`ID: ${concert.id} | ${concert.title} | ${concert.venue.name} | setlistId: ${concert.setlistId}`);
    });
  }

  console.log('\n=== Magical Mirai 2025 (eventId = 1) ===');
  const mmConcerts = concerts.filter(c => c.eventId === 1);
  mmConcerts.forEach(concert => {
    console.log(`ID: ${concert.id} | ${concert.title} | ${concert.venue.name} | setlistId: ${concert.setlistId}`);
  });
}

checkExpoConcerts()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
