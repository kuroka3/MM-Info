import fs from 'fs';
import path from 'path';

const htmlFile = '.dev/db_backup/song_html.txt';

interface SongData {
  slug: string;
  title: string;
  krtitle?: string;
  summary?: string;
  lyrics?: any;
  videoId?: string;
  spotify?: string;
  thumbnail?: string;
}

async function main() {
  console.log('📖 Parsing song_html.txt...\n');

  const content = fs.readFileSync(htmlFile, 'utf-8');

  const songDataMatches = content.match(/"song":\{[^}]+\}/g);

  if (!songDataMatches) {
    console.log('No song data found');
    return;
  }

  const songs: SongData[] = [];

  for (const match of songDataMatches) {
    try {
      const fullObjectMatch = content.match(new RegExp(`"song":(\\{[^}]*${match.slice(8, 30)}[^}]*\\})`));
      if (fullObjectMatch) {
        const jsonStr = fullObjectMatch[1]
          .replace(/\\"/g, '"')
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n/g, '\n');

        const songObj = JSON.parse(jsonStr);
        songs.push(songObj);
      }
    } catch (e) {
      continue;
    }
  }

  console.log(`Found ${songs.length} song entries\n`);

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

  console.log('🔍 Comparing summaries...\n');

  const summaryDifferences: Array<{
    slug: string;
    title: string;
    htmlSummary: string | undefined;
    lyricsSummary: string | undefined;
  }> = [];

  for (const song of songs) {
    if (!song.slug) continue;

    const lyricsFile = Object.entries(slugMapping).find(([_, slug]) => slug === song.slug);

    if (lyricsFile) {
      const lyricsPath = path.join(lyricsDir, lyricsFile[0]);
      const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));

      const htmlSummary = song.summary?.trim();
      const lyricsSummary = lyricsData.summary?.trim();

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
      console.log(`   song_html.txt: ${diff.htmlSummary || '(없음)'}`);
      console.log(`   song lyrics:   ${diff.lyricsSummary || '(없음)'}`);
      console.log('');
    }
  } else {
    console.log('✅ All summaries match!\n');
  }

  console.log('📊 Additional metadata found in song_html.txt:\n');

  for (const song of songs.slice(0, 5)) {
    console.log(`${song.title}:`);
    console.log(`  - videoId: ${song.videoId || 'N/A'}`);
    console.log(`  - spotify: ${song.spotify || 'N/A'}`);
    console.log(`  - thumbnail: ${song.thumbnail ? 'Yes' : 'No'}`);
    console.log('');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  });
