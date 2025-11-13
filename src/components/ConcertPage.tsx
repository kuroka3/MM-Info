import type { Metadata } from 'next';
import React, { Suspense, cache } from 'react';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
import SpoilerGate from '@/components/SpoilerGate';
import SetlistImageGenerator from '@/components/SetlistImageGenerator';
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
  const getConcertWithSetlist = cache(async (concertId: string) => {
    const id = Number.parseInt(concertId, 10);
    if (Number.isNaN(id)) return null;

    return prisma.concert.findFirst({
      where: {
        id,
        setlistId: {
          not: null,
        },
        event: {
          is: { slug: config.eventSlug },
        },
      },
      include: {
        venue: true,
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
        id: true,
      },
    });

    return concerts.map((concert) => ({
      concertId: concert.id.toString(),
    }));
  };

  const generateMetadata = async ({ params }: { params: Promise<{ concertId: string }> }): Promise<Metadata> => {
    const concert = await getConcertWithSetlist((await params).concertId);
    const title = concert?.setlist?.name ?? (config.notFoundMessage || '세트리스트를 찾을 수 없습니다.');
    return { title };
  };

  async function SetlistContent({
    concertId,
    date,
    block,
  }: {
    concertId: string;
    date?: string;
    block?: string;
  }) {
    const concert = await getConcertWithSetlist(concertId);
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

    const allEventConcertsWithVenues = await prisma.concert.findMany({
      where: {
        eventId: concert.eventId,
        setlistId: { not: null },
      },
      include: {
        venue: true,
        setlist: {
          include: {
            songs: {
              include: { song: true },
            },
          },
        },
      },
    });

    const songToVenueMap = new Map<string, string[]>();
    allEventConcertsWithVenues.forEach(c => {
      if (!c.venue || !c.setlist) return;
      c.setlist.songs.forEach(ss => {
        if (ss.song?.slug) {
          const venues = songToVenueMap.get(ss.song.slug) || [];
          if (!venues.includes(c.venue!.name)) {
            venues.push(c.venue!.name);
          }
          songToVenueMap.set(ss.song.slug, venues);
        }
      });
    });

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
      const higawariLabel = concert.setlist?.higawariLabel || undefined;

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
        venueName: variation?.isLocationgawari ? concert.venue?.name : undefined,
        blockName: variation?.isHigawari ? higawariLabel : undefined,
        slug: item.song.slug || undefined,
        lyrics: item.song.lyrics || undefined,
      };
    });

    const playlistImageUrl = concert.playlistImageUrl || config.playlistImageUrl || '/images/playlist-icon.png';

    const allConcerts = await prisma.concert.findMany({
      where: {
        eventId: concert.eventId,
        venueId: concert.venueId,
      },
      select: {
        day: true,
      },
    });

    const uniqueDays = new Set(allConcerts.map(c => c.day).filter(Boolean));
    const hasMultipleDays = uniqueDays.size >= 2;

    const eventName = concert.event?.name || '';
    const venueName = concert.venue?.name || '';
    const dayPart = concert.day ? `${concert.day}요일` : '';
    const blockPart = concert.block && concert.block !== '공연' ? concert.block : '';

    const line1 = eventName;
    const line2Parts: string[] = [];
    if (venueName) line2Parts.push(venueName);
    if (hasMultipleDays && dayPart) line2Parts.push(dayPart);
    if (blockPart) line2Parts.push(`${blockPart} 공연`);
    line2Parts.push('세트리스트');

    const setlistTitle = line1 ? `${line1}\n${line2Parts.join(' ')}` : line2Parts.join(' ');

    if (setlist.playlist || setlist.spotifyPlaylist) {
      songs.push({
        type: 'final-playlist',
        title: '최종 플레이리스트',
        artist: '',
        spotifyUrl: setlist.spotifyPlaylist || '',
        youtubeUrl: setlist.playlist || '',
        jacketUrl: playlistImageUrl,
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
    if (concert.block && concert.block !== '공연') {
      dateParts.push(`${concert.block} 공연`);
    } else if (block && block !== '공연') {
      dateParts.push(`${block} 공연`);
    }
    const dateString = dateParts.length > 0 ? dateParts.join(' ') : (config.preparingMessage || '공연 정보 준비 중');

    let concertTime: string | undefined;
    if (concert.showTimeUTC) {
      const showDate = new Date(concert.showTimeUTC);
      concertTime = showDate.toLocaleString('ko-KR', {
        timeZone: concert.timeZone || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (concert.showTime) {
      concertTime = typeof concert.showTime === 'string'
        ? concert.showTime
        : concert.showTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return (
      <>
        <Header
          title={setlistTitle}
          artist={concert.event?.name || config.artistName}
          date={dateString}
          higawariLabel={concert.setlist?.higawariLabel || undefined}
        />
        <section className="container">
          <SetlistImageGenerator
            songs={songs}
            eventName={concert.event?.name || config.artistName}
            concertTitle={setlistTitle}
            concertTime={concertTime}
            timeZone={concert.timeOffset || concert.timeZone || undefined}
            playlistImageUrl={playlistImageUrl}
            higawariLabel={concert.setlist?.higawariLabel || undefined}
          />
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
            <SetlistContent concertId={(await params).concertId} date={date} block={block} />
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
