import Link from 'next/link';
import Image from 'next/image';
import SpoilerGate from '@/components/SpoilerGate';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = { title: '콜 가이드' };

export default async function CallGuideIndex() {
  const songs = await prisma.song.findMany({
    where: {
      slug: {
        not: null,
      },
      thumbnail: {
        not: null,
      },
      summary: {
        not: null,
      },
    },
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
            {songs.map((song) => (
              <Link
                key={song.slug!}
                href={`/call-guide/${song.slug}`}
                className="call-item"
                style={{ textDecoration: 'none' }}
              >
                <div className="call-info-link">
                  <Image
                    src={song.thumbnail!}
                    alt={song.title}
                    width={80}
                    height={80}
                    className="song-jacket"
                  />
                  <div className="song-text-info">
                    <p className="song-title">{song.krtitle ? song.krtitle : song.title}</p>
                    <p className="song-artist">{song.artist}</p>
                  </div>
                </div>
                <div className="call-item-summary">
                  {song.summary!.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </SpoilerGate>
  );
}
