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
    <main className="container pt-16">
      <h1 className="header-title text-center">세트리스트</h1>
      <p className="header-subtitle text-center mb-12">
        장소와 날짜별 콘서트를 확인하세요.
      </p>
      <div className="space-y-8">
        {schedule.map(({ venue, shows }) => (
          <div
            key={venue}
            className="flex flex-col sm:flex-row items-start gap-4 p-6 rounded-2xl border border-[rgb(var(--card-border-rgb))] bg-[rgb(var(--card-rgb))] hover:border-[rgb(var(--primary-rgb))]/40 transition-colors"
          >
            <div className="sm:w-1/3 text-3xl sm:text-4xl font-semibold text-left">{venue}</div>
            <ul className="sm:w-2/3 flex flex-wrap gap-2 list-none p-0 m-0">
              {shows.map(({ date, day, block, id }) => (
                <li key={`${date}-${block}`}>
                  {id ? (
                    <Link
                      href={`/concerts/${id}`}
                      className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
                    >
                      {date} {day} {block}
                    </Link>
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 cursor-not-allowed">
                      {date} {day} {block}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
