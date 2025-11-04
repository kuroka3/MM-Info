import type { Metadata } from 'next';
import NoticeScroll from '@/components/NoticeScroll';
import ScrollTopButton from '@/components/ScrollTopButton';

const sections = [
  {
    id: 'entry',
    title: '입장 안내',
    description:
      '티켓에 기재된 이름과 사진이 있는 신분증을 확인하니 반드시 지참해 주세요. 해외 방문객은 여권 원본을 준비하시고, 현지 예매처 이용 시에는 예매 확인 메일과 결제 카드도 함께 가져오시면 원활합니다.',
    items: [
      '공연장 주변 혼잡을 피하기 위해 지정된 입장 시간에 맞춰 대기열에 합류하세요.',
      '티켓을 여러 장 구매했다면 모든 동행자와 함께 입장 게이트로 이동해야 합니다.',
      '공식 직원의 안내에 따라 휴대용 가방 검사를 진행하며, 반입 금지 물품은 사전에 회수됩니다.',
    ],
  },
  {
    id: 'merch',
    title: '공식 굿즈 부스',
    description:
      'MIKU EXPO ASIA TOUR 2025 굿즈는 각 도시별 한정 상품을 포함합니다. 인기 상품은 조기에 품절될 수 있으니 현장 재고 상황을 안내하는 공지를 주기적으로 확인해 주세요.',
    items: [
      '카드 결제가 어려운 도시가 있으니 현지 통화 현금을 미리 준비하는 것이 좋습니다.',
      '줄서기 규칙과 판매 개시 시간은 도시별로 다를 수 있으므로 공식 SNS 공지를 확인해 주세요.',
      '부스에서 구매한 상품은 교환·환불이 제한되므로 수령 즉시 구성품을 확인해 주세요.',
    ],
  },
  {
    id: 'etiquette',
    title: '콜 & 매너',
    description:
      '콜과 함성이 허용되는 공연이지만 주변 관객을 배려해 주세요. 응원 도구는 공연장을 가리지 않는 범위에서 사용하고, 셀카봉·대형 깃발 등은 사용할 수 없습니다.',
    items: [
      '공연 중에는 플래시 촬영과 동영상 기록이 금지됩니다.',
      '콜 가이드 페이지에서 곡별 응원 타이밍을 확인하고, 안전 요원의 지시에 협조해 주세요.',
      '몸이 좋지 않으면 즉시 가까운 스태프에게 알려 도움을 요청하세요.',
    ],
  },
];

export const metadata: Metadata = {
  title: '주의 사항',
};

export default function ImportantNoticesPage() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1 className="header-title">주의 사항</h1>
          <p className="header-subtitle">하츠네 미쿠 &lt;MIKU EXPO ASIA TOUR 2025&gt; 안내</p>
        </div>
      </header>

      <div className="container notice-alert">
        <a href="#entry">입장 전 꼭 확인하세요</a>
      </div>

      <nav className="container notice-nav">
        <ul>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <NoticeScroll />

      {sections.map(({ id, title, description, items }) => (
        <section key={id} id={id} className="container notice-section">
          <div className="notice-box info-box">
            <h2 className="section-title">{title}</h2>
            <p className="text-left">{description}</p>
            <ul className="notice-list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <ScrollTopButton />
    </main>
  );
}
