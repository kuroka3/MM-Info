'use client';

import { useState, useEffect, useLayoutEffect, Fragment, useRef } from 'react';
import Image from 'next/image';
import { ROWS, COLS, rowClasses, BOOTHS, Booth } from './boothData';
import ScrollTopButton from '@/components/ScrollTopButton';
import { scrollToPosition } from '@/lib/scroll';

const DAYS = ['8/9(토)', '8/10(일)', '8/11(월)'] as const;
const COLS_REVERSED = [...COLS].reverse();
const jacketSrc = (id: string) => `/images/osaka/creators-market/CC_${id}.jpg`;

const BOOTHS_MAP: Record<string, Record<number, Booth>> = {};
for (const b of BOOTHS) (BOOTHS_MAP[b.row] ??= {})[b.col] = b;

const findBooth = (row: string, col: number, day: string) => {
  const booth = BOOTHS_MAP[row]?.[col];
  return booth && booth.dates.includes(day) ? booth : undefined;
};

export default function CreatorsMarketClient() {
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>(DAYS[0]);
  const [gutter, setGutter] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useLayoutEffect(() => {
    function updateGutter() {
      if (wrapperRef.current) {
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        setGutter(Math.min(width, height) * 0.12);
      }
    }
    updateGutter();
    window.addEventListener('resize', updateGutter);
    return () => window.removeEventListener('resize', updateGutter);
  }, []);

  const scrollTo = (id: string) => {
    const el = listRefs.current[id];
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    scrollToPosition(top, 400);
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 2000);
  };

  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">Creators Market Map</h1>
        </div>
      </header>

      <div className="container cm-main">
        <nav className="day-tabs">
          {DAYS.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={d === selectedDay ? 'active' : ''}
            >
              {d}
            </button>
          ))}
        </nav>

      <section className="cm-section">
        <div className="cm-map-wrapper" ref={wrapperRef}>
          <svg className="map-arrow exit" viewBox="0 0 32 32">
            <path d="M30 16H4M16 4l-12 12 12 12" />
          </svg>

          <svg className="map-arrow entrance" viewBox="0 0 32 32">
            <path d="M16 30V4M4 16l12-12 12 12" />
          </svg>
          <div className="entrance-label">입구</div>

          <div className="cm-grid">
            {ROWS.map(row => (
              <Fragment key={row}>
                {COLS_REVERSED.map(col => {
                  if (row === 'A' && col === 12) {
                    return (
                      <div key="exit-cell" className="exit-label-cell">
                        출구
                      </div>
                    );
                  }
                  const booth = findBooth(row, col, selectedDay);
                    const prevSpan =
                      col > 1 && findBooth(row, col - 1, selectedDay)?.span;
                    if (!booth && prevSpan) return null;
                    if (!booth) return <div key={`x-${row}-${col}`} className="booth-empty">✕</div>;
                    if (booth.hidden) {
                      return (
                        <div
                          key={booth.id}
                          className="booth-hidden"
                          style={booth.span ? { gridColumn: `span ${booth.span}` } : {}}
                        />
                      );
                    }
                    if (booth.span && col !== booth.col) return null;

                    return (
                      <button
                        key={booth.id}
                        className={`booth ${rowClasses[row]}`}
                        style={booth.span ? { gridColumn: `span ${booth.span}` } : {}}
                        onClick={() => scrollTo(booth.id)}
                      >
                        {booth.id}
                        <div className="booth-tooltip">
                          <div className="tooltip-img-wrapper">
                            <Image
                              src={jacketSrc(booth.id)}
                              alt={booth.name}
                              width={120}
                              height={120}
                              className="tooltip-img"
                              style={{ position: 'relative', width: '100%', height: '100%' }}
                            />
                          </div>
                          <p className="tooltip-title">{booth.name}</p>
                        </div>
                      </button>
                    );
                  })}
                {(row === 'A' || row === 'C' || row === 'E') && <div className="walk-gap" />}
              </Fragment>
            ))}
          </div>

          <div
            className="bottom-left-mask-box"
            style={{
              width: `calc(100% - ${gutter}px)`,
              height: `calc(100% - ${gutter}px)`,
            }}
          />
        </div>
      </section>

        <section className="cm-section booth-list-section">
          <h2 className="booth-list-title">Booth List – {selectedDay}</h2>
          <ul className="booth-list">
            {BOOTHS.filter(b => !b.hidden && b.dates.includes(selectedDay))
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(booth => (
                <li
                  key={booth.id}
                  ref={el => {
                    listRefs.current[booth.id] = el;
                  }}
                  className="booth-item"
                >
                  <Image
                    src={jacketSrc(booth.id)}
                    alt={booth.name}
                    width={96}
                    height={96}
                    className="booth-item-img"
                  />
                  <div>
                    <h3 className="booth-item-title">
                      {booth.name}
                      {booth.koPNames && <> ({booth.koPNames})</>}
                    </h3>
                    <p className="booth-item-meta">{booth.id}</p>
                    {booth.members.length > 0 && (
                      <ul className="member-list">
                        {booth.members.map(m => (
                          <li key={m.name} className="member-item">
                            <span className="member-name">{m.name}</span>
                            {m.links?.length && (
                              <span className="member-links">
                                {m.links.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Image src="/images/link.svg" alt="" width={12} height={12} />
                                    {link.label}
                                  </a>
                                ))}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        </section>
      </div>
      <ScrollTopButton />
    </main>
  );
}
