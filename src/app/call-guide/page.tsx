import Link from 'next/link';
import Image from 'next/image';
import SpoilerGate from '@/components/SpoilerGate';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { CSSProperties } from 'react';

const partColors = {
  MIKU: '#39c5bbaa',
  RIN: '#ffa500aa',
  LEN: '#ffe211aa',
  LUKA: '#ffc0cbaa',
  KAITO: '#0000ffaa',
  MEIKO: '#d80000aa',
} as const;

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
        select: { order: true },
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
          <div className="call-list">
            {songs.map((song) => {
              const order = song.setlists[0]?.order ?? 0;
              const itemClass = 'call-item';

              const colors = song.part
                ? song.part
                    .map((name) => partColors[name as keyof typeof partColors])
                    .filter(Boolean)
                : [];

              const borderStyle: CSSProperties =
                colors.length > 0
                  ? {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '24px',
                      padding: '2px',
                      background:
                        colors.length === 1
                          ? colors[0]
                          : `linear-gradient(to bottom right, ${colors.join(', ')})`,
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      pointerEvents: 'none',
                    }
                  : {};

              return (
                <Link
                  key={song.slug!}
                  href={`/call-guide/${song.slug}`}
                  className={itemClass}
                  style={{ textDecoration: 'none' }}
                >
                  {colors.length > 0 && <div style={borderStyle} />}
                  <span className="song-index">{order}</span>
                  <div className="call-info-link">
                    <Image
                      src={song.thumbnail!}
                      alt={song.title}
                      width={80}
                      height={80}
                      className="song-jacket"
                    />
                    <div className="song-text-info">
                      <p className="song-title">
                        {song.krtitle ? song.krtitle : song.title}
                      </p>
                      <p className="song-artist">{song.artist}</p>
                    </div>
                  </div>
                  <div className="call-item-summary">
                    {song.summary!.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </SpoilerGate>
  );
}
