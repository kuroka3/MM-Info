import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchFromProduction(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  console.log('Fetching data from production site...\n');

  try {
    const concerts = await fetchFromProduction('https://mm-info.miku.kr/api/concerts');
    console.log(`✓ Found ${concerts.length} concerts from production`);

    for (const concert of concerts) {
      console.log(`\nProcessing concert: ${concert.title}`);

      if (concert.setlist && concert.setlist.songs) {
        const setlist = await prisma.setlist.create({
          data: {
            name: concert.setlist.name,
          },
        });
        console.log(`  ✓ Created setlist: ${setlist.name}`);

        for (const item of concert.setlist.songs) {
          if (item.song) {
            let song = await prisma.song.findUnique({
              where: { slug: item.song.slug },
            });

            if (!song) {
              song = await prisma.song.create({
                data: {
                  title: item.song.title,
                  krtitle: item.song.krtitle || null,
                  artist: item.song.artist,
                  krartist: item.song.krartist || null,
                  slug: item.song.slug,
                  videoId: item.song.videoId || null,
                  spotify: item.song.spotify || null,
                  youtube: item.song.youtube || null,
                  thumbnail: item.song.thumbnail || null,
                  part: item.song.part || [],
                  anotherName: item.song.anotherName || [],
                  summary: item.song.summary || null,
                  lyrics: item.song.lyrics || null,
                },
              });
              console.log(`    ✓ Created song: ${song.krtitle || song.title}`);
            }

            await prisma.setlistSong.create({
              data: {
                setlistId: setlist.id,
                songId: song.id,
                order: item.order,
                type: item.type || 'song',
                text: item.text || null,
              },
            });
          }
        }

        let venue = null;
        if (concert.venue) {
          venue = await prisma.venue.upsert({
            where: { id: concert.venue.id },
            create: {
              name: concert.venue.name,
              name_en: concert.venue.name_en || null,
            },
            update: {},
          });
        }

        let event = null;
        if (concert.event) {
          event = await prisma.event.findUnique({
            where: { slug: concert.event.slug },
          });
        }

        await prisma.concert.create({
          data: {
            title: concert.title,
            date: new Date(concert.date),
            day: concert.day,
            block: concert.block,
            hidden: concert.hidden || false,
            venueId: venue?.id || null,
            setlistId: setlist.id,
            eventId: event?.id || null,
            showTime: concert.showTime ? new Date(concert.showTime) : null,
            doorTime: concert.doorTime ? new Date(concert.doorTime) : null,
            vipTime: concert.vipTime ? new Date(concert.vipTime) : null,
            timeZone: concert.timeZone || null,
            timeOffset: concert.timeOffset || null,
            showTimeUTC: concert.showTimeUTC ? new Date(concert.showTimeUTC) : null,
            doorTimeUTC: concert.doorTimeUTC ? new Date(concert.doorTimeUTC) : null,
            vipTimeUTC: concert.vipTimeUTC ? new Date(concert.vipTimeUTC) : null,
          },
        });
        console.log(`  ✓ Created concert: ${concert.title}`);
      }
    }

    console.log('\n✅ Production data restored successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to restore from production:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
