import type { Booth } from '@/types/booth';

const boothsA: Booth[] = [
  {
    id: 'A-1',
    row: 'A',
    col: 1,
    name: 'ピノキオ定食',
    koPNames: '피노키오피',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ピノキオピー',
        koName: '피노키오피',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000236' },
          { label: 'X(Twitter)', url: 'https://x.com/pinocchiop' },
          { label: 'WEB', url: 'https://pinocchiop.com/' },
        ],
      },
    ],
  },
  {
    id: 'A-2',
    row: 'A',
    col: 2,
    name: 'MY SONG IS SHIT',
    koPNames: '우츠P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '鬱P',
        koName: '우츠P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000333' },
          { label: 'X(Twitter)', url: 'https://x.com/utsupii' },
        ],
      },
    ],
  },
  {
    id: 'A-3',
    row: 'A',
    col: 3,
    name: 'かおなしレコード',
    koPNames: '와다 타케아키',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '和田たけあき',
        koName: '와다 타케아키',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000812' },
          { label: 'lit.link', url: 'https://lit.link/wadatakeaki' },
        ],
      },
    ],
  },
  {
    id: 'A-4',
    row: 'A',
    col: 4,
    span: 2,
    name: 'ZLMS',
    koPNames: '지그 / 루완 / 하루마키고한 / 유노스케',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ジグ',
        koName: '지그',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000786' },
          { label: 'X(Twitter)', url: 'https://x.com/z7i9g' },
          { label: 'YouTube', url: 'https://www.youtube.com/zigzag727' },
        ],
      },
      {
        name: '遼遼(a.k.a ルワン)',
        koName: '루완',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000787' },
          { label: 'X(Twitter)', url: 'https://x.com/L0_1N' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Haruka-Ryo' },
        ],
      },
      {
        name: 'はるまきごはん',
        koName: '하루마키고한',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000758' },
          { label: 'X(Twitter)', url: 'https://x.com/harumaki_gohan' },
          { label: 'YouTube', url: 'https://www.youtube.com/c/harumakigohan' },
        ],
      },
      {
        name: '雄之助',
        koName: '유노스케',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000760' },
          { label: 'X(Twitter)', url: 'https://x.com/bass_ynk' },
          { label: 'YouTube', url: 'https://www.youtube.com/user/yunosuke23' },
        ],
      },
    ],
  },
  {
    id: 'A-5',
    row: 'A',
    col: 6,
    name: 'MY SHIP',
    koPNames: 'BCNO',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'BCNO',
        koName: 'BCNO',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001058' },
          { label: 'Linktree', url: 'https://linktr.ee/BCNO' },
        ],
      },
    ],
  },
  {
    id: 'A-6',
    row: 'A',
    col: 7,
    name: '海風太陽',
    koPNames: '해풍태양',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '海風太陽',
        koName: '해풍태양',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001114' },
          { label: 'X(Twitter)', url: 'https://x.com/UmiKazeTaiyouP' },
          { label: 'YouTube', url: 'https://www.youtube.com/@UmikazeTaiyoP' },
        ],
      },
    ],
  },
  {
    id: 'A-7',
    row: 'A',
    col: 8,
    name: '家の裏でマンボウが死んでるP',
    koPNames: '집 뒤에 개복치가 죽어 있어P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '家の裏でマンボウが死んでるP',
        koName: '집 뒤에 개복치가 죽어 있어P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000321' },
          { label: 'WEB', url: 'https://manbo-p.com' },
        ],
      },
    ],
  },
  {
    id: 'A-8',
    row: 'A',
    col: 9,
    name: 'GTども',
    koPNames: '타카피',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'たかぴぃ',
        koName: '타카피',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000770' },
          { label: 'X(Twitter)', url: 'https://x.com/niconico_takap' },
          { label: 'WEB', url: 'https://www.gtcast.com/' },
        ],
      },
    ],
  },
  {
    id: 'A-9',
    row: 'A',
    col: 10,
    name: 'ヤデュクシチャンネル',
    koPNames: '야즈키',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ヤヅキ',
        koName: '야즈키',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/yadukishinya' },
        ],
      },
    ],
  },
  {
    id: 'A-10',
    row: 'A',
    col: 11,
    name: 'やめろ！来るな！',
    koPNames: 'SLAVE.V-V-R',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'SLAVE.V-V-R',
        koName: 'SLAVE.V-V-R',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000905' },
          { label: 'YouTube', url: 'https://www.youtube.com/c/SLAVEVVR_wa_dance_dekirukara' },
        ],
      },
    ],
  },
  {
    id: 'A-11',
    row: 'A',
    col: 12,
    name: '子牛',
    koPNames: '코우시',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '子牛',
        koName: '코우시',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/COWshi504' },
          { label: 'ニコニコ動画', url: 'https://www.nicovideo.jp/user/87549428/video?sortKey=viewCount&sortOrder=desc' },
        ],
      },
    ],
  },
  {
    id: 'A-12',
    row: 'A',
    col: 13,
    name: '南ノ店',
    koPNames: '미나미노미나미',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '南ノ南',
        koName: '미나미노미나미',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001016' },
          { label: 'X(Twitter)', url: 'https://x.com/mnmno373' },
        ],
      },
    ],
  },
  {
    id: 'A-13',
    row: 'A',
    col: 14,
    name: '札幌市吉田区夜世一丁目',
    koPNames: '요시다 야세이',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: '吉田夜世',
        koName: '요시다 야세이',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001039' },
          { label: 'X(Twitter)', url: 'https://x.com/otgys' },
          { label: 'YouTube', url: 'https://www.youtube.com/@YaseiMusic' },
        ],
      },
    ],
  },
  {
    id: 'A-14',
    row: 'A',
    col: 15,
    name: 'ムラサメ',
    koPNames: '무라타 시유우 / 야마사메루이',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ムラタシユウ',
        koName: '무라타 시유우',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001090' },
          { label: 'X(Twitter)', url: 'https://x.com/muratashiyuu' },
          { label: 'WEB', url: 'https://muratashiyuu.studio.site/' },
        ],
      },
      {
        name: '彩雨るい',
        koName: '야마사메루이',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/saiudrop' },
          { label: 'Instagram', url: 'https://www.instagram.com/saiudrop/' },
        ],
      },
    ],
  },
  {
    id: 'A-15',
    row: 'A',
    col: 16,
    name: 'ネネバネバネマレ団',
    koPNames: 'YM',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'YM',
        koName: 'YM',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000507' },
          { label: 'X(Twitter)', url: 'https://x.com/YM_yoshiya' },
          { label: 'YouTube', url: 'https://www.youtube.com/@YM_yoshiya' },
        ],
      },
    ],
  },
  {
    id: 'A-16',
    row: 'A',
    col: 17,
    name: 'BASYAUMA RECORDS',
    koPNames: '*Luna',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: '*Luna',
        koName: '*Luna',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000797' },
          { label: 'WEB', url: 'https://www.ast-luna.com/' },
        ],
      },
    ],
  },
];

