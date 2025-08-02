'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeButton() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <Link href="/" className="home-button">
      <span>2 0 2 5</span>
      <span>마지미라</span>
      <span>정보 모음</span>
    </Link>
  );
}
