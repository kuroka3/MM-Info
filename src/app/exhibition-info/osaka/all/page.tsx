import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = { title: '오사카 전체 맵 - 기획전 정보' };



export default function ExhibitionInfoPage() {
  return (
    <main>
      <header className='header'>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="header-title">오사카 전체 지도</h1>
          <p className="header-subtitle">2025년 8월 9일 (토) ~ 8월 11일 (월)</p>
        </div>
      </header>

      {/* <div className="info-section"> */}
        {/* <h1 className="info-section-title">전체 지도</h1> */}
        <div className="image-map-container">
          <Image
            src="https://github.com/kuroka3/MM-Info/blob/master/.github/osaka_assets/map_osaka_all_kr.png?raw=true"
            alt="오사카 전체 맵"
            fill
            priority
            style={{ objectFit: 'contain', borderRadius: '16px' }}
          />
          <a
            href="/concert-guide"
            className="image-map-link"
            style={{
              left: '30.67%',
              top: '2.66%',
              width: '14.33%',
              height: '34.90%',
            }}
          ></a>
          <a
            href="/exhibition-info/osaka/4"
            className="image-map-link"
            style={{
              left: '45.93%',
              top: '2.66%',
              width: '21.53%',
              height: '34.90%',
            }}
          ></a>
          <a
            href="/exhibition-info/osaka/3"
            className="image-map-link"
            style={{
              left: '48.33%',
              top: '54.62%',
              width: '16.73%',
              height: '39.28%',
            }}
          ></a>
        </div>
      {/* </div> */}
    </main>
  );
}