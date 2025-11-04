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

      <section className="container">
        <div className="feature-card">
          <h3 className="feature-title">MIKU EXPO 2025 ASIA 공식 안내</h3>
          <p className="feature-text">
            최신 공연 공지와 도시별 정보를 공식 사이트에서 확인하세요.
          </p>
          <a
            href="https://mikuexpo.com/asia2025/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-effect block-link"
          >
            MIKU EXPO 2025 ASIA 공식사이트 바로가기
          </a>
        </div>
      </section>
    </main>
  )
}
