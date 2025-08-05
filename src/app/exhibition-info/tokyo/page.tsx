import type { Metadata } from 'next';

export const metadata: Metadata = { title: '도쿄 - 기획전 정보' };

export default function TokyoExhibitionInfoPage() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="header-title">도쿄 기획전 정보</h1>
      <p className="header-subtitle">추가 예정입니다.</p>
    </main>
  );
}
