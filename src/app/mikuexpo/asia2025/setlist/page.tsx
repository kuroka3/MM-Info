import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import SpoilerGate from '@/components/SpoilerGate';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  groupConcertsByVenue,
  type ConcertWithVenue,
  type VenueGroup,
} from '@/utils/groupConcerts';
import './global.css';

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] });

export const metadata: Metadata = { title: '세트리스트' };
export const revalidate = 60;

const basePath = '/mikuexpo/asia2025';
const EVENT_SLUG = 'miku-expo-2025-asia';

export default async function Page() {
  const event = await prisma.event.findUnique({
    where: { slug: EVENT_SLUG },
    include: {
      concerts: {
        orderBy: [
          { date: 'asc' },
          { block: 'asc' },
        ],
        include: {
          venue: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const venueGroups = groupConcertsByVenue(event.concerts as ConcertWithVenue[]);
  const seoulGroups = venueGroups.filter(({ venueName }) => venueName.includes('서울'));
  const hasConcerts = seoulGroups.length > 0 || venueGroups.length > 0;

  const renderVenueCard = (
    venueName: string,
    concerts: VenueGroup['concerts'],
    variant: 'default' | 'primary' | 'ghost',
    keySuffix: string
  ) => {
    const isSeoul = venueName.includes('서울');
    const cardClassNames = ['feature-card'];

    if (isSeoul) {
      cardClassNames.push('seoul-card');
      if (variant === 'primary') {
        cardClassNames.push('seoul-card--primary');
      }
      if (variant === 'ghost') {
        cardClassNames.push('seoul-card--ghost');
      }
    }

    return (
      <div key={`${venueName}-${keySuffix}`} className={cardClassNames.join(' ')}>
        <h3 className="feature-title">{venueName}</h3>
        <div className="feature-list">
          {concerts.map(({ date, day, blocks }) => (
            <div key={date} className="date-row">
              <span className="header-date">{`${date} (${day})`}</span>
              <div className="block-buttons">
                {blocks.map(({ block, label, id, hidden, concertId }, blockIndex) => {
                  const key = id ? `set-${id}` : `concert-${concertId}-${blockIndex}`;

                  if (hidden) {
                    return (
                      <span key={key} className="block-placeholder">
                        {label}
                      </span>
                    );
                  }

                  if (!id) {
                    return (
                      <span key={key} className="glass-effect block-disabled">
                        {label}
                      </span>
                    );
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
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SpoilerGate storageKey="spoilerConfirmed:mikuexpo-asia2025">
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
              <>
                {seoulGroups.map(({ venueName, concerts }, index) =>
                  renderVenueCard(venueName, concerts, 'primary', `highlight-${index}`)
                )}
                {venueGroups.map(({ venueName, concerts }, index) =>
                  renderVenueCard(
                    venueName,
                    concerts,
                    venueName.includes('서울') ? 'ghost' : 'default',
                    `list-${index}`
                  )
                )}
              </>
            ) : (
              <div className="feature-card">
                <h3 className="feature-title">세트리스트 준비 중</h3>
                <p className="feature-text">등록된 공연 세트리스트가 없는 이벤트입니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </SpoilerGate>
  );
}
