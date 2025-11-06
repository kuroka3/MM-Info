import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function extractSpotifyId(url: string): string | null {
  if (!url || url.includes('nicovideo')) return null;
  const match = url.match(/spotify:track:([a-zA-Z0-9]+)/) || url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function generateSlug(title: string): string {
  const slugMap: Record<string, string> = {
    'ヒアソビ': 'hiasobi',
    'アンテナ39': 'antena-39',
    'こちら、幸福安心委員会です。': 'koufuku-anshin',
    'MAGA MAGA': 'maga-maga',
    '星屑ユートピア': 'hoshikuzu-utopia',
    'ラヴィ': 'lavie',
    '少女A': 'shoujo-a',
    'キミペディア': 'kimipedia',
    '1/6 -out of the gravity-': 'one-sixth',
    '独りんぼエンヴィー': 'hitorinbo-envy',
    'ヴァニッシュ': 'vanish',
    'みかぼし': 'mikaboshi',
    'げんてん': 'genten',
    '夜舞うシルエット': 'yomau-silhouette',
    'Flyway': 'flyway',
    'メテオ': 'meteo',
    'Last Night, Good Night': 'last-night-good-night',
    'StargazeR': 'stargazer',
    'Meteor': 'meteor',
    '黙ってロックをやれって言ってんの！': 'dama-rock',
    'ストリートライト': 'street-light',
    'Blessing': 'blessing',
    'ブループラネット': 'blue-planet',
    'Hand in Hand': 'hand-in-hand',
    'ラストラス': 'lustrous',
    '初音天地開闢神話': 'shinkai-kaibyaku',
    '抜錨': 'batsubyou',
    'ジェミニ': 'gemini',
    'ドクター＝ファンクビート': 'docter-funkbeat',
    '星空クロノグラフ': 'hoshizora-chronograph',
    'Starduster': 'starduster',
    'グリーンライツ・セレナーデ': 'greenlights-serenade',
  };
  return slugMap[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

async function main() {
  console.log('🔄 Starting full database restoration...\n');

  const lagacyData = JSON.parse(
    fs.readFileSync('.dev/db_backup/lagacy.json', 'utf-8')
  );

  console.log('Step 1: Cleaning existing data...');
  await prisma.setlistSong.deleteMany({});
  await prisma.concert.deleteMany({});
  await prisma.song.deleteMany({});
  console.log('✓ Cleaned\n');

  console.log('Step 2: Creating unique songs from legacy data...');
  const songMap = new Map<string, any>();

  for (const setlistId of Object.keys(lagacyData)) {
    const setlist = lagacyData[setlistId];
    for (const song of setlist.songs) {
      if (song.title === '최종 플레이리스트') continue;

      const slug = generateSlug(song.title);
      if (!songMap.has(slug)) {
        const videoId = extractYouTubeId(song.youtubeUrl);
        const spotifyId = extractSpotifyId(song.spotifyUrl);

        songMap.set(slug, {
          title: song.title,
          krtitle: song.krtitle || null,
          artist: song.artist,
          slug,
          videoId,
          spotify: spotifyId ? `https://open.spotify.com/track/${spotifyId}` : null,
          youtube: song.youtubeUrl || null,
          thumbnail: song.jacketUrl || null,
          part: song.part || [],
          anotherName: [],
        });
      }
    }
  }

  console.log(`Found ${songMap.size} unique songs`);

  for (const [slug, songData] of songMap) {
    try {
      await prisma.song.create({ data: songData });
      console.log(`  ✓ ${songData.krtitle || songData.title}`);
    } catch (error: any) {
      if (error.code !== 'P2002') {
        console.error(`  ✗ Failed: ${songData.title}:`, error.message);
      }
    }
  }

  console.log('\nStep 3: Creating SetlistSongs...');

  for (const setlistId of ['1', '2']) {
    const setlist = lagacyData[setlistId];
    let order = 1;

    for (const song of setlist.songs) {
      if (song.title === '최종 플레이리스트') continue;

      const slug = generateSlug(song.title);
      const dbSong = await prisma.song.findUnique({ where: { slug } });

      if (dbSong) {
        await prisma.setlistSong.create({
          data: {
            setlistId: parseInt(setlistId),
            songId: dbSong.id,
            order,
            type: 'song',
          },
        });
        order++;
      }
    }
    console.log(`  ✓ Setlist ${setlistId}: ${order - 1} songs`);
  }

  console.log('\nStep 4: Creating Venues...');
  const venues = [
    { id: 1, name: 'ゼビオアリーナ仙台', name_en: 'Xebio Arena Sendai' },
    { id: 2, name: '大阪城ホール', name_en: 'Osaka-jo Hall' },
    { id: 3, name: '幕張メッセ国際展示場 9-11ホール', name_en: 'Makuhari Messe' },
    { id: 4, name: 'Thunder Dome', name_en: 'Thunder Dome' },
    { id: 5, name: 'AsiaWorld-Expo', name_en: 'AsiaWorld-Expo' },
    { id: 6, name: 'Indonesia Convention Exhibition (ICE)', name_en: 'Indonesia Convention Exhibition (ICE)' },
    { id: 7, name: 'SM Mall of Asia Arena', name_en: 'SM Mall of Asia Arena' },
    { id: 8, name: 'The Star Theatre', name_en: 'The Star Theatre' },
    { id: 9, name: 'Axiata Arena', name_en: 'Axiata Arena' },
    { id: 10, name: '台北流行音樂中心', name_en: 'Taipei Music Center' },
    { id: 11, name: '올림픽공원 올림픽홀', name_en: 'Olympic Hall' },
  ];

  for (const venue of venues) {
    await prisma.$executeRaw`
      INSERT INTO "Venue" (id, name, name_en)
      VALUES (${venue.id}, ${venue.name}, ${venue.name_en})
      ON CONFLICT (id) DO UPDATE SET name = ${venue.name}, name_en = ${venue.name_en}
    `;
  }
  console.log(`✓ Created ${venues.length} venues`);

  console.log('\nStep 5: Creating Concerts from talk_log...');
  const concerts = [
    { id: 2, title: '센다이 금요일 밤', date: '2025-08-01', day: '금', block: '밤', venueId: 1, setlistId: 1, eventId: 1, showTime: '17:00:00', doorTime: '16:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 3, title: '센다이 토요일 낮', date: '2025-08-02', day: '토', block: '낮', venueId: 1, setlistId: 2, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 4, title: '센다이 토요일 밤', date: '2025-08-02', day: '토', block: '밤', venueId: 1, setlistId: 1, eventId: 1, showTime: '16:30:00', doorTime: '15:30:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 5, title: '센다이 일요일 낮', date: '2025-08-03', day: '일', block: '낮', venueId: 1, setlistId: 2, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 6, title: '센다이 일요일 밤', date: '2025-08-03', day: '일', block: '밤', venueId: 1, setlistId: 1, eventId: 1, showTime: '16:30:00', doorTime: '15:30:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 7, title: '오사카 토요일 낮', date: '2025-08-09', day: '토', block: '낮', venueId: 2, setlistId: 4, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 8, title: '오사카 토요일 밤', date: '2025-08-09', day: '토', block: '밤', venueId: 2, setlistId: 3, eventId: 1, showTime: '16:30:00', doorTime: '15:30:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 9, title: '오사카 일요일 낮', date: '2025-08-10', day: '일', block: '낮', venueId: 2, setlistId: 4, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 10, title: '오사카 일요일 밤', date: '2025-08-10', day: '일', block: '밤', venueId: 2, setlistId: 3, eventId: 1, showTime: '16:30:00', doorTime: '15:30:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 11, title: '오사카 월요일 낮', date: '2025-08-11', day: '월', block: '낮', venueId: 2, setlistId: 4, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 12, title: '오사카 월요일 밤', date: '2025-08-11', day: '월', block: '밤', venueId: 2, setlistId: 3, eventId: 1, showTime: '16:30:00', doorTime: '15:30:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 13, title: '도쿄 금요일 낮', date: '2025-08-29', day: '금', block: '낮', venueId: 3, setlistId: 6, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
    { id: 15, title: '도쿄 토요일 낮', date: '2025-08-30', day: '토', block: '낮', venueId: 3, setlistId: 6, eventId: 1, showTime: '12:00:00', doorTime: '11:00:00', timeZone: 'Asia/Tokyo', timeOffset: '+09:00' },
  ];

  for (const concert of concerts) {
    await prisma.$executeRaw`
      INSERT INTO "Concert" (id, title, date, day, block, hidden, "venueId", "setlistId", "eventId", "showTime", "doorTime", "timeZone", "timeOffset")
      VALUES (
        ${concert.id},
        ${concert.title},
        ${concert.date}::date,
        ${concert.day},
        ${concert.block},
        false,
        ${concert.venueId},
        ${concert.setlistId},
        ${concert.eventId},
        ${concert.showTime}::time,
        ${concert.doorTime}::time,
        ${concert.timeZone},
        ${concert.timeOffset}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    console.log(`  ✓ ${concert.title}`);
  }

  console.log('\n✅ Database restoration completed!');
  console.log('\n📊 Summary:');
  console.log(`  - Songs: ${songMap.size}`);
  console.log(`  - Setlists: 15 (existing)`);
  console.log(`  - Concerts: ${concerts.length}`);
  console.log(`  - Venues: ${venues.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
