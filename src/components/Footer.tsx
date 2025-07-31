import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <nav>
        <ul className="footer-nav-list">
          <li><Link href="/concerts/1">센다이 세트리 A</Link></li>
          <li><Link href="/concerts/2">센다이 세트리 B</Link></li>
          <li><Link href="/concerts/3">센다이 세트리 C</Link></li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
