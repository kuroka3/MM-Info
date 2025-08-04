import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import CallGuideClient from './CallGuideClient';
import { notFound } from 'next/navigation';
import type { Song } from '@prisma/client';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getSongData = async (slug: string): Promise<{ song: Song; prevSong: Song | null; nextSong: Song | null }> => {
    const allCallSongs = await prisma.song.findMany({
        where: {
          slug: { not: null },
          videoId: { not: null },
          summary: { not: null },
          lyrics: { not: Prisma.JsonNull },
        },
        orderBy: { title: 'asc' },
    });

    const songIndex = allCallSongs.findIndex((s) => s.slug === slug);

    if (songIndex === -1) {
        notFound();
    }

    const song = allCallSongs[songIndex];
    const prevSong = songIndex > 0 ? allCallSongs[songIndex - 1] : null;
    const nextSong = songIndex < allCallSongs.length - 1 ? allCallSongs[songIndex + 1] : null;

    return { song, prevSong, nextSong };
}

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

  return songs.map((song) => ({
    slug: song.slug!,
  }));
}

export default async function CallGuideSongPage({ params }: PageProps) {
  const { slug } = await params;
  const { song, prevSong, nextSong } = await getSongData(slug);

  return <CallGuideClient song={song} prevSong={prevSong} nextSong={nextSong} />;
}