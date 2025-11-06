import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const songData = [
  { slug: 'hiasobi', title: 'ヒアソビ', krtitle: '히아소비', artist: 'かめりあ', krartist: '카메리아' },
  { slug: 'shinkai-kaibyaku', title: '初音天地開闢神話', krtitle: '하츠네 천지개벽 신화', artist: 'cosMo@暴走P', krartist: 'cosMo@폭주P' },
  { slug: 'antena-39', title: 'アンテナ39', krtitle: '안테나 39', artist: '柊マグネタイト', krartist: '히이라기 마그네타이트' },
  { slug: 'koufuku-anshin', title: 'こちら、幸福安心委員会です。', krtitle: '여기는, 행복안심위원회입니다.', artist: 'うたたP', krartist: '우타타P' },
  { slug: 'maga-maga', title: 'MAGA MAGA', krtitle: 'MAGA MAGA', artist: 'ユーレイ一門寺', krartist: '유레이 이치몬지' },
  { slug: 'hoshikuzu-utopia', title: '星屑ユートピア', krtitle: '별가루 유토피아', artist: 'otetsu', krartist: 'otetsu' },
  { slug: 'batsubyou', title: '抜錨', krtitle: '발묘', artist: 'ナナホシ管弦楽団', krartist: '나나호시 관현악단' },
  { slug: 'lavie', title: 'ラヴィ', krtitle: '라비', artist: 'すりぃ', krartist: '스리이' },
  { slug: 'shoujo-a', title: '少女A', krtitle: '소녀A', artist: '椎名もた', krartist: '시이나 모타' },
  { slug: 'gemini', title: 'ジェミニ', krtitle: '제미니', artist: 'Dixie Flatline', krartist: 'Dixie Flatline' },
  { slug: 'kimipedia', title: 'キミペディア', krtitle: '키미피디아', artist: 'Junky', krartist: 'Junky' },
  { slug: 'one-sixth', title: '1/6 -out of the gravity-', krtitle: '1/6 -out of the gravity-', artist: 'ぼーかりおどP', krartist: '보카리오도P' },
  { slug: 'hitorinbo-envy', title: '独りんぼエンヴィー', krtitle: '혼자 놀이 엔비', artist: 'koyori(電ポルP)', krartist: 'koyori' },
  { slug: 'taiyoukei-disco', title: '太陽系デスコ', krtitle: '태양계 디스코', artist: 'ナユタン星人', krartist: '나유탄 성인' },
  { slug: 'hajimemashite-chikyuujin', title: 'はじめまして地球人さん', krtitle: '처음 뵙겠습니다 지구인씨', artist: 'ピノキオピー', krartist: '피노키오피' },
  { slug: 'vanish', title: 'ヴァニッシュ', krtitle: '배니시', artist: 'クチリ', krartist: '구치리' },
  { slug: 'docter-funkbeat', title: 'ドクター＝ファンクビート', krtitle: '닥터=펑크 비트', artist: 'nyanyannya', krartist: 'nyanyannya' },
  { slug: 'venus', title: 'ビーナス', krtitle: '금성', artist: '3106.', krartist: '3106.' },
  { slug: 'mikaboshi', title: 'みかぼし', krtitle: '미카보시', artist: '3106.', krartist: '3106.' },
  { slug: 'genten', title: 'げんてん', krtitle: '원점', artist: '大漠波新', krartist: '다이바쿠하신' },
  { slug: 'hoshizora-chronograph', title: '星空クロノグラフ', krtitle: '별하늘 크로노그래프', artist: 'MINO-U', krartist: 'MINO-U' },
  { slug: 'yomau-silhouette', title: '夜舞うシルエット', krtitle: '밤에 춤추는 실루엣', artist: '宮守文学', krartist: '미야모리 분가쿠' },
  { slug: 'flyway', title: 'Flyway', krtitle: 'Flyway', artist: 'halyosy', krartist: 'halyosy' },
  { slug: 'meteo', title: 'メテオ', krtitle: '메테오', artist: 'じょん', krartist: '존' },
  { slug: 'starduster', title: 'Starduster', krtitle: 'Starduster', artist: 'ジミーサムP', krartist: '지미섬P' },
  { slug: 'last-night-good-night', title: 'Last Night, Good Night', krtitle: 'Last Night, Good Night', artist: 'kz(livetune)', krartist: 'livetune' },
  { slug: 'meteor', title: 'METEOR', krtitle: 'METEOR', artist: 'DIVELA', krartist: '디벨라' },
  { slug: 'stargazer', title: 'StargazeR', krtitle: 'StargazeR', artist: '骨盤P', krartist: '골반P' },
  { slug: 'dama-rock', title: '黙ってロックをやれって言ってんの！', krtitle: '닥치고 록을 하라고 말하고 있잖아!', artist: '猫田こたつ', krartist: '네코타치 코타츠' },
  { slug: 'blue-planet', title: 'ブループラネット', krtitle: '블루 플래닛', artist: 'DECO*27', krartist: 'DECO*27' },
  { slug: 'hand-in-hand', title: 'Hand in Hand', krtitle: 'Hand in Hand', artist: 'kz(livetune)', krartist: 'livetune' },
  { slug: 'street-light', title: 'ストリートライト', krtitle: '스트리트 라이트', artist: 'ねぎシャワーP', krartist: '네기샤워P' },
  { slug: 'blessing', title: 'Blessing', krtitle: 'Blessing', artist: 'halyosy', krartist: 'halyosy' },
  { slug: 'lustrous', title: 'ラストラス', krtitle: '러스트러스', artist: '*Luna', krartist: '*Luna' },
];

async function main() {
  console.log('🔍 Updating song data from CSV...\n');

  let updated = 0;
  const differences: string[] = [];

  for (const data of songData) {
    const song = await prisma.song.findUnique({
      where: { slug: data.slug },
    });

    if (!song) {
      console.log(`❌ Song not found: ${data.slug}`);
      continue;
    }

    const changes: string[] = [];
    if (song.title !== data.title) {
      changes.push(`title: "${song.title}" → "${data.title}"`);
    }
    if (song.krtitle !== data.krtitle) {
      changes.push(`krtitle: "${song.krtitle}" → "${data.krtitle}"`);
    }
    if (song.artist !== data.artist) {
      changes.push(`artist: "${song.artist}" → "${data.artist}"`);
    }
    if (song.krartist !== data.krartist) {
      changes.push(`krartist: "${song.krartist}" → "${data.krartist}"`);
    }

    if (changes.length > 0) {
      differences.push(`\n${data.krtitle} (${data.slug}):`);
      changes.forEach(c => differences.push(`  - ${c}`));

      await prisma.song.update({
        where: { slug: data.slug },
        data: {
          title: data.title,
          krtitle: data.krtitle,
          artist: data.artist,
          krartist: data.krartist,
        },
      });

      console.log(`✓ Updated: ${data.krtitle}`);
      updated++;
    }
  }

  console.log(`\n✅ Update completed!`);
  console.log(`  - Total songs: ${songData.length}`);
  console.log(`  - Updated: ${updated}`);

  if (differences.length > 0) {
    console.log('\n📝 Changes made:');
    differences.forEach(d => console.log(d));
  } else {
    console.log('\n✨ All song data already matches!');
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
