import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SongData {
  order: number;
  title: string;
  title_en: string;
  krtitle: string | null;
  artist: string;
  krartist: string;
  part: string[];
  slug: string;
  higawari: '낮' | '밤' | null;
  locationgawari: '센다이' | '오사카' | '도쿄' | null;
}

const songs: SongData[] = [
  { order: 1, title: 'ヒアソビ', title_en: 'Hiasobi', krtitle: '불장난', artist: 'かめりあ', krartist: '카메리아', part: ['MIKU'], slug: 'hiasobi', higawari: null, locationgawari: null },
  { order: 2, title: '初音天地開闢神話', title_en: 'Hatsune Tenchi Kaibyaku Shinwa', krtitle: '하츠네 천지개벽 신화', artist: 'cosMo@暴走P', krartist: 'cosMo@폭주P', part: ['MIKU'], slug: 'shinkai-kaibyaku', higawari: '낮', locationgawari: null },
  { order: 2, title: 'アンテナ39', title_en: 'Antenna 39', krtitle: '안테나39', artist: '柊マグネタイト', krartist: '히이라기 마그네타이트', part: ['MIKU'], slug: 'antena-39', higawari: '밤', locationgawari: null },
  { order: 3, title: 'こちら、幸福安心委員会です。', title_en: 'Kochira, Koufuku Anshin Iinkai desu.', krtitle: '여기는, 행복안심위원회입니다.', artist: 'うたたP', krartist: '우타타P', part: ['MIKU'], slug: 'koufuku-anshin', higawari: null, locationgawari: null },
  { order: 4, title: 'MAGA MAGA', title_en: 'MAGA MAGA', krtitle: 'MAGA MAGA', artist: 'ユーレイ一門寺', krartist: '유레이 이치몬지', part: ['LUKA'], slug: 'maga-maga', higawari: null, locationgawari: null },
  { order: 5, title: '抜錨', title_en: 'Batsubyō', krtitle: '발묘', artist: 'ナナホシ管弦楽団', krartist: '나나호시 관현악단', part: ['LUKA'], slug: 'batsubyou', higawari: '낮', locationgawari: null },
  { order: 5, title: '星屑ユートピア', title_en: 'Hoshikuzu Utopia', krtitle: '별가루 유토피아', artist: 'otetsu', krartist: 'otetsu', part: ['LUKA'], slug: 'hoshikuzu-utopia', higawari: '밤', locationgawari: null },
  { order: 6, title: 'ラヴィ', title_en: 'LAVIE', krtitle: '라비', artist: 'すりぃ', krartist: '스리이', part: ['REN'], slug: 'lavie', higawari: null, locationgawari: null },
  { order: 7, title: '少女A', title_en: 'Shoujo A', krtitle: '소녀A', artist: '椎名もた', krartist: '시이나 모타', part: ['RIN'], slug: 'shoujo-a', higawari: null, locationgawari: null },
  { order: 8, title: 'ジェミニ', title_en: 'Gemini', krtitle: '제미니', artist: 'Dixie Flatline', krartist: 'Dixie Flatline', part: ['RIN', 'REN'], slug: 'gemini', higawari: '낮', locationgawari: null },
  { order: 8, title: 'キミペディア', title_en: 'Kimipedia', krtitle: '키미페디아', artist: 'Junky', krartist: 'Junky', part: ['RIN', 'REN'], slug: 'kimipedia', higawari: '밤', locationgawari: null },
  { order: 9, title: '1/6 -out of the gravity-', title_en: '1/6 -out of the gravity-', krtitle: '1/6 -out of the gravity-', artist: 'ぼーかりおどP', krartist: '보카리오도P', part: ['MIKU'], slug: 'one-sixth', higawari: null, locationgawari: null },
  { order: 10, title: '独りんぼエンヴィー', title_en: 'Hitorinbo Envy', krtitle: '혼자 놀이 엔비', artist: 'koyori(電ポルP)', krartist: 'koyori(덴포루P)', part: ['MIKU'], slug: 'hitorinbo-envy', higawari: null, locationgawari: '센다이' },
  { order: 10, title: '太陽系デスコ', title_en: 'Taiyoukei Disco', krtitle: '태양계 디스코', artist: 'ナユタン星人', krartist: '나유탄 성인', part: ['MIKU'], slug: 'taiyoukei-disco', higawari: null, locationgawari: '오사카' },
  { order: 10, title: 'はじめまして地球人さん', title_en: 'Hajimemashite Chikyuujin-san', krtitle: '처음 뵙겠습니다 지구인씨', artist: 'ピノキオピー', krartist: '피노키오피', part: ['MIKU'], slug: 'hajimemashite-chikyuujin', higawari: null, locationgawari: '도쿄' },
  { order: 11, title: 'バニシング', title_en: 'Vanishing', krtitle: '배니싱', artist: 'クチリ', krartist: '구치리', part: ['KAITO'], slug: 'vanish', higawari: null, locationgawari: null },
  { order: 12, title: 'ドクター＝ファンクビート', title_en: 'Doctor=Funk Beat', krtitle: '닥터=펑크비트', artist: 'nyanyannya', krartist: 'nyanyannya', part: ['KAITO'], slug: 'docter-funkbeat', higawari: '낮', locationgawari: null },
  { order: 12, title: 'ビーナス', title_en: 'Venus', krtitle: '금성', artist: '3106.', krartist: '3106.', part: ['KAITO'], slug: 'venus', higawari: '밤', locationgawari: null },
  { order: 13, title: '原点', title_en: 'Genten', krtitle: '원점', artist: '大漠波新', krartist: '다이바쿠하신', part: ['MEIKO'], slug: 'genten', higawari: null, locationgawari: null },
  { order: 14, title: '星空クロノグラフ', title_en: 'Hoshizora Chronograph', krtitle: '별하늘 크로노그래프', artist: 'MINO-U', krartist: 'MINO-U', part: ['MEIKO'], slug: 'hoshizora-chronograph', higawari: '낮', locationgawari: null },
  { order: 14, title: '夜に踊るシルエット', title_en: 'Yoru ni Odoru Silhouette', krtitle: '밤에 춤추는 실루엣', artist: '宮守文学', krartist: '미야모리 분가쿠', part: ['MEIKO'], slug: 'yomau-silhouette', higawari: '밤', locationgawari: null },
  { order: 15, title: 'Flyway', title_en: 'Flyway', krtitle: 'Flyway', artist: 'halyosy', krartist: 'halyosy', part: ['REN', 'KAITO'], slug: 'flyway', higawari: null, locationgawari: null },
  { order: 16, title: 'メテオ', title_en: 'Meteor', krtitle: '메테오', artist: 'じょん', krartist: '존', part: ['MIKU'], slug: 'meteo', higawari: null, locationgawari: null },
  { order: 17, title: 'Starduster', title_en: 'Starduster', krtitle: 'Starduster', artist: 'ジミーサムP', krartist: '지미섬P', part: ['MIKU'], slug: 'starduster', higawari: '낮', locationgawari: null },
  { order: 17, title: 'Last Night, Good Night', title_en: 'Last Night, Good Night', krtitle: 'Last Night, Good Night', artist: 'kz(livetune)', krartist: 'kz(livetune)', part: ['MIKU'], slug: 'last-night-good-night', higawari: '밤', locationgawari: null },
  { order: 18, title: 'METEOR', title_en: 'METEOR', krtitle: 'METEOR', artist: 'DIVELA', krartist: 'DIVELA', part: ['MIKU'], slug: 'meteor', higawari: null, locationgawari: null },
  { order: 19, title: 'StargazeR', title_en: 'StargazeR', krtitle: 'StargazeR', artist: '骨盤P', krartist: '골반P', part: ['MIKU'], slug: 'stargazer', higawari: null, locationgawari: null },
  { order: 20, title: '黙ってロック「を」しろって言ってるんだ、こっちは！', title_en: "Damatte Rock 'wo' Shirotte Itterunda, Kotchi wa!", krtitle: '닥치고 록을 하라고 말하고 있잖아!', artist: '猫田こたつ', krartist: '네코타치 코타츠', part: ['MIKU', 'RIN', 'LUKA', 'MEIKO'], slug: 'dama-rock', higawari: null, locationgawari: null },
  { order: 21, title: 'ブループラネット', title_en: 'Blue Planet', krtitle: '블루 플래닛', artist: 'DECO*27', krartist: 'DECO*27', part: ['MIKU'], slug: 'blue-planet', higawari: null, locationgawari: null },
  { order: 22, title: 'Hand in Hand', title_en: 'Hand in Hand', krtitle: 'Hand in Hand', artist: 'kz(livetune)', krartist: 'kz(livetune)', part: ['MIKU', 'RIN', 'REN', 'LUKA', 'MEIKO', 'KAITO'], slug: 'hand-in-hand', higawari: null, locationgawari: null },
  { order: 23, title: 'ストリートライト', title_en: 'Streetlight', krtitle: '스트리트 라이트', artist: 'ねぎシャワーP', krartist: '네기샤워P', part: ['MIKU', 'RIN', 'REN', 'LUKA', 'MEIKO', 'KAITO'], slug: 'street-light', higawari: null, locationgawari: null },
  { order: 24, title: 'Blessing', title_en: 'Blessing', krtitle: 'Blessing', artist: 'halyosy', krartist: 'halyosy', part: ['MIKU', 'RIN', 'REN', 'LUKA', 'MEIKO', 'KAITO'], slug: 'blessing', higawari: null, locationgawari: null },
  { order: 25, title: 'ラストラス', title_en: 'Lustrous', krtitle: '러스트러스', artist: '*Luna', krartist: '*Luna', part: ['MIKU'], slug: 'lustrous', higawari: null, locationgawari: null },
];

