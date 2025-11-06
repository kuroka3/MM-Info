import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLenToRen() {
  console.log('🔧 Fixing LEN → REN typo in database...\n');

  const songs = await prisma.song.findMany({
    where: {
      part: {
        has: 'LEN',
      },
    },
  });

  console.log(`Found ${songs.length} songs with 'LEN' in part field:\n`);

  let updated = 0;

  for (const song of songs) {
    const oldPart = song.part;
    const newPart = oldPart.map(p => p === 'LEN' ? 'REN' : p);

    await prisma.song.update({
      where: { id: song.id },
      data: { part: newPart },
    });

    console.log(`✓ ${song.krtitle || song.title} (${song.slug})`);
    console.log(`  Before: [${oldPart.join(', ')}]`);
    console.log(`  After:  [${newPart.join(', ')}]\n`);

    updated++;
  }

  console.log(`✅ Fixed ${updated} songs!`);
}

fixLenToRen()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
