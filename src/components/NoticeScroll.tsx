'use client';

import { useEffect } from 'react';
import { scrollToPosition } from '@/lib/scroll';

export default function NoticeScroll() {
  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('.notice-nav a, .notice-alert a');

    const onClick = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const element = document.querySelector(href);
      if (!element) return;
      event.preventDefault();
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      scrollToPosition(top, 400);
      history.pushState(null, '', href);
      const box = element.querySelector('.notice-box') as HTMLElement | null;
      box?.classList.add('highlight');
      setTimeout(() => box?.classList.remove('highlight'), 2000);
    };

    links.forEach((link) => link.addEventListener('click', onClick));
    return () => {
      links.forEach((link) => link.removeEventListener('click', onClick));
    };
  }, []);

  return null;
}
