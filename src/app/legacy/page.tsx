import Link from 'next/link';

const legacyLandings = [
  {
    href: '/magicalmirai/2025',
    title: '매지컬 미라이 2025',
    description: '세트리스트, 공연 정보, 콜 가이드 등 2025년 매지컬 미라이 정보모음',
    badge: '마지컬 미라이',
  },
];

export default function LegacyIndexPage() {
  return (
    <main className="legacy-main" aria-labelledby="legacy-title">
      <div className="legacy-wrapper">
        <header className="legacy-header">
          <p className="legacy-eyebrow">ARCHIVE</p>
          <h1 id="legacy-title" className="legacy-title">
            이전 공연 아카이브
          </h1>
          <p className="legacy-description">
            지나간 콘서트들의 정보를 모아두었어요. 아래 카드에서 보고 싶은 공연을 선택해 주세요.
          </p>
        </header>

        <div className="legacy-grid" role="list">
          {legacyLandings.map(({ href, title, description, badge }) => (
            <Link key={href} href={href} className="legacy-card glass-effect" role="listitem">
              <span className="legacy-card-badge">{badge}</span>
              <span className="legacy-card-title">{title}</span>
              <span className="legacy-card-description">{description}</span>
              <span className="legacy-card-link">바로가기 →</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="landing-utility-links" aria-label="보조 링크">
        <Link href="/" className="landing-utility-link glass-effect">
          메인 페이지로
        </Link>
      </div>
    </main>
  );
}
