'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const EVENTS = [
  {
    slug: '/mikuexpo/asia2025',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 가이드' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
  {
    slug: '/magicalmirai/2025',
    links: [
      { path: 'setlist', label: '세트리스트' },
      { path: 'concert-guide', label: '공연 가이드' },
      { path: 'exhibition-info', label: '기획전 정보' },
      { path: 'call-guide', label: '콜 가이드' },
    ],
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const activeEvent = EVENTS.find(({ slug }) => pathname.startsWith(slug)) ?? EVENTS[0];
  const links = activeEvent.links.map(({ path, label }) => ({
    href: `${activeEvent.slug}/${path}`,
    label,
  }));

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
      </div>
    </nav>
  );
}
