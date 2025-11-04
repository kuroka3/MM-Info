'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useThrottle from '@/hooks/useThrottle';

export default function HomeButton() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [hidden, setHidden] = useState(false);

  const EVENTS = [
    {
      slug: '/mikuexpo/asia2025',
      lines: ['2 0 2 5', 'EXPO ASIA', '정보 모음'],
    },
    {
      slug: '/magicalmirai/2025',
      lines: ['2 0 2 5', '마지미라', '정보 모음'],
    },
  ];

  const activeEvent =
    EVENTS.find(({ slug }) => pathname.startsWith(slug)) ?? EVENTS[0];
  const isHome = pathname === '/' || pathname === activeEvent.slug;

  const handleResize = useThrottle(() => {
    setIsMobile(window.innerWidth < 640);
  }, 200);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const updateHiddenState = useCallback(() => {
    const shouldHide = window.scrollY > (isMobile ? 0 : 200);
    setHidden((prev) => (prev === shouldHide ? prev : shouldHide));
  }, [isMobile]);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateHiddenState();
      });
    };

    updateHiddenState();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, [updateHiddenState]);

  return (
    <Link
      href={activeEvent.slug}
      className={`home-button${hidden ? ' hidden' : ''}`}
      style={{ display: isHome ? 'none' : undefined }}
    >
      {activeEvent.lines.map((line) => {
        const isExpoLine = line === 'EXPO ASIA';
        return (
          <span
            key={line}
            className={`home-button__line${isExpoLine ? ' home-button__line--expo' : ''}`}
          >
            {line}
          </span>
        );
      })}
    </Link>
  );
}
