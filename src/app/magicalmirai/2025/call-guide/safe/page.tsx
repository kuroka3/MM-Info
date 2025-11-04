import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import SafeCallGuideIndexClient from './SafeCallGuideIndexClient';
import { SAFE_SONG_INDEX } from '@/data/safeSongIndex';

export const metadata: Metadata = { title: '콜 가이드 - 스포 X' };
export const revalidate = 60;

export default async function SafeCallGuidePage() {
  const songs = await prisma.song.findMany({
    where: {
      slug: { not: null },
      thumbnail: { not: null },
      summary: { not: null },
      lyrics: { not: Prisma.JsonNull },
    },
    select: {
      id: true,
      title: true,
      krtitle: true,
      artist: true,
      slug: true,
      videoId: true,
      summary: true,
      lyrics: true,
      spotify: true,
      youtube: true,
      thumbnail: true,
      part: true,
      anotherName: true,
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
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">앨범에 포함된 스포 X 곡</p>
        </div>
      </header>
      <section className="container call-section">
        <SafeCallGuideIndexClient songs={songs} />
      </section>
    </main>
  );
}