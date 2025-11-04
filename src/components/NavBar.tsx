'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const EVENTS = [
  {
    slug: '/mikuexpo/asia2025',
    spoilerStorageKey: 'spoilerConfirmed:mikuexpo-asia2025',
    spoilerLabel: 'MIKU EXPO 스포일러 허용',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 정보' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
  {
    slug: '/magicalmirai/2025',
    spoilerStorageKey: 'spoilerConfirmed:magical-mirai-2025',
    spoilerLabel: '마지미라 스포일러 허용',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 정보' },
      { path: 'exhibition-info', label: '기획전 정보' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [spoilerEnabled, setSpoilerEnabled] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const activeEvent = EVENTS.find(({ slug }) => pathname.startsWith(slug)) ?? EVENTS[0];
  const links = activeEvent.links.map(({ path, label }) => ({
    href: `${activeEvent.slug}/${path}`,
    label,
  }));
  const spoilerKey = activeEvent.spoilerStorageKey;
  const spoilerLabel = activeEvent.spoilerLabel;

  useEffect(() => {
    if (!spoilerKey) {
      setSpoilerEnabled(false);
      return;
    }

    const updateSpoiler = () => {
      setSpoilerEnabled(localStorage.getItem(spoilerKey) === 'true');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === spoilerKey) updateSpoiler();
    };

    const handleToggle = (event: Event) => {
      const custom = event as CustomEvent<{ key: string; value: boolean }>;
      if (!custom.detail || custom.detail.key !== spoilerKey) return;
      setSpoilerEnabled(Boolean(custom.detail.value));
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
    setSpoilerEnabled((prev) => {
      const next = !prev;
      if (next) localStorage.setItem(spoilerKey, 'true');
      else localStorage.removeItem(spoilerKey);
      window.dispatchEvent(
        new CustomEvent('spoilerToggleChange', {
          detail: { key: spoilerKey, value: next },
        }),
      );
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
            >
              <span className="ios-toggle__handle" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
