import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import CallGuideIndexClient from '../CallGuideIndexClient';

export const metadata: Metadata = { title: '콜 가이드 - 스포 O' };
export const revalidate = 60;

export default async function CallGuideAllPage() {
  const songs = await prisma.song.findMany({
    where: {
      slug: { not: null },
      thumbnail: { not: null },
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
    const orderA = a.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">공연에 나오는 콜이 있는 모든 곡</p>
        </div>
      </header>
      <section className="container call-section">
        <CallGuideIndexClient songs={songs} />
      </section>
    </main>
  );
}
