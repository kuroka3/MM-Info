'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

type Show = { date: string; day: string; block: string; id: string | null; hidden?: boolean };

type Venue = { venue: string; shows: Show[] };

const raw: Venue[] = [
  {
    venue: '센다이',
    shows: [
      { date: '08/01', day: '금', block: '낮', id: null, hidden: true },
      { date: '08/01', day: '금', block: '밤', id: '1' },
      { date: '08/02', day: '토', block: '낮', id: null },
      { date: '08/02', day: '토', block: '밤', id: null },
      { date: '08/03', day: '일', block: '낮', id: null },
      { date: '08/03', day: '일', block: '밤', id: null },
    ],
  },
  {
    venue: '오사카',
    shows: [
      { date: '08/09', day: '토', block: '낮', id: null },
      { date: '08/09', day: '토', block: '밤', id: null },
      { date: '08/10', day: '일', block: '낮', id: null },
      { date: '08/10', day: '일', block: '밤', id: null },
      { date: '08/11', day: '월', block: '낮', id: null },
      { date: '08/11', day: '월', block: '밤', id: null },
    ],
  },
  {
    venue: '도쿄',
    shows: [
      { date: '08/29', day: '금', block: '낮', id: null },
      { date: '08/29', day: '금', block: '밤', id: null },
      { date: '08/30', day: '토', block: '낮', id: null },
      { date: '08/30', day: '토', block: '밤', id: null },
      { date: '08/31', day: '일', block: '낮', id: null },
      { date: '08/31', day: '일', block: '밤', id: null },
    ],
  },
];

const group = (arr: Show[]) => {
  const map = new Map<string, {
    day: string;
    blocks: { block: string; id: string | null; hidden?: boolean }[];
  }>();
  arr.forEach((s) => {
    if (!map.has(s.date)) map.set(s.date, { day: s.day, blocks: [] });
    map.get(s.date)!.blocks.push({ block: s.block, id: s.id, hidden: s.hidden });
  });
  return [...map].map(([date, { day, blocks }]) => ({ date, day, blocks }));
};

export default function Page() {
  const venues = useMemo(() => raw, []);

  return (
    <main className={inter.className}>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">세트리스트</h1>
          <p className="header-subtitle">공연 회차를 선택하세요</p>
        </div>
      </header>

      <section className="container">
        <div className="features-grid">
          {venues.map(({ venue, shows }) => (
            <div key={venue} className="feature-card">
              <h3 className="feature-title">{venue}</h3>
              <div className="feature-list">
                {group(shows).map(({ date, day, blocks }) => (
                  <div key={date} className="date-row">
                    <span className="header-date">{`${date} (${day})`}</span>
                    <div className="block-buttons">
                      {blocks.map(({ block: t, id, hidden }) =>
                        hidden ? (
                          <span key={t} className="block-placeholder">
                            {t}
                          </span>
                        ) : id ? (
                          <Link
                            key={t}
                            href={`/concerts/${id}`}
                            className="glass-effect block-link"
                          >
                            {t}
                          </Link>
                        ) : (
                          <span key={t} className="glass-effect block-disabled">
                            {t}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
