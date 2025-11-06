import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import CallGuideIndex from '@/components/call-guide/CallGuideIndex';
import SpoilerGate from '@/components/SpoilerGate';
import { MIKU_EXPO_ASIA_2025 } from '@/types/eventConfig';

export const metadata: Metadata = { title: '콜 가이드 - 스포 O' };
export const revalidate = 60;

const EVENT_SLUG = MIKU_EXPO_ASIA_2025.eventSlug;
const EVENT_BASE_PATH = MIKU_EXPO_ASIA_2025.eventBasePath;

export default async function CallGuideAllPage() {
  const event = await prisma.event.findUnique({
    where: { slug: EVENT_SLUG },
    select: { id: true },
  });

  const songs = await prisma.song.findMany({
    where: {
      slug: { not: null },
      thumbnail: { not: null },
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

  songs.sort((a, b) => {
    const orderA = a.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.setlists[0]?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  return (
    <SpoilerGate
      storageKey="spoilerConfirmed:mikuexpo-asia2025"
      overlayClassName="call-guide-spoiler"
      redirectPath="/mikuexpo/asia2025"
    >
      <main>
        <header className="header">
          <div className="container header-content">
            <h1 className="header-title">콜 가이드</h1>
            <p className="header-subtitle">공연에 나오는 콜이 있는 모든 곡</p>
          </div>
        </header>
        <section className="container call-section">
          <CallGuideIndex songs={songs} eventSlug={EVENT_SLUG} eventBasePath={EVENT_BASE_PATH} forceAllSongs={true} />
        </section>
      </main>
    </SpoilerGate>
  );
}
