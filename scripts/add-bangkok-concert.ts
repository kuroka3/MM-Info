import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bangkokSetlistOrder = [
  'antena-39',
  'rabbit-hole',
  'aun-no-beats',
  'taiyokei-disco',
  'gunjou-sanka',
  'karakuri-pierrot',
  'inochi-bakkari',
  'seija-no-koushin',
  'aishite-aishite-aishite',
  'odore-orchestra',
  'nonsense-speaker',
  'lower',
  'watashi-no-r',
  'kocchi-muite-baby',
  'meteor',
  'world-is-mine',
  'getcha',
  'dappou-rock',
  'romeo-to-cinderella',
  'jigoku-gokuraku',
  'all-im-asking-for-is-love',
  'rolling-girl',
  'from-y-to-y',
  'tell-your-world',
];

async function main() {
  console.log('Creating Bangkok concert setup...\n');

  const event = await prisma.event.findUnique({
    where: { slug: 'miku-expo-2025-asia' },
  });

  if (!event) {
    console.error('Error: MIKU EXPO 2025 ASIA event not found. Please run seed first.');
    process.exit(1);
  }

  console.log(`✓ Found event: ${event.name}`);

  const venue = await prisma.venue.upsert({
    where: { id: -1 },
    create: {
      name: 'Thunder Dome',
      name_en: 'Thunder Dome',
    },
    update: {},
  });

  console.log(`✓ Created/found venue: ${venue.name}`);

  const setlist = await prisma.setlist.create({
    data: {
      name: 'MIKU EXPO 2025 Bangkok',
    },
  });

  console.log(`✓ Created setlist: ${setlist.name}`);

  for (let i = 0; i < bangkokSetlistOrder.length; i++) {
    const slug = bangkokSetlistOrder[i];
    const song = await prisma.song.findUnique({
      where: { slug },
    });

    if (!song) {
      console.error(`✗ Song not found: ${slug}`);
      continue;
    }

    const type = i >= 20 ? 'encore' : 'song';

    await prisma.setlistSong.create({
      data: {
        setlistId: setlist.id,
        songId: song.id,
        order: i + 1,
        type,
      },
    });

    console.log(`  Added ${i + 1}. ${song.krtitle} (${type})`);
  }

  const concert = await prisma.concert.create({
    data: {
      title: 'MIKU EXPO 2025 Bangkok',
      date: new Date('2025-02-01'),
      day: 'Saturday',
      block: 'DAY 1',
      hidden: false,
      venueId: venue.id,
      setlistId: setlist.id,
      eventId: event.id,
      timeZone: 'Asia/Bangkok',
      timeOffset: '+07:00',
    },
  });

  console.log(`\n✓ Created concert: ${concert.title}`);
  console.log(`  Date: ${concert.date.toISOString().split('T')[0]}`);
  console.log(`  Venue: ${venue.name}`);
  console.log(`  Setlist: ${setlist.name}`);

  console.log('\n✅ Bangkok concert setup complete!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