const boothsB: Booth[] = [
  {
    id: 'B-1',
    row: 'B',
    col: 1,
    name: 'おだいば',
    koPNames: '대막파신 / Oda Kogane',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '大漠波新',
        koName: '대막파신',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001091' },
          { label: 'X(Twitter)', url: 'https://x.com/Daibakuhasin' },
        ],
      },
      {
        name: 'Oda Kogane',
        koName: 'Oda Kogane',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/oda_koden' },
        ],
      },
    ],
  },
  {
    id: 'B-2',
    row: 'B',
    col: 2,
    name: '宮守文学',
    koPNames: '미야모리 문학',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '宮守文学',
        koName: '미야모리 문학',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000976' },
          { label: 'X(Twitter)', url: 'https://x.com/miyamoribungaku' },
        ],
      },
    ],
  },
  {
    id: 'B-3',
    row: 'B',
    col: 3,
    name: 'らいちょーくらぶ',
    koPNames: '고부스',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ごーぶす',
        koName: '고부스',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000825' },
          { label: 'X(Twitter)', url: 'https://x.com/Chill_with_GoBS' },
        ],
      },
    ],
  },
  {
    id: 'B-4',
    row: 'B',
    col: 4,
    name: 'Retriever Records / buzzG',
    koPNames: 'buzzG',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'buzzG',
        koName: 'buzzG',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000330' },
          { label: 'X(Twitter)', url: 'https://x.com/buzz_g' },
        ],
      },
    ],
  },
  {
    id: 'B-5',
    row: 'B',
    col: 5,
    name: 'ねじ式',
    koPNames: '네지시키 / maigo',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ねじ式',
        koName: '네지시키',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000646' },
          { label: 'WEB', url: 'https://www.nejishiki.com/' },
        ],
      },
      {
        name: 'maigo',
        koName: 'maigo',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/yorunemurenai' },
        ],
      },
    ],
  },
  {
    id: 'B-6',
    row: 'B',
    col: 6,
    name: 'studio ark attack',
    koPNames: 'noa(보카리오도P)',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ぼーかりおどP（noa）',
        koName: 'noa(보카리오도P)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000511' },
          { label: 'X(Twitter)', url: 'https://x.com/vocaliod_P' },
          { label: 'Linktree', url: 'https://linktr.ee/vocaliod_P' },
        ],
      },
    ],
  },
  {
    id: 'B-7',
    row: 'B',
    col: 7,
    name: '音戯噺屋',
    koPNames: 'koushirou（卑屈P）',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'koushirou（卑屈P）',
        koName: 'koushirou（卑屈P）',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000013' },
          { label: 'X(Twitter)', url: 'https://x.com/kou46' },
          { label: 'WEB', url: 'http://jirai8.web.fc2.com/gateway.html' },
        ],
      },
    ],
  },
  {
    id: 'B-8',
    row: 'B',
    col: 8,
    name: 'ぽりふぉ / PolyphonicBranch',
    koPNames: '폴리포(PolyphonicBranch)',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ぽりふぉ',
        koName: '폴리포(PolyphonicBranch)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000377' },
          { label: 'X(Twitter)', url: 'https://x.com/Tomoya_PB' },
        ],
      },
    ],
  },
  {
    id: 'B-9',
    row: 'B',
    col: 9,
    name: 'imie',
    koPNames: 'imie',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'imie',
        koName: 'imie',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000841' },
          { label: 'X(Twitter)', url: 'https://x.com/imieimieimi' },
        ],
      },
    ],
  },
  {
    id: 'B-10',
    row: 'B',
    col: 10,
    name: '薄塩指数',
    koPNames: '얼간지수',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '薄塩指数',
        koName: '얼간지수',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000981' },
          { label: 'Linktree', url: 'https://linktr.ee/usushioshisuu' },
        ],
      },
    ],
  },
  {
    id: 'B-11',
    row: 'B',
    col: 11,
    span: 2,
    name: 'Evergreen Leland Studio',
    koPNames: 'Hevenz / koyori / yukkedolce / HarryP / nogumi',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Heavenz',
        koName: 'Hevenz',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000071' }]
      },
      {
        name: 'koyori(電ポルP)',
        koName: 'koyori',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000235' }]
      },
      {
        name: 'yukkedoluce',
        koName: 'yukkedolce',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000405' }]
      },
      {
        name: '針原翼(はりーP)',
        koName: 'HarryP',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000583' }]
      },
      {
        name: 'nogumi',
        koName: 'nogumi',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000960' },
          { label: 'WEB', url: 'https://www.studio-els.tokyo/' },
        ],
      },
    ],
  },
  {
    id: 'B-12',
    row: 'B',
    col: 13,
    name: 'REONAlD',
    koPNames: '노보루↑',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'のぼる↑',
        koName: '노보루↑',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000129' },
          { label: 'X(Twitter)', url: 'https://x.com/noboru_e' },
          { label: 'YouTube', url: 'https://www.youtube.com/user/noborustudio' },
        ],
      },
    ],
  },
  {
    id: 'B-13',
    row: 'B',
    col: 14,
    name: 'MINO-U+γ',
    koPNames: 'MINO-U / 쿠리야마',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'MINO-U',
        koName: 'MINO-U',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000743' },
          { label: 'X(Twitter)', url: 'https://x.com/MINOU_0831' },
        ],
      },
      {
        name: '栗山',
        koName: '쿠리야마',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/nekota_yama' },
        ],
      },
    ],
  },
  {
    id: 'B-14',
    row: 'B',
    col: 15,
    name: 'るなちゅのアトリエ',
    koPNames: '루나츄',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'るなちゅ',
        koName: '루나츄',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000436' },
          { label: 'YouTube', url: 'https://www.youtube.com/channel/UC6u87yID_t7W6BSyvLBv-Pg' },
        ],
      },
    ],
  },
  {
    id: 'B-15',
    row: 'B',
    col: 16,
    name: 'ちかるとふ',
    koPNames: '치카루토후',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ちかるとふ',
        koName: '치카루토후',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001006' },
          { label: 'X(Twitter)', url: 'https://x.com/CHIKARUTOF' },
        ],
      },
    ],
  },
  {
    id: 'B-16',
    row: 'B',
    col: 17,
    name: 'めろくる',
    koPNames: '메로쿠루',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'めろくる',
        koName: '메로쿠루',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000972' },
          { label: 'X(Twitter)', url: 'https://x.com/Mellowcle' },
          { label: 'YouTube', url: 'http://youtube.com/@Mellowcle' },
        ],
      },
    ],
  },
];

