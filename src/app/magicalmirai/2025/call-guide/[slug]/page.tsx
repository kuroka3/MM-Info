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
export const dynamicParams = true;

const EVENT_SLUG = 'magical-mirai-2025';
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

const getSongData = cache(async (
  slug: string,
  isSafeMode: boolean,
): Promise<{ song: Song; songs: Song[] }> => {
  const eventId = await getEventId();
  const songs = await getAllSongs(eventId);

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

  return { song: song!, songs };
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
  const { song, songs } = await getSongData(slug, isSafeMode);
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
      />
    </Suspense>
  );
}
