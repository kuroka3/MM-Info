import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏙️  Current venues:\n');

  const venues = await prisma.venue.findMany({
    orderBy: { id: 'asc' },
  });

  venues.forEach(venue => {
    console.log(`ID ${venue.id}: ${venue.name} (${venue.name_en})`);
  });

  console.log('\n✏️  Updating venues to city names in Korean...\n');

  const cityMapping = [
    { id: 1, name: '센다이', name_en: 'Sendai' },
    { id: 2, name: '오사카', name_en: 'Osaka' },
    { id: 3, name: '도쿄', name_en: 'Tokyo' },
    { id: 4, name: '방콕', name_en: 'Bangkok' },
    { id: 5, name: '홍콩', name_en: 'Hong Kong' },
    { id: 6, name: '자카르타', name_en: 'Jakarta' },
    { id: 7, name: '마닐라', name_en: 'Manila' },
    { id: 8, name: '싱가포르', name_en: 'Singapore' },
    { id: 9, name: '쿠알라룸푸르', name_en: 'Kuala Lumpur' },
    { id: 10, name: '타이베이', name_en: 'Taipei' },
    { id: 11, name: '서울', name_en: 'Seoul' },
  ];

  for (const city of cityMapping) {
    await prisma.venue.update({
      where: { id: city.id },
      data: {
        name: city.name,
        name_en: city.name_en,
      },
    });
    console.log(`✓ Updated: ${city.name} (${city.name_en})`);
  }

  console.log('\n✅ All venues updated to city names!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
