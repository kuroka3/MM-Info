import Link from 'next/link';
import Image from 'next/image';
import { callSongs } from '@/data/songs';

export default function CallGuideIndex() {
  return (
    <main>
      <header className="header">
        <div className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">곡을 선택하세요</p>
        </div>
      </header>

      <section className="container call-section">
        <div className="call-list">
          {callSongs.map((song) => (
            <div key={song.slug} className="call-item">
              <Link href={`/call-guide/${song.slug}`} className="call-info-link">
                <Image
                  src={song.thumbnail}
                  alt={song.title}
                  width={80}
                  height={80}
                  className="song-jacket"
                />
                <div className="song-text-info">
                  <p className="song-title">{song.title}</p>
                  <p className="song-artist">{song.artist}</p>
                </div>
              </Link>
              <div className="call-item-summary">
                {song.summary.map((c) => (
                  <p key={c.time}>{c.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
