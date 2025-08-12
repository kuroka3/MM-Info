'use client';

import { useState, useRef } from 'react';
import DayTabs from './components/DayTabs';
import BoothMap, { BoothMapHandle } from './components/BoothMap';
import BoothList, { BoothListHandle } from './components/BoothList';
import { DAYS } from '@/data/exhibition/osaka/creators-market/constants';
import { ROWS, rowClasses } from '@/data/exhibition/osaka/creators-market/booths';
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
          <p className="header-subtitle">오사카 크리에이터즈 마켓 맵</p>
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

      <style jsx global>{`
        .cm-scope .cm-section,
        .cm-scope .map-section {
          position: relative !important;
        }
        .cm-scope .cm-map-wrapper {
          box-sizing: border-box !important;
          overflow: hidden !important;
        }
        .cm-scope .cm-grid > * {
          min-width: 0 !important;
          min-height: 0 !important;
        }

        .cm-scope .cm-grid .booth,
        .cm-scope .cm-grid .booth-empty,
        .cm-scope .cm-grid .booth-hidden,
        .cm-scope .cm-grid .walk-gap {
          transform: none !important;
          rotate: 0deg !important;
        }

        @media (max-width: 480px) {
          .cm-scope .map-inner.is-rotated {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) rotate(90deg) !important;
            transform-origin: center !important;
            overflow: hidden !important;
          }
          .cm-scope .map-inner.is-rotated .cm-grid {
            width: 100% !important;
            height: 100% !important;
          }
          .cm-scope .map-inner.is-rotated .cm-grid > * {
            transform: rotate(-90deg) !important;
            transform-origin: center !important;
            transform-box: fill-box !important;
          }
          .cm-scope .map-inner.is-rotated .booth {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transform: none !important;
          }
          .cm-scope .map-inner.is-rotated .booth .booth-tooltip {
            writing-mode: horizontal-tb !important;
            text-orientation: mixed !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}
