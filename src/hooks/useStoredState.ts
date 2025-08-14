import { useEffect, useRef, useState } from 'react';

export default function useStoredState<T>(
  key: string,
  defaultValue: T,
  parser: (raw: string) => T = JSON.parse,
  serializer: (value: T) => string = JSON.stringify,
) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        const parsed = parser(stored);
        setValue(parsed);
        ref.current = parsed;
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [key, parser]);

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, serializer(value));
    } catch {
      // ignore
    }
  }, [key, value, serializer, loaded]);

  return [value, setValue, ref, loaded] as const;
}
