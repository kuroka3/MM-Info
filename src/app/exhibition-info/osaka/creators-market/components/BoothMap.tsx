'use client';

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
  CSSProperties,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import Image from 'next/image';
import type { Booth } from '@/types/booth';
import { ROWS, COLS, rowClasses, BOOTHS } from '@/data/exhibition/osaka/creators-market/booths';
import { jacketSrc, displayBoothId, DAYS } from '@/data/exhibition/osaka/creators-market/constants';
import { scrollToPosition } from '@/lib/scroll';

interface BoothMapProps {
  selectedDay: (typeof DAYS)[number]['value'];
  onBoothClick: (id: string) => void;
}

export interface BoothMapHandle {
  scrollToMapBooth: (id: string) => void;
}

const COLS_REVERSED = [...COLS].reverse();
const BOOTHS_MAP: Record<string, Record<number, Booth>> = {};
for (const b of BOOTHS) (BOOTHS_MAP[b.row] ??= {})[b.col] = b;

const findBooth = (row: string, col: number, day: string) => {
  const booth = BOOTHS_MAP[row]?.[col];
  return booth && booth.dates.includes(day) ? booth : undefined;
};

const BoothMap = forwardRef<BoothMapHandle, BoothMapProps>(
  ({ selectedDay, onBoothClick }, ref) => {
  const [prevDay, setPrevDay] = useState(selectedDay);
  const [flippedCells, setFlippedCells] = useState<Set<string>>(new Set());
  const flipTimer = useRef<number>();
  const boothRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
    >(),
  );
  const activeTooltip = useRef<HTMLButtonElement | null>(null);
  const disableScrollHide = useRef(false);
  const touchInfo = useRef<{
    target: HTMLButtonElement | null;
    longPress: boolean;
    timer: number | null;
  }>({ target: null, longPress: false, timer: null });
  const [gutter, setGutter] = useState(0);

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
    tooltip.style.transition =
      'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)';

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

  useEffect(() => {
    return () => {
      if (flipTimer.current) window.clearTimeout(flipTimer.current);
    };
  }, []);

  useEffect(() => {
    const changed = new Set<string>();
    ROWS.forEach(row => {
      COLS_REVERSED.forEach(col => {
        const prevBooth = findBooth(row, col, prevDay);
        const nextBooth = findBooth(row, col, selectedDay);
        const prevActive = !!(prevBooth && !prevBooth.hidden);
        const nextActive = !!(nextBooth && !nextBooth.hidden);
        if (prevActive !== nextActive) {
          changed.add(`${row}-${col}`);
        }
      });
    });
    setFlippedCells(changed);
    if (flipTimer.current) window.clearTimeout(flipTimer.current);
    flipTimer.current = window.setTimeout(() => {
      setFlippedCells(new Set());
      setPrevDay(selectedDay);
    }, 600);
  }, [selectedDay, prevDay]);

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

  useImperativeHandle(ref, () => ({ scrollToMapBooth }));

  const renderCell = (
    row: string,
    col: number,
    day: (typeof DAYS)[number]['value'],
    interactive: boolean,
  ): { node: ReactNode; style?: CSSProperties } => {
    const booth = findBooth(row, col, day);
    const prevSpan = col > 1 && findBooth(row, col - 1, day)?.span;
    if (!booth && prevSpan) return { node: null };
    if (!booth) return { node: <div className="booth-empty">✕</div> };
    if (booth.hidden) {
      return {
        node: <div className="booth-hidden" />,
        style: booth.span ? { gridColumn: `span ${booth.span}` } : undefined,
      };
    }
    if (booth.span && col !== booth.col) return { node: null };
    const style = booth.span ? { gridColumn: `span ${booth.span}` } : undefined;
    if (interactive) {
      return {
        node: (
          <button
            ref={el => {
              boothRefs.current[booth.id] = el;
            }}
            className={`booth ${rowClasses[row]}`}
            onClick={() => {
              if (!touchInfo.current.longPress) onBoothClick(booth.id);
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
        ),
        style,
      };
    }
    return {
      node: (
        <div className={`booth ${rowClasses[row]}`}>{displayBoothId(booth.id)}</div>
      ),
      style,
    };
  };

  return (
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
              const key = `${row}-${col}`;
              const flipping = flippedCells.has(key);
              const front = renderCell(row, col, prevDay, false);
              const back = renderCell(row, col, selectedDay, true);
              if (!front.node && !back.node) return null;
              const style = back.style || front.style;
              if (flipping && front.node && back.node) {
                return (
                  <div key={key} className="flip-card flipping" style={style}>
                    <div className="flip-inner">
                      <div className="flip-front">{front.node}</div>
                      <div className="flip-back">{back.node}</div>
                    </div>
                  </div>
                );
              }
              const content = back.node ?? front.node;
              if (!content) return null;
              return (
                <div key={key} style={style}>
                  {content}
                </div>
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
  );
});

BoothMap.displayName = 'BoothMap';

export default BoothMap;
