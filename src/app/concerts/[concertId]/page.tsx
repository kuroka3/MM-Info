import React, { Suspense } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import SpoilerGate from '@/components/SpoilerGate';

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
  return await res.json();
}

type ConcertPageProps = Promise<{
  concertId: string;
}>;

async function Songs({ concertId }: { concertId: string }) {
  const concerts = await getConcerts();
  const concert = concerts[concertId as keyof typeof concerts];
  return <SongList songs={concert.songs} />;
}

const ConcertPage = async ( props: { params: ConcertPageProps}) => {
  const concerts = await getConcerts();
  const concert = concerts[(await props.params).concertId];

  if (!concert) {
    return (
      <div className="container">
        <p>콘서트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <main>
      <Header title={concert.title} artist={concert.artist} date={concert.date} />
      <section className="container">
        <Suspense fallback={
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        }>
          <Songs concertId={(await props.params).concertId} />
        </Suspense>
      </section>
    </main>
=======
    <SpoilerGate>
      <main>
        <Header title={concert.title} artist={concert.artist} date={concert.date} />
        <section className="container">
          <SongList songs={concert.songs} />
        </section>
      </main>
    </SpoilerGate>
>>>>>>> origin/master
  );
};

export default ConcertPage;

export async function generateStaticParams() {
  const concerts = await getConcerts();
  return Object.keys(concerts).map((concertId) => ({
    concertId,
  }));
}