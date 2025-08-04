import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
import SpoilerGate from '@/components/SpoilerGate';
import prisma from '@/lib/prisma';

async function getSetlist(setlistId: string) {
  return prisma.setlist.findUnique({
    where: { id: parseInt(setlistId) },
    include: {
      songs: {
        include: {
          song: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });
}

// --- Metadata Generation (runs separately on the server) ---
export async function generateMetadata({ params }: { params: Promise<{ concertId: string }> }): Promise<Metadata> {
  const setlist = await getSetlist((await params).concertId);
  return { title: setlist ? setlist.name : '세트리스트를 찾을 수 없습니다.' };
}

// --- Async Component for Loading UI ---
async function SetlistContent({ setlistId }: { setlistId: string }) {
  const setlist = await getSetlist(setlistId);

  if (!setlist) {
    return (
      <div className="container">
        <p>세트리스트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const songs = setlist.songs.map(item => ({
    title: item.song.title,
    artist: item.song.artist,
    spotifyUrl: item.song.spotify || '',
    youtubeUrl: item.song.youtube || '',
    jacketUrl: item.song.thumbnail || '',
    part: item.song.part || '',
    higawari: item.higawari || false,
    locationgawari: item.locationgawari || false,
  }));

  const playlist = songs.find(
    (s) => s.title === '최종 플레이리스트' || s.artist === ''
  );

  return (
    <>
      <Header title={setlist.name} artist="マジカルミライ２０２５" date="" />
      <section className="container">
        <SongList songs={songs} />
      </section>
      {playlist && (
        <PlaylistPopup
          spotifyUrl={playlist.spotifyUrl}
          youtubeUrl={playlist.youtubeUrl}
          jacketUrl={playlist.jacketUrl}
        />
      )}
    </>
  );
}

const ConcertPage = async ({ params }: { params: Promise<{ concertId: string }> }) => {
  return (
    <SpoilerGate>
      <main>
        <Suspense fallback={
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        }>
          <SetlistContent setlistId={(await params).concertId} />
        </Suspense>
      </main>
    </SpoilerGate>
  );
};

export default ConcertPage;