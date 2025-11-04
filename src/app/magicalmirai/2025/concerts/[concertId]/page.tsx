import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
import SpoilerGate from '@/components/SpoilerGate';
import prisma from '@/lib/prisma';
import { formatConcertDate } from '@/utils/groupConcerts';

export const revalidate = 60;

const EVENT_SLUG = 'magical-mirai-2025';

async function getConcertWithSetlist(setlistId: string) {
  const id = Number.parseInt(setlistId, 10);
  if (Number.isNaN(id)) return null;

  return prisma.concert.findFirst({
    where: {
      setlistId: id,
      event: {
        is: { slug: EVENT_SLUG },
      },
    },
    include: {
      event: {
        include: {
          series: true,
        },
      },
      setlist: {
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
      },
    },
  });
}

// --- Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ concertId: string }> }): Promise<Metadata> {
  const concert = await getConcertWithSetlist((await params).concertId);
  const title = concert?.setlist?.name ?? '세트리스트를 찾을 수 없습니다.';
  return { title };
}

// --- Async Component for Loading UI ---
async function SetlistContent({
  setlistId,
  date,
  block,
}: {
  setlistId: string
  date?: string
  block?: string
}) {
  const concert = await getConcertWithSetlist(setlistId);
  const setlist = concert?.setlist;

  if (!concert || !setlist) {
    return (
      <div className="container">
        <p>세트리스트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const songs = setlist.songs.map(item => ({
    title: item.song.title,
    krtitle: item.song.krtitle || undefined,
    artist: item.song.artist,
    spotifyUrl: item.song.spotify || '',
    youtubeUrl: item.song.youtube || '',
    jacketUrl: item.song.thumbnail || '',
    part: item.song.part || '',
    higawari: item.higawari || false,
    locationgawari: item.locationgawari || false,
    slug: item.song.slug || undefined,
  }));

  const playlist = songs.find(
    (s) => s.title === '최종 플레이리스트' || s.artist === ''
  );

  const dateParts: string[] = [];
  if (concert.date) {
    const formattedDate = formatConcertDate(concert.date, concert.timeZone);
    dateParts.push(concert.day ? `${formattedDate} (${concert.day})` : formattedDate);
  } else if (date) {
    dateParts.push(date);
  }
  if (concert.block) {
    dateParts.push(concert.block);
  } else if (block) {
    dateParts.push(block);
  }
  const dateString = dateParts.length > 0 ? `${dateParts.join(' ')} 공연` : '公演情報は準備中です';

  return (
    <>
      <Header title={setlist.name} artist="マジカルミライ２０２５" date={dateString} />
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

const ConcertPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ concertId: string }>
  searchParams: Promise<{ date?: string; block?: string }>
}) => {
  const { date, block } = await searchParams;

  return (
    <SpoilerGate storageKey="spoilerConfirmed:magical-mirai-2025">
      <main>
        <Suspense fallback={
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        }>
          <SetlistContent setlistId={(await params).concertId} date={date} block={block} />
        </Suspense>
      </main>
    </SpoilerGate>
  );
};

export default ConcertPage;
