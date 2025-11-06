import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createExpoConcerts() {
  console.log('🎫 Creating MIKU EXPO 2025 Asia concerts...\n');

  const event = await prisma.event.findUnique({
    where: { slug: 'miku-expo-2025-asia' },
  });

  if (!event) {
    console.error('❌ Event "miku-expo-2025-asia" not found!');
    process.exit(1);
  }

  const concerts = [
    {
      id: 17,
      title: '방콕',
      date: new Date('2025-11-05'),
      day: '수',
      block: '공연',
      venueId: 4,
      eventId: event.id,
      showTime: new Date('1970-01-01T20:00:00Z'),
      doorTime: new Date('1970-01-01T19:00:00Z'),
      vipTime: new Date('1970-01-01T18:30:00Z'),
      timeZone: 'Asia/Bangkok',
      showTimeUTC: new Date('2025-11-05T13:00:00Z'),
      doorTimeUTC: new Date('2025-11-05T12:00:00Z'),
      vipTimeUTC: new Date('2025-11-05T11:30:00Z'),
      timeOffset: '+07:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 18,
      title: '홍콩',
      date: new Date('2025-11-08'),
      day: '토',
      block: '공연',
      venueId: 5,
      eventId: event.id,
      showTime: new Date('1970-01-01T20:00:00Z'),
      doorTime: new Date('1970-01-01T18:30:00Z'),
      vipTime: new Date('1970-01-01T18:00:00Z'),
      timeZone: 'Asia/Hong_Kong',
      showTimeUTC: new Date('2025-11-08T12:00:00Z'),
      doorTimeUTC: new Date('2025-11-08T10:30:00Z'),
      vipTimeUTC: new Date('2025-11-08T10:00:00Z'),
      timeOffset: '+08:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 19,
      title: '자카르타',
      date: new Date('2025-11-12'),
      day: '수',
      block: '공연',
      venueId: 6,
      eventId: event.id,
      showTime: new Date('1970-01-01T20:00:00Z'),
      doorTime: new Date('1970-01-01T18:30:00Z'),
      vipTime: new Date('1970-01-01T18:00:00Z'),
      timeZone: 'Asia/Jakarta',
      showTimeUTC: new Date('2025-11-12T13:00:00Z'),
      doorTimeUTC: new Date('2025-11-12T11:30:00Z'),
      vipTimeUTC: new Date('2025-11-12T11:00:00Z'),
      timeOffset: '+07:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 20,
      title: '마닐라',
      date: new Date('2025-11-16'),
      day: '일',
      block: '공연',
      venueId: 7,
      eventId: event.id,
      showTime: new Date('1970-01-01T20:00:00Z'),
      doorTime: new Date('1970-01-01T18:30:00Z'),
      vipTime: new Date('1970-01-01T18:00:00Z'),
      timeZone: 'Asia/Manila',
      showTimeUTC: new Date('2025-11-16T12:00:00Z'),
      doorTimeUTC: new Date('2025-11-16T10:30:00Z'),
      vipTimeUTC: new Date('2025-11-16T10:00:00Z'),
      timeOffset: '+08:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 21,
      title: '싱가포르',
      date: new Date('2025-11-19'),
      day: '수',
      block: '공연',
      venueId: 8,
      eventId: event.id,
      showTime: new Date('1970-01-01T20:00:00Z'),
      doorTime: new Date('1970-01-01T19:00:00Z'),
      vipTime: new Date('1970-01-01T18:30:00Z'),
      timeZone: 'Asia/Singapore',
      showTimeUTC: new Date('2025-11-19T12:00:00Z'),
      doorTimeUTC: new Date('2025-11-19T11:00:00Z'),
      vipTimeUTC: new Date('2025-11-19T10:30:00Z'),
      timeOffset: '+08:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 22,
      title: '쿠알라룸푸르',
      date: new Date('2025-11-22'),
      day: '토',
      block: '공연',
      venueId: 9,
      eventId: event.id,
      showTime: new Date('1970-01-01T19:30:00Z'),
      doorTime: new Date('1970-01-01T18:00:00Z'),
      vipTime: new Date('1970-01-01T17:30:00Z'),
      timeZone: 'Asia/Kuala_Lumpur',
      showTimeUTC: new Date('2025-11-22T11:30:00Z'),
      doorTimeUTC: new Date('2025-11-22T10:00:00Z'),
      vipTimeUTC: new Date('2025-11-22T09:30:00Z'),
      timeOffset: '+08:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 23,
      title: '타이베이',
      date: new Date('2025-11-26'),
      day: '수',
      block: '공연',
      venueId: 10,
      eventId: event.id,
      showTime: new Date('1970-01-01T19:30:00Z'),
      doorTime: new Date('1970-01-01T18:00:00Z'),
      vipTime: new Date('1970-01-01T17:00:00Z'),
      timeZone: 'Asia/Taipei',
      showTimeUTC: new Date('2025-11-26T11:30:00Z'),
      doorTimeUTC: new Date('2025-11-26T10:00:00Z'),
      vipTimeUTC: new Date('2025-11-26T09:00:00Z'),
      timeOffset: '+08:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 24,
      title: '서울 (토)',
      date: new Date('2025-11-29'),
      day: '토',
      block: '공연',
      venueId: 11,
      eventId: event.id,
      showTime: new Date('1970-01-01T19:00:00Z'),
      doorTime: new Date('1970-01-01T18:00:00Z'),
      vipTime: new Date('1970-01-01T17:30:00Z'),
      timeZone: 'Asia/Seoul',
      showTimeUTC: new Date('2025-11-29T10:00:00Z'),
      doorTimeUTC: new Date('2025-11-29T09:00:00Z'),
      vipTimeUTC: new Date('2025-11-29T08:30:00Z'),
      timeOffset: '+09:00',
      hidden: false,
      setlistId: null,
    },
    {
      id: 25,
      title: '서울 (일)',
      date: new Date('2025-11-30'),
      day: '일',
      block: '공연',
      venueId: 11,
      eventId: event.id,
      showTime: new Date('1970-01-01T16:00:00Z'),
      doorTime: new Date('1970-01-01T15:00:00Z'),
      vipTime: new Date('1970-01-01T14:30:00Z'),
      timeZone: 'Asia/Seoul',
      showTimeUTC: new Date('2025-11-30T07:00:00Z'),
      doorTimeUTC: new Date('2025-11-30T06:00:00Z'),
      vipTimeUTC: new Date('2025-11-30T05:30:00Z'),
      timeOffset: '+09:00',
      hidden: false,
      setlistId: null,
    },
  ];

  for (const concert of concerts) {
    await prisma.concert.upsert({
      where: { id: concert.id },
      create: concert,
      update: concert,
    });

    console.log(`✓ ${concert.title} (${concert.date.toISOString().split('T')[0]})`);
  }

  console.log(`\n✅ Created/updated ${concerts.length} EXPO concerts!`);
  console.log('   All concerts have setlistId = null');

  console.log('\n📋 Verifying concerts...');
  const created = await prisma.concert.findMany({
    where: { eventId: event.id },
    include: { venue: true },
    orderBy: { date: 'asc' },
  });

  created.forEach(c => {
    console.log(`   ${c.title} @ ${c.venue.name} - ${c.date.toISOString().split('T')[0]} ${c.showTime?.toISOString().split('T')[1].substring(0, 5)}`);
  });
}

createExpoConcerts()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