const boothsC: Booth[] = [
  {
    id: 'C-1',
    row: 'C',
    col: 1,
    name: 'ネギシャワーパーティ',
    koPNames: '네기샤워P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '加賀(ネギシャワーP)',
        koName: '네기샤워P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000909' },
          { label: 'X(Twitter)', url: 'https://x.com/kaga_qwerty' },
          { label: 'WEB', url: 'https://www.negishower.com/' },
        ],
      },
    ],
  },
  {
    id: 'C-2',
    row: 'C',
    col: 2,
    span: 2,
    name: 'On Prism Records',
    koPNames: '이루카아이스 / 이치노세루포 / Ponchi♪',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'いるかアイス',
        koName: '이루카아이스',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000894' },
          { label: 'X(Twitter)', url: 'https://x.com/irucaice' },
          { label: 'YouTube', url: 'http://youtube.com/irucaice' },
        ],
      },
      {
        name: '市瀬るぽ',
        koName: '이치노세루포',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000811' },
          { label: 'X(Twitter)', url: 'https://x.com/LUPO_Reportage' },
          { label: 'YouTube', url: 'https://www.youtube.com/c/ichinoselupo' },
        ],
      },
      {
        name: 'Ponchi♪',
        koName: 'Ponchi♪',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000952' },
          { label: 'X(Twitter)', url: 'https://x.com/ponchi_pop' },
          { label: 'YouTube', url: 'https://youtube.com/@ponchi_pop' },
        ],
      },
    ],
  },
  {
    id: 'C-3',
    row: 'C',
    col: 4,
    name: 'GYU P',
    koPNames: 'GYU P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'GYU P',
        koName: 'GYU P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001051' },
          { label: 'X(Twitter)', url: 'https://x.com/GYUP_bokaroP' },
          { label: 'YouTube', url: 'https://www.youtube.com/@gyup_bokaroP' },
        ],
      },
    ],
  },
  {
    id: 'C-4',
    row: 'C',
    col: 5,
    name: 'adomiori',
    koPNames: '아도미오리',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'adomiori(アドミオリ)',
        koName: '아도미오리',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000940' },
          { label: 'X(Twitter)', url: 'https://x.com/Adomiori' },
        ],
      },
    ],
  },
  {
    id: 'C-5',
    row: 'C',
    col: 6,
    name: '歩く人のお店',
    koPNames: '걷는 사람',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '歩く人',
        koName: '걷는 사람',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000792' },
          { label: 'X(Twitter)', url: 'https://x.com/tri_angl_e' },
          { label: 'YouTube', url: 'https://www.youtube.com/c/pedestrianJPN' },
        ],
      },
    ],
  },
  {
    id: 'C-6',
    row: 'C',
    col: 7,
    name: 'SPACELECTRO',
    koPNames: 'SPACELECTRO',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'SPACELECTRO',
        koName: 'SPACELECTRO',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000800' },
          { label: 'WEB', url: 'https://spacelectro.jp' },
        ],
      },
    ],
  },
  {
    id: 'C-7',
    row: 'C',
    col: 8,
    name: 'ベリーイージー',
    koPNames: 'EasyPop',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'EasyPop',
        koName: 'EasyPop',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000336' },
          { label: 'WEB', url: 'https://easypop.jp/' },
        ],
      },
    ],
  },
  {
    id: 'C-8',
    row: 'C',
    col: 9,
    name: 'BIGHEAD',
    koPNames: 'BIGHEAD',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'BIGHEAD',
        koName: 'BIGHEAD',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000685' },
          { label: 'X(Twitter)', url: 'https://x.com/bighead11111' },
          { label: 'YouTube', url: 'https://www.youtube.com/@BIGHEADJP' },
        ],
      },
    ],
  },
  {
    id: 'C-9',
    row: 'C',
    col: 10,
    span: 2,
    name: 'Popism',
    koPNames: 'tekalu / Capchii / Twindfield',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'tekalu',
        koName: 'tekalu',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000932' }]
      },
      {
        name: 'Capchii',
        koName: 'Capchii',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000931' }]
      },
      {
        name: 'Twinfield',
        koName: 'Twindfield',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000912' },
          { label: 'X(Twitter)', url: 'https://x.com/popism_info' },
          { label: 'WEB', url: 'https://popism.info/' },
        ],
      },
    ],
  },
  {
    id: 'C-10',
    row: 'C',
    col: 12,
    name: 'ATOLS',
    koPNames: 'ATOLS',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ATOLS',
        koName: 'ATOLS',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000497' },
          { label: 'X(Twitter)', url: 'https://x.com/ATOLSX' },
        ],
      },
    ],
  },
  {
    id: 'C-11b',
    row: 'C',
    col: 13,
    name: 'keisei',
    koPNames: 'keisei',
    dates: ['8/30(토)'],
    members: [
      {
        name: 'keisei',
        koName: 'keisei',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000729' },
          { label: 'WEB', url: 'https://miraitoarumachi.com' },
        ],
      },
    ],
  },
  {
    id: 'C-11a',
    row: 'C',
    col: 13,
    name: 'しゃいとれこーず',
    koPNames: '샤이토',
    dates: ['8/29(금)', '8/31(일)'],
    members: [
      {
        name: 'しゃいと',
        koName: '샤이토',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000947' },
          { label: 'X(Twitter)', url: 'https://x.com/shaito_otiahs' },
          { label: 'YouTube', url: 'https://www.youtube.com/channel/UC-6CnJA6jkZdv_yfv5KIcDA' },
        ],
      },
    ],
  },
  {
    id: 'C-12',
    row: 'C',
    col: 14,
    name: 'Evelend / 吉田ヨシユキ',
    koPNames: '요시다 요시유키',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: '吉田ヨシユキ',
        koName: '요시다 요시유키',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001082' },
          { label: 'X(Twitter)', url: 'https://x.com/yoshiyuki_eve' },
        ],
      },
    ],
  },
  {
    id: 'C-13',
    row: 'C',
    col: 15,
    name: 'oQ',
    koPNames: 'oQ',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'oQ',
        koName: 'oQ',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000888' },
          { label: 'X(Twitter)', url: 'https://x.com/oQcuu' },
          { label: 'YouTube', url: 'https://www.youtube.com/@oq8388' },
        ],
      },
    ],
  },
  {
    id: 'C-14',
    row: 'C',
    col: 16,
    name: 'JHT STUDIO',
    koPNames: '네코타치 코타츠',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: '猫舘 こたつ',
        koName: '네코타치 코타츠',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001079' },
          { label: 'X(Twitter)', url: 'https://x.com/NKTC_KTT' },
        ],
      },
      { name: 'Ichinoku', links: [{ label: 'X(Twitter)', url: 'https://x.com/Ichino_9' }] },
      { name: '紗凪ふい', links: [{ label: 'X(Twitter)', url: 'https://x.com/sana_fis' }] },
    ],
  },
  {
    id: 'C-15',
    row: 'C',
    col: 17,
    name: 'WONDERFUL OPPORTUNITY',
    koPNames: '마이너스(원더풀 오퍼튜니티)',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      { name: 'じーざす' },
      {
        name: 'マイナス',
        koName: '마이너스(원더풀 오퍼튜니티)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000124' },
          { label: 'X(Twitter)', url: 'https://x.com/WAN_OPO' },
          { label: 'YouTube', url: 'https://www.youtube.com/@WANOPOch' },
          { label: 'WEB', url: 'http://www.wan-opo.com' },
        ],
      },
    ],
  },
];

