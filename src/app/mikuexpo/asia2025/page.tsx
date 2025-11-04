import Image from 'next/image';
import Link from 'next/link';

const basePath = '/mikuexpo/asia2025';

const menu = [
  { href: `${basePath}/setlist`, label: '세트리스트', icon: '/images/list.svg' },
  { href: `${basePath}/concert-guide`, label: '공연 정보', icon: '/images/ticket.svg' },
  { href: `${basePath}/call-guide`, label: '콜 가이드', icon: '/images/megaphone.svg' },
];

export default function Home() {
  return (
    <main className="landing-main" aria-label="메인 메뉴">
      <div className="landing-wrapper">
        <div className="landing-header">
          <h1 className="landing-title">MIKU EXPO ASIA 2025<br></br>정보 모음</h1>
        </div>

        <div className="landing-menu">
          {menu.map(({ href, label, icon }) => (
            <Link key={href} href={href} className="menu-card" aria-label={label}>
              <div className="menu-icon">
                <Image src={icon} alt="" width={80} height={80} priority />
              </div>
              <span className="menu-label">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="landing-utility-links" aria-label="이전 공연 바로가기">
        <Link href="/legacy" className="landing-utility-link glass-effect">
          이전 공연
        </Link>
      </div>
    </main>
  );
}
