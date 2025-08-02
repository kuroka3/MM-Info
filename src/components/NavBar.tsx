'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/setlist', label: '세트리스트' },
  { href: '/concert-guide', label: '공연 가이드' },
  { href: '/exhibition-info', label: '기획전 정보' },
  { href: '/call-guide', label: '콜 가이드' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  if (pathname === '/') return null;

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
