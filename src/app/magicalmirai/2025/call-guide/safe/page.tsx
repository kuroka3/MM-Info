import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import SafeCallGuideIndexClient from './SafeCallGuideIndexClient';
import { getAlbumSongs, getSafeSongIndex } from '@/data/safeSongIndex';

export const metadata: Metadata = { title: '콜 가이드 - 스포 X' };
export const revalidate = 60;

const EVENT_SLUG = 'magical-mirai-2025';
const EVENT_BASE_PATH = '/magicalmirai/2025';
const SAFE_SONG_INDEX = getSafeSongIndex(EVENT_SLUG);
const ALBUM_SONGS = getAlbumSongs(EVENT_SLUG);

export default async function SafeCallGuidePage() {
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
    select: {
      id: true,
      title: true,
      krtitle: true,
      artist: true,
      krartist: true,
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

  const songsWithoutVariations = songs.map(song => {
    const hasVariation = song.eventVariations.some(v => v.isHigawari || v.isLocationgawari);
    if (hasVariation) {
      return { ...song, setlists: [{ order: 0 }], eventVariations: [] };
    }
    return song;
  }).filter(song => !song.eventVariations.some(v => v.isHigawari || v.isLocationgawari));

  songsWithoutVariations.sort((a, b) => {
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
        <SafeCallGuideIndexClient songs={songsWithoutVariations} safeSongIndex={SAFE_SONG_INDEX} albumSongs={ALBUM_SONGS} eventSlug={EVENT_SLUG} eventBasePath={EVENT_BASE_PATH} />
      </section>
    </main>
  );
}
