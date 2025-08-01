import Link from 'next/link';
import React from 'react';

type Concert = {
    title: string;
    artist: string;
    date: string;
    songs: {
        title: string;
        artist: string;
        spotifyUrl: string;
        youtubeUrl: string;
        jacketUrl: string;
    }[];
}

type Concerts = {
    [key: string]: Concert;
}

async function getConcerts(): Promise<Concerts> {
    const res = await fetch('https://pastebin.com/raw/ruQTXtgQ', { next: { revalidate: 60 } });
    if (!res.ok) {
        throw new Error('Failed to fetch concert data');
    }
    return res.json();
}

const Footer = async () => {
  const concerts = await getConcerts();

  return (
    <footer className="footer">
      <nav>
        <ul className="footer-nav-list">
          {Object.keys(concerts).map((concertId) => (
            <li key={concertId}>
              <Link href={`/concerts/${concertId}`}>{concerts[concertId].title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
