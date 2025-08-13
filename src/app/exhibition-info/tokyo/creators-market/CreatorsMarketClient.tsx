'use client';

import { useState, useRef } from 'react';
import DayTabs from './components/DayTabs';
import BoothMap, { BoothMapHandle } from './components/BoothMap';
import BoothList, { BoothListHandle } from './components/BoothList';
import { DAYS } from '@/data/exhibition/tokyo/creators-market/constants';
import { ROWS, rowClasses } from '@/data/exhibition/tokyo/creators-market/booths';
import ScrollTopButton from '@/components/ScrollTopButton';

export default function CreatorsMarketClient() {
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]['value']>(
    DAYS[0].value,
  );
  const mapRef = useRef<BoothMapHandle>(null);
  const listRef = useRef<BoothListHandle>(null);
  const [scrollLock, setScrollLock] = useState(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lockScroll = (duration = 600) => {
    setScrollLock(true);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      setScrollLock(false);
      lockTimer.current = null;
    }, duration);
  };

  return (
    <main className="cm-scope">
      {scrollLock && <div className="scroll-blocker" />}
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">Creators Market Map</h1>
          <p className="header-subtitle">도쿄 크리에이터즈 마켓 맵</p>
        </div>
      </header>

      <div className="container cm-main">
        <DayTabs selectedDay={selectedDay} onChange={setSelectedDay} />

        <section className="cm-section map-section">
          <BoothMap
            ref={mapRef}
            selectedDay={selectedDay}
            onBoothClick={(id) => {
              lockScroll();
              listRef.current?.scrollToBooth(id);
            }}
          />
        </section>

        <nav className="row-nav">
          {ROWS.map((r) => (
            <button
              key={r}
              className={`row-nav-btn ${rowClasses[r]}`}
              onClick={() => {
                lockScroll();
                listRef.current?.scrollToRow(r);
              }}
            >
              {r}열
            </button>
          ))}
        </nav>

        <section className="cm-section booth-list-section">
          <BoothList
            ref={listRef}
            selectedDay={selectedDay}
            onBoothClick={(id) => {
              lockScroll();
              mapRef.current?.scrollToMapBooth(id);
            }}
          />
        </section>
      </div>
      <ScrollTopButton />

    </main>
  );
}
