import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: '오사카 3호관 지도 - 기획전 정보' };

export default function OsakaThirdFloorExhibitionInfoPage() {
  return (
    <main>
      <header className='header'>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="header-title">3호관 지도</h1>
          <p className="header-subtitle">오사카 기획전 - 매지컬 미라이 2025</p>
        </div>
      </header>

      <section id='map' className="info-section">
        <div className="image-map-container" style={{ aspectRatio: 1500 / 1372 }}>
          <Image
            src="https://github.com/kuroka3/MM-Info/blob/master/.github/osaka_assets/map_osaka_ex_floor3_kr.png?raw=true"
            alt="오사카 3호관 지도"
            fill
            priority
            style={{ objectFit: 'contain', borderRadius: '16px' }}
          />
          <a
            href="/magicalmirai/2025/exhibition-info/osaka/creators-market"
            className="image-map-link"
            style={{
              left: '22.13%',
              top: '62.9%',
              width: '35.53%',
              height: '30.69%',
            }}
          />
        </div>
      </section>
    </main>
  );
}