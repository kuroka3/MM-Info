import React from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';

type Song = {
  title: string;
  artist: string;
  spotifyUrl: string;
  youtubeUrl: string;
  jacketUrl: string;
};

type Concert = {
  title: string;
  artist: string;
  date: string;
  songs: Song[];
};

type ConcertsData = {
  [id: string]: Concert;
};

async function getConcerts(): Promise<ConcertsData> {
  const res = await fetch('https://pastebin.com/raw/ruQTXtgQ', { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error('Failed to fetch concert data');
  }
  return res.json();
}

type ConcertPageProps = Promise<{
  concertId: string;
}>;

const ConcertPage = async ( props: { params: ConcertPageProps }) => {
  const concerts = await getConcerts();
  const concertId = (await props.params).concertId as keyof typeof concerts;
  const concert = concerts[concertId];

  if (!concert) {
    return <div className="container"><p>Concert not found.</p></div>;
  }

  return (
    <main className="container">
      <Header title={concert.title} artist={concert.artist} date={concert.date} />
      <SongList songs={concert.songs} />
    </main>
  );
};

export default ConcertPage;

export async function generateStaticParams() {
  const concerts = await getConcerts();
  return Object.keys(concerts).map((concertId) => ({
    concertId,
  }));
}