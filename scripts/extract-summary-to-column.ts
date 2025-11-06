import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Extracting summary from lyrics JSON to summary column...\n');

  const songs = await prisma.song.findMany({
    where: {
      lyrics: { not: Prisma.JsonNull },
    },
  });

  let updated = 0;

  for (const song of songs) {
    const lyricsData = song.lyrics as any;

    if (!lyricsData || typeof lyricsData !== 'object') continue;

    const summaryValue = lyricsData.summary;

    if (summaryValue && typeof summaryValue === 'string' && summaryValue.trim() !== '') {
      await prisma.song.update({
        where: { id: song.id },
        data: { summary: summaryValue },
      });

      console.log(`✓ ${song.krtitle || song.title} (${song.slug})`);
      console.log(`  Summary: ${summaryValue.substring(0, 60)}${summaryValue.length > 60 ? '...' : ''}\n`);
      updated++;
    }
  }

  console.log(`✅ Summary extraction completed!`);
  console.log(`  - Updated: ${updated} songs`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
