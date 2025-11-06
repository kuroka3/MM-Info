import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bangkokSetlistOrder = [
  'artifact',
  'vampire',
  'culture',
  'taiyokei-disco',
  'sweet-magic',
  'telecaster-b-boy',
  'rettou-joutou',
  'god-ish',
  'knife-knife-knife',
  'shinkai-shoujo',
  'red-land-marker',
  'literacy',
  'on-the-rocks',
  'tsugihagi-staccato',
  'double-lariat',
  'aidee',
  'magical-cure-love-shot',
  'satisfaction',
  'shake-it',
  '39',
  'intergalactic-bound',
  'rolling-girl',
  'decorator',
  'melt',
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

  const existingVenue = await prisma.venue.findFirst({
    where: { name: 'Thunder Dome' },
  });

  let venue;
  if (existingVenue) {
    venue = existingVenue;
    console.log(`✓ Using existing venue: ${venue.name}`);
  } else {
    venue = await prisma.venue.create({
      data: {
        name: 'Thunder Dome',
        name_en: 'Thunder Dome',
      },
    });
    console.log(`✓ Created venue: ${venue.name}`);
  }

  const setlist = await prisma.setlist.create({
    data: {
      name: 'MIKU EXPO 2025 Bangkok',
    },
  });

  console.log(`✓ Created setlist: ${setlist.name}\n`);

  for (let i = 0; i < bangkokSetlistOrder.length; i++) {
    const slug = bangkokSetlistOrder[i];
    const song = await prisma.song.findUnique({
      where: { slug },
    });

    if (!song) {
      console.error(`✗ Song not found: ${slug}`);
      continue;
    }

    const type = i >= 21 ? 'encore' : 'song';

    await prisma.setlistSong.create({
      data: {
        setlistId: setlist.id,
        songId: song.id,
        order: i + 1,
        type,
      },
    });

    const prefix = i >= 21 ? '  [앙코르]' : '  ';
    console.log(`${prefix}${i + 1}. ${song.krtitle} (${song.title})`);
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
  console.log(`  Songs: ${bangkokSetlistOrder.length} (including 3 encore songs)`);

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
