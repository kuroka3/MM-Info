'use client';

import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  Fragment,
  CSSProperties,
  useCallback,
} from 'react';
import useThrottle from '@/hooks/useThrottle';
import Image from 'next/image';
import { ROWS, rowClasses, BOOTHS } from '@/data/exhibition/tokyo/creators-market/booths';
import {
  jacketSrc,
  displayBoothId,
  rowColors,
  dayClass,
  DAYS,
} from '@/data/exhibition/tokyo/creators-market/constants';
import { scrollToPosition } from '@/lib/scroll';

interface BoothListProps {
  selectedDay: (typeof DAYS)[number]['value'];
  onBoothClick: (id: string) => void;
}

export interface BoothListHandle {
  scrollToBooth: (id: string) => void;
  scrollToRow: (row: string) => void;
}

const BoothList = forwardRef<BoothListHandle, BoothListProps>(
  ({ selectedDay, onBoothClick }, ref) => {
  const listRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const updateDividers = useCallback(() => {
    const wrapper = document.querySelector('.cm-map-wrapper') as HTMLDivElement | null;
    if (!wrapper) return;
    const parentRect = wrapper.getBoundingClientRect();
    const style = getComputedStyle(wrapper);
    const rightGap = parseFloat(style.paddingRight) || 0;
    const maxWidth = Math.min(parentRect.width, window.innerWidth);
    Object.values(rowRefs.current).forEach(li => {
      if (!li) return;
      const width = maxWidth - rightGap;
      li.style.setProperty('--divider-left', '0px');
      li.style.setProperty('--divider-width', `${width}px`);
    });
  }, []);
  const throttledUpdateDividers = useThrottle(updateDividers, 100);

  useLayoutEffect(() => {
    throttledUpdateDividers();
    window.addEventListener('resize', throttledUpdateDividers);
    return () => window.removeEventListener('resize', throttledUpdateDividers);
  }, [throttledUpdateDividers]);

  const scrollToBooth = (id: string) => {
    const el = listRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const elementCenterY = rect.top + window.scrollY + rect.height / 2;
    const targetScroll = elementCenterY - window.innerHeight / 2;
    void scrollToPosition(targetScroll, 400);
    el.classList.add('highlight');
    setTimeout(() => {
      el.classList.remove('highlight');
    }, 5000);
  };

  const scrollToRow = (row: string) => {
    const el = rowRefs.current[row];
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    void scrollToPosition(top, 400);
    el.classList.add('highlight');
    setTimeout(() => el.classList.remove('highlight'), 3000);
  };

  useImperativeHandle(ref, () => ({ scrollToBooth, scrollToRow }));

  return (
    <>
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
                  data-booth-id={booth.id}
                  style={{
                    '--row-color': rowColors[booth.row],
                  } as CSSProperties}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('.member-links')) return;
                    const id = (e.currentTarget as HTMLLIElement).dataset.boothId!;
                    onBoothClick(id);
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
    </>
  );
});

BoothList.displayName = 'BoothList';

export default BoothList;
