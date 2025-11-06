import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Fixing concert schedules...\n');

  console.log('1️⃣ Unhiding 센다이 낮 공연 (8/2, 8/3)...\n');

  await prisma.concert.updateMany({
    where: {
      venueId: 1,
      date: { in: [new Date('2025-08-02'), new Date('2025-08-03')] },
      block: '낮',
    },
    data: {
      hidden: false,
      setlistId: 2,
    },
  });

  console.log('✓ 센다이 토요일 낮 (8/2): hidden=false, setlistId=2');
  console.log('✓ 센다이 일요일 낮 (8/3): hidden=false, setlistId=2\n');

  console.log('2️⃣ Creating 도쿄 밤 공연 (8/29, 8/30)...\n');

  const tokyoVenue = await prisma.venue.findUnique({ where: { id: 3 } });
  const event = await prisma.event.findUnique({ where: { slug: 'magical-mirai-2025' } });

  if (!event) {
    throw new Error('Event not found');
  }

  const tokyoConcerts = [
    {
      title: '도쿄 금요일 밤',
      date: new Date('2025-08-29'),
      day: '금',
      block: '밤',
      venueId: 3,
      setlistId: 5,
      eventId: event.id,
      showTime: new Date('1970-01-01T16:30:00Z'),
      doorTime: new Date('1970-01-01T15:30:00Z'),
      timeZone: 'Asia/Tokyo',
      timeOffset: '+09:00',
      hidden: false,
    },
    {
      title: '도쿄 토요일 밤',
      date: new Date('2025-08-30'),
      day: '토',
      block: '밤',
      venueId: 3,
      setlistId: 5,
      eventId: event.id,
      showTime: new Date('1970-01-01T16:30:00Z'),
      doorTime: new Date('1970-01-01T15:30:00Z'),
      timeZone: 'Asia/Tokyo',
      timeOffset: '+09:00',
      hidden: false,
    },
  ];

  for (const concert of tokyoConcerts) {
    const existing = await prisma.concert.findFirst({
      where: {
        date: concert.date,
        block: concert.block,
        venueId: concert.venueId,
      },
    });

    if (existing) {
      console.log(`⚠️  ${concert.title} already exists`);
    } else {
      await prisma.concert.create({ data: concert });
      console.log(`✓ Created: ${concert.title}`);
    }
  }

  console.log('\n✅ Concert schedule fixed!');
  console.log('\n최종 결과:');
  console.log('센다이:');
  console.log('  - 8/1 (금): 밤만');
  console.log('  - 8/2 (토): 낮, 밤');
  console.log('  - 8/3 (일): 낮, 밤');
  console.log('\n도쿄:');
  console.log('  - 8/29 (금): 낮, 밤');
  console.log('  - 8/30 (토): 낮, 밤');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
