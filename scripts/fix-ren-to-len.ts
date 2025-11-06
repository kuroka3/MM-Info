import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRenToLen() {
  console.log('🔧 Fixing REN → LEN (카가미네 렌 공식 표기)...\n');

  const songs = await prisma.song.findMany();

  let updated = 0;

  for (const song of songs) {
    let needsUpdate = false;
    const oldPart = song.part;
    const newPart = oldPart.map(p => {
      if (p === 'REN') {
        needsUpdate = true;
        return 'LEN';
      }
      return p;
    });

    if (needsUpdate) {
      await prisma.song.update({
        where: { id: song.id },
        data: { part: newPart },
      });

      console.log(`✓ ${song.krtitle || song.title} (${song.slug})`);
      console.log(`  Before: [${oldPart.join(', ')}]`);
      console.log(`  After:  [${newPart.join(', ')}]\n`);

      updated++;
    }
  }

  if (updated === 0) {
    console.log('✅ No songs with REN found. All clean!');
  } else {
    console.log(`✅ Fixed ${updated} songs!`);
  }
}

fixRenToLen()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
