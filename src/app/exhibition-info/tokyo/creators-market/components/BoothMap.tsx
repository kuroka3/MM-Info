'use client';

import {
  useState,
  useRef,
  useEffect,
  Fragment,
  forwardRef,
  useImperativeHandle,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  CSSProperties,
  type ReactNode,
} from 'react';
import useThrottle from '@/hooks/useThrottle';
import Image from 'next/image';
import type { Booth } from '@/types/booth';
import { ROWS, COLS, rowClasses, BOOTHS } from '@/data/exhibition/tokyo/creators-market/booths';
import { jacketSrc, displayBoothId, DAYS } from '@/data/exhibition/tokyo/creators-market/constants';
import { scrollToPosition } from '@/lib/scroll';

interface BoothMapProps {
  selectedDay: (typeof DAYS)[number]['value'];
  onBoothClick: (id: string) => void;
}

export interface BoothMapHandle {
  scrollToMapBooth: (id: string) => Promise<void>;
}

const BOOTHS_MAP: Record<string, Record<number, Booth[]>> = {};
for (const b of BOOTHS) ((BOOTHS_MAP[b.row] ??= {})[b.col] ??= []).push(b);

const findBooth = (row: string, col: number, day: string) => {
  const booths = BOOTHS_MAP[row]?.[col];
  if (!booths) return undefined;
  return booths.find(b => b.dates.includes(day)) ?? booths.find(b => b.hidden);
};

