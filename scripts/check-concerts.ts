import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📅 Checking concert schedules...\n');

  const sendaiConcerts = await prisma.concert.findMany({
    where: {
      venueId: 1,
      event: { slug: 'magical-mirai-2025' },
    },
    orderBy: [{ date: 'asc' }, { block: 'asc' }],
    select: {
      id: true,
      title: true,
      date: true,
      day: true,
      block: true,
      hidden: true,
      setlistId: true,
    },
  });

  console.log('센다이 공연:');
  sendaiConcerts.forEach(c => {
    console.log(`  ${c.date.toISOString().slice(0, 10)} (${c.day}) ${c.block} - Hidden: ${c.hidden}, SetlistId: ${c.setlistId}`);
  });

  const tokyoConcerts = await prisma.concert.findMany({
    where: {
      venueId: 3,
      event: { slug: 'magical-mirai-2025' },
    },
    orderBy: [{ date: 'asc' }, { block: 'asc' }],
    select: {
      id: true,
      title: true,
      date: true,
      day: true,
      block: true,
      hidden: true,
      setlistId: true,
    },
  });

  console.log('\n도쿄 공연:');
  tokyoConcerts.forEach(c => {
    console.log(`  ${c.date.toISOString().slice(0, 10)} (${c.day}) ${c.block} - Hidden: ${c.hidden}, SetlistId: ${c.setlistId}`);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
