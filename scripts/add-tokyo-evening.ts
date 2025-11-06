import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌃 Adding 도쿄 밤 공연...\n');

  const event = await prisma.event.findUnique({ where: { slug: 'magical-mirai-2025' } });

  if (!event) {
    throw new Error('Event not found');
  }

  await prisma.$executeRaw`
    INSERT INTO "Concert" (id, title, date, day, block, hidden, "venueId", "setlistId", "eventId", "showTime", "doorTime", "timeZone", "timeOffset")
    VALUES
      (14, '도쿄 금요일 밤', '2025-08-29'::date, '금', '밤', false, 3, 5, ${event.id}, '16:30:00'::time, '15:30:00'::time, 'Asia/Tokyo', '+09:00'),
      (16, '도쿄 토요일 밤', '2025-08-30'::date, '토', '밤', false, 3, 5, ${event.id}, '16:30:00'::time, '15:30:00'::time, 'Asia/Tokyo', '+09:00')
    ON CONFLICT (id) DO UPDATE SET
      "setlistId" = EXCLUDED."setlistId",
      hidden = EXCLUDED.hidden
  `;

  console.log('✓ 도쿄 금요일 밤 (ID: 14)');
  console.log('✓ 도쿄 토요일 밤 (ID: 16)');

  console.log('\n✅ All done!');
  console.log('\n최종 공연 스케줄:');
  console.log('센다이:');
  console.log('  - 8/1 (금): 밤');
  console.log('  - 8/2 (토): 낮, 밤');
  console.log('  - 8/3 (일): 낮, 밤');
  console.log('\n도쿄:');
  console.log('  - 8/29 (금): 낮, 밤');
  console.log('  - 8/30 (토): 낮, 밤');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
