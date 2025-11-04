import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '오사카 - 기획전 정보' };

export default function ExhibitionInfoPage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">오사카 기획전 정보</h1>
          <p className="header-subtitle">2025년 8월 9일 (토) ~ 8월 11일 (월)</p>
        </div>
      </header>

      <nav className="container info-nav">
        <ul>
          <li>
            <Link href="/magicalmirai/2025/exhibition-info/osaka/all">전체 지도</Link>
          </li>
          <li>
            <Link href="/magicalmirai/2025/exhibition-info/osaka/4">4호관 지도</Link>
          </li>
          <li>
            <Link href="/magicalmirai/2025/exhibition-info/osaka/3">3호관 지도</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
