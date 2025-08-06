'use client';

import { useState, Fragment, useRef } from 'react';
import Image from 'next/image';
import {
  ROWS, COLS, rowClasses,
  BOOTHS, Booth
} from './boothData';
import ScrollTopButton from '@/components/ScrollTopButton';

/* ---------- 상수 ---------- */
const DAYS = ['8/9(토)', '8/10(일)', '8/11(월)'] as const;
const COLS_REVERSED = [...COLS].reverse();
const jacketSrc = (id: string) =>
  `/images/osaka/creators-market/CC_${id}.jpg`;

/* ---------- 부스 맵 ---------- */
const BOOTHS_MAP: Record<string, Record<number, Booth>> = {};
for (const b of BOOTHS) (BOOTHS_MAP[b.row] ??= {})[b.col] = b;

const findBooth = (row: string, col: number, day: string) => {
  const booth = BOOTHS_MAP[row]?.[col];
  return booth && booth.dates.includes(day) ? booth : undefined;
};

/* ---------- 컴포넌트 ---------- */
export default function CreatorsMarketClient() {
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>(DAYS[0]);
  const listRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const scrollTo = (id: string) =>
    listRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main>
      {/* ---------- 인라인 CSS (후에 분리예정) ---------- */}
      <style jsx>{`
        /* 전역 glass·색상은 globals.css 변수 사용 */
        .day-tabs {
          display: flex; justify-content: center; gap: 1rem; margin: 2rem 0;
        }
        .day-tabs button {
          font-size: 1.15rem; padding: .6rem 1.4rem;
          border-radius: 9999px; border: none;
          background: var(--glass-bg); color: #fff;
          backdrop-filter: blur(10px); cursor: pointer;
          transition: background .2s;
        }
        .day-tabs button.active { background: rgba(255,255,255,.25); font-weight: 700; }

        .cm-map-wrapper{
          position:relative; padding:1.5rem;
          background:var(--glass-bg); backdrop-filter:blur(10px);
          border:1px solid var(--glass-border); border-radius:16px;
        }
        /* 안쪽(Inner) 보더 – 출·입구 쪽은 투명하여 뚫림 효과 */
        .cm-map-wrapper::after{
          content:''; pointer-events:none; position:absolute; inset:8px;
          border:2px solid rgba(255,255,255,.6);
          border-left-color:transparent;       /* 출구(A-12) */
          border-bottom-color:transparent;     /* 입구(G-1) */
          border-radius:12px;
        }

        /* 출구(←) A-12 왼쪽 / 입구(↑) G-1 아래 */
        .map-arrow{ position:absolute; fill:none; stroke:#fff; stroke-width:2; width:32px; height:32px;}
        .map-arrow.exit{ top:0.4rem; left:-18px; transform:none; }
        .map-arrow.entrance{ bottom:-18px; right:0.4rem; transform:none; }

.cm-grid{
  display:grid;
  grid-template-columns:repeat(12,minmax(0,1fr));

  /* ── 변경 사항 ── */
  column-gap:0;         /* 열 사이 간격 0   */
  row-gap:2px;          /* 행 사이(= 복도 제외) 최소 2px */
  padding:2px;          /* 그리드와 테두리 사이 간격을 2px로 맞춤 */
}


        /* ===== 셀 스타일 ===== */
        .booth{
          position:relative; font-weight:700; font-size:.95rem;
          padding:.55rem .2rem; border-radius:8px; text-align:center;
          background:rgba(255,255,255,.12); color:#fff; cursor:pointer;
          column-gap: 0;
        }
        .booth:hover .booth-tooltip{ opacity:1; visibility:visible; }

        .booth-empty{
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.04);
          border:1px dashed rgba(255,255,255,.18);
          border-radius:8px; padding:.3rem 0;
          font-size:1rem; color:rgba(255,255,255,.28);
          column-gap: 0;
        }
        .booth-hidden{ background:transparent; }

        /* Tooltip */
        .booth-tooltip{
          position:absolute; z-index:10; left:50%; top:104%;
          transform:translateX(-50%); white-space:nowrap;
          padding:.7rem; border-radius:12px;
          background:rgba(255,255,255,.22); backdrop-filter:blur(8px);
          opacity:0; visibility:hidden; transition:.2s ease;
        }
        .tooltip-img{ border-radius:8px; margin-bottom:.25rem; }
        .tooltip-title{ font-size:.9rem; font-weight:600; }

        /* walkway */
        .walk-gap{ height:10px; grid-column:1/-1; }

        /* ===== 리스트 ===== */
        .booth-list{ display:flex; flex-direction:column; gap:1.25rem; margin-top:2rem; }
        .booth-item{
          display:flex; gap:1rem; padding:1rem;
          background:rgba(255,255,255,.17); border-radius:16px; backdrop-filter:blur(10px);
        }
        .booth-item-img{ border-radius:12px; width:96px; height:96px; object-fit:cover; }
        .booth-item-title{ font-size:1.1rem; font-weight:700; margin:0 0 .3rem; }
        .booth-item-meta{ font-size:.88rem; opacity:.8; margin:0 0 .5rem; }
        .member-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.25rem; }
        .member-item{ font-size:.83rem; display:flex; justify-content:space-between; }
        .member-links a{ margin-left:.4rem; display:inline-flex; align-items:center; gap:.2rem; font-size:.78rem; color:#fff; text-decoration:none; }
      `}</style>

      {/* ---------- 헤더 ---------- */}
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">Creators Market Map</h1>
        </div>
      </header>

      <div className="container cm-main">
        {/* ---------- 날짜 탭 ---------- */}
        <nav className="day-tabs">
          {DAYS.map(d => (
            <button key={d} onClick={() => setSelectedDay(d)} className={d === selectedDay ? 'active' : ''}>{d}</button>
          ))}
        </nav>

        {/* ---------- 부스 맵 ---------- */}
        <section className="cm-section">
          <div className="cm-map-wrapper">
            <svg className="map-arrow exit" viewBox="0 0 32 32"><path d="M30 16H4M16 4l-12 12 12 12" /></svg>
            <svg className="map-arrow entrance" viewBox="0 0 32 32"><path d="M16 30V4M4 16l12-12 12 12" /></svg>

            <div className="cm-grid">
              {ROWS.map(row => (
                <Fragment key={row}>

                  {COLS_REVERSED.map(col => {
                    const booth = findBooth(row, col, selectedDay);
                    const prevSpan = col > 1 && findBooth(row, col - 1, selectedDay)?.span;
                    if (!booth && prevSpan) return null;
                    if (!booth) return <div key={`x-${row}-${col}`} className="booth-empty">✕</div>;
                    if (booth.hidden) return <div key={booth.id} className="booth-hidden" style={booth.span ? { gridColumn: `span ${booth.span}` } : {}} />;
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
                          <Image src={jacketSrc(booth.id)} alt={booth.name} width={120} height={120} className="tooltip-img" />
                          <p className="tooltip-title">{booth.name}</p>
                        </div>
                      </button>
                    );
                  })}
                  {/* 복도 */}
                  {row === 'A' || row === 'C' || row === 'E' ? <div className="walk-gap" /> : null}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 부스 리스트 ---------- */}
        <section className="cm-section booth-list-section">
          <h2 className="booth-list-title">Booth List – {selectedDay}</h2>
          <ul className="booth-list">
            {BOOTHS
              .filter(b => !b.hidden && b.dates.includes(selectedDay))
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(booth => (
                <li key={booth.id} ref={el => { listRefs.current[booth.id] = el; }} className="booth-item">
                  <Image src={jacketSrc(booth.id)} alt={booth.name} width={96} height={96} className="booth-item-img" />
                  <div>
                    <h3 className="booth-item-title">{booth.name}{booth.koPNames && <> ({booth.koPNames})</>}</h3>
                    <p className="booth-item-meta">{booth.id}</p>
                    {booth.members.length > 0 && (
                      <ul className="member-list">
                        {booth.members.map(m => (
                          <li key={m.name} className="member-item">
                            <span className="member-name">{m.name}</span>
                            {m.links?.length && (
                              <span className="member-links">
                                {m.links.map((link, i) => (
                                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                                    <Image src="/images/link.svg" alt="" width={12} height={12} />{link.label}
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
