import Image from 'next/image';
import Link from 'next/link';

const menu = [
  { href: '/setlist', label: '세트리스트', icon: '/list.svg' },
  { href: '/concert-guide', label: '공연 가이드', icon: '/ticket.svg' },
  { href: '/exhibition-info', label: '기획전 정보', icon: '/info.svg' },
  { href: '/call-guide', label: '콜 가이드', icon: '/megaphone.svg' },
];

export default function Home() {
  return (
    <main className="landing-page min-h-screen flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-center">
        2025 매지컬 미라이 정보 모음
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {menu.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group block bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center hover:bg-[rgba(255,255,255,0.1)] transition-transform transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={icon}
                  alt=""
                  width={64}
                  height={64}
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-xl font-semibold">{label}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
