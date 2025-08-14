import { useEffect, useRef, useState } from 'react';

export default function useStoredState<T>(
  key: string,
  defaultValue: T,
  parser: (raw: string) => T = JSON.parse,
  serializer: (value: T) => string = JSON.stringify,
) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = window.localStorage.getItem(key);
    if (stored === null) return defaultValue;
    try {
      return parser(stored);
    } catch {
      return defaultValue;
    }
  });

  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, serializer(value));
      } catch {
        // ignore
      }
    }
  }, [key, value, serializer]);

  return [value, setValue, ref] as const;
}
