'use client';

import { useEffect } from 'react';
import useThrottle from '@/hooks/useThrottle';

export default function ViewportHeightSetter() {
  const setVh = useThrottle(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, 100);

  useEffect(() => {
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, [setVh]);
  return null;
}
