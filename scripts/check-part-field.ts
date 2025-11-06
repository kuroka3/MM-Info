import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking part field types...\n');

  const songs = await prisma.song.findMany({
    select: {
      slug: true,
      title: true,
      krtitle: true,
      part: true,
    },
  });

  const issues: string[] = [];

  for (const song of songs) {
    const isArray = Array.isArray(song.part);
    const type = typeof song.part;

    if (!isArray) {
      issues.push(`${song.krtitle || song.title} (${song.slug}): part is ${type}, value: ${JSON.stringify(song.part)}`);
    }
  }

  if (issues.length > 0) {
    console.log(`⚠️  Found ${issues.length} songs with non-array part field:\n`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('✅ All songs have array part field!');
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
