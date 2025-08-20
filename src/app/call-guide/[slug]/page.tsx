import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import { Prisma, type Song } from '@prisma/client';
import CallGuideClient from './CallGuideClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SAFE_SONG_INDEX } from '@/data/safeSongIndex';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 60;

const getSongData = async (slug: string): Promise<{ song: Song; songs: Song[] }> => {
  const songs = await prisma.song.findMany({
    where: {
      slug: { not: null },
      videoId: { not: null },
      summary: { not: null },
      lyrics: { not: Prisma.JsonNull },
    },
    include: {
      setlists: {
        select: { order: true, higawari: true, locationgawari: true },
        orderBy: { order: 'asc' },
        take: 1,
      },
    },
  });

  songs.sort((a, b) => {
    const idxA = SAFE_SONG_INDEX.indexOf(a.slug!);
    const idxB = SAFE_SONG_INDEX.indexOf(b.slug!);
    const orderA = idxA === -1 ? Number.MAX_SAFE_INTEGER : idxA;
    const orderB = idxB === -1 ? Number.MAX_SAFE_INTEGER : idxB;
    return orderA - orderB;
  });

  const song = songs.find((s) => s.slug === slug);
  if (!song) notFound();

  return { song: song!, songs };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { song } = await getSongData(slug);
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

export default async function CallGuideSongPage({ params }: PageProps) {
  const { slug } = await params;
  const { song, songs } = await getSongData(slug);
  return (
    <Suspense fallback={null}>
      <CallGuideClient song={song} songs={songs} />
    </Suspense>
  );
}
