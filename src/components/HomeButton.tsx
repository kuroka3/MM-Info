'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    if (isMobile) return;
    const handleScroll = () => {
      setHidden(window.scrollY > 200);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  if (pathname === '/') return null;

  return (
    <Link href="/" className={`home-button${hidden ? ' hidden' : ''}`}>
      <span>2 0 2 5</span>
      <span>마지미라</span>
      <span>정보 모음</span>
    </Link>
  );
}