const boothsD: Booth[] = [
  {
    id: 'D-1',
    row: 'D',
    col: 1,
    name: 'halyosy',
    koPNames: 'halyosy',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'halyosy',
        koName: 'halyosy',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/halyosy' },
          { label: 'WEB', url: 'https://halyosy.com/' },
        ],
      },
    ],
  },
  {
    id: 'D-2',
    row: 'D',
    col: 2,
    name: 'たきだしごはん',
    koPNames: '세키코미고한 / 하이사키 아마네',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'せきこみごはん',
        koName: '세키코미고한',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000927' },
          { label: 'X(Twitter)', url: 'https://x.com/p_akiaki' },
        ],
      },
      {
        name: '灰咲雨音',
        koName: '하이사키 아마네',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/haisakiamane' },
        ],
      },
    ],
  },
  {
    id: 'D-3',
    row: 'D',
    col: 3,
    name: 'ただただだいず',
    koPNames: 'D-D-DICE(打打だいず)',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '打打だいず',
        koName: 'D-D-DICE(打打だいず)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001107' },
          { label: 'X(Twitter)', url: 'https://x.com/DICE__game' },
          { label: 'YouTube', url: 'https://www.youtube.com/@d-d-diceofficial5259' },
        ],
      },
    ],
  },
  {
    id: 'D-4',
    row: 'D',
    col: 4,
    span: 2,
    name: 'NEXTLIGHT',
    koPNames: 'Reno / picco / purini / Mi7s3 / 미츠키쿠라시게',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Reno',
        koName: 'Reno',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000881' },
          { label: 'X(Twitter)', url: 'https://x.com/reno_gtgtgt' },
        ],
      },
      {
        name: 'picco',
        koName: 'picco',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000893' },
          { label: 'X(Twitter)', url: 'https://x.com/picco_xxx' },
        ],
      },
      {
        name: 'purini',
        koName: 'purini',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001111' },
          { label: 'X(Twitter)', url: 'https://x.com/purini_v' },
        ],
      },
      {
        name: 'Mi7s3',
        koName: 'Mi7s3',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001110' },
          { label: 'X(Twitter)', url: 'https://x.com/minase0402' },
        ],
      },
      {
        name: '倉重 みつき',
        koName: '미츠키쿠라시게',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/mi2_ku39' },
          { label: 'WEB', url: 'https://nextlight.io/' },
        ],
      },
    ],
  },
  {
    id: 'D-5',
    row: 'D',
    col: 6,
    name: 'ケチャップ販売員',
    koPNames: '오존',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'オゾン',
        koName: '오존',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000870' },
          { label: 'X(Twitter)', url: 'https://x.com/ozon_541' },
          { label: 'Instagram', url: 'https://www.instagram.com/ozon_541/' },
        ],
      },
      { name: 'れいろう' },
    ],
  },
  {
    id: 'D-6',
    row: 'D',
    col: 7,
    name: 'カガヤ家',
    koPNames: 'Cagayake',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Cagayake',
        koName: 'Cagayake',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001030' },
          { label: 'X(Twitter)', url: 'https://x.com/Cagayakeee' },
          { label: 'YouTube', url: 'https://www.youtube.com/channel/UChkyYk8q6YTGkvrsybY1_Xg' },
        ],
      },
    ],
  },
  {
    id: 'D-7',
    row: 'D',
    col: 8,
    name: 'Blatantly Emotional Records',
    koPNames: '쇼텐타로',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '書店太郎',
        koName: '쇼텐타로',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000857' },
          { label: 'X(Twitter)', url: 'https://x.com/shotenteki_ore' },
          { label: 'YouTube', url: 'https://youtube.com/c/BlatantlyEmotionalRecords' },
        ],
      },
    ],
  },
  {
    id: 'D-8',
    row: 'D',
    col: 9,
    name: 'Wakuwaku Miwaku',
    koPNames: 'Mwk',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Mwk',
        koName: 'Mwk',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000820' },
          { label: 'X(Twitter)', url: 'https://x.com/Mwk_094' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Mwk' },
        ],
      },
    ],
  },
  {
    id: 'D-9',
    row: 'D',
    col: 10,
    name: '幽霊ず',
    koPNames: '유레이 이치모지 / 야미쿠로',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '幽霊一文字',
        koName: '유레이 이치모지',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000649' },
          { label: 'X(Twitter)', url: 'https://x.com/YureiIchimonji' },
        ],
      },
      {
        name: 'やみくろ',
        koName: '야미쿠로',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000656' },
          { label: 'X(Twitter)', url: 'https://x.com/yamichrome' },
        ],
      },
    ],
  },
  {
    id: 'D-10',
    row: 'D',
    col: 11,
    name: 'きさらんどりー',
    koPNames: '키사라',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'きさら',
        koName: '키사라',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000908' },
          { label: 'X(Twitter)', url: 'https://x.com/kisalaundry' },
          { label: 'YouTube', url: 'https://www.youtube.com/@kisalaundry' },
        ],
      },
    ],
  },
  {
    id: 'D-11',
    row: 'D',
    col: 12,
    name: 'マジカルミライの不可避なマジミラ性',
    koPNames: 'Sohbana',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Sohbana',
        koName: 'Sohbana',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001003' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Sohbanasick' },
          { label: 'note', url: 'https://note.com/sohbanasick/n/n94107f9aa585' },
        ],
      },
    ],
  },
  {
    id: 'D-12a',
    row: 'D',
    col: 13,
    name: 'Hylen Lab',
    koPNames: 'Hylen',
    dates: ['8/29(금)', '8/31(일)'],
    members: [
      {
        name: 'Hylen',
        koName: 'Hylen',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001017' },
          { label: 'X(Twitter)', url: 'https://x.com/Hylen_JP' },
          { label: 'WEB', url: 'https://hylenlab.info/' },
        ],
      },
    ],
  },
  {
    id: 'D-12b',
    row: 'D',
    col: 13,
    name: 'フヲルテ',
    koPNames: 'forute(포르테)',
    dates: ['8/30(토)'],
    members: [
      {
        name: 'フヲルテ',
        koName: 'forute(포르테)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000757' },
          { label: 'YouTube', url: 'https://www.youtube.com/@forute' },
        ],
      },
    ],
  },
  {
    id: 'D-13',
    row: 'D',
    col: 14,
    name: 'みなる色の音紡ぎ',
    koPNames: '미나루P',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'みなるP',
        koName: '미나루P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000745' },
          { label: 'X(Twitter)', url: 'https://x.com/minarup' },
        ],
      },
    ],
  },
  {
    id: 'D-14',
    row: 'D',
    col: 15,
    name: 'まにそらマーケット',
    koPNames: 'manika / Iceky',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'manika',
        koName: 'manika',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001087' },
          { label: 'X(Twitter)', url: 'https://x.com/ma_ni_ka_' },
        ],
      },
      {
        name: 'Iceky',
        koName: 'Iceky',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001122' },
          { label: 'X(Twitter)', url: 'https://x.com/flogsing' },
        ],
      },
    ],
  },
  {
    id: 'D-15',
    row: 'D',
    col: 16,
    name: 'やましずく',
    koPNames: '야마△',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'やま△',
        koName: '야마△',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001120' },
          { label: 'X(Twitter)', url: 'https://x.com/shoma1983' },
          { label: 'WEB', url: 'https://hitoyamamusic.com/' },
        ],
      },
    ],
  },
  {
    id: 'D-16',
    row: 'D',
    col: 17,
    name: 'team OS',
    koPNames: '히토시즈쿠P / 스즈노스케 / VAVA',
    dates: ['8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ひとしずくP',
        koName: '히토시즈쿠P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000193' },
          { label: 'X(Twitter)', url: 'https://x.com/samorira9' },
          { label: 'WEB', url: 'https://hitoyamamusic.com/' },
        ],
      },
      {
        name: '鈴ノ助',
        koName: '스즈노스케',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/suzu3939' },
        ],
      },
      {
        name: 'VAVA',
        koName: 'VAVA',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/vavajun' },
        ],
      },
    ],
  },
];

