import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '공연 정보' }

export default function ConcertGuidePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">공연 정보</h1>
          <p className="header-subtitle">
            하츠네 미쿠 &lt;매지컬 미라이 2025&gt; 공연 정보
          </p>
        </div>
      </header>

      <nav className="container notice-nav">
        <ul>
          <li>
            <Link href="/magicalmirai/2025/concert-guide/important">주의 사항</Link>
          </li>
        </ul>
      </nav>

      <section className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">센다이</h3>
            <p className="feature-text">공연이 종료되었습니다.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">오사카</h3>
            <Link
              href="/magicalmirai/2025/exhibition-info/osaka/creators-market"
              className="glass-effect map-link"
            >
              크리에이터즈 마켓 맵
            </Link>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">도쿄</h3>
            <Link
              href="/magicalmirai/2025/exhibition-info/tokyo/creators-market"
              className="glass-effect map-link"
            >
              크리에이터즈 마켓 맵
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
