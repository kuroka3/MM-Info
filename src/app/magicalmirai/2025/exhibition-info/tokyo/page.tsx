import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '도쿄 - 기획전 정보' };

export default function TokyoExhibitionInfoPage() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">도쿄 기획전 정보</h1>
          <p className="header-subtitle">2025년 8월 29일 (금) ~ 8월 31일 (일)</p>
        </div>
      </header>

      <nav className="container info-nav">
        <ul>
          <li>
            <Link href="/magicalmirai/2025/exhibition-info/tokyo/creators-market">크리에이터즈 마켓 맵</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
