import SpoilerGate from '@/components/SpoilerGate';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import CallGuideIndexClient from './CallGuideIndexClient';

export const metadata: Metadata = { title: '콜 가이드' };
export const revalidate = 60;

export default async function CallGuideIndex() {
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
    <SpoilerGate>
      <main>
        <header className="header">
          <div className="container header-content">
            <h1 className="header-title">콜 가이드</h1>
            <p className="header-subtitle">곡을 선택하세요</p>
          </div>
        </header>

        <section className="container call-section">
          <CallGuideIndexClient songs={songs} />
        </section>
      </main>
    </SpoilerGate>
  );
}
