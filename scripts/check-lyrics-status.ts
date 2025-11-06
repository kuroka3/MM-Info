import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking lyrics and summary status...\n');

  const songs = await prisma.song.findMany({
    orderBy: { slug: 'asc' },
    select: {
      slug: true,
      title: true,
      krtitle: true,
      lyrics: true,
    },
  });

  let hasLyrics = 0;
  let hasSummary = 0;
  let missing: string[] = [];

  for (const song of songs) {
    const lyricsData = song.lyrics as any;
    const hasSummaryField = lyricsData && typeof lyricsData === 'object' && 'summary' in lyricsData;
    const hasLyricsArray = lyricsData && typeof lyricsData === 'object' && Array.isArray(lyricsData.lyrics || lyricsData);

    if (hasLyricsArray) hasLyrics++;
    if (hasSummaryField) hasSummary++;

    if (!hasSummaryField && !hasLyricsArray) {
      missing.push(`${song.krtitle || song.title} (${song.slug})`);
    }
  }

  console.log(`Total songs: ${songs.length}`);
  console.log(`Songs with lyrics: ${hasLyrics}`);
  console.log(`Songs with summary: ${hasSummary}`);

  if (missing.length > 0) {
    console.log(`\n⚠️  Songs missing lyrics/summary (${missing.length}):`);
    missing.forEach(s => console.log(`  - ${s}`));
  } else {
    console.log('\n✅ All songs have lyrics data!');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
