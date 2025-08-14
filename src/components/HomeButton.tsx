'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useThrottle from '@/hooks/useThrottle';

export default function HomeButton() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleResize = useThrottle(() => {
    setIsMobile(window.innerWidth < 640);
  }, 200);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleScroll = useThrottle(() => {
    setHidden(window.scrollY > (isMobile ? 0 : 200));
  }, 100);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Link
      href='/'
      className={`home-button${hidden ? ' hidden' : ''}`}
      style={{ display: pathname === '/' ? 'none' : undefined }}
    >
      <span>2 0 2 5</span>
      <span>마지미라</span>
      <span>정보 모음</span>
    </Link>
  );
}
