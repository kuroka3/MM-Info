import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: '오사카 전체 지도 - 기획전 정보' };



export default function OsakaAllMapExhibitionInfoPage() {
  return (
    <main>
      <header className='header'>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="header-title">전체 지도</h1>
          <p className="header-subtitle">오사카 기획전 - 매지컬 미라이 2025</p>
        </div>
      </header>

      {/* <div className="info-section"> */}
        {/* <h1 className="info-section-title">전체 지도</h1> */}
        <div className="image-map-container" style={{ aspectRatio: 1500 / 639 }}>
          <Image
            src="https://github.com/kuroka3/MM-Info/blob/master/.github/osaka_assets/map_osaka_all_kr.png?raw=true"
            alt="오사카 전체 지도"
            fill
            priority
            style={{ objectFit: 'contain', borderRadius: '16px' }}
          />
          <a
            href="/magicalmirai/2025/concert-guide"
            className="image-map-link"
            style={{
              left: '30.67%',
              top: '2.66%',
              width: '14.33%',
              height: '34.90%',
            }}
          />
          <a
            href="/magicalmirai/2025/exhibition-info/osaka/4"
            className="image-map-link"
            style={{
              left: '45.93%',
              top: '2.66%',
              width: '21.53%',
              height: '34.90%',
            }}
          />
          <a
            href="/magicalmirai/2025/exhibition-info/osaka/3"
            className="image-map-link"
            style={{
              left: '48.33%',
              top: '54.62%',
              width: '16.73%',
              height: '39.28%',
            }}
          />
        </div>
      {/* </div> */}
    </main>
  );
}