import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Adding グリーンライツ・セレナーデ...\n');

  const greenlightsData = JSON.parse(
    fs.readFileSync('.dev/db_backup/song lyrics/greenlights-serenade (1).json', 'utf-8')
  );

  const existingSong = await prisma.song.findUnique({
    where: { slug: 'greenlights-serenade' },
  });

  if (existingSong) {
    await prisma.song.update({
      where: { slug: 'greenlights-serenade' },
      data: {
        title: greenlightsData.title,
        krtitle: greenlightsData.krtitle,
        artist: greenlightsData.artist,
        krartist: greenlightsData.artist,
        videoId: greenlightsData.videoId,
        youtube: `https://youtu.be/${greenlightsData.videoId}`,
        thumbnail: greenlightsData.thumbnail,
        lyrics: greenlightsData,
        part: ['MIKU'],
      },
    });
    console.log('✓ Updated: 그린라이트 세레나데');
  } else {
    await prisma.song.create({
      data: {
        title: greenlightsData.title,
        krtitle: greenlightsData.krtitle,
        artist: greenlightsData.artist,
        krartist: greenlightsData.artist,
        slug: 'greenlights-serenade',
        videoId: greenlightsData.videoId,
        youtube: `https://youtu.be/${greenlightsData.videoId}`,
        thumbnail: greenlightsData.thumbnail,
        lyrics: greenlightsData,
        part: ['MIKU'],
      },
    });
    console.log('✓ Created: 그린라이트 세레나데');
  }

  console.log('\n📝 Updating summaries for songs with lyrics but missing summary...\n');

  const songsWithLyrics = await prisma.song.findMany({
    where: {
      lyrics: { not: Prisma.JsonNull },
    },
  });

  let updated = 0;

  for (const song of songsWithLyrics) {
    const lyricsData = song.lyrics as any;

    if (!lyricsData || typeof lyricsData !== 'object') continue;

    const hasSummary = 'summary' in lyricsData && lyricsData.summary;
    const hasLyricsArray = 'lyrics' in lyricsData || Array.isArray(lyricsData);

    if (!hasSummary && hasLyricsArray) {
      const updatedLyrics = {
        ...lyricsData,
        summary: '',
      };

      await prisma.song.update({
        where: { id: song.id },
        data: { lyrics: updatedLyrics },
      });

      console.log(`✓ Added empty summary field: ${song.krtitle || song.title} (${song.slug})`);
      updated++;
    }
  }

  console.log(`\n✅ Completed!`);
  console.log(`  - Updated summaries: ${updated}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
