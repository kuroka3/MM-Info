import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Updating setlist playlists and hiding Sendai afternoon concerts...\n');

  await prisma.setlist.update({
    where: { id: 1 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0QhD2eLFE6Ja7PaMFo3UCfc' },
  });
  console.log('✓ Updated 센다이 세트리 A (밤) playlist');

  await prisma.setlist.update({
    where: { id: 2 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0SMmTO2CEizTfp2RzycQKdn' },
  });
  console.log('✓ Updated 센다이 세트리 B (낮) playlist');

  await prisma.setlist.update({
    where: { id: 3 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0QhD2eLFE6Ja7PaMFo3UCfc' },
  });
  console.log('✓ Updated 오사카 세트리 B (밤) playlist');

  await prisma.setlist.update({
    where: { id: 4 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0SMmTO2CEizTfp2RzycQKdn' },
  });
  console.log('✓ Updated 오사카 세트리 A (낮) playlist');

  await prisma.setlist.update({
    where: { id: 5 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0QhD2eLFE6Ja7PaMFo3UCfc' },
  });
  console.log('✓ Updated 도쿄 세트리 B (밤) playlist');

  await prisma.setlist.update({
    where: { id: 6 },
    data: { playlist: 'https://youtube.com/playlist?list=PLbc3cSt2on0SMmTO2CEizTfp2RzycQKdn' },
  });
  console.log('✓ Updated 도쿄 세트리 A (낮) playlist');

  console.log('\n🔒 Hiding Sendai afternoon concerts...\n');

  const sendaiAfternoonConcerts = await prisma.concert.findMany({
    where: {
      venueId: 1,
      block: '낮',
      event: {
        slug: 'magical-mirai-2025',
      },
    },
  });

  for (const concert of sendaiAfternoonConcerts) {
    await prisma.concert.update({
      where: { id: concert.id },
      data: {
        hidden: true,
        setlistId: null,
      },
    });
    console.log(`✓ Hidden: ${concert.title} (ID: ${concert.id})`);
  }

  console.log('\n✅ Update completed!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
