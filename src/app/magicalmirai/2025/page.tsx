import Image from 'next/image';
import Link from 'next/link';

const basePath = '/magicalmirai/2025';

const menu = [
  { href: `${basePath}/setlist`, label: '세트리스트', icon: '/images/list.svg' },
  { href: `${basePath}/concert-guide`, label: '공연 가이드', icon: '/images/ticket.svg' },
  { href: `${basePath}/exhibition-info`, label: '기획전 정보', icon: '/images/info.svg' },
  { href: `${basePath}/call-guide`, label: '콜 가이드', icon: '/images/megaphone.svg' },
];

export default function Home() {
  return (
    <main className="landing-main" aria-label="메인 메뉴">
      <div className="landing-wrapper">
        <div className="landing-header">
          <h1 className="landing-title">2025 마지미라 정보 모음</h1>
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
    </main>
  );
}
