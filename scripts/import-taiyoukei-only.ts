import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Importing 태양계 디스코 lyrics...\n');

  const lyricsData = JSON.parse(
    fs.readFileSync('.dev/db_backup/song lyrics/taiyoukei-disco (2).json', 'utf-8')
  );

  const song = await prisma.song.findUnique({
    where: { slug: 'taiyoukei-disco' },
  });

  if (!song) {
    console.log('❌ Song not found: taiyoukei-disco');
    return;
  }

  await prisma.song.update({
    where: { slug: 'taiyoukei-disco' },
    data: { lyrics: lyricsData },
  });

  console.log('✅ 태양계 디스코 lyrics imported successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
