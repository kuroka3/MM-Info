import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '공연 가이드' };

export default function ConcertGuidePage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">공연 가이드</h1>
          <p className="header-subtitle">공연 정보를 확인하세요</p>
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
