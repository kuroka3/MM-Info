'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function HomeButton() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > (isMobile ? 0 : 200));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

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
