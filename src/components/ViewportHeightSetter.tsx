'use client';

import { useEffect } from 'react';

export default function ViewportHeightSetter() {
  useEffect(() => {
    const rafThrottle = <T extends unknown[]>(fn: (...args: T) => void) => {
      let ticking = false;
      return (...args: T) => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          fn(...args);
        });
      };
    };

    const setVh = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      const next = `${h * 0.01}px`;
      const cur = document.documentElement.style.getPropertyValue('--vh');
      if (cur && Math.abs(parseFloat(cur) - parseFloat(next)) < 0.5) return;
      document.documentElement.style.setProperty('--vh', next);
    };

    const setVhRaf = rafThrottle(setVh);

    setVh();
    window.addEventListener('orientationchange', setVh, { passive: true });
    window.addEventListener('resize', setVhRaf, { passive: true });
    window.visualViewport?.addEventListener('resize', setVhRaf, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', setVh);
      window.removeEventListener('resize', setVhRaf);
      window.visualViewport?.removeEventListener('resize', setVhRaf);
    };
  }, []);

  return null;
}
