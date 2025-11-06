import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const summaryUpdates: Record<string, string> = {
  'meteor': '사비 전 <<오~하이>> × 6 \n끝나고 바로 후 사비 직전 <<METEOR>>',
  'hiasobi': '<<텐카시테>>\n<<Woah>>\n<<Yeah>>',
  'antena-39': '<<안테나39하이>>, <<야바이야바이야바이>>,\n<<안타모39하이>>, <<(다)다다라 다라다라단스>>',
  'koufuku-anshin': '사비: 코우후쿠나노와 <<기무난데스>>',
  'batsubyou': '~ 시이라레루노와 <<바츠뵤오>>\n~ 토오자케루노와 <<네츠뵤오>>',
  'lavie': '<<츗 츗 츗>>\n<<야미ー 야미ー 야미ー>>\n<<라비 라비 라비>>\n<<무노ー 무노ー 무노ー>>\n마지막: <<야미ー 야미ー 라비>>',
  'one-sixth': '소코니 이케바 카라다노 오모사모 <<로쿠분노이치>>\n츠라이 코토야 카나시이 코토모 젠부 <<로쿠분노이치>>',
  'taiyoukei-disco': '사비 직전: ~키라메이테, <<세잇!>>\n사비: <<오ー・오・오ー>>\n<<나ー나나 나ー나나 나ー나나 나ー나ー>>\n<<하, 하, 하, 하>>',
  'docter-funkbeat': '오요비카이? / 시아와세카이? <<이에스 마이 도쿠타아>>\n손나 아나타니와 오쿠스리 <<Dumb down>>\n마지쿠? 낫 마지쿠! <<마지쿠? 낫 마지쿠!>>\n루우리에호완인 나이나이다아 <<루우리에호완인 나이나이다아>>\n다이・텐・사이! <<다이・텐・사이!>>',
  'genten': 'Get it. yeah(발음: 겐텐)와 동시에 <<겐텐>>\n동시에 <<키라메쿠 메이코오>>',
  'yomau-silhouette': '~ <<Woah>>\n<<Woah Woah Woah Woah Woah>>\nthat\'s funny <<Woah Woah Woah Woah)>>\n도코마데모 유케루 <<hoo!>> (1~2번째만, 3번째는 X)',
  'dama-rock': '동시에 <<다맛테 록쿠오 야렛테 잇텐노(우탓텐노)>>\n그 후 <<소노토키마데 도오카~>> 부터 끝까지 떼창',
  'blue-planet': '사비: 히비케 <<오 예>> 마와리다스 <<브루 프라넷토>>\n<<마다 이케루카>>\n사비 이후: <<Woah>>\n마지막:  미라이에이고오큐우노 <<파토나>>',
  'hand-in-hand': '인트로: 스네어에 맞춰 <<박수>>\n미쿠와 동시에 <<Hand in Hand!>> 콜\n\'Hand in Hand\'에 맞춰 펜라이트를 ＜→＞＜←＞＜↑＞으로 흔들기,\n그 후 펜라이트를 빙글빙글 돌리고 미쿠 팔 따라 S자로 내리기',
  'street-light': '<<Yeah!>>\n~ <<아아아아아이>>',
  'blessing': '<<Like This Like This Yeah>>\n<<Da da da da da>>\n사비: <<Hip hip HOORAY>>\n<<Blessings for your birthday Blessings for your everyday>>\n펜라이트 흔드는 방향:（Blessings）＜↑＞\n（for your birthday Blessings）＜←＞＜→＞\n（for your everyday）＜←＞＜→＞(2배속),＜↓＞＜↑＞',
};

async function main() {
  console.log('📝 Updating summaries from song_html.txt...\n');

  let updated = 0;
  let notFound = 0;

  for (const [slug, summary] of Object.entries(summaryUpdates)) {
    const song = await prisma.song.findUnique({
      where: { slug },
    });

    if (!song) {
      console.log(`❌ Song not found: ${slug}`);
      notFound++;
      continue;
    }

    const lyrics = song.lyrics as any;
    if (lyrics && typeof lyrics === 'object' && lyrics.summary) {
      lyrics.summary = summary;

      await prisma.song.update({
        where: { slug },
        data: { lyrics },
      });

      console.log(`✓ ${song.krtitle || song.title} (${slug})`);
      updated++;
    } else {
      console.log(`⚠️  ${song.krtitle || song.title} (${slug}) - No lyrics object found`);
    }
  }

  console.log(`\n✅ Update completed!`);
  console.log(`  - Updated: ${updated}`);
  console.log(`  - Not found: ${notFound}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
