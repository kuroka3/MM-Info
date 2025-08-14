'use client';

import { useEffect } from 'react';

export default function ViewportHeightSetter() {
  useEffect(() => {
    const throttle = <T extends unknown[]>(fn: (...args: T) => void, limit: number) => {
      let inThrottle = false;
      return (...args: T) => {
        if (inThrottle) return;
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
          fn(...args);
        }, limit);
      };
    };

    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      const next = `${h * 0.01}px`;
      const cur = document.documentElement.style.getPropertyValue('--vh');
      if (cur && Math.abs(parseFloat(cur) - parseFloat(next)) < 0.5) return;
      document.documentElement.style.setProperty('--vh', next);
    };

    const setVhThrottled = throttle(setVh, 100);

    setVh();
    window.addEventListener('orientationchange', setVh, { passive: true });
    window.addEventListener('resize', setVhThrottled, { passive: true });
    window.visualViewport?.addEventListener('resize', setVhThrottled, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', setVh);
      window.removeEventListener('resize', setVhThrottled);
      window.visualViewport?.removeEventListener('resize', setVhThrottled);
    };
  }, []);

  return null;
}
