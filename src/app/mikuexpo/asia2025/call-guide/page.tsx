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
        <Link href="/mikuexpo/asia2025/call-guide/safe" className="glass-block green">
          <h2>테마곡</h2>
          <p>
            <strong>테마곡</strong>이 있고, 커스텀으로 곡을 추가할 수 있는 <strong>스포 X</strong> 페이지
          </p>
        </Link>
        <Link href="/mikuexpo/asia2025/call-guide/all" className="glass-block red">
          <h2>모든 곡</h2>
          <p>
            세트리 곡들을 포함한 콜이 있는 <strong>모든 곡</strong>이 있는 <strong>스포 O</strong> 페이지
          </p>
        </Link>
      </section>
    </main>
  );
}
