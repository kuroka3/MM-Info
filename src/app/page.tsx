import Image from 'next/image';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['700', '800'] });

const menu = [
  { href: '/setlist', label: '세트리스트', icon: '/list.svg' },
  { href: '/concert-guide', label: '공연 가이드', icon: '/ticket.svg' },
  { href: '/exhibition-info', label: '기획전 정보', icon: '/info.svg' },
  { href: '/call-guide', label: '콜 가이드', icon: '/megaphone.svg' },
];

export default function Home() {
  return (
    <main
      className={`${inter.className} landing-page min-h-screen flex flex-col items-center`}
      aria-label="메인 메뉴"
    >
      <div className="w-full max-w-6xl">
        <div className="py-6 text-center">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            2025 매지컬 미라이 정보 모음
          </h1>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 mx-auto w-full" style={{ height: 'calc(100vh - 140px)' }}>
          {menu.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl p-10 no-underline transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
              aria-label={label}
            >
              <div className="absolute inset-0 -z-10 rounded-2xl bg-[rgba(255,255,255,0.03)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]" />
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[rgba(255,255,255,0.03)]" />
              </div>

              <div className="flex flex-col items-center justify-center gap-6 text-[rgba(255,255,255,0.95)] w-full h-full">
                <div className="w-28 h-28 flex items-center justify-center">
                  <Image
                    src={icon}
                    alt=""
                    width={72}
                    height={72}
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                    priority
                  />
                </div>
                <span className="text-4xl sm:text-5xl font-semibold">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
