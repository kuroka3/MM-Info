import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import CallGuideIndex from '@/components/call-guide/CallGuideIndex';
import SpoilerGate from '@/components/SpoilerGate';
import { MAGICAL_MIRAI_2025 } from '@/types/eventConfig';

export const metadata: Metadata = { title: '콜 가이드 - 스포 O' };
export const revalidate = 60;

const EVENT_SLUG = MAGICAL_MIRAI_2025.eventSlug;
const EVENT_BASE_PATH = MAGICAL_MIRAI_2025.eventBasePath;

export default async function CallGuideAllPage() {
  const event = await prisma.event.findUnique({
    where: { slug: EVENT_SLUG },
    select: { id: true },
  });

  const concerts = event
    ? await prisma.concert.findMany({
        where: { eventId: event.id, setlistId: { not: null } },
        include: {
          venue: true,
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

  const songToOrderMap = new Map<string, number>();
  const songToVenuesMap = new Map<string, Set<string>>();
  const songToHigawariMap = new Map<string, Set<string>>();

  concerts.forEach((concert) => {
    if (!concert.setlist) return;

    concert.setlist.songs.forEach((ss) => {
      const songSlug = ss.song?.slug;
      if (!songSlug) return;

      const currentOrder = songToOrderMap.get(songSlug);
      if (currentOrder === undefined || ss.order < currentOrder) {
        songToOrderMap.set(songSlug, ss.order);
      }

      if (concert.venue) {
        if (!songToVenuesMap.has(songSlug)) {
          songToVenuesMap.set(songSlug, new Set());
        }
        songToVenuesMap.get(songSlug)!.add(concert.venue.name);
      }

      if (concert.setlist?.higawariLabel) {
        if (!songToHigawariMap.has(songSlug)) {
          songToHigawariMap.set(songSlug, new Set());
        }
        songToHigawariMap.get(songSlug)!.add(concert.setlist.higawariLabel);
      }
    });
  });

  const venueMap = new Map<string, string[]>();
  songToVenuesMap.forEach((venues, slug) => {
    venueMap.set(slug, Array.from(venues));
  });

  const higawariLabelMap = new Map<string, string>();
  songToHigawariMap.forEach((labels, slug) => {
    higawariLabelMap.set(slug, Array.from(labels).join(', '));
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

  return (
    <SpoilerGate
      storageKey="spoilerConfirmed:magical-mirai-2025"
      overlayClassName="call-guide-spoiler"
      redirectPath="/magicalmirai/2025"
    >
      <main>
        <header className="header">
          <div className="container header-content">
            <h1 className="header-title">콜 가이드</h1>
            <p className="header-subtitle">공연에 나오는 콜이 있는 모든 곡</p>
          </div>
        </header>
        <section className="container call-section">
          <CallGuideIndex
            songs={songs}
            eventSlug={EVENT_SLUG}
            eventBasePath={EVENT_BASE_PATH}
            showBadges={true}
            songToOrderMap={songToOrderMap}
            venueMap={venueMap}
            higawariLabelMap={higawariLabelMap}
          />
        </section>
      </main>
    </SpoilerGate>
  );
}