const BoothMap = forwardRef<BoothMapHandle, BoothMapProps>(
  ({ selectedDay, onBoothClick }, ref) => {
    const [prevDay, setPrevDay] = useState(selectedDay);
    const [flippedCells, setFlippedCells] = useState<Set<string>>(new Set());
    const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
          id?: string;
        }
      >(),
    );
    const activeTooltip = useRef<HTMLButtonElement | null>(null);
    const disableScrollHide = useRef(false);


    useEffect(() => {
      const root = document.createElement('div');
      root.style.position = 'absolute';
      root.style.top = '0';
      root.style.left = '0';
      root.style.pointerEvents = 'none';
      root.style.zIndex = '2147483647';
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

    const showTooltip = (el: HTMLButtonElement, allowClick = false) => {
      const root = tooltipRootRef.current;
      if (!root) return;
      const id = el.dataset.boothId!;
      let entry = tooltipMap.current.get(el);
      const found = el.querySelector('.booth-tooltip') as HTMLElement | null;
      if (!entry) {
        if (!found) return;
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.pointerEvents = 'none';
        wrapper.style.overflow = 'hidden';
        const color = getComputedStyle(el).getPropertyValue('--row-color');
        if (color) wrapper.style.setProperty('--row-color', color);
        const tooltip = found.cloneNode(true) as HTMLElement;
        tooltip.style.pointerEvents = 'none';
        wrapper.appendChild(tooltip);
        wrapper.addEventListener('pointerup', e => {
          if (e.pointerType === 'touch') {
            hideTooltip(el);
            const currentId = el.dataset.boothId!;
            onBoothClick(currentId);
          }
        });
        entry = { tooltip, wrapper, id };
        tooltipMap.current.set(el, entry);
        found.style.display = 'none';
      } else if (entry.id !== id) {
        if (found) {
          const newImg = found.querySelector('.tooltip-img') as HTMLImageElement | null;
          const oldImg = entry.tooltip.querySelector('.tooltip-img') as HTMLImageElement | null;
          if (newImg && oldImg) {
            oldImg.src = newImg.src;
            if (newImg.srcset) oldImg.srcset = newImg.srcset;
            if (newImg.sizes) oldImg.sizes = newImg.sizes;
            oldImg.alt = newImg.alt;
          }
          const newTitle = found.querySelector('.tooltip-title') as HTMLElement | null;
          const oldTitle = entry.tooltip.querySelector('.tooltip-title') as HTMLElement | null;
          if (newTitle && oldTitle) oldTitle.textContent = newTitle.textContent;
          entry.id = id;
          found.style.display = 'none';
        }
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
      wrapper.style.pointerEvents = allowClick ? 'auto' : 'none';
      wrapper.style.zIndex = '2147483647';
      tooltip.style.pointerEvents = allowClick ? 'auto' : 'none';
      root.style.pointerEvents = allowClick ? 'auto' : 'none';
      root.appendChild(wrapper);
      activeTooltip.current = el;
      if (allowClick) {
        el.classList.add('touch-glow');
        tooltip.classList.add('touch-glow');
      }

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
      el.classList.remove('touch-glow');
      tooltip.classList.remove('touch-glow');
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
      tooltip.style.pointerEvents = 'none';
      wrapper.style.pointerEvents = 'none';
      if (tooltipRootRef.current) {
        tooltipRootRef.current.style.pointerEvents = 'none';
      }
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translate(-50%, 8px)';
      if (activeTooltip.current === el) activeTooltip.current = null;
    };

    const handleScroll = useThrottle(() => {
      const active = activeTooltip.current;
      if (!active) return;
      if (active.matches(':hover') || disableScrollHide.current) {
        updateTooltipPosition(active);
      } else {
        hideTooltip(active);
      }
    }, 100);

    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
      const handlePointerDown = (e: PointerEvent) => {
        if (e.pointerType !== 'touch') return;
        const target = e.target as HTMLElement;
        if (!target.closest('.booth') && !target.closest('.booth-tooltip')) {
          if (activeTooltip.current) hideTooltip(activeTooltip.current);
        }
      };
      window.addEventListener('pointerdown', handlePointerDown);
      return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    useEffect(() => {
      return () => {
        if (flipTimer.current) window.clearTimeout(flipTimer.current);
      };
    }, []);

    const handleBoothActivation = (
      el: HTMLButtonElement,
      id: string,
      isTouch: boolean,
    ) => {
      if (activeTooltip.current === el) {
        hideTooltip(el);
        onBoothClick(id);
      } else {
        if (activeTooltip.current) hideTooltip(activeTooltip.current);
        if (isTouch) {
          disableScrollHide.current = true;
          window.setTimeout(() => {
            disableScrollHide.current = false;
          }, 600);
        }
        showTooltip(el, isTouch);
        window.setTimeout(() => {
          if (activeTooltip.current === el) hideTooltip(el);
        }, 2000);
      }
    };

    const handleBoothPointerUp = (
      e: ReactPointerEvent<HTMLButtonElement>,
      id: string,
    ) => {
      const el = e.currentTarget;
      if (e.pointerType === 'touch') {
        e.preventDefault();
        handleBoothActivation(el, id, true);
      } else {
        onBoothClick(id);
      }
    };

    const handleBoothClick = (e: ReactMouseEvent<HTMLButtonElement>, id: string) => {
      if (e.detail === 0 || !('PointerEvent' in window)) {
        handleBoothActivation(e.currentTarget, id, false);
      }
    };

    useEffect(() => {
      if (prevDay === selectedDay) return;
      const changed = new Set<string>();
      ROWS.forEach(row => {
        COLS.forEach(col => {
          const prevBooth = findBooth(row, col, prevDay);
          const nextBooth = findBooth(row, col, selectedDay);
          const prevActive = !!(prevBooth && !prevBooth.hidden);
          const nextActive = !!(nextBooth && !nextBooth.hidden);
          if (prevActive !== nextActive) changed.add(`${row}-${col}`);
        });
      });
      setFlippedCells(changed);
      if (flipTimer.current) clearTimeout(flipTimer.current);
      flipTimer.current = setTimeout(() => {
        setFlippedCells(new Set());
        setPrevDay(prev => (prev === selectedDay ? prev : selectedDay));
      }, 600);
      return () => {
        if (flipTimer.current) {
          clearTimeout(flipTimer.current);
          flipTimer.current = null;
        }
      };
    }, [selectedDay, prevDay]);

    const scrollToMapBooth = async (id: string) => {
      const el = boothRefs.current[id];
      if (!el) return;
      const offset = 80;
      const rect = el.getBoundingClientRect();
      let target = rect.top + window.scrollY - offset;

      const hiddenTooltip = el.querySelector('.booth-tooltip') as HTMLElement | null;
      if (hiddenTooltip) {
        const tooltipHeight = hiddenTooltip.offsetHeight;
        const margin = 8;
        const bottomSafe = 80;
        const bottomLimit = window.innerHeight - bottomSafe - margin;
        const boothBottom = offset + rect.height;
        const tipBottom = boothBottom + tooltipHeight + margin;
        if (tipBottom > bottomLimit) {
          target += tipBottom - bottomLimit;
        } else {
          const extra = Math.min(bottomLimit - tipBottom, target);
          target -= extra;
        }
      }

      const dayTabs = document.querySelector('.day-tabs') as HTMLElement | null;
      if (dayTabs) {
        const minTop = dayTabs.getBoundingClientRect().top + window.scrollY;
        if (target < minTop) target = minTop;
      }

      disableScrollHide.current = true;
      await scrollToPosition(target, 400);
      showTooltip(el);
      await new Promise(resolve => requestAnimationFrame(resolve));
      updateTooltipPosition(el);
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 5000);
      setTimeout(() => {
        disableScrollHide.current = false;
        if (!el.matches(':hover')) hideTooltip(el);
      }, 2000);
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
        const displayId = displayBoothId(booth.id);
        const [labelRow, labelCol] = displayId.split('-');
        const labelNode = (
          <span className="booth-label">
            <span>{labelRow}</span>
            <span>-</span>
            <span>{labelCol}</span>
          </span>
        );
        if (interactive) {
          return {
            node: (
              <button
                ref={el => {
                  boothRefs.current[booth.id] = el;
                }}
                className={`booth ${rowClasses[row]} ${booth.span && booth.span > 1 ? 'booth-wide' : ''}`}
                data-booth-id={booth.id}
                onPointerUp={e => handleBoothPointerUp(e, booth.id)}
                onClick={e => handleBoothClick(e, booth.id)}
                onMouseEnter={e => showTooltip(e.currentTarget)}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  setTimeout(() => {
                    if (!el.matches(':hover')) hideTooltip(el);
                  }, 50);
                }}
              >
                {labelNode}
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
            <div className={`booth ${rowClasses[row]} ${booth.span && booth.span > 1 ? 'booth-wide' : ''}`}>
              {labelNode}
            </div>
          ),
          style,
        };
    };

    return (
      <div className="cm-map-wrapper" ref={wrapperRef}>
        <div className="map-inner">
          <div className="cm-grid">
            {ROWS.map(row => (
              <Fragment key={row}>
                {COLS.map(col => {
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
                {(row === 'B' || row === 'D') && <div className="walk-gap" />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

BoothMap.displayName = 'BoothMap';

export default BoothMap;
