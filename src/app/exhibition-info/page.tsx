import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '기획전 정보' };

export default function ExhibitionInfoPage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">기획전 정보</h1>
          <p className="header-subtitle">하츠네 미쿠 &lt;매지컬 미라이 2025&gt; 기획전 정보</p>
        </div>
      </header>

      <nav className="container info-nav">
        <ul>
          <li>
            <Link href="/exhibition-info/osaka">오사카</Link>
          </li>
          <li>
            <Link href="/exhibition-info/tokyo">도쿄</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
