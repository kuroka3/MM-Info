import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import SpoilerGate from '@/components/SpoilerGate';
import prisma from '@/lib/prisma';
import type { Concert } from '@prisma/client';

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

export const metadata: Metadata = { title: '세트리스트' };

const group = (arr: Concert[]) => {
  const map = new Map<string, {
    day: string;
    blocks: { block: string; id: number | null; hidden?: boolean | null }[];
  }>();
  arr.forEach((s) => {
    if (!map.has(s.date)) map.set(s.date, { day: s.day, blocks: [] });
    map.get(s.date)!.blocks.push({ block: s.block, id: s.setlistId, hidden: s.hidden });
  });
  return [...map].map(([date, { day, blocks }]) => ({ date, day, blocks }));
};

export default async function Page() {
  const venues = await prisma.venue.findMany({
    include: {
      concerts: {
        orderBy: [
          {
            date: 'asc',
          },
          {
            block: 'asc',
          },
        ],
      },
    },
  });

  return (
    <SpoilerGate>
      <main className={inter.className}>
        <header className="header">
        <div className="container header-content">
          <h1 className="header-title">세트리스트</h1>
          <p className="header-subtitle">공연 회차를 선택하세요</p>
        </div>
      </header>

      <section className="container">
        <div className="features-grid">
          {venues.map(({ name, concerts }) => (
            <div key={name} className="feature-card">
              <h3 className="feature-title">{name}</h3>
              <div className="feature-list">
                {group(concerts).map(({ date, day, blocks }) => (
                  <div key={date} className="date-row">
                    <span className="header-date">{`${date} (${day})`}</span>
                    <div className="block-buttons">
                      {blocks.map(({ block: t, id, hidden }) =>
                        hidden ? (
                          <span key={t} className="block-placeholder">
                            {t}
                          </span>
                        ) : id ? (
                          <Link
                            key={t}
                            href={`/concerts/${id}?date=${encodeURIComponent(
                              date
                            )}&block=${encodeURIComponent(t)}`}
                            className="glass-effect block-link"
                          >
                            {t}
                          </Link>
                        ) : (
                          <span key={t} className="glass-effect block-disabled">
                            {t}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      </main>
    </SpoilerGate>
  );
}
