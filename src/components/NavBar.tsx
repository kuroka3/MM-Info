'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { triggerSpoilerRedirect } from '@/utils/spoilerRedirect';

const EVENTS = [
  {
    slug: '/mikuexpo/asia2025',
    spoilerStorageKey: 'spoilerConfirmed:mikuexpo-asia2025',
    spoilerLabel: '스포일러',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 정보' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
  {
    slug: '/magicalmirai/2025',
    spoilerStorageKey: 'spoilerConfirmed:magical-mirai-2025',
    spoilerLabel: '스포일러',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 정보' },
      { path: 'exhibition-info', label: '기획전 정보' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
];

const DEFAULT_EVENT = {
  slug: '',
  spoilerStorageKey: undefined,
  spoilerLabel: '스포일러',
  links: [
    { path: 'setlist', label: '세트리스트' },
    { path: 'concert-guide', label: '공연 정보' },
    { path: 'call-guide', label: '콜 가이드' },
  ],
} satisfies typeof EVENTS[number];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [spoilerEnabled, setSpoilerEnabled] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const matchedEvent = EVENTS.find(({ slug }) =>
    slug && (pathname === slug || pathname.startsWith(`${slug}/`)),
  );
  const isRootPath = pathname === '/' || pathname === '';
  const fallbackEvent = isRootPath && EVENTS.length > 0 ? EVENTS[0] : DEFAULT_EVENT;
  const activeEvent = matchedEvent ?? fallbackEvent;
  const baseSegments = activeEvent.slug.split('/').filter(Boolean);
  const links = activeEvent.links.map(({ path, label }) => {
    const normalizedPath = path.replace(/^\/+/u, '');
    const segments = normalizedPath ? [...baseSegments, normalizedPath] : [...baseSegments];
    const href = `/${segments.join('/')}` || '/';
    return {
      href,
      label,
    };
  });
  const spoilerKey = activeEvent.spoilerStorageKey;
  const spoilerLabel = activeEvent.spoilerLabel;

  useEffect(() => {
    if (!spoilerKey) {
      setSpoilerEnabled(false);
      return;
    }

    const disabledKey = `${spoilerKey}:disabled`;

    const updateSpoiler = () => {
      const enabled =
        localStorage.getItem(spoilerKey) === 'true' &&
        localStorage.getItem(disabledKey) !== 'true';
      setSpoilerEnabled(enabled);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === spoilerKey || event.key === disabledKey) updateSpoiler();
    };

    const handleToggle = (event: Event) => {
      const custom = event as CustomEvent<{ key: string; value: boolean }>;
      if (!custom.detail || custom.detail.key !== spoilerKey) return;
      updateSpoiler();
    };

    updateSpoiler();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('spoilerToggleChange', handleToggle);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('spoilerToggleChange', handleToggle);
    };
  }, [spoilerKey]);

  const toggleSpoiler = () => {
    if (!spoilerKey) return;
    const disabledKey = `${spoilerKey}:disabled`;
    setSpoilerEnabled((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem(spoilerKey, 'true');
        localStorage.removeItem(disabledKey);
        window.dispatchEvent(
          new CustomEvent('spoilerToggleChange', {
            detail: { key: spoilerKey, value: true },
          }),
        );
        if (typeof document !== 'undefined') {
          const redirectTarget = document.body.dataset.spoilerRedirect;
          if (redirectTarget) triggerSpoilerRedirect(redirectTarget, { startDelay: 220 });
        }
      } else {
        localStorage.removeItem(spoilerKey);
        localStorage.setItem(disabledKey, 'true');
        window.dispatchEvent(
          new CustomEvent('spoilerToggleChange', {
            detail: { key: spoilerKey, value: false },
          }),
        );
        if (typeof document !== 'undefined') {
          const redirectTarget = document.body.dataset.spoilerRedirect;
          if (redirectTarget) triggerSpoilerRedirect(redirectTarget, { startDelay: 300 });
        }
      }
      return next;
    });
  };

  return (
    <nav className="nav-bar">
      <button
        className="nav-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ☰
      </button>
      <div className={`nav-links${isOpen ? ' open' : ''}`}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
        {spoilerKey && (
          <div className="nav-spoiler-toggle">
            <span className="nav-spoiler-text">{spoilerLabel}</span>
            <button
              type="button"
              className={`ios-toggle${spoilerEnabled ? ' ios-toggle--on' : ''}`}
              onClick={toggleSpoiler}
              aria-pressed={spoilerEnabled}
              aria-label={spoilerLabel}
              style={
                spoilerEnabled
                  ? ({ '--toggle-accent': '#39c5bb' } as CSSProperties)
                  : undefined
              }
            >
              <span className="ios-toggle__handle" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
