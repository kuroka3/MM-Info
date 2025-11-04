import Link from 'next/link';
import React from 'react';

// type Concert = {
//     title: string;
//     artist: string;
//     date: string;
//     songs: {
//         title: string;
//         artist: string;
//         spotifyUrl: string;
//         youtubeUrl: string;
//         jacketUrl: string;
//     }[];
// }

// type Concerts = {
//     [key: string]: Concert;
// }

// async function getConcerts(): Promise<Concerts> {
//     const res = await fetch('https://pastebin.com/raw/ruQTXtgQ', { next: { revalidate: 60 } });
//     if (!res.ok) {
//         throw new Error('콘서트 데이터를 가져오지 못했습니다.');
//     }
//     return res.json();
// }

const footerLinks = [
  { href: '/legacy', label: '이전 공연' },
  { href: '/', label: '메인 페이지로' },
];

const Footer = () => {
  // const concerts = await getConcerts();

  return (
    <footer className="footer">
      <nav aria-label="푸터 보조 링크">
        <ul className="footer-nav-list">
          {footerLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href}>
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
