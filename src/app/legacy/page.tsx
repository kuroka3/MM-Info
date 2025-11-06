import Link from 'next/link';
import prisma from '@/lib/prisma';

export const revalidate = 60;

const MAIN_EVENT_SLUG = 'miku-expo-2025-asia';

const EVENT_ROUTES: Record<string, string> = {
  'magical-mirai-2025': '/magicalmirai/2025',
  'miku-expo-2025-asia': '/mikuexpo/asia2025',
};

async function getLegacyEvents() {
  const events = await prisma.event.findMany({
    where: {
      slug: {
        not: MAIN_EVENT_SLUG,
      },
    },
    include: {
      series: true,
      concerts: {
        include: {
          venue: true,
        },
      },
    },
    orderBy: [
      { year: 'desc' },
      { name: 'asc' },
    ],
  });

  return events.map(event => {
    const uniqueVenues = Array.from(
      new Set(
        event.concerts
          .map(c => c.venue?.name)
          .filter((name): name is string => name !== null && name !== undefined)
      )
    );

    return {
      href: EVENT_ROUTES[event.slug] || `/events/${event.slug}`,
      title: event.name,
      description: `세트리스트, 공연 정보, 콜 가이드 등 ${event.year}년 ${event.series?.name || event.name} 정보모음`,
      badges: [
        event.series?.name,
        event.year?.toString(),
        ...uniqueVenues,
      ].filter((badge): badge is string => badge !== undefined && badge !== null),
    };
  });
}

export default async function LegacyIndexPage() {
  const legacyLandings = await getLegacyEvents();
  return (
    <main className="legacy-main" aria-labelledby="legacy-title">
      <div className="legacy-wrapper">
        <header className="legacy-header">
          <p className="legacy-eyebrow">ARCHIVE</p>
          <h1 id="legacy-title" className="legacy-title">
            이전 공연 아카이브
          </h1>
          <p className="legacy-description">
            지나간 공연들의 정보모음 리스트
          </p>
        </header>

        <div className="legacy-grid" role="list">
          {legacyLandings.map(({ href, title, description, badges }) => (
            <Link key={href} href={href} className="legacy-card glass-effect" role="listitem">
              <div className="legacy-card-badges">
                {badges.map((badge, index) => (
                  <span key={index} className="legacy-card-badge">{badge}</span>
                ))}
              </div>
              <span className="legacy-card-title">{title}</span>
              <span className="legacy-card-description">{description}</span>
              <span className="legacy-card-link">바로가기 →</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="landing-utility-links" aria-label="보조 링크">
        <Link href="/" className="landing-utility-link glass-effect">
          메인 페이지로
        </Link>
      </div>
    </main>
  );
}
