import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import SpoilerGate from '@/components/SpoilerGate';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { groupConcertsByVenue, type ConcertWithVenue } from '@/utils/groupConcerts';

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

export const metadata: Metadata = { title: '세트리스트' };
export const revalidate = 60;

const basePath = '/magicalmirai/2025';
const EVENT_SLUG = 'magical-mirai-2025';

export default async function Page() {
  const event = await prisma.event.findUnique({
    where: { slug: EVENT_SLUG },
    include: {
      concerts: {
        orderBy: [
          { date: 'asc' },
          { block: 'asc' },
        ],
        include: { venue: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const venueGroups = groupConcertsByVenue(event.concerts as ConcertWithVenue[]);
  const hasConcerts = venueGroups.length > 0;

  return (
    <SpoilerGate storageKey="spoilerConfirmed:magical-mirai-2025" redirectPath="/magicalmirai/2025">
      <main className={inter.className}>
        <header className="header">
          <div className="container header-content">
            <h1 className="header-title">세트리스트</h1>
            <p className="header-subtitle">공연 회차를 선택하세요</p>
          </div>
        </header>

        <section className="container">
          <div className="features-grid">
            {hasConcerts ? (
              venueGroups.map(({ venueName, concerts }) => (
                <div key={venueName} className="feature-card">
                  <h3 className="feature-title">{venueName}</h3>
                  <div className="feature-list">
                    {concerts.map(({ date, day, blocks }) => (
                      <div key={date} className="date-row">
                        <span className="header-date">{`${date} (${day})`}</span>
                        <div className="block-buttons">
                          {blocks.map(({ block, label, id, hidden, concertId }, blockIndex) => {
                            const key = id ? `set-${id}` : `concert-${concertId}-${blockIndex}`
                            if (hidden) {
                              return (
                                <span key={key} className="block-placeholder">
                                  {label}
                                </span>
                              )
                            }

                            if (!id) {
                              return (
                                <span key={key} className="glass-effect block-disabled">
                                  {label}
                                </span>
                              )
                            }

                            return (
                              <Link
                                key={key}
                                href={`${basePath}/concerts/${id}?date=${encodeURIComponent(
                                  date
                                )}&block=${encodeURIComponent(block)}`}
                                className="glass-effect block-link"
                              >
                                {label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="feature-card">
                <h3 className="feature-title">세트리스트 준비 중</h3>
                <p className="feature-text">
                  등록된 공연 세트리스트가 없는 이벤트입니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </SpoilerGate>
  );
}
