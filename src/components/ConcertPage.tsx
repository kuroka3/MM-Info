import type { Metadata } from 'next';
import React, { Suspense, cache } from 'react';
import { unstable_cache } from 'next/cache';
import Header from '@/components/Header';
import SongList from '@/components/SongList';
import PlaylistPopup from '@/components/PlaylistPopup';
import SpoilerGate from '@/components/SpoilerGate';
import SetlistImageGenerator from '@/components/SetlistImageGenerator';
import ConcertDetailSkeleton from '@/components/loading/ConcertDetailSkeleton';
import prisma from '@/lib/prisma';
import { formatConcertDate } from '@/utils/groupConcerts';
import { getPredictedSetlist } from '@/utils/setlistPrediction';

export const revalidate = 86400;

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
  const getConcertWithSetlist = cache((concertId: string) => {
    const id = Number.parseInt(concertId, 10);
    if (Number.isNaN(id)) return Promise.resolve(null);

    return unstable_cache(
      async () => {
        // Fetch concert and determine setlist ID first
        const concert = await prisma.concert.findFirst({
          where: {
            id,
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
          },
        });

        if (!concert) return null;

        // Get effective setlist ID (predicted or actual)
        const prediction = getPredictedSetlist(concert);
        const effectiveSetlistId = prediction?.setlistId ?? null;

        if (!effectiveSetlistId) return null;

        // Fetch setlist with all related data
        const setlist = await prisma.setlist.findUnique({
          where: { id: effectiveSetlistId },
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

        if (!setlist) return null;

        // Combine and return
        return {
          ...concert,
          setlist,
        };
      },
      [`concert-${concertId}-${config.eventSlug}`],
      {
        revalidate: 86400,
        tags: [`concert-${concertId}`, `event-${config.eventSlug}`]
      }
    )();
  });

  const getEventConcertsWithVenues = cache((eventId: number) => {
    return unstable_cache(
      async () => {
        return prisma.concert.findMany({
          where: {
            eventId,
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
      },
      [`event-concerts-${eventId}-${config.eventSlug}`],
      { revalidate: 86400, tags: [`concerts-${config.eventSlug}`, `event-${eventId}`] }
    )();
  });

  const getEventConcertsByVenue = cache((eventId: number, venueId: number) => {
    return unstable_cache(
      async () => {
        return prisma.concert.findMany({
          where: {
            eventId,
            venueId,
          },
          select: {
            day: true,
          },
        });
      },
      [`event-concerts-venue-${eventId}-${venueId}-${config.eventSlug}`],
      { revalidate: 86400, tags: [`concerts-${config.eventSlug}`, `event-${eventId}`, `venue-${venueId}`] }
    )();
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

    if (!concert) {
      return { title: config.notFoundMessage || '세트리스트를 찾을 수 없습니다.' };
    }

    // Check if there are multiple days for this venue
    const allConcerts = (concert.eventId && concert.venueId)
      ? await getEventConcertsByVenue(concert.eventId, concert.venueId)
      : [];
    const uniqueDays = new Set(allConcerts.map(c => c.day).filter(Boolean));
    const hasMultipleDays = uniqueDays.size >= 2;

    // Check if setlist is predicted
    const prediction = getPredictedSetlist(concert);
    const isPredicted = prediction?.isPredicted ?? false;

    // Construct title parts (without event name)
    const titleParts: string[] = [];
    const venueName = concert.venue?.name || '';
    const dayPart = concert.day ? `${concert.day}요일` : '';
    const blockPart = concert.block && concert.block !== '공연' ? concert.block : '';

    if (venueName) titleParts.push(venueName);
    if (hasMultipleDays && dayPart) titleParts.push(dayPart);
    if (blockPart) titleParts.push(`${blockPart} 공연`);
    titleParts.push('세트리스트');
    if (isPredicted) titleParts.push('- 예상');

    const title = titleParts.join(' ');
    return { title };
  };

  async function SetlistContent({
    concertId,
  }: {
    concertId: string;
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

    const allEventConcertsWithVenues = concert.eventId
      ? await getEventConcertsWithVenues(concert.eventId)
      : [];

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

    const allConcerts = (concert.eventId && concert.venueId)
      ? await getEventConcertsByVenue(concert.eventId, concert.venueId)
      : [];

    const uniqueDays = new Set(allConcerts.map(c => c.day).filter(Boolean));
    const hasMultipleDays = uniqueDays.size >= 2;

    const eventName = concert.event?.name || '';
    const venueName = concert.venue?.name || '';
    const dayPart = concert.day ? `${concert.day}요일` : '';
    const blockPart = concert.block && concert.block !== '공연' ? concert.block : '';

    // Check if setlist is predicted
    const prediction = getPredictedSetlist(concert);
    const isPredicted = prediction?.isPredicted ?? false;

    const line1 = eventName;
    const line2Parts: string[] = [];
    if (venueName) line2Parts.push(venueName);
    if (hasMultipleDays && dayPart) line2Parts.push(dayPart);
    if (blockPart) line2Parts.push(`${blockPart} 공연`);
    line2Parts.push('세트리스트');
    if (isPredicted) line2Parts.push('- 예상');

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
    }
    if (concert.block && concert.block !== '공연') {
      dateParts.push(`${concert.block} 공연`);
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
  }: {
    params: Promise<{ concertId: string }>;
  }) => {
    return (
      <SpoilerGate storageKey={config.spoilerStorageKey} redirectPath={config.redirectPath}>
        <main>
          <Suspense fallback={<ConcertDetailSkeleton />}>
            <SetlistContent concertId={(await params).concertId} />
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