async function main() {
  console.log('🔄 Restoring songs from CSV data...\n');

  let created = 0;
  let updated = 0;

  for (const songData of songs) {
    const existing = await prisma.song.findUnique({
      where: { slug: songData.slug },
    });

    if (existing) {
      await prisma.song.update({
        where: { slug: songData.slug },
        data: {
          title: songData.title,
          krtitle: songData.krtitle,
          artist: songData.artist,
          krartist: songData.krartist,
          part: songData.part,
        },
      });
      console.log(`✓ Updated: ${songData.krtitle || songData.title} (${songData.slug})`);
      updated++;
    } else {
      await prisma.song.create({
        data: {
          title: songData.title,
          krtitle: songData.krtitle,
          artist: songData.artist,
          krartist: songData.krartist,
          slug: songData.slug,
          part: songData.part,
        },
      });
      console.log(`✓ Created: ${songData.krtitle || songData.title} (${songData.slug})`);
      created++;
    }
  }

  console.log('\n📝 Creating SetlistSongs and EventSongVariations...\n');

  await prisma.setlistSong.deleteMany({});
  await prisma.eventSongVariation.deleteMany({});

  const setlistMapping = [
    { id: 1, name: '센다이 세트리 A', location: '센다이', block: '밤' },
    { id: 2, name: '센다이 세트리 B', location: '센다이', block: '낮' },
    { id: 3, name: '오사카 세트리 B', location: '오사카', block: '밤' },
    { id: 4, name: '오사카 세트리 A', location: '오사카', block: '낮' },
    { id: 5, name: '도쿄 세트리 B', location: '도쿄', block: '밤' },
    { id: 6, name: '도쿄 세트리 A', location: '도쿄', block: '낮' },
  ];

  const magicalMiraiEvent = await prisma.event.findUnique({
    where: { slug: 'magical-mirai-2025' },
  });

  if (!magicalMiraiEvent) {
    throw new Error('Magical Mirai 2025 event not found');
  }

  for (const songData of songs) {
    if (songData.higawari || songData.locationgawari) {
      await prisma.eventSongVariation.create({
        data: {
          eventId: magicalMiraiEvent.id,
          songSlug: songData.slug,
          isHigawari: songData.higawari !== null,
          isLocationgawari: songData.locationgawari !== null,
        },
      });
    }
  }

  console.log('✓ Created EventSongVariations\n');

  for (const setlist of setlistMapping) {
    let setlistSongCount = 0;

    for (const songData of songs) {
      const shouldInclude =
        (!songData.higawari && !songData.locationgawari) ||
        (songData.higawari === setlist.block) ||
        (songData.locationgawari === setlist.location);

      if (!shouldInclude) continue;

      const song = await prisma.song.findUnique({
        where: { slug: songData.slug },
      });

      if (!song) continue;

      await prisma.setlistSong.create({
        data: {
          setlistId: setlist.id,
          songId: song.id,
          order: songData.order,
          type: 'song',
        },
      });

      setlistSongCount++;
    }

    console.log(`✓ ${setlist.name}: ${setlistSongCount} songs`);
  }

  console.log('\n✅ Restoration completed!');
  console.log(`  - Songs created: ${created}`);
  console.log(`  - Songs updated: ${updated}`);
  console.log(`  - Total songs: ${songs.length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
