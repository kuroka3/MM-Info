import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface CSVRow {
  순서: string;
  번역명: string;
  원제: string;
  프로듀서: string;
  파트: string;
  링크: string;
  비고: string;
}

const slugMapping: Record<string, string> = {
  'ヒアソビ': 'hiasobi',
  '初音天地開闢神話': 'shinkai-kaibyaku',
  'アンテナ39': 'antena-39',
  'こちら、幸福安心委員会です。': 'koufuku-anshin',
  'MAGA MAGA': 'maga-maga',
  '抜錨': 'batsubyou',
  '星屑ユートピア': 'hoshikuzu-utopia',
  'ラヴィ': 'lavie',
  '少女A': 'shoujo-a',
  'ジェミニ': 'gemini',
  'キミペディア': 'kimipedia',
  '1/6 -out of the gravity-': 'one-sixth',
  '独りんぼエンヴィー': 'hitorinbo-envy',
  '太陽系デスコ': 'taiyoukei-disco',
  'はじめまして地球人さん': 'hajimemashite-chikyuujin',
  'ヴァニッシュ': 'vanish',
  'ドクター＝ファンクビート': 'docter-funkbeat',
  'みかぼし': 'mikaboshi',
  'げんてん': 'genten',
  '星空クロノグラフ': 'hoshizora-chronograph',
  '夜舞うシルエット': 'yomau-silhouette',
  'Flyway': 'flyway',
  'メテオ': 'meteo',
  'Starduster': 'starduster',
  'Last Night, Good Night': 'last-night-good-night',
  'METEOR': 'meteor',
  'StargazeR': 'stargazer',
  '黙ってロックをやれって言ってんの！': 'dama-rock',
  'ブループラネット': 'blue-planet',
  'Hand in Hand': 'hand-in-hand',
  'ストリートライト': 'street-light',
  'Blessing': 'blessing',
  'ラストラス': 'lustrous',
};

async function main() {
  console.log('🔍 Verifying and updating song data from CSV files...\n');

  const csvAPath = '.dev/db_backup/2025 마지미라 세트리스트 - A.csv';
  const csvBPath = '.dev/db_backup/2025 마지미라 세트리스트 - B.csv';

  const contentA = fs.readFileSync(csvAPath, 'utf-8');
  const contentB = fs.readFileSync(csvBPath, 'utf-8');

  const recordsA = parse(contentA, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  const recordsB = parse(contentB, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CSVRow[];

  const allRecords = [...recordsA, ...recordsB];
  const songMap = new Map<string, { title: string; krtitle: string; artist: string; krartist: string }>();

  for (const record of allRecords) {
    if (!record.원제 || !record.번역명) continue;

    const title = record.원제.trim();
    const slug = slugMapping[title];

    if (!slug) {
      console.log(`⚠️  No slug mapping for: ${title}`);
      continue;
    }

    if (songMap.has(slug)) continue;

    songMap.set(slug, {
      title: title,
      krtitle: record.번역명.trim(),
      artist: record.프로듀서.trim(),
      krartist: record.프로듀서.trim(),
    });
  }

  console.log(`Found ${songMap.size} songs in CSV files\n`);

  let updated = 0;
  let differences: string[] = [];

  for (const [slug, csvData] of songMap) {
    const song = await prisma.song.findUnique({
      where: { slug },
    });

    if (!song) {
      console.log(`❌ Song not found in DB: ${slug}`);
      continue;
    }

    const changes: string[] = [];
    if (song.title !== csvData.title) {
      changes.push(`title: "${song.title}" → "${csvData.title}"`);
    }
    if (song.krtitle !== csvData.krtitle) {
      changes.push(`krtitle: "${song.krtitle}" → "${csvData.krtitle}"`);
    }
    if (song.artist !== csvData.artist) {
      changes.push(`artist: "${song.artist}" → "${csvData.artist}"`);
    }
    if (song.krartist !== csvData.krartist) {
      changes.push(`krartist: "${song.krartist}" → "${csvData.krartist}"`);
    }

    if (changes.length > 0) {
      differences.push(`\n${csvData.krtitle || csvData.title} (${slug}):`);
      changes.forEach(c => differences.push(`  - ${c}`));

      await prisma.song.update({
        where: { slug },
        data: {
          title: csvData.title,
          krtitle: csvData.krtitle,
          artist: csvData.artist,
          krartist: csvData.krartist,
        },
      });

      console.log(`✓ Updated: ${csvData.krtitle || csvData.title}`);
      updated++;
    }
  }

  console.log(`\n✅ Verification completed!`);
  console.log(`  - Total songs in CSV: ${songMap.size}`);
  console.log(`  - Updated: ${updated}`);

  if (differences.length > 0) {
    console.log('\n📝 Changes made:');
    differences.forEach(d => console.log(d));
  } else {
    console.log('\n✨ All song data matches CSV files!');
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
