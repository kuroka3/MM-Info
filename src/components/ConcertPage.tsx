import type { Metadata } from 'next';
import React, { Suspense, cache } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
import SpoilerGate from '@/components/SpoilerGate';
import prisma from '@/lib/prisma';
import { formatConcertDate } from '@/utils/groupConcerts';

export const revalidate = 60;

interface ConcertPageConfig {
  eventSlug: string;
  artistName: string;
  spoilerStorageKey: string;
  redirectPath: string;
  notFoundMessage?: string;
  preparingMessage?: string;
  playlistImageUrl?: string;
}

export function createConcertPageHandlers(config: ConcertPageConfig) {
  const getConcertWithSetlist = cache(async (setlistId: string) => {
    const id = Number.parseInt(setlistId, 10);
    if (Number.isNaN(id)) return null;

    return prisma.concert.findFirst({
      where: {
        setlistId: id,
        event: {
          is: { slug: config.eventSlug },
        },
      },
      include: {
        event: {
          include: {
            series: true,
            songVariations: true,
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
  });

  const generateStaticParams = async () => {
    const concerts = await prisma.concert.findMany({
      where: {
        event: {
          is: { slug: config.eventSlug },
        },
        setlistId: {
          not: null,
        },
      },
      select: {
        setlistId: true,
      },
    });

    return concerts
      .filter((c): c is { setlistId: number } => c.setlistId !== null)
      .map((concert) => ({
        concertId: concert.setlistId.toString(),
      }));
  };

  const generateMetadata = async ({ params }: { params: Promise<{ concertId: string }> }): Promise<Metadata> => {
    const concert = await getConcertWithSetlist((await params).concertId);
    const title = concert?.setlist?.name ?? (config.notFoundMessage || '세트리스트를 찾을 수 없습니다.');
    return { title };
  };

  async function SetlistContent({
    setlistId,
    date,
    block,
  }: {
    setlistId: string;
    date?: string;
    block?: string;
  }) {
    const concert = await getConcertWithSetlist(setlistId);
    const setlist = concert?.setlist;

    if (!concert || !setlist) {
      return (
        <div className="container">
          <p>{config.notFoundMessage || '세트리스트를 찾을 수 없습니다.'}</p>
        </div>
      );
    }

    const eventVariations = concert.event?.songVariations || [];
    const eventVariationMap = new Map(
      eventVariations.map(v => [v.songSlug, v])
    );

    const songs = setlist.songs.map(item => {
      if (item.type !== 'song' || !item.song) {
        return {
          type: item.type,
          title: item.text || '',
          artist: '',
          spotifyUrl: '',
          youtubeUrl: '',
          jacketUrl: '',
          part: [],
          higawari: false,
          locationgawari: false,
        };
      }

      const variation = item.song.slug ? eventVariationMap.get(item.song.slug) : null;
      return {
        type: 'song',
        title: item.song.title,
        krtitle: item.song.krtitle || undefined,
        artist: item.song.artist,
        krartist: item.song.krartist || undefined,
        spotifyUrl: item.song.spotify || '',
        youtubeUrl: item.song.youtube || '',
        jacketUrl: item.song.thumbnail || '',
        part: item.song.part || '',
        higawari: variation?.isHigawari || false,
        locationgawari: variation?.isLocationgawari || false,
        slug: item.song.slug || undefined,
        lyrics: item.song.lyrics || undefined,
      };
    });

    if (setlist.playlist || setlist.spotifyPlaylist) {
      songs.push({
        type: 'final-playlist',
        title: '최종 플레이리스트',
        artist: '',
        spotifyUrl: setlist.spotifyPlaylist || '',
        youtubeUrl: setlist.playlist || '',
        jacketUrl: config.playlistImageUrl || '/images/playlist-icon.png',
        part: [],
        higawari: false,
        locationgawari: false,
      });
    }

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
    const dateString = dateParts.length > 0 ? dateParts.join(' ') : (config.preparingMessage || '공연 정보 준비 중');

    return (
      <>
        <Header title={setlist.name} artist={config.artistName} date={dateString} />
        <section className="container">
          <SongList songs={songs} />
        </section>
        {(setlist.playlist || setlist.spotifyPlaylist) && (
          <PlaylistPopup
            youtubeUrl={setlist.playlist || undefined}
            spotifyUrl={setlist.spotifyPlaylist || undefined}
          />
        )}
      </>
    );
  }

  const ConcertPageComponent = async ({
    params,
    searchParams,
  }: {
    params: Promise<{ concertId: string }>;
    searchParams: Promise<{ date?: string; block?: string }>;
  }) => {
    const { date, block } = await searchParams;

    return (
      <SpoilerGate storageKey={config.spoilerStorageKey} redirectPath={config.redirectPath}>
        <main>
          <Suspense
            fallback={
              <div className="loading-spinner-container">
                <div className="loading-spinner"></div>
              </div>
            }
          >
            <SetlistContent setlistId={(await params).concertId} date={date} block={block} />
          </Suspense>
        </main>
      </SpoilerGate>
    );
  };

  return {
    generateStaticParams,
    generateMetadata,
    ConcertPageComponent,
  };
}