const boothsE: Booth[] = [
  {
    id: 'E-1',
    row: 'E',
    col: 1,
    name: 'シシドサウンドとぐちりずむ',
    koPNames: '구치리 / 시시도',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ぐちり',
        koName: '구치리',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000924' },
          { label: 'X(Twitter)', url: 'https://x.com/bomless_race' },
          { label: 'WEB', url: 'https://bomless-race.theblog.me/' },
        ],
      },
      {
        name: 'シシド',
        koName: '시시도',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000963' },
          { label: 'X(Twitter)', url: 'https://x.com/shishido_4410' },
          { label: 'Linktree', url: 'https://linktr.ee/shishido_4410' },
        ],
      },
    ],
  },
  {
    id: 'E-2',
    row: 'E',
    col: 2,
    name: 'あ子',
    koPNames: '아코',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'あ子',
        koName: '아코',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000838' },
          { label: 'X(Twitter)', url: 'https://x.com/ako_okko' },
          { label: 'YouTube', url: 'https://www.youtube.com/@ako_okko' },
        ],
      },
      {
        name: '葵山わさび',
        koName: '',
        links: [{ label: 'X(Twitter)', url: 'https://x.com/ahowasa86' }],
      },
    ],
  },
  {
    id: 'E-3',
    row: 'E',
    col: 3,
    name: 'EOとナサガシ',
    koPNames: 'EO / 나사가시',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'EO',
        koName: 'EO',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000955' },
          { label: 'X(Twitter)', url: 'https://x.com/eo_aui7740' },
          { label: 'YouTube', url: 'https://www.youtube.com/@eo_aui7740' },
        ],
      },
      {
        name: 'ナサガシ',
        koName: '나사가시',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000996' },
          { label: 'X(Twitter)', url: 'https://x.com/nasagashi' },
          { label: 'YouTube', url: 'https://www.youtube.com/@nasagashi' },
        ],
      },
    ],
  },
  {
    id: 'E-4',
    row: 'E',
    col: 4,
    name: 'ど夏ue',
    koPNames: '도파민 / 나츠야마 요츠기 / Glue',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ど〜ぱみん',
        koName: '도파민',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000957' },
          { label: 'X(Twitter)', url: 'https://x.com/DTM_dopamine' },
          { label: 'YouTube', url: 'https://youtube.com/channel/UCz-IailvAsZZK9_By6ZAnfA?si=29Wz-AkP2lvWOs_U' },
        ],
      },
      {
        name: '夏山よつぎ',
        koName: '나츠야마 요츠기',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000961' },
          { label: 'X(Twitter)', url: 'https://x.com/seckarium' },
          { label: 'YouTube', url: 'https://youtube.com/@seckarium?si=kaFbe_2ZEJjhRK3f' },
        ],
      },
      {
        name: 'Glue',
        koName: 'Glue',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000918' },
          { label: 'X(Twitter)', url: 'https://x.com/_Glu_E_' },
          { label: 'YouTube', url: 'https://youtube.com/@glu_e?si=Htk1sVBRAKtepdpD' },
        ],
      },
    ],
  },
  {
    id: 'E-5',
    row: 'E',
    col: 5,
    name: 'CielP / Le Ciel Bleu',
    koPNames: 'CielP',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'CielP',
        koName: 'CielP',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000163' },
          { label: 'WEB', url: 'https://sound.jp/ciel/' },
        ],
      },
    ],
  },
  {
    id: 'E-6',
    row: 'E',
    col: 6,
    name: 'たけねこれこーず',
    koPNames: '죽순소년',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'タケノコ少年',
        koName: '죽순소년',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000910' },
          { label: 'X(Twitter)', url: 'https://x.com/TA_MOR_I' },
        ],
      },
    ],
  },
  {
    id: 'E-7',
    row: 'E',
    col: 7,
    name: 'ろいどる！',
    koPNames: 'shino',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'shino',
        koName: 'shino',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000816' },
          { label: 'X(Twitter)', url: 'https://x.com/shi_no_music' },
          { label: 'YouTube', url: 'https://www.youtube.com/@shi_no_music' },
        ],
      },
      { name: 'NoNe', links: [{ label: 'X(Twitter)', url: 'https://x.com/NoNeon319' }] },
    ],
  },
  {
    id: 'E-8',
    row: 'E',
    col: 8,
    name: 'studio MURASAKI',
    koPNames: 'MURASAKI',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'MURASAKI',
        koName: 'MURASAKI',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000892' },
          { label: 'X(Twitter)', url: 'https://x.com/yukarinmurasaki' },
        ],
      },
    ],
  },
  {
    id: 'E-9',
    row: 'E',
    col: 9,
    name: 'Shu&VocaGaku',
    koPNames: 'Shu / 오토나시 아후 / 하루마 료키',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Shu',
        koName: 'Shu',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001040' },
          { label: 'X(Twitter)', url: 'https://x.com/shu_horiike' },
        ],
      },
      {
        name: '音無あふ',
        koName: '오토나시 아후',
      },
      {
        name: '春馬崚木',
        koName: '하루마 료키',
        links: [{ label: 'X(Twitter)', url: 'https://x.com/Voca_Gaku' }]
      },
    ],
  },
  {
    id: 'E-10',
    row: 'E',
    col: 10,
    name: 'あいのて',
    koPNames: 'appy',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'appy',
        koName: 'appy',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001036' },
          { label: 'X(Twitter)', url: 'https://x.com/appy_7' },
          { label: 'lit.link', url: 'https://lit.link/appy' },
        ],
      },
    ],
  },
  {
    id: 'E-11',
    row: 'E',
    col: 11,
    name: '阿修トヒライシン',
    koPNames: '阿修 / 히로모토 히라이신',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '阿修',
        koName: '阿修',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001053' },
          { label: 'X(Twitter)', url: 'https://x.com/4syuP' },
        ],
      },
      {
        name: 'ヒロモトヒライシン',
        koName: '히로모토 히라이신',
      },
    ],
  },
  {
    id: 'E-12',
    row: 'E',
    col: 12,
    name: 'はがね・あくタイプ',
    koPNames: '미츠아쿠마 / 후지와라 하가네',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'みつあくま',
        koName: '미츠아쿠마',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000949' },
          { label: 'X(Twitter)', url: 'https://x.com/mitsu_akuma' },
        ],
      },
      {
        name: '藤原ハガネ',
        koName: '후지와라 하가네',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001101' },
          { label: 'X(Twitter)', url: 'https://x.com/fujitetsu8' },
        ],
      },
    ],
  },
  {
    id: 'E-13a',
    row: 'E',
    col: 13,
    name: 'UtopiaLyric',
    koPNames: 'UtopiaLyric',
    dates: ['8/29(금)', '8/30(토)'],
    members: [
      {
        name: 'UtopiaLyric',
        koName: 'UtopiaLyric',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000073' },
          { label: 'X(Twitter)', url: 'https://x.com/UtopiaLyric' },
          { label: 'WEB', url: 'https://utopialyric.xyz/' },
        ],
      },
    ],
  },
  {
    id: 'E-13b',
    row: 'E',
    col: 13,
    name: 'いえぬ',
    koPNames: '이에누',
    dates: ['8/31(일)'],
    members: [
      {
        name: 'いえぬ',
        koName: '이에누',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001005' },
          { label: 'X(Twitter)', url: 'https://x.com/ienu0ienu' },
        ],
      },
    ],
  },
  {
    id: 'E-14b',
    row: 'E',
    col: 14,
    name: '森羅盤商会',
    koPNames: '신라',
    dates: ['8/31(일)'],
    members: [
      {
        name: '森羅',
        koName: '신라',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000827' },
          { label: 'X(Twitter)', url: 'https://x.com/shinra_logic' },
          { label: 'YouTube', url: 'https://www.youtube.com/@shinra_logic' },
        ],
      },
    ],
  },
  {
    id: 'E-14a',
    row: 'E',
    col: 14,
    name: '忘却書店',
    koPNames: '코우',
    dates: ['8/29(금)', '8/30(토)'],
    members: [
      {
        name: 'コウ',
        koName: '코우',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000747' },
          { label: 'X(Twitter)', url: 'https://x.com/kou_shimizu_' },
          { label: 'YouTube', url: 'https://www.youtube.com/@kou_shimizu_' },
        ],
      },
      { name: 'Kakeru' },
      { name: 'りんす' },
      { name: 'ショウ' },
    ],
  },
  {
    id: 'E-15',
    row: 'E',
    col: 15,
    name: 'Past Days Sparkle / ryuryu',
    koPNames: 'ryuryu',
    dates: ['8/30(토)'],
    members: [
      {
        name: 'ryuryu',
        koName: 'ryuryu',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000039' },
          { label: 'X(Twitter)', url: 'https://x.com/ryuryuephemera' },
          { label: 'YouTube', url: 'https://www.youtube.com/channel/UCHlbavmqBTRRr92o76ZaOag' },
        ],
      },
    ],
  },
  {
    id: 'E-16',
    row: 'E',
    col: 16,
    name: '量産型西沢さん。',
    koPNames: 'TOKOTOKO',
    dates: ['8/30(토)'],
    members: [
      {
        name: 'TOKOTOKO（西沢さんP）',
        koName: 'TOKOTOKO',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000231' },
          { label: 'X(Twitter)', url: 'https://x.com/NishizawasanP' },
          { label: 'YouTube', url: 'https://www.youtube.com/c/ZawasoOfficial' },
        ],
      },
    ],
  },
  {
    id: 'E-17',
    row: 'E',
    col: 17,
    name: '一二三中毒',
    koPNames: '히후미',
    dates: ['8/30(토)'],
    members: [
      {
        name: '一二三',
        koName: '히후미',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000794' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Hihumi_v' },
        ],
      },
    ],
  },
];

