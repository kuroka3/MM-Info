import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: '오사카 4호관 지도 - 기획전 정보' };

const booths = [
    {
      "id": 1,
      "name": "bilibiliGoods",
      "content": "「bilibiliGoods」는 동영상 플랫폼 「bilibili」 산하의 굿즈 브랜드입니다. 이번에도 다채로운 신작 시리즈와 함께 「매지컬 미라이 2025」에 출전합니다. 여러분과의 멋진 만남을 진심으로 기대하고 있겠습니다♪",
      "images": [
        "https://pbs.twimg.com/media/Gwq3ZZxbgAMy2Vn?format=jpg&name=large"
      ]
    },
    {
      "id": 2,
      "name": "HMV＆BOOKS",
      "content": "하츠네 미쿠, 매지컬 미라이 관련 CD・DVD・Blu-ray를 판매합니다. 꼭 들러주세요.",
      "images": []
    },
    {
      "id": 3,
      "name": "「매지컬 미라이」 부스 TOKYO MX",
      "content": "하츠네 미쿠 「매지컬 미라이」 Blu-ray & DVD 정보를 전해드립니다! 꼭 들러주세요!",
      "images": []
    },
    {
      "id": 4,
      "name": "유키미쿠 스카이타운 출장소",
      "content": "스카이타운 부스에서는 인기 오리지널 굿즈를 판매합니다. 자세한 내용은 하츠네 미쿠 공식 블로그, 유키미쿠 공식 X 계정 등에서 알려드립니다!",
      "images": []
    },
    {
      "id": 5,
      "name": "크립톤 퓨처 미디어 주식회사 로컬팀",
      "content": "홋카이도에서만 발매 중인 「홋카이도 유키미쿠 쇼콜라 쿠키」를 로컬팀 부스에서 출장 판매! 기념품으로도 추천하는, 눈처럼 부드러운 식감의 과자를 꼭 즐겨보세요. 또한, 본 부스에서는 \"하츠네 미쿠의 창시자\"가 쓴 책 『창작의 미래 「하츠네 미쿠」가 홋카이도에서 태어난 이유』의 특장판도 판매합니다. 또한, 홋카이도 정보 미디어 「Domingo」 공식 X(@cfm_domingo)를 팔로우하면 행사장 한정 『래빗 유키네 스티커』를 선물합니다!",
      "images": []
    },
    {
      "id": 6,
      "name": "DBC／주식회사 다이하츠 비즈니스 서포트 센터",
      "content": "\"평소에 사용하기 쉬운\"을 테마로 한 『하츠네 미쿠 콜라보 카』나 오리지널 굿즈를 제작하는 『DBC』입니다♪ 행사장에서는 새로운 콜라보 카 『미쿠 캔버스 2』의 시승 체험과 신상품 판매를 예정하고 있으니, 편하게 놀러 오세요♪",
      "images": []
    },
    {
      "id": 7,
      "name": "호치 엔터테인먼트 마켓",
      "content": "2014년부터 호치 신문이 발행해 온 타블로이드 신문 「하츠네 미쿠 특별호」에 게재된 5장의 신규 일러스트(KEI 님 2장, U35 님, 시라코무기 님, 타마 님)를 활용한 오리지널 굿즈를 판매. 신규 굿즈로 KEI 님의 하츠네 미쿠와 피아프로 캐릭터즈의 티셔츠, 타월을 새로 발매. 또한 위 인기 일러스트레이터 5명의 미쿠 일러스트를 클리어 카드로 만들었습니다! 화집 「TABLOID MIKU」 구매자에게는 특제 쇼퍼를 증정합니다.",
      "images": [
        "https://pbs.twimg.com/media/GxLA_-1aMAAhnzJ?format=jpg&name=4096x4096"
      ]
    },
    {
      "id": 8,
      "name": "하츠네 미쿠 심포니 2025 ~10th Anniversary~",
      "content": "『하츠네 미쿠 심포니 2025 ~10th Anniversary~』 부스에서는, 하츠네 미쿠 심포니 2025 삿포로, 오사카, 도쿄 공연에서 판매한 굿즈(일부)를 판매합니다.",
      "images": []
    },
    {
      "id": 9,
      "name": "나탈리 스토어",
      "content": "나탈리 스토어 부스에서는, 대인기 「가공의 애니메이션」 시리즈의 신작, 「비밀의 가희 메이린」「괴도 헤븐즈 나이츠」 상품을 선행 판매★ 공식 LINE 친구 등록으로 엽서를, 세금 포함 5,000엔 이상 구매하신 분께는 특제 쇼퍼를 증정합니다!",
      "images": []
    },
    {
      "id": 10,
      "name": "(주)카토 상회",
      "content": "전통 공예품과의 콜라보! 「하츠네 미쿠×코슈 인덴」의 모든 아이템을 전시・판매(일부 상품은 예약 판매)! 또한, 「Dr.가우스＜하츠네 미쿠 ver.＞(시착 가능)」, 오무타츠 님이 그린 일러스트의 오리지널 굿즈도 특별 가격으로 판매합니다. 올해도 구매 특전 있음! 방문 시 꼭 들러주세요!",
      "images": []
    },
    {
      "id": 11,
      "name": "크럭스",
      "content": "크럭스 부스에서는 「클래식 레트로」를 테마로 한 6명의 신규 일러스트 굿즈를 판매합니다. 또한, 과거에 크럭스에서 발매한 신규 일러스트 굿즈 등 다수 아이템을 준비하고 있습니다! 방문 시 꼭 들러주세요!",
      "images": []
    },
    {
      "id": 12,
      "name": "COSPA (코스파)",
      "content": "COSPA의 하츠네 미쿠 《매지컬 미라이 2025》 신규 굿즈는 이쪽! ◆이미지 블루종 ◆츠마마레+스티커 세트 ◆아크릴 아트 스탠드 매지컬 미라이 2025 Ver.+스티커 세트(KEI) 그 외 버추얼 싱어들의 굿즈를 준비하여 부스에서 기다리고 있겠습니다♪",
      "images": []
    },
    {
      "id": 13,
      "name": "디리겐트",
      "content": "디리겐트 부스에서는 「Apple Music + djay」를 사용하여 보컬로이드 곡을 DJ하는 솔루션을 소개. djay의 기본 기능을 잠금 해제할 수 있는 Hercules DJControl Mix Ultara나 Reloop BUDDY / Mixtour Pro를 비롯한 DJ 컨트롤러를 체험할 수 있는 코너를 설치!",
      "images": []
    },
    {
      "id": 14,
      "name": "크립톤 퓨처 미디어 주식회사 디지털 콘텐츠팀",
      "content": "「디지털 콘텐츠팀 공식 X(@cfm_mobile) 팔로우」로 【오리지널 부채】, 「미쿠 내비 체크인 완료」로 【한정 스티커】를 증정! 꼭 부스에 놀러 오세요!",
      "images": []
    },
    {
      "id": 15,
      "name": "크립톤 퓨처 미디어 주식회사 SONICWIRE팀",
      "content": "올봄에 공개된 『하츠네 미쿠 NT (Ver.2)』를 사용한 노랫소리 입력이나, 간단하게 가창 스타일과 뉘앙스를 조작하는 새로운 기능 「Automatic Control」의 효과를 체험! 그 외, 『하츠네 미쿠 NT』나 『피아프로 캐릭터즈 슈퍼 팩』을 비롯한 버추얼 싱어 제품의 특별 판매를 실시합니다.",
      "images": []
    },
    {
      "id": 16,
      "name": "굿스마일 컴퍼니",
      "content": "굿스마일 컴퍼니 부스에서는 『넨도로이드 하츠네 미쿠 매지컬 미라이 2024 Ver.』와 『넨도로이드 하츠네 미쿠 매지컬 미라이 2015 Ver.』를 선행 판매합니다! 여러분의 방문을 기다리고 있습니다.",
      "images": []
    },
    {
      "id": 17,
      "name": "굿스마일 레이싱 (GSR)",
      "content": "\"팬과 함께 달리는\" 레이싱팀, 굿스마일 레이싱(GSR)은 2025년에도 자동차 레이스 「SUPER GT」의 GT300 클래스에 참전하고 있습니다. GSR 부스에서는 SUPER GT에서 실제로 주행하는 레이스 차량 「굿스마일 하츠네 미쿠 AMG」를 전시. 또한, 레이스 앰배서더 유닛 「레이싱 미쿠 서포터즈」도 등장 예정입니다.",
      "images": []
    },
    {
      "id": 18,
      "name": "(주)야마하 뮤직 재팬",
      "content": "보컬로이드 작곡 체험이나 노래 체험, 핑거 드럼 체험 등 초보자도 즐길 수 있는 다양한 체험 콘텐츠를 준비하고 있습니다. (일부 정리권 대응) 전문 스태프가 상주하는 상담 코너도 마련되어 있으니, DTM 등에 관심 있는 분은 꼭 들러주세요!",
      "images": []
    },
    {
      "id": 19,
      "name": "센본자쿠라",
      "content": "올해도 「센본자쿠라」 굿즈를 중심으로 판매하고 있습니다. 스테디셀러 아이템부터 센본자쿠라×전통 공예, 그리고 쿠로우사P의 그 악곡 굿즈가 등장합니다! 최신 정보는 센본자쿠라 공식 X(@senbonshop39)에서 확인해 주세요. 냥본자쿠라의 귀여운 굿즈도 물론 준비되어 있습니다!",
      "images": []
    },
    {
      "id": 20,
      "name": "하츠네 미쿠 MI 카드",
      "content": "미츠코시 이세탄 그룹 「하츠네 미쿠 MI 카드」 부스에서는 카드 입회 접수를 받습니다! 또한, 부스에 있는 QR 코드를 스캔하면 오리지널 굿즈를 증정! 추가로 신청하신 분께는 그 자리에서 오리지널 아크릴 색지를 선물!! 꼭 들러주세요♪",
      "images": []
    },
    {
      "id": 21,
      "name": "보크스",
      "content": "「매지컬 미라이 2025」의 돌용 합피를 판매! 또한, 평소에는 매장에 없는 피아프로 캐릭터즈 관련 상품의 특별 판매 및 전시 등 풍성한 볼거리! 보크스 점포와의 연동 기획 및 최신 정보도 기대해 주세요♪",
      "images": []
    },
    {
      "id": 22,
      "name": "AOZORAGEAR",
      "content": "AOZORAGEAR 부스에서는 일러스트레이터 '사이네' 씨의 신규 일러스트를 사용한 아웃도어 쿠킹 굿즈를 판매합니다. 카레를 맛있게 먹기 위해 고심한 굿즈도! 카레는 마시는 것? 아니요, 아웃도어에서는 진수성찬입니다!",
      "images": []
    },
    {
      "id": 23,
      "name": "COCOLLABO(코코라보)＆SOLWA(솔와)",
      "content": "코코라보 부스에서는 매년 호평을 받고 있는 「하츠네 미쿠×라스칼 2025」「행사장 한정 아이템」 등 신작 아이템을 다수 판매합니다! 매년 항례인 구매 특전 쇼퍼백도 준비♪ SOLWA 신작 아이템 전시도 예정되어 있으니 꼭 들러주세요!",
      "images": [
        "https://pbs.twimg.com/media/GxGAAYkbcAAXWgo?format=jpg&name=4096x4096",
        "https://pbs.twimg.com/media/GxGFX8QacAAPapO?format=jpg&name=4096x4096"
      ]
    },
    {
      "id": 24,
      "name": "와진 팔레트",
      "content": "디자인성과 실용성을 겸비한 아이템을 다수 준비하고 있습니다. 시착도 가능하니 편하게 들러주세요.",
      "images": []
    },
    {
      "id": 25,
      "name": "인형 메이커 Gift",
      "content": "Gift 부스에서는 「매지컬 미라이 2025 인형」 등의 판매를 예정하고 있습니다. 꼭 들러주세요.",
      "images": []
    },
    {
      "id": 26,
      "name": "빨간깃털 공동모금",
      "content": "빨간깃털 공동모금 부스에서는 모금액에 따라 「하츠네 미쿠 클리어파일(오사카 한정 디자인 등)」이나 「핀배지」, 「SONOCA」 등의 모금 노벨티 굿즈를 증정합니다. 행사장에서 모인 모금은 2025년 10월부터 시작되는 빨간깃털 공동모금 운동에 기탁되어 오사카부의 지역 복지 활동에 사용됩니다.",
      "images": []
    },
    {
      "id": 27,
      "name": "Desktop Mate",
      "content": "Steam에서 150만 다운로드를 돌파한 「Desktop Mate」가 매지컬 미라이 2025에 등장! 하츠네 미쿠 「매지컬 미라이 2025 Ver.」 DLC 체험 및 노벨티 배포를 예정하고 있습니다. 당신의 데스크톱을 더욱 즐겁고 특별한 공간으로 만들지 않겠습니까? 부스에서 기다리고 있겠습니다!",
      "images": []
    },
    {
      "id": 28,
      "name": "MIKU ART CHAIR",
      "content": "홋카이도에서 시작. 일본이 세계에 자랑하는 고급 가구 메이커 「CondeHouse」가 \"ART OF MIKU\"와 진심으로 콜라보. 카와무라 코스케, SHETA, 히로세 쇼코——세 명의 현대 아티스트에 의한 하츠네 미쿠가 라운지 체어의 등에 각자의 세계에서 서서, 앉는 사람을 부드럽게 감싸 안습니다. 「앉는다」는 체험 자체가, 미쿠와 만나는 아트가 된다. 꼭, 그 손으로, 그 몸으로, 새로운 하츠네 미쿠를 느끼러 오세요.",
      "images": []
    },
    {
      "id": 29,
      "name": "P&J 주식회사 오사카 영업소",
      "content": "P&J 주식회사 오사카 영업소 부스에서는 『토호쿠 준코・즌다몬 프로젝트』의 굿즈를 판매합니다! 『즌다몬』의 굿즈를 중심으로, 준준 PJ 굿즈를 준비하고 있으니, 꼭 들러주세요!",
      "images": [
        "https://pbs.twimg.com/media/GwnqzCJaAAAbzo9?format=jpg&name=large"
      ]
    },
    {
      "id": 30,
      "name": "프로젝트 세카이 컬러풀 스테이지! feat. 하츠네 미쿠",
      "content": "세가×Colorful Palette가 선사하는 스마트폰용 게임 『프로젝트 세카이 컬러풀 스테이지! feat. 하츠네 미쿠』의 부스입니다. 부스에서는 특별한 벽면 일러스트와 하츠네 미쿠와 사진 촬영을 할 수 있는 전자 패널을 전시합니다. 또한 프로젝트 세카이 앱 화면을 보여주시면 일러스트를 사용한 스티커를 증정!",
      "images": []
    },
    {
      "id": 31,
      "name": "주식회사 세가 페이브",
      "content": "세가 페이브 부스에서는 「매지컬 미라이 2025」의 메인 비주얼을 바탕으로 산가츠 요카 씨가 그린 귀여운 일러스트의 인형을 전시합니다! 그 외에도 최신 상품도 전시 예정! 꼭 방문해 주세요♪",
      "images": []
    },
    {
      "id": 32,
      "name": "주식회사 타이토",
      "content": "타이토 부스에서는 「spiritale」 하츠네 미쿠 피규어의 원형을 전시 예정! 실물을 직접 볼 수 있는 몇 안 되는 기회이니, 꼭 들러주세요!",
      "images": []
    },
    {
      "id": 33,
      "name": "캐릭터펍",
      "content": "올해는 수주 생산으로 벽걸이형 B4 펍 미러, 재고 판매로 코스터 펍 미러와 스탠드형 펍 미러를 전개! 신상품인 스탠드형 펍 미러는 A5 사이즈로 선반에 장식하기 좋을 뿐만 아니라, 벽걸이도 가능한 아이템입니다!",
      "images": []
    },
    {
      "id": 34,
      "name": "무빅",
      "content": "이벤트 공식 비주얼을 사용한 클리어파일 세트, 러버 키홀더, 체키 프린트 등 그 외 다수의 신상품을 준비하여 여러분의 방문을 진심으로 기다리고 있습니다!",
      "images": []
    },
    {
      "id": 35,
      "name": "주식회사 엔도 체인",
      "content": "매지컬 미라이 2025 SENDAI 개최에 맞춰, 「어서오세요 센다이! ~숲의 도시에서 콜라보레이션!~」을 개최! 센다이 비주얼과 즌다 모찌, 사사카마보코 등 센다이・미야기 유카리 상품이 콜라보레이션한 한정 상품을 판매합니다! 구매하시면 센다이벤 코케시 콜라보 엽서를 증정!",
      "images": []
    },
    {
      "id": 36,
      "name": "주식회사 디자인 코코",
      "content": "「매지컬 미라이 2025」 주최 전시에서 전시하는 등신대 입상 하츠네 미쿠가 1/7 스케일 피규어화! 채색 원형을 전시합니다. 예약하고 디자인 코코 부스에 방문하신 분께는 행사장 예약 특전을 증정!",
      "images": []
    },
    {
      "id": 37,
      "name": "아우린 (AURYN)",
      "content": "올해도 신작 가방을 발매 예정!! 그 외에도 첫 공개 & 선행 판매되는 상품을 다수 준비하고 있습니다! 최신 정보는 아우린 공식 X(@auryn_goods)를 체크! 꼭 아우린 부스에 들러주세요♪",
      "images": [
        "https://www.auryn.co.jp/images/20250731_09.jpg",
        "https://www.auryn.co.jp/images/20250731_10.jpg",
        "https://www.auryn.co.jp/images/20250731_11.jpg",
        "https://www.auryn.co.jp/images/20250731_12.jpg",
        "https://pbs.twimg.com/media/GxJoqP5aQAEiwG5?format=jpg&name=large"
      ]
    },
    {
      "id": 38,
      "name": "ETERNO RÉCIT (에테르노 레시)",
      "content": "『매지컬 미라이 2025』에서 하츠네 미쿠가 착용하고 있는 액세서리를 재현한 「이어커프・귀걸이 세트」를 비롯하여, 밤하늘을 이미지하여 디자인된 「아로마 캔들」이나 「컴팩트 월렛」을 판매! 또한 『Glow up』을 테마로 하츠네 미쿠, MEIKO, KAITO, 카가미네 린, 카가미네 렌, 메구리네 루카 6명을 이미지 모델 모티브로 한 신규 일러스트 사용 굿즈와 본격 주얼리 컬렉션을 이벤트 회장에서 선행 전개합니다!",
      "images": []
    },
    {
      "id": 39,
      "name": "하츠네 미쿠×애니메이트 카페-Casual Dessertmaid-",
      "content": "버추얼 싱어를 이미지한 오리지널 메뉴와 굿즈를 판매합니다. 테이타 님(@88_taho)이 그린 캐주얼 메이드풍 일러스트를 대공개♪ 컬러풀하고 귀여운 메뉴와 오리지널 굿즈를 준비하여 여러분을 기다리고 있습니다!",
      "images": [
        "https://pbs.twimg.com/media/GxK6Cc6aIAE0DTF?format=jpg&name=4096x4096"
      ]
    },
    {
      "id": 40,
      "name": "츄러스 제조소",
      "content": "성하일천(세이가잇텐)을 테마로 별 모양을 한 \"별 츄로\"와 핸드 스트랩, 폰탭, 스티커를 전개합니다! 전문점이 만드는 맛있고 귀여운 \"별 츄로\"를 꼭 맛보세요☆",
      "images": []
    },
    {
      "id": 41,
      "name": "(주)반다이",
      "content": "가샤폰 머신에서 피규어를 비롯한 다양한 굿즈를 컬렉션할 수 있는 「아소토」와, 캡슐이 아닌 평면 비주얼 상품으로 나오는 자판기 플랫 가샤폰에서 「클리어 비주얼 포스터」 2상품을 전개합니다. 둘 다 모으고 싶어지는 상품이니 꼭 획득하세요!",
      "images": []
    },
    {
      "id": 42,
      "name": "오사카부 적십자 혈액센터",
      "content": "헌혈에 협력해주신 분께, 마츠우니 님이 그린 행사장 한정 오리지널 하츠네 미쿠 「아크릴 스탠드」를 증정! 또한, 헌혈 웹 서비스 「러브러드」에 등록하시고 (이미 등록하신 분도 포함) 헌혈 예약을 하신 분께는 8월 예약 기념품도 선물! 이 기회에 꼭 헌혈에 협력 부탁드립니다",
      "images": []
    }
  ];

