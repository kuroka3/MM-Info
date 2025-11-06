import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const lyricsDir = '.dev/db_backup/song lyrics';

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

async function main() {
  console.log('📝 Importing lyrics from JSON files...\n');

  const files = fs.readdirSync(lyricsDir);
  let imported = 0;
  let notFound = 0;

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const slug = slugMapping[file];
    if (!slug) {
      console.log(`⚠️  No slug mapping for ${file}`);
      continue;
    }

    const filePath = path.join(lyricsDir, file);
    const lyricsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const song = await prisma.song.findUnique({
      where: { slug },
    });

    if (!song) {
      console.log(`❌ Song not found: ${slug}`);
      notFound++;
      continue;
    }

    await prisma.song.update({
      where: { slug },
      data: {
        lyrics: lyricsData,
      },
    });

    console.log(`✓ ${song.krtitle || song.title} (${slug})`);
    imported++;
  }

  console.log(`\n✅ Import completed!`);
  console.log(`  - Imported: ${imported}`);
  console.log(`  - Not found: ${notFound}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
