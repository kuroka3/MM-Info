import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { Prisma, type Song } from '@prisma/client';
import CallGuideClient from './CallGuideClient';
import CallGuideWrapper from '@/components/call-guide/CallGuideWrapper';
import CallGuideSkeleton from '@/components/loading/CallGuideSkeleton';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAlbumSongs, getSafeSongIndex } from '@/data/safeSongIndex';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 60;

const EVENT_SLUG = 'miku-expo-2025-asia';
const SAFE_SONG_INDEX = getSafeSongIndex(EVENT_SLUG);
const ALBUM_SONGS = getAlbumSongs(EVENT_SLUG);

const getSongData = async (
  slug: string,
  isSafeMode: boolean,
): Promise<{ song: Song; songs: Song[]; defaultPlaylists?: Array<{ id: string; name: string; slugs: string[] }> }> => {
  const event = await prisma.event.findUnique({
    where: { slug: EVENT_SLUG },
    select: { id: true },
  });

  const songs = await prisma.song.findMany({
    where: {
      slug: { not: null },
      videoId: { not: null },
      summary: { not: null },
      lyrics: { not: Prisma.JsonNull },
    },
    include: {
      setlists: {
        select: { order: true },
        orderBy: { order: 'asc' },
        take: 1,
      },
      eventVariations: {
        where: event ? { eventId: event.id } : undefined,
        select: { isHigawari: true, isLocationgawari: true, eventId: true },
      },
    },
  });

  let defaultPlaylists: Array<{ id: string; name: string; slugs: string[] }> | undefined = undefined;

  if (!isSafeMode) {
    const concerts = event
      ? await prisma.concert.findMany({
          where: { eventId: event.id, setlistId: { not: null } },
          include: {
            setlist: {
              include: {
                songs: {
                  include: { song: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        })
      : [];

    const setlistASlugToOrder = new Map<string, number>();
    const setlistBSlugToOrder = new Map<string, number>();
    const allSetlistSlugToOrder = new Map<string, number>();

    concerts.forEach((concert) => {
      if (!concert.setlist) return;

      const songItems = concert.setlist.songs.filter(
        (ss) => ss.type === 'song' && ss.song?.slug
      );

      songItems.forEach((ss, index) => {
        const songSlug = ss.song!.slug!;
        const songOnlyOrder = index + 1;

        if (!allSetlistSlugToOrder.has(songSlug)) {
          allSetlistSlugToOrder.set(songSlug, songOnlyOrder);
        }

        if (concert.setlist?.higawariLabel === 'A' && !setlistASlugToOrder.has(songSlug)) {
          setlistASlugToOrder.set(songSlug, songOnlyOrder);
        } else if (concert.setlist?.higawariLabel === 'B' && !setlistBSlugToOrder.has(songSlug)) {
          setlistBSlugToOrder.set(songSlug, songOnlyOrder);
        }
      });
    });

    const setlistASlugs = Array.from(setlistASlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug);

    const setlistBSlugs = Array.from(setlistBSlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug);

    const allSetlistSlugs = Array.from(allSetlistSlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug);

    defaultPlaylists = [
      { id: 'all-songs', name: '전체 곡', slugs: songs.map((s) => s.slug!) },
      { id: 'setlist-integrated', name: '세트리 통합', slugs: allSetlistSlugs },
      { id: 'setlist-a', name: '세트리 A', slugs: setlistASlugs },
      { id: 'setlist-b', name: '세트리 B', slugs: setlistBSlugs },
    ];
  }

  if (isSafeMode) {
    songs.sort((a, b) => {
      const idxA = SAFE_SONG_INDEX.indexOf(a.slug!);
      const idxB = SAFE_SONG_INDEX.indexOf(b.slug!);
      const orderA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
      const orderB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;
      return orderA - orderB;
    });
  } else {
    songs.sort((a, b) => {
      const orderA = a.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }

  const song = songs.find((s) => s.slug === slug);
  if (!song) notFound();

  return { song: song!, songs, defaultPlaylists };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { song } = await getSongData(slug, false);
  return {
    title: `${song.krtitle ? song.krtitle : song.title} - 콜 가이드`,
  };
}

export async function generateStaticParams() {
  const songs = await prisma.song.findMany({
    where: { slug: { not: null } },
    select: { slug: true },
  });

  return songs.map((song) => ({ slug: song.slug! }));
}

export default async function CallGuideSongPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const s = await searchParams;
  const isSafeMode = s.safe === '1';
  const { song, songs, defaultPlaylists } = await getSongData(slug, isSafeMode);
  return (
    <Suspense fallback={<CallGuideSkeleton />}>
      <CallGuideWrapper
        key={slug}
        initialSong={song}
        initialSongs={songs}
        eventSlug={EVENT_SLUG}
        safeSongIndex={SAFE_SONG_INDEX}
        albumSongs={ALBUM_SONGS}
        slug={slug}
        isSafeMode={isSafeMode}
        CallGuideComponent={CallGuideClient}
        defaultPlaylists={defaultPlaylists}
      />
    </Suspense>
  );
}