const boothsF: Booth[] = [
  {
    id: 'F-1',
    row: 'F',
    col: 1,
    name: 'Omoi',
    koPNames: '오모이',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Sakurai',
        koName: '오모이',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000832' },
          { label: 'X(Twitter)', url: 'https://x.com/Omoi3965' },
        ],
      },
    ],
  },
  {
    id: 'F-2',
    row: 'F',
    col: 2,
    name: '錦市場withワイファイSPOT',
    koPNames: '니시키 / 아오와이파이',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '錦',
        koName: '니시키',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000890' },
          { label: 'X(Twitter)', url: 'https://x.com/nishikikn' },
        ],
      },
      {
        name: 'アオワイファイ',
        koName: '아오와이파이',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/ao_WiFi' },
        ],
      },
    ],
  },
  {
    id: 'F-3',
    row: 'F',
    col: 3,
    name: 'ウミノソコ。',
    koPNames: '우니(雲丹)',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: '雲丹',
        koName: '우니(雲丹)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000823' },
          { label: 'X(Twitter)', url: 'https://x.com/sea_urchinP' },
          { label: 'YouTube', url: 'https://www.youtube.com/@uni_kagamine' },
        ],
      },
    ],
  },
  {
    id: 'F-4',
    row: 'F',
    col: 4,
    name: 'the heavenly yard',
    koPNames: 'MONTY_악의P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'mothy_悪ノP',
        koName: 'MONTY_악의P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000037' },
          { label: 'blog', url: 'http://mothy.blog39.fc2.com/' },
        ],
      },
    ],
  },
  {
    id: 'F-5',
    row: 'F',
    col: 5,
    name: 'twinkledisc',
    koPNames: 'Dios/시그널P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Dios/シグナルP',
        koName: 'Dios/시그널P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000007' },
          { label: 'X(Twitter)', url: 'https://x.com/Hiroaki_Arai_' },
          { label: 'WEB', url: 'https://twinkledisc.net/event/' },
        ],
      },
    ],
  },
  {
    id: 'F-6',
    row: 'F',
    col: 6,
    name: 'クリキッド',
    koPNames: '크리스탈P / 키드P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'クリスタルP',
        koName: '크리스탈P',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000017' }]
      },
      {
        name: 'キッド',
        koName: '키드P',
        links: [{ label: 'KARENT', url: 'https://karent.jp/artist/pp000272' }]
      },
    ],
  },
  {
    id: 'F-7',
    row: 'F',
    col: 7,
    name: 'くくく計画',
    koPNames: '에이치',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'えいち(eighch)',
        koName: '에이치',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000991' },
          { label: 'X(Twitter)', url: 'https://x.com/donkakusense' },
        ],
      },
    ],
  },
  {
    id: 'F-8',
    row: 'F',
    col: 8,
    name: 'G.C.M Records',
    koPNames: '안멜츠P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'gcmstyle（アンメルツP）',
        koName: '안멜츠P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000454' },
          { label: 'X(Twitter)', url: 'https://x.com/gcmstyle' },
          { label: 'WEB', url: 'https://www.gcmstyle.com/' },
        ],
      },
    ],
  },
  {
    id: 'F-9',
    row: 'F',
    col: 9,
    name: 'L3Project',
    koPNames: '레레레P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'れれれP',
        koName: '레레레P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000327' },
          { label: 'X(Twitter)', url: 'https://x.com/lelelep' },
          { label: 'WEB', url: 'https://l3project.com/' },
        ],
      },
    ],
  },
  {
    id: 'F-10',
    row: 'F',
    col: 10,
    name: 'がるなん.com',
    koPNames: '가르나(오와타P)',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'ガルナ(オワタP)',
        koName: '가르나(오와타P)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000049' },
          { label: 'X(Twitter)', url: 'https://x.com/tomatowt' },
          { label: 'WEB', url: 'https://garunan.com/' },
        ],
      },
    ],
  },
  {
    id: 'F-11',
    row: 'F',
    col: 11,
    name: '最後の芋会館 2036',
    koPNames: 'IMO / 라디칼P',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'IMO',
        koName: 'IMO',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000942' },
          { label: 'YouTube', url: 'https://www.youtube.com/@IMO_FPotatoP' },
        ],
      },
      {
        name: 'ラディカル',
        koName: '라디칼P',
        links: [
          { label: 'YouTube', url: 'https://t.co/4mDlXwrNja' },
          { label: 'ニコニコ動画', url: 'https://t.co/hPPOAzWmxi' },
        ],
      },
    ],
  },
  {
    id: 'F-12',
    row: 'F',
    col: 12,
    name: 'solidbeats(Re:nG)',
    koPNames: 'Re:nG',
    dates: ['8/29(금)', '8/30(토)', '8/31(일)'],
    members: [
      {
        name: 'Re:nG',
        koName: 'Re:nG',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000041' },
          { label: 'X(Twitter)', url: 'https://x.com/_reng' },
          { label: 'WEB', url: 'https://reng.jp/' },
        ],
      },
    ],
  },
  {
    id: 'F-13a',
    row: 'F',
    col: 13,
    name: 'ツムギ食堂',
    koPNames: 'kijima',
    dates: ['8/29(금)', '8/30(토)'],
    members: [
      {
        name: 'kijima',
        koName: 'kijima',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001025' },
          { label: 'X(Twitter)', url: 'https://x.com/rider_caster' },
          { label: 'WEB', url: 'https://ridercaster0809.wixsite.com/tsumugi-syokudo' },
        ],
      },
    ],
  },
  {
    id: 'F-13b',
    row: 'F',
    col: 13,
    name: '木瀬のんのCD販売所',
    koPNames: '키세논',
    dates: ['8/31(일)'],
    members: [
      {
        name: '木瀬のん',
        koName: '키세논',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001057' },
          { label: 'X(Twitter)', url: 'https://x.com/Xenon54cp' },
          { label: 'ニコニコ動画', url: 'https://www.nicovideo.jp/user/120147810' },
        ],
      },
    ],
  },
  {
    id: 'F-14b',
    row: 'F',
    col: 14,
    name: '3106RecordS',
    koPNames: '3106。(사토루)',
    dates: ['8/31(일)'],
    members: [
      {
        name: '3106。／さとる',
        koName: '3106。(사토루)',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000467' },
          { label: 'X(Twitter)', url: 'https://x.com/3106_com' },
          { label: 'YouTube', url: 'https://www.youtube.com/@3106satoru/videos' },
        ],
      },
    ],
  },
  {
    id: 'F-14a',
    row: 'F',
    col: 14,
    name: 'MUSEBINAKI',
    koPNames: 'mucell / 군조로우',
    dates: ['8/29(금)', '8/30(토)'],
    members: [
      {
        name: 'mucell',
        koName: 'mucell',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001068' },
          { label: 'X(Twitter)', url: 'https://x.com/mucell_' },
        ],
      },
      {
        name: '群青狼',
        koName: '군조로우',
        links: [
          { label: 'X(Twitter)', url: 'https://x.com/Gunjou_row' },
        ],
      },
    ],
  },
  {
    id: 'F-15',
    row: 'F',
    col: 15,
    name: '迷いの森',
    koPNames: '하세가와 마이고',
    dates: ['8/30(토)'],
    members: [
      {
        name: '長谷川迷子',
        koName: '하세가와 마이고',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp001060' },
          { label: 'X(Twitter)', url: 'https://x.com/hourouhekiheki' },
        ],
      },
    ],
  },
  {
    id: 'F-16',
    row: 'F',
    col: 16,
    name: 'nyanyannya（大天才P）',
    koPNames: '대천재P / 요칸코',
    dates: ['8/30(토)'],
    members: [
      {
        name: 'nyanyannya（大天才P）',
        koName: '대천재P',
        links: [
          { label: 'KARENT', url: 'https://karent.jp/artist/pp000651' },
          { label: 'X(Twitter)', url: 'https://x.com/neko_nekokan' },
          { label: 'YouTube', url: 'https://www.youtube.com/channel/UC13cTkDWK6o_TYL2tdtpJHg' },
        ],
      },
      {
        name: '予感子',
        koName: '요칸코',
      },
    ],
  },
  {
    id: 'F-17',
    row: 'F',
    col: 17,
    name: '',
    koPNames: '',
    dates: [],
    members: [],
    hidden: true
  }
];


export const ROWS: string[] = [];
export const COLS: number[] = [];
export const rowClasses: Record<string, string> = {};
export const BOOTHS: Booth[] = [];
export const findBooth = (r: string, c: number): Booth | undefined =>
  BOOTHS.find(b => b.row === r && b.col === c);
export const findBooths = (r: string, c: number): Booth[] =>
  BOOTHS.filter(b => b.row === r && b.col === c);