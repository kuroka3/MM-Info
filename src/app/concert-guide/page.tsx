import type { Metadata } from 'next';

export const metadata: Metadata = { title: '공연 가이드' };

export default function CallGuidePage() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="header-title">공연 가이드</h1>
      <p className="header-subtitle">추가 예정입니다.</p>
    </main>
  );
}
