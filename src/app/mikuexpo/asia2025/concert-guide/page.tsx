import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '공연 가이드' }

export default function ConcertGuidePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">공연 가이드</h1>
          <p className="header-subtitle">
            하츠네 미쿠 &lt;MIKU EXPO ASIA TOUR 2025&gt; 공연 정보
          </p>
        </div>
      </header>

      <nav className="container notice-nav">
        <ul>
          <li>
            <Link href="/mikuexpo/asia2025/concert-guide/important">주의 사항</Link>
          </li>
        </ul>
      </nav>

      <section className="container">
        <div className="features-grid">
          <div className="feature-card">
            <h3 className="feature-title">투어 일정</h3>
            <p className="feature-text">MIKU EXPO ASIA TOUR 2025 회차 정보를 정리하고 있어요.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">지역별 공지</h3>
            <p className="feature-text">현지 운영 안내와 입장 규칙은 추후 업데이트될 예정입니다.</p>
          </div>

          <div className="feature-card">
            <h3 className="feature-title">콜 &amp; 매너</h3>
            <p className="feature-text">콜 가이드 페이지에서 응원 타이밍과 주의 사항을 확인하세요.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
