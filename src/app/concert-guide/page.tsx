import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '공연 가이드' };

export default function ConcertGuidePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">공연 가이드</h1>
          <p className="header-subtitle">하츠네 미쿠 &lt;매지컬 미라이 2025&gt; 공연 정보</p>
        </div>
      </header>

      <nav className="container notice-nav">
        <ul>
          <li>
            <Link href="/concert-guide/important">주의 사항</Link>
          </li>
        </ul>
      </nav>

      <section className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">센다이</h3>
            <div className="feature-list">
              <div className="date-row">
                <span className="header-date">공연이 종료되었습니다.</span>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">오사카</h3>
            <div className="feature-list">
              <div className="date-row">
                <Link
                  href="/exhibition-info/osaka/creators-market"
                  className="header-date"
                >
                  크리마켓 맵
                </Link>
              </div>
            </div>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">도쿄</h3>
            <div className="feature-list">
              <div className="date-row">
                <span className="header-date">추가 예정입니다.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
