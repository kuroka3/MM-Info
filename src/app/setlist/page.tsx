import Link from 'next/link';

const schedule = [
  {
    venue: '센다이',
    shows: [
      { date: '08/01', day: "금", block: '밤', id: '1' },
      { date: '08/02', day: "토", block: '낮', id: null },
      { date: '08/02', day: "토", block: '밤', id: null },
      { date: '08/03', day: "일", block: '낮', id: null },
      { date: '08/03', day: "일", block: '밤', id: null },
    ],
  },
  {
    venue: '오사카',
    shows: [
      { date: '08/09', day: "토", block: '낮', id: null },
      { date: '08/09', day: "토", block: '밤', id: null },
      { date: '08/10', day: "일", block: '낮', id: null },
      { date: '08/10', day: "일", block: '밤', id: null },
      { date: '08/11', day: "월", block: '낮', id: null },
      { date: '08/11', day: "월", block: '밤', id: null },
    ],
  },
  {
    venue: '도쿄',
    shows: [
      { date: '08/29', day: "금", block: '낮', id: null },
      { date: '08/29', day: "금", block: '밤', id: null },
      { date: '08/30', day: "토", block: '낮', id: null },
      { date: '08/30', day: "토", block: '밤', id: null },
      { date: '08/31', day: "일", block: '낮', id: null },
      { date: '08/31', day: "일", block: '밤', id: null },
    ],
  },
];

export default function SetlistPage() {
  return (
    <main className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="header-title">세트리스트</h1>
      <p className="header-subtitle" style={{ marginBottom: '2rem' }}>
        장소와 날짜별 콘서트를 확인하세요.
      </p>
      {schedule.map(({ venue, shows }) => (
        <section key={venue} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{venue}</h2>
          <ul className="space-y-1">
            {shows.map(({ date, day, block, id }) => (
              <li key={`${date}-${block}`}>
                {id ? (
                  <Link href={`/concerts/${id}`} className="text-blue-600 hover:underline">
                    {date} {day} {block}
                  </Link>
                ) : (
                  <span className="opacity-50 cursor-not-allowed">
                    {date} {day} {block}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
