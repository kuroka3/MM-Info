import React, { Suspense } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
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

type ConcertPageProps = {
  params: Promise<{ concertId: string }>;
  searchParams: Promise<{ date?: string; block?: string }>;
};

const ConcertPage = async ({ params, searchParams }: ConcertPageProps) => {
  const { concertId } = await params;
  const { date, block } = await searchParams;
  const concerts = await getConcerts();
  const concert = concerts[concertId];

  if (!concert) {
    return (
      <div className="container">
        <p>콘서트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const playlist = concert.songs.find(
    (s) => s.title === '최종 플레이리스트' || s.artist === ''
  );
  const songs = concert.songs;

  const displayDate = date && block ? `${date} ${block} 공연` : concert.date;

  return (
    <SpoilerGate>
      <main>
        <Header title={concert.title} artist={concert.artist} date={displayDate} />
        <section className="container">
          <Suspense fallback={
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          }>
          <SongList songs={songs} />
          </Suspense>
        </section>
                {playlist && (
          <PlaylistPopup
            spotifyUrl={playlist.spotifyUrl}
            youtubeUrl={playlist.youtubeUrl}
            jacketUrl={playlist.jacketUrl}
          />
        )}
      </main>
    </SpoilerGate>
  );
};

export default ConcertPage;

export async function generateStaticParams() {
  const concerts = await getConcerts();
  return Object.keys(concerts).map((concertId) => ({
    concertId,
  }));
}