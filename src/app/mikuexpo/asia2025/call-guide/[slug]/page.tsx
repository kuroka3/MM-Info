import { Suspense, cache } from 'react';
import { unstable_cache } from 'next/cache';
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

export const revalidate = 3600;
export const dynamic = 'force-static';
export const dynamicParams = true;

const EVENT_SLUG = 'miku-expo-2025-asia';
const SAFE_SONG_INDEX = getSafeSongIndex(EVENT_SLUG);
const ALBUM_SONGS = getAlbumSongs(EVENT_SLUG);

const getEventId = unstable_cache(
  async () => {
    const event = await prisma.event.findUnique({
      where: { slug: EVENT_SLUG },
      select: { id: true },
    });
    return event?.id;
  },
  [`event-id-${EVENT_SLUG}`],
  { revalidate: 3600, tags: [`event-${EVENT_SLUG}`] }
);

const getAllSongs = unstable_cache(
  async (eventId: number | undefined) => {
    return await prisma.song.findMany({
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
          where: eventId ? { eventId } : undefined,
          select: { isHigawari: true, isLocationgawari: true, eventId: true },
        },
      },
    });
  },
  [`all-songs-${EVENT_SLUG}`],
  { revalidate: 3600, tags: [`songs-${EVENT_SLUG}`] }
);

const getConcertsForEvent = unstable_cache(
  async (eventId: number | undefined) => {
    if (!eventId) return [];
    return await prisma.concert.findMany({
      where: { eventId, setlistId: { not: null } },
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
    });
  },
  [`concerts-${EVENT_SLUG}`],
  { revalidate: 3600, tags: [`concerts-${EVENT_SLUG}`] }
);

const getSongData = cache(async (
  slug: string,
  isSafeMode: boolean,
): Promise<{ song: Song; songs: Song[]; defaultPlaylists?: Array<{ id: string; name: string; slugs: string[] }> }> => {
  const eventId = await getEventId();
  const songs = await getAllSongs(eventId);

  let defaultPlaylists: Array<{ id: string; name: string; slugs: string[] }> | undefined = undefined;

  if (isSafeMode) {
    songs.sort((a, b) => {
      const idxA = SAFE_SONG_INDEX.indexOf(a.slug!);
      const idxB = SAFE_SONG_INDEX.indexOf(b.slug!);
      const orderA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
      const orderB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;
      return orderA - orderB;
    });
  } else {
    const concerts = await getConcertsForEvent(eventId);

    const songToOrderMap = new Map<string, number>();
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

        const currentOrder = songToOrderMap.get(songSlug);
        if (currentOrder === undefined || songOnlyOrder < currentOrder) {
          songToOrderMap.set(songSlug, songOnlyOrder);
        }

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

    songs.sort((a, b) => {
      const aSlug = a.slug!;
      const bSlug = b.slug!;
      const aInEvent = songToOrderMap.has(aSlug);
      const bInEvent = songToOrderMap.has(bSlug);

      if (aInEvent && !bInEvent) return -1;
      if (!aInEvent && bInEvent) return 1;

      if (aInEvent && bInEvent) {
        const orderA = songToOrderMap.get(aSlug)!;
        const orderB = songToOrderMap.get(bSlug)!;
        return orderA - orderB;
      }

      const titleA = a.krtitle || a.title;
      const titleB = b.krtitle || b.title;
      return titleA.localeCompare(titleB, 'ko');
    });

    // Create a Set of slugs that have call-guide data
    const songsWithCallGuideSet = new Set(songs.map((s) => s.slug));

    const setlistASlugs = Array.from(setlistASlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug)
      .filter((slug) => songsWithCallGuideSet.has(slug));

    const setlistBSlugs = Array.from(setlistBSlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug)
      .filter((slug) => songsWithCallGuideSet.has(slug));

    const allSetlistSlugs = Array.from(allSetlistSlugToOrder.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([slug]) => slug)
      .filter((slug) => songsWithCallGuideSet.has(slug));

    defaultPlaylists = [
      { id: 'all-songs', name: '전체 곡', slugs: songs.map((s) => s.slug!) },
      { id: 'setlist-integrated', name: '세트리 통합', slugs: allSetlistSlugs },
      { id: 'setlist-a', name: '세트리 A', slugs: setlistASlugs },
      { id: 'setlist-b', name: '세트리 B', slugs: setlistBSlugs },
    ];
  }

  const song = songs.find((s) => s.slug === slug);
  if (!song) notFound();

  return { song: song!, songs, defaultPlaylists };
});

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
