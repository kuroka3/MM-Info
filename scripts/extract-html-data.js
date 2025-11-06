const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('.dev/db_backup/song_html.txt', 'utf-8');

const songRegex = /\\"slug\\":\\"([^"]+)\\",\\"videoId\\":\\"[^"]*\\",\\"summary\\":\\"([^"]*?)\\",\\"lyrics\\":/g;

let match;
const songData = [];

while ((match = songRegex.exec(content)) !== null) {
  const slug = match[1];
  const summary = match[2]
    .replace(/\\r\\n/g, '\n')
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>');

  const existing = songData.find(s => s.slug === slug);
  if (!existing) {
    songData.push({ slug, summary });
  }
}

console.log('📊 Extraction Results:\n');
console.log(`Found ${songData.length} unique songs with summaries`);

console.log('\n🎵 Songs extracted from song_html.txt:\n');
songData.forEach((s, i) => {
  console.log(`${i+1}. ${s.slug}`);
  if (s.summary) {
    console.log(`   Summary: ${s.summary.substring(0, 100)}${s.summary.length > 100 ? '...' : ''}`);
  }
  console.log('');
});

const lyricsDir = '.dev/db_backup/song lyrics';
const slugMapping = {
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

console.log('\n\n🔍 Comparing summaries with song lyrics files...\n');

const differences = [];

for (const song of songData) {
  const lyricsFile = Object.entries(slugMapping).find(([_, slug]) => slug === song.slug);

  if (lyricsFile) {
    const lyricsPath = path.join(lyricsDir, lyricsFile[0]);
    try {
      const lyricsData = JSON.parse(fs.readFileSync(lyricsPath, 'utf-8'));

      const htmlSummary = song.summary.trim();
      const lyricsSummary = (lyricsData.summary || '').trim();

      if (htmlSummary !== lyricsSummary) {
        differences.push({
          slug: song.slug,
          htmlSummary,
          lyricsSummary
        });
      }
    } catch (e) {
      console.log(`Error reading ${lyricsFile[0]}: ${e.message}`);
    }
  }
}

if (differences.length > 0) {
  console.log(`⚠️  Found ${differences.length} songs with different summaries:\n`);

  differences.forEach((diff, i) => {
    console.log(`${i+1}. ${diff.slug}`);
    console.log(`   song_html.txt: "${diff.htmlSummary}"`);
    console.log(`   song lyrics:   "${diff.lyricsSummary}"`);
    console.log('');
  });

  console.log('\n❓ 어느 쪽 summary가 맞는지 확인이 필요합니다.');
} else {
  console.log('✅ All summaries match!');
}
