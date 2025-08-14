'use client';

import { useEffect, useState } from 'react';
import useThrottle from '@/hooks/useThrottle';
import { scrollToPosition } from '@/lib/scroll';

interface ScrollTopButtonProps {
  className?: string;
}

export default function ScrollTopButton({ className = '' }: ScrollTopButtonProps) {
  const [visible, setVisible] = useState(false);

  const onScroll = useThrottle(() => setVisible(window.scrollY > 200), 100);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <button
      aria-label="맨 위로"
      title="맨 위로"
      className={`scroll-top ${visible ? 'show' : ''} ${className}`.trim()}
      onClick={() =>
        void scrollToPosition(0, 400).then(() => setVisible(false))
      }
    >
      ↑
    </button>
  );
}
