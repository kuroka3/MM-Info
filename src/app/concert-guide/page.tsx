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
    </main>
  );
}
