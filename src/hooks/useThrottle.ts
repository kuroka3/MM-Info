'use client';

import { useRef, useCallback } from 'react';

export default function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
) {
  const lastCalled = useRef(0);
  const savedFn = useRef(fn);
  savedFn.current = fn;

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCalled.current >= delay) {
        lastCalled.current = now;
        savedFn.current(...args);
      }
    },
    [delay],
  );
}