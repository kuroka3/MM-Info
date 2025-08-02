'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

type Show = { date: string; day: string; block: string; id: string | null };
type Grouped = { date: string; day: string; blocks: { block: string; id: string | null }[] };
type Stage = { [venue: string]: number };

const raw = [
  {
    venue: '센다이',
    shows: [
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

const group = (arr: Show[]): Grouped[] => {
  const m = new Map<string, { day: string; blocks: { block: string; id: string | null }[] }>();
  arr.forEach((s) => {
    if (!m.has(s.date)) m.set(s.date, { day: s.day, blocks: [] });
    m.get(s.date)!.blocks.push({ block: s.block, id: s.id });
  });
  return [...m].map(([date, { day, blocks }]) => ({ date, day, blocks }));
};

export default function Page() {
  const venues = useMemo(() => raw, []);
  const [open, setOpen] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>({});

  const show = (v: string) => {
    setStage((p) => ({ ...p, [v]: 1 }));
    setTimeout(() => setStage((p) => ({ ...p, [v]: 2 })), 70);
    setTimeout(() => setStage((p) => ({ ...p, [v]: 3 })), 140);
  };
  const hide = (v: string) => {
    setStage((p) => ({ ...p, [v]: 2 }));
    setTimeout(() => setStage((p) => ({ ...p, [v]: 1 })), 70);
    setTimeout(() => setStage((p) => ({ ...p, [v]: 0 })), 140);
  };
  const toggle = (v: string) => {
    if (open && open !== v) hide(open);
    open === v ? (hide(v), setOpen(null)) : (setOpen(v), show(v));
  };

  return (
    <main className={`${inter.className} max-w-6xl mx-auto px-6 py-12`}>
      <h1 className="text-center text-4xl sm:text-6xl font-extrabold mb-12">세트리스트</h1>
      <div className="flex flex-col gap-24">
        {venues.map(({ venue, shows }) => {
          const active = open === venue;
          const lvl = stage[venue] ?? 0;
          return (
            <div
              key={venue}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                background: 'rgb(var(--card-rgb))',
                width: active ? '100%' : '18rem',
                margin: active ? 0 : '0 auto',
                transition: 'width .35s ease, margin .35s ease',
                display: 'flex',
                gap: '2rem',
                padding: active ? '2rem' : '0',
              }}
            >
              <button
                onClick={() => toggle(venue)}
                className="flex-none w-72 h-72 flex items-center justify-center bg-[rgba(255,255,255,0.08)]"
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <span
                  className="font-extrabold text-center whitespace-nowrap break-keep"
                  style={{ fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 1 }}
                >
                  {venue}
                </span>
              </button>
              {lvl > 0 && (
                <div
                  className="flex-1 flex flex-col gap-8 justify-center"
                  style={{ opacity: lvl > 0 ? 1 : 0, transition: 'opacity .2s linear' }}
                >
                  {group(shows).map(({ date, day, blocks }) => {
                    const noon = blocks.find((b) => b.block === '낮');
                    const night = blocks.find((b) => b.block === '밤');
                    return (
                      <div
                        key={date}
                        className="grid grid-cols-3 gap-8 items-center"
                        style={{
                          opacity: lvl >= 1 ? 1 : 0,
                          transition: 'opacity .15s linear',
                        }}
                      >
                        <div className="text-center text-lg sm:text-2xl font-semibold whitespace-nowrap">
                          {`${date} (${day})`}
                        </div>
                        {['낮', '밤'].map((t, i) => {
                          const blk = t === '낮' ? noon : night;
                          const filled = blk?.id;
                          return (
                            <div
                              key={t}
                              style={{
                                opacity: lvl >= (i === 0 ? 2 : 3) ? 1 : 0,
                                transition: `opacity .15s linear ${i === 0 ? '.05s' : '.1s'}`,
                              }}
                            >
                              {filled ? (
                                <Link
                                  href={`/concerts/${blk!.id}`}
                                  className="group relative block w-full h-20 sm:h-24 rounded-xl border border-white/70 text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center"
                                >
                                  <span className="relative z-10">{t}</span>
                                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-white/20 opacity-0 group-hover:opacity-100 transition" />
                                </Link>
                              ) : (
                                <span className="block w-full h-20 sm:h-24 rounded-xl border border-white/20 text-gray-400 text-3xl sm:text-4xl font-extrabold flex items-center justify-center">
                                  {t}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
