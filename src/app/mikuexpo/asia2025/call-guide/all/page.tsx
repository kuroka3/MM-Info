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

  const setlistASlugToOrder = new Map<string, number>();
  const setlistBSlugToOrder = new Map<string, number>();
  const allSetlistSlugToOrder = new Map<string, number>();

  concerts.forEach((concert) => {
    if (!concert.setlist) return;

    const songItems = concert.setlist.songs.filter(
      (ss) => ss.type === 'song' && ss.song?.slug
    );

    songItems.forEach((ss, index) => {
      const slug = ss.song!.slug!;
      const songOnlyOrder = index + 1;

      if (!allSetlistSlugToOrder.has(slug)) {
        allSetlistSlugToOrder.set(slug, songOnlyOrder);
      }

      if (concert.setlist?.higawariLabel === 'A' && !setlistASlugToOrder.has(slug)) {
        setlistASlugToOrder.set(slug, songOnlyOrder);
      } else if (concert.setlist?.higawariLabel === 'B' && !setlistBSlugToOrder.has(slug)) {
        setlistBSlugToOrder.set(slug, songOnlyOrder);
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

  // Create a Set of slugs that have call-guide data
  const songsWithCallGuideSet = new Set(songs.map((s) => s.slug));

  // Filter setlist slugs to only include songs with call-guide data
  const filteredSetlistASlugs = setlistASlugs.filter((slug) => songsWithCallGuideSet.has(slug));
  const filteredSetlistBSlugs = setlistBSlugs.filter((slug) => songsWithCallGuideSet.has(slug));
  const filteredAllSetlistSlugs = allSetlistSlugs.filter((slug) => songsWithCallGuideSet.has(slug));

  const defaultPlaylists = [
    { id: 'all-songs', name: '전체 곡', slugs: songs.map((s) => s.slug!) },
    { id: 'setlist-integrated', name: '세트리 통합', slugs: filteredAllSetlistSlugs },
    { id: 'setlist-a', name: '세트리 A', slugs: filteredSetlistASlugs },
    { id: 'setlist-b', name: '세트리 B', slugs: filteredSetlistBSlugs },
  ];

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
          <CallGuideIndex
            songs={songs}
            eventSlug={EVENT_SLUG}
            eventBasePath={EVENT_BASE_PATH}
            showBadges={true}
            songToOrderMap={songToOrderMap}
            venueMap={venueMap}
            higawariLabelMap={higawariLabelMap}
            defaultPlaylists={defaultPlaylists}
          />
        </section>
      </main>
    </SpoilerGate>
  );
}
