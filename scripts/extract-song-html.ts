import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SongData {
  id: number;
  title: string;
  krtitle: string | null;
  artist: string;
  slug: string;
  videoId: string;
  summary: string;
  lyrics: any[];
  spotify: string;
  youtube: string;
  thumbnail: string;
  part: string[];
}

async function main() {
  console.log('📖 Extracting song data from song_html.txt...\n');

  const content = fs.readFileSync('.dev/db_backup/song_html.txt', 'utf-8');

  const regex = /\{"id":\d+,"title":"[^"]+","krtitle":[^}]*,"artist":"[^"]+","slug":"[^"]+","videoId":"[^"]*","summary":"[^"]*","lyrics":\[.*?\],"spotify":"[^"]*","youtube":"[^"]*","thumbnail":"[^"]*","part":\[[^\]]*\]/g;

  const matches = content.match(regex);

  if (!matches) {
    console.log('No song data found');
    return;
  }

  console.log(`Found ${matches.length} potential song entries\n`);

  const songs: SongData[] = [];
  const seenSlugs = new Set<string>();

  for (const match of matches) {
    try {
      const cleaned = match
        .replace(/\\"/g, '"')
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\\/g, '\\');

      const songObj = JSON.parse(cleaned + '}');

      if (!seenSlugs.has(songObj.slug)) {
        songs.push(songObj);
        seenSlugs.add(songObj.slug);
      }
    } catch (e) {
      continue;
    }
  }

  console.log(`Parsed ${songs.length} unique songs\n`);

  const lyricsDir = '.dev/db_backup/song lyrics';
  const lyricsFiles = fs.readdirSync(lyricsDir).filter(f => f.endsWith('.json'));

  const slugMapping: Record<string, string> = {
    'antena-39 (2).json': 'antena-39',
    'batsubyou (1).json': 'batsubyou',
    'blessing (4).json': 'blessing',
    'blue-planet (1).json': 'blue-planet',
    'dama-rock (2).json': 'dama-rock',
    'docter-funkbeat (3).json': 'docter-funkbeat',
    'genten (2).json': 'genten',
    'hand-in-hand.json': 'hand-in-hand',
    'hiasobi (4).json': 'hiasobi',
    'koufuku-anshin.json': 'koufuku-anshin',
    'lavie (2).json': 'lavie',
    'lustrous.json': 'lustrous',
    'maga-maga.json': 'maga-maga',
    'meteor (6).json': 'meteor',
    'one-sixth (1).json': 'one-sixth',
    'stargazer (5).json': 'stargazer',
    'street-light (1).json': 'street-light',
    'taiyokei-disco (2).json': 'taiyokei-disco',
    'yomau-silhouette (2).json': 'yomau-silhouette',
  };

  console.log('🔍 Comparing summaries between song_html.txt and song lyrics files...\n');

  const summaryDifferences: Array<{
    slug: string;
    title: string;
    htmlSummary: string;
    lyricsSummary: string;
  }> = [];

  for (const song of songs) {
    const lyricsFile = Object.entries(slugMapping).find(([_, slug]) => slug === song.slug);

    if (lyricsFile) {
      const lyricsPath = path.join(lyricsDir, lyricsFile[0]);
      const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));

      const htmlSummary = song.summary?.trim() || '';
      const lyricsSummary = lyricsData.summary?.trim() || '';

      if (htmlSummary !== lyricsSummary) {
        summaryDifferences.push({
          slug: song.slug,
          title: song.title,
          htmlSummary,
          lyricsSummary,
        });
      }
    }
  }

  if (summaryDifferences.length > 0) {
    console.log(`⚠️  Found ${summaryDifferences.length} songs with different summaries:\n`);

    for (const diff of summaryDifferences) {
      console.log(`📌 ${diff.title} (${diff.slug})`);
      console.log(`   song_html.txt: "${diff.htmlSummary}"`);
      console.log(`   song lyrics:   "${diff.lyricsSummary}"`);
      console.log('');
    }

    console.log('\n❓ 어느 쪽이 맞는지 확인이 필요합니다.\n');
  } else {
    console.log('✅ All summaries match between song_html.txt and song lyrics files!\n');
  }

  console.log('📊 Songs found in song_html.txt:\n');
  for (const song of songs) {
    const inDb = await prisma.song.findUnique({ where: { slug: song.slug } });
    const status = inDb ? '✓' : '✗';
    console.log(`  ${status} ${song.title} (${song.slug})`);
  }

  console.log('\n📝 Summary of metadata in song_html.txt:');
  console.log(`  - Total unique songs: ${songs.length}`);
  console.log(`  - Songs with summary: ${songs.filter(s => s.summary).length}`);
  console.log(`  - Songs with videoId: ${songs.filter(s => s.videoId).length}`);
  console.log(`  - Songs with spotify: ${songs.filter(s => s.spotify).length}`);
  console.log(`  - Songs with lyrics: ${songs.filter(s => s.lyrics && s.lyrics.length > 0).length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
