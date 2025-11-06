import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const setlists = [
  { id: 1, name: '센다이 세트리 A' },
  { id: 2, name: '센다이 세트리 B' },
  { id: 3, name: '오사카 세트리 B' },
  { id: 4, name: '오사카 세트리 A' },
  { id: 5, name: '도쿄 세트리 B' },
  { id: 6, name: '도쿄 세트리 A' },
  { id: 17, name: 'MIKU EXPO 방콕 세트리스트' },
  { id: 18, name: 'MIKU EXPO 홍콩 세트리스트' },
  { id: 19, name: 'MIKU EXPO 자카르타 세트리스트' },
  { id: 20, name: 'MIKU EXPO 마닐라 세트리스트' },
  { id: 21, name: 'MIKU EXPO 싱가포르 세트리스트' },
  { id: 22, name: 'MIKU EXPO 쿠알라룸푸르 세트리스트' },
  { id: 23, name: 'MIKU EXPO 타이베이 세트리스트' },
  { id: 24, name: 'MIKU EXPO 서울 세트리스트 - 토' },
  { id: 25, name: 'MIKU EXPO 서울 세트리스트 - 일' },
];

async function main() {
  console.log('Restoring setlists...\n');

  // Delete existing data first
  console.log('Cleaning up existing data...');
  await prisma.setlistSong.deleteMany({});
  await prisma.concert.deleteMany({});
  await prisma.setlist.deleteMany({});
  console.log('✓ Cleaned up\n');

  // Restore setlists
  for (const setlist of setlists) {
    await prisma.$executeRaw`
      INSERT INTO "Setlist" (id, name)
      VALUES (${setlist.id}, ${setlist.name})
      ON CONFLICT (id) DO UPDATE SET name = ${setlist.name}
    `;
    console.log(`✓ Restored: ${setlist.name}`);
  }

  // Reset sequence to max id + 1
  await prisma.$executeRaw`
    SELECT setval('"Setlist_id_seq"', (SELECT MAX(id) FROM "Setlist"))
  `;

  console.log(`\n✅ Successfully restored ${setlists.length} setlists!`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
