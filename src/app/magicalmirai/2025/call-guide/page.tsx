import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '콜 가이드' };

export default function CallGuideHome() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">모드를 선택하세요</p>
        </div>
      </header>
      <section className="container call-guide-entry">
        <Link href="/magicalmirai/2025/call-guide/safe" className="glass-block green">
          <h2>스포 X</h2>
          <p>
            <strong>앨범곡</strong> 중에 콜이 있는 곡만 있는 스포일러 없는 페이지
          </p>
        </Link>
        <Link href="/magicalmirai/2025/call-guide/all" className="glass-block red">
          <h2>스포 O</h2>
          <p>
            공연에 나오는 <strong>모든 곡</strong> 중에 콜이 있는 곡만 있는 페이지
          </p>
        </Link>
      </section>
    </main>
  );
}