export default function OsakaFourthFloorExhibitionInfoPage() {
  return (
    <main>
      <header className='header'>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="header-title">4호관 지도</h1>
          <p className="header-subtitle">오사카 기획전 - 매지컬 미라이 2025</p>
        </div>
      </header>

      <section id='map' className="info-section">
        <div className="image-map-container" style={{ aspectRatio: 1500 / 906 }}>
          <Image
            src="https://github.com/kuroka3/MM-Info/blob/master/.github/osaka_assets/map_osaka_ex_floor4_kr.png?raw=true"
            alt="오사카 4호관 지도"
            fill
            priority
            style={{ objectFit: 'contain', borderRadius: '16px' }}
          />
          <a
            href="https://magicalmirai.com/2025/goods.html" target='_blank' // Temp redirect
            className="image-map-link"
            style={{
              left: '93.2%',
              top: '10.26%',
              width: '6.27%',
              height: '68.21%',
            }}
          />
        </div>
      </section>

      <nav className='info-nav'>
        <ul>
          {booths.map(booth => (
            <li key={booth.id}><a href={`#${booth.id.toString()}`}>{`${booth.id}. ${booth.name}`}</a></li>
          ))}
        </ul>
      </nav>

      {booths.map(booth => (
        <section id={booth.id.toString()} key={booth.id} className="booth-section">
          <h1 className='booth-section-title'>{`${booth.id}. ${booth.name}`}</h1>
          <p>{booth.content}</p>
          {booth.images.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              {booth.images.map((image, index) => (
                <Image className="booth-image"
                  key={index}
                  src={image}
                  alt={`${booth.name} 이미지 ${index + 1}`}
                  width={500}
                  height={500}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}