import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function fixLyricsStructure() {
  console.log('🔧 Fixing lyrics JSON structure...\n');
  console.log('Converting { "lyrics": [...] } → [...]\n');

  const songs = await prisma.song.findMany({
    where: {
      lyrics: { not: Prisma.JsonNull },
    },
  });

  let updated = 0;
  let alreadyCorrect = 0;

  for (const song of songs) {
    const lyricsData = song.lyrics as any;

    if (!lyricsData) continue;

    if (Array.isArray(lyricsData)) {
      console.log(`✓ Already correct: ${song.krtitle || song.title} (${song.slug})`);
      alreadyCorrect++;
      continue;
    }

    if (typeof lyricsData === 'object' && Array.isArray(lyricsData.lyrics)) {
      const newLyrics = lyricsData.lyrics;

      await prisma.song.update({
        where: { id: song.id },
        data: { lyrics: newLyrics },
      });

      console.log(`✓ Fixed: ${song.krtitle || song.title} (${song.slug})`);
      console.log(`  Before: { "lyrics": [${newLyrics.length} items], ...other fields }`);
      console.log(`  After:  [${newLyrics.length} items]\n`);

      updated++;
    } else {
      console.log(`⚠️  Unexpected structure: ${song.krtitle || song.title} (${song.slug})`);
      console.log(`   Type: ${typeof lyricsData}`);
      console.log(`   Keys: ${Object.keys(lyricsData).join(', ')}\n`);
    }
  }

  console.log(`\n✅ Summary:`);
  console.log(`   Fixed: ${updated} songs`);
  console.log(`   Already correct: ${alreadyCorrect} songs`);
  console.log(`   Total: ${songs.length} songs`);
}

fixLyricsStructure()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
