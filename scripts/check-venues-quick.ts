import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const venues = await prisma.venue.findMany({ orderBy: { id: 'asc' } });
  console.log('Current venues in database:');
  venues.forEach(v => console.log(`  ID ${v.id}: ${v.name}`));
}

main()
  .finally(() => prisma.$disconnect());
