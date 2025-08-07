'use client';

import {
  useState,
  useLayoutEffect,
  Fragment,
  useRef,
  useEffect,
  CSSProperties,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import Image from 'next/image';
import { ROWS, COLS, rowClasses, BOOTHS, Booth } from './boothData';
import ScrollTopButton from '@/components/ScrollTopButton';
import { scrollToPosition } from '@/lib/scroll';

const DAYS = ['8/9(토)', '8/10(일)', '8/11(월)'] as const;
const COLS_REVERSED = [...COLS].reverse();
const jacketSrc = (id: string) => `/images/osaka/creators-market/cc_${id}.jpg`;
const displayBoothId = (id: string) => id.replace(/[a-z]$/i, '');
const rowColors: Record<string, string> = {
  A: '255,71,133',
  B: '0,122,255',
  C: '255,149,0',
  D: '48,209,88',
  E: '175,82,222',
  F: '94,92,230',
  G: '255,45,85',
};

const dayClass: Record<string, string> = {
  토: 'sat',
  일: 'sun',
  월: 'mon',
};

const BOOTHS_MAP: Record<string, Record<number, Booth>> = {};
for (const b of BOOTHS) (BOOTHS_MAP[b.row] ??= {})[b.col] = b;

const findBooth = (row: string, col: number, day: string) => {
  const booth = BOOTHS_MAP[row]?.[col];
  return booth && booth.dates.includes(day) ? booth : undefined;
};

export default function CreatorsMarketClient() {
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>(DAYS[0]);
  const listRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const boothRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [gutter, setGutter] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRootRef = useRef<HTMLDivElement | null>(null);
  const tooltipMap = useRef(
    new Map<
      HTMLButtonElement,
      {
        tooltip: HTMLElement;
        wrapper: HTMLDivElement;
        hideTimer?: number;
        finish?: () => void;
      }
    >()
  );
  const activeTooltip = useRef<HTMLButtonElement | null>(null);
  const disableScrollHide = useRef(false);
  const touchInfo = useRef<{ target: HTMLButtonElement | null; longPress: boolean; timer: number | null }>({ target: null, longPress: false, timer: null });

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateDividers = () => {
      const parentRect = wrapper.getBoundingClientRect();
      const style = getComputedStyle(wrapper);
      const rightGap = parseFloat(style.paddingRight) || 0;

      Object.values(rowRefs.current).forEach(li => {
        if (!li) return;
        const elRect = li.getBoundingClientRect();
        const offset = elRect.left - parentRect.left;
        const width = parentRect.width - offset - rightGap;

        li.style.setProperty('--divider-left', `${offset}px`);
        li.style.setProperty('--divider-width', `${width}px`);
      });
    };

    updateDividers();
    window.addEventListener('resize', updateDividers);
    return () => {
      window.removeEventListener('resize', updateDividers);
    };
  }, []);


  useEffect(() => {
    const root = document.createElement('div');
    root.style.position = 'absolute';
    root.style.top = '0';
    root.style.left = '0';
    root.style.pointerEvents = 'none';
    root.style.zIndex = '99999';
    document.body.appendChild(root);
    tooltipRootRef.current = root;
    return () => {
      document.body.removeChild(root);
    };
  }, []);

  const updateTooltipPosition = (el: HTMLButtonElement) => {
    const entry = tooltipMap.current.get(el);
    if (!entry) return;
    const { tooltip, wrapper } = entry;
    tooltip.style.pointerEvents = 'none';
    const rect = el.getBoundingClientRect();
    wrapper.style.left = `${rect.left + window.scrollX}px`;
    wrapper.style.top = `${rect.top + window.scrollY}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.height = `${rect.height}px`;
    tooltip.style.left = `${rect.width / 2}px`;
    tooltip.style.top = `calc(100% + 4px)`;
    tooltip.style.bottom = 'auto';
    const r = tooltip.getBoundingClientRect();
    let shift = 0;
    if (r.right > window.innerWidth) shift = window.innerWidth - r.right - 8;
    if (r.left < 0) shift = -r.left + 8;
    tooltip.style.left = `${rect.width / 2 + shift}px`;
    if (r.bottom > window.innerHeight) {
      tooltip.style.top = 'auto';
      tooltip.style.bottom = `calc(100% + 4px)`;
    }
  };

  const showTooltip = (el: HTMLButtonElement) => {
    const root = tooltipRootRef.current;
    if (!root) return;
    let entry = tooltipMap.current.get(el);
    if (!entry) {
      const found = el.querySelector('.booth-tooltip') as HTMLElement | null;
      if (!found) return;
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.pointerEvents = 'none';
      wrapper.style.overflow = 'hidden';
      const tooltip = found.cloneNode(true) as HTMLElement;
      tooltip.style.pointerEvents = 'none';
      wrapper.appendChild(tooltip);
      entry = { tooltip, wrapper };
      tooltipMap.current.set(el, entry);
      found.style.display = 'none';
    }
    const { tooltip, wrapper } = entry;
    if (entry.finish) {
      tooltip.removeEventListener('transitionend', entry.finish);
      entry.finish = undefined;
    }
    if (entry.hideTimer) {
      clearTimeout(entry.hideTimer);
      entry.hideTimer = undefined;
    }
    const rect = el.getBoundingClientRect();
    wrapper.style.left = `${rect.left + window.scrollX}px`;
    wrapper.style.top = `${rect.top + window.scrollY}px`;
    wrapper.style.width = `${rect.width}px`;
    wrapper.style.height = `${rect.height}px`;
    wrapper.style.overflow = 'hidden';
    root.appendChild(wrapper);
    activeTooltip.current = el;

    tooltip.style.position = 'absolute';
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '0';
    tooltip.style.left = `${rect.width / 2}px`;
    tooltip.style.top = `calc(100% + 4px)`;
    tooltip.style.bottom = 'auto';
    tooltip.style.transform = 'translate(-50%, 8px)';
    tooltip.style.transition = 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)';

    requestAnimationFrame(() => {
      updateTooltipPosition(el);
      tooltip.style.transform = 'translate(-50%, 0)';
      tooltip.style.opacity = '1';
      wrapper.style.overflow = 'visible';
    });
  };

  const hideTooltip = (el: HTMLButtonElement) => {
    const entry = tooltipMap.current.get(el);
    if (!entry) return;
    const { tooltip, wrapper } = entry;
    if (entry.finish) {
      tooltip.removeEventListener('transitionend', entry.finish);
    }
    if (entry.hideTimer) {
      clearTimeout(entry.hideTimer);
    }
    const finish = () => {
      tooltip.style.visibility = 'hidden';
      if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
      entry.finish = undefined;
      entry.hideTimer = undefined;
    };
    tooltip.addEventListener('transitionend', finish, { once: true });
    entry.finish = finish;
    entry.hideTimer = window.setTimeout(finish, 350);
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translate(-50%, 8px)';
    if (activeTooltip.current === el) activeTooltip.current = null;
  };

  useEffect(() => {
    const handleScroll = () => {
      const active = activeTooltip.current;
      if (!active) return;
      if (active.matches(':hover') || disableScrollHide.current) {
        updateTooltipPosition(active);
      } else {
        hideTooltip(active);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleTouchMove(e: TouchEvent) {
    const info = touchInfo.current;
    if (!info.longPress) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const booth = el?.closest('button.booth') as HTMLButtonElement | null;
    if (booth !== info.target) {
      if (info.target) hideTooltip(info.target);
      info.target = booth;
      if (booth) showTooltip(booth);
    }
    e.preventDefault();
  }

  const handleTouchStart = (e: ReactTouchEvent<HTMLButtonElement>) => {
    const info = touchInfo.current;
    const target = e.currentTarget;
    info.target = target;
    info.longPress = false;
    if (info.timer) window.clearTimeout(info.timer);
    info.timer = window.setTimeout(() => {
      info.longPress = true;
      showTooltip(target);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }, 200);
  };

  const handleTouchEnd = () => {
    const info = touchInfo.current;
    if (info.timer) window.clearTimeout(info.timer);
    if (info.longPress && info.target) {
      hideTooltip(info.target);
    }
    document.removeEventListener('touchmove', handleTouchMove);
    info.target = null;
    info.longPress = false;
    info.timer = null;
  };

  useLayoutEffect(() => {
    function updateGutter() {
      if (wrapperRef.current) {
        const { width, height } = wrapperRef.current.getBoundingClientRect();
        setGutter(Math.min(width, height) * 0.15);
      }
    }
    updateGutter();
    window.addEventListener('resize', updateGutter);
    return () => window.removeEventListener('resize', updateGutter);
  }, []);

  const scrollToBooth = (id: string) => {
    const el = listRefs.current[id];
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    scrollToPosition(top, 400);
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 3000);
  };

  const scrollToMapBooth = (id: string) => {
    const el = boothRefs.current[id];
    if (!el) return;
    const offset = 80;
    const map = wrapperRef.current;
    disableScrollHide.current = true;
    if (map) {
      const top = map.getBoundingClientRect().top + window.scrollY - offset;
      scrollToPosition(top, 400);
    }
    showTooltip(el);
    el.classList.add('highlight');
    setTimeout(() => {
      disableScrollHide.current = false;
      if (!el.matches(':hover')) hideTooltip(el);
    }, 2000);
    setTimeout(() => {
      el.classList.remove('highlight');
    }, 5000);
  };

  const scrollToRow = (row: string) => {
    const el = rowRefs.current[row];
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    scrollToPosition(top, 400);
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 3000);
  };

  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">Creators Market Map</h1>
          <p className="header-subtitle">오사카 크리에이터즈 마켓 맵</p>
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
                        ref={el => {
                          boothRefs.current[booth.id] = el;
                        }}
                        className={`booth ${rowClasses[row]}`}
                        style={booth.span ? { gridColumn: `span ${booth.span}` } : {}}
                        onClick={() => {
                          if (!touchInfo.current.longPress) scrollToBooth(booth.id);
                        }}
                        onMouseEnter={e => showTooltip(e.currentTarget)}
                        onMouseLeave={e => {
                          const el = e.currentTarget;
                          setTimeout(() => {
                            if (!el.matches(':hover')) hideTooltip(el);
                          }, 50);
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                      >
                        {displayBoothId(booth.id)}
                        <div className="booth-tooltip">
                          <div className="tooltip-img-wrapper">
                            <Image
                              src={jacketSrc(booth.id)}
                              alt={booth.name}
                              width={120}
                              height={120}
                              className="tooltip-img"
                            />
                          </div>
                          <p className="tooltip-title">{booth.koPNames || booth.name}</p>
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

        <nav className="row-nav">
          {ROWS.map(r => (
            <button
              key={r}
              className={`row-nav-btn ${rowClasses[r]}`}
              onClick={() => scrollToRow(r)}
            >
              {r}열
            </button>
          ))}
        </nav>

        <section className="cm-section booth-list-section">
          <h2 className="booth-list-title">Booth List – {selectedDay}</h2>
          <ul className="booth-list">
            {ROWS.map(row => {
              const booths = BOOTHS.filter(
                b => !b.hidden && b.dates.includes(selectedDay) && b.row === row,
              ).sort((a, b) => a.col - b.col);
              if (booths.length === 0) return null;
              return (
                <Fragment key={row}>
                  <li
                    className={`booth-row-header ${rowClasses[row]}`}
                    ref={el => {
                      rowRefs.current[row] = el;
                    }}
                  >
                    {row}
                  </li>
                  {booths.map(booth => (
                    <li
                      key={booth.id}
                      ref={el => {
                        listRefs.current[booth.id] = el;
                      }}
                      className="booth-item"
                      style={{
                        '--row-color': rowColors[booth.row],
                      } as CSSProperties}
                      onClick={e => {
                        if ((e.target as HTMLElement).closest('.member-links')) return;
                        scrollToMapBooth(booth.id);
                      }}
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
                        <p className="booth-item-meta">
                          {displayBoothId(booth.id)}
                          <span className="booth-days">
                            {Array.from(
                              new Set(
                                booth.dates
                                  .map(d => d.match(/\((.)\)/)?.[1])
                                  .filter(Boolean) as string[],
                              ),
                            ).map(day => (
                              <span
                                key={day}
                                className={`booth-day ${dayClass[day] ?? ''}`}
                              >
                                {day}
                              </span>
                            ))}
                          </span>
                        </p>
                        {booth.members.length > 0 && (
                          <ul className="member-list">
                            {booth.members.map(m => (
                              <li key={m.name} className="member-item">
                                <span className="member-name">
                                  {m.name}
                                  {m.koName && m.koName !== m.name && <> ({m.koName})</>}
                                </span>
                                {!!m.links?.length && (
                                  <span className="member-links">
                                    {m.links.map((link, i) => (
                                      <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="member-link"
                                      >
                                        <Image
                                          src="/images/link.svg"
                                          alt=""
                                          width={12}
                                          height={12}
                                        />
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
                </Fragment>
              );
            })}
          </ul>
        </section>
      </div>
      <ScrollTopButton />
    </main>
  );
}
