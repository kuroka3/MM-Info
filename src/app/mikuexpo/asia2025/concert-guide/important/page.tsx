import type { Metadata } from 'next';
import NoticeScroll from '@/components/NoticeScroll';
import ScrollTopButton from '@/components/ScrollTopButton';

const sections = [
  {
    id: 'test',
    title: '추가중입니다.',
    description:
      '추가중입니다.',
    items: [
      '업데이트 예정',
    ],
  },
];

export const metadata: Metadata = {
  title: '주의 사항',
};

export default function ImportantNoticesPage() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1 className="header-title">주의 사항</h1>
          <p className="header-subtitle">하츠네 미쿠 &lt;MIKU EXPO ASIA TOUR 2025&gt; 안내</p>
        </div>
      </header>

      <div className="container notice-alert">
        <a href="#entry">입장 전 꼭 확인하세요</a>
      </div>

      <nav className="container notice-nav">
        <ul>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <NoticeScroll />

      {sections.map(({ id, title, description, items }) => (
        <section key={id} id={id} className="container notice-section">
          <div className="notice-box info-box">
            <h2 className="section-title">{title}</h2>
            <p className="text-left">{description}</p>
            <ul className="notice-list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <ScrollTopButton />
    </main>
  );
}
