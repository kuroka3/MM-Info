import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import SpoilerGate from '@/components/SpoilerGate'
import prisma from '@/lib/prisma'
import { groupConcertsByVenue, type ConcertWithVenue } from '@/utils/groupConcerts'

const inter = Inter({ subsets: ['latin'], weight: ['600', '700', '800'] })

const EVENT_PATH_MAP: Record<string, string | undefined> = {
  'miku-expo-2025-asia': '/mikuexpo/asia2025',
  'magical-mirai-2025': '/magicalmirai/2025',
}

const fetchEvent = (slug: string) =>
  prisma.event.findUnique({
    where: { slug },
    include: {
      series: true,
      concerts: {
        orderBy: [
          { date: 'asc' },
          { block: 'asc' },
        ],
        include: { venue: true },
      },
    },
  })

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = await fetchEvent((await params).slug)
  if (!event) {
    return { title: '이벤트를 찾을 수 없습니다.' }
  }

  return { title: `${event.name} 세트리스트` }
}

const EventSetlistsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const event = await fetchEvent(slug)

  if (!event) {
    notFound()
  }

  const venueGroups = groupConcertsByVenue(event.concerts as ConcertWithVenue[])
  const hasConcerts = venueGroups.length > 0
  const basePath = EVENT_PATH_MAP[event.slug ?? '']

  return (
    <SpoilerGate>
      <main className={inter.className}>
        <header className="header">
          <div className="container header-content">
            <h1 className="header-title">세트리스트</h1>
            <p className="header-subtitle">
              {event.series ? `${event.series.name} › ${event.name}` : event.name}
            </p>
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

                            if (!basePath) {
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
                <p className="feature-text">등록된 공연 세트리스트가 없는 이벤트입니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </SpoilerGate>
  )
}

export default EventSetlistsPage
