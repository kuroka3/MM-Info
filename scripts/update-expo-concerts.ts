import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExpoConcerts() {
  console.log('🔧 Updating MIKU EXPO 2025 Asia concerts...\n');

  const result = await prisma.concert.updateMany({
    where: {
      id: {
        in: [21, 22, 23, 24, 25, 26, 27, 28, 29],
      },
    },
    data: {
      setlistId: null,
    },
  });

  console.log(`✅ Updated ${result.count} concerts (방콕~서울) to have null setlistId\n`);

  const concerts = await prisma.concert.findMany({
    where: {
      id: {
        in: [21, 22, 23, 24, 25, 26, 27, 28, 29],
      },
    },
    include: {
      venue: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  console.log('Updated concerts:');
  concerts.forEach(concert => {
    console.log(`  - ${concert.title} (${concert.venue.name}): setlistId = ${concert.setlistId}`);
  });
}

updateExpoConcerts()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
