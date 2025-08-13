'use client';

import { useEffect, useState } from 'react';
import { scrollToPosition } from '@/lib/scroll';

interface ScrollTopButtonProps {
  className?: string;
}

export default function ScrollTopButton({ className = '' }: ScrollTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      aria-label="맨 위로"
      title="맨 위로"
      className={`scroll-top ${visible ? 'show' : ''} ${className}`.trim()}
      onClick={() => void scrollToPosition(0, 400)}
    >
      ↑
    </button>
  );
}
