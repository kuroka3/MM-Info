'use client';

import { useEffect, useRef, useState, use } from 'react';
import Link from 'next/link';
import { callSongs, LyricLine, Token } from '@/data/songs';

interface YTPlayer {
  getCurrentTime: () => number;
}

declare global {
  interface Window {
    YT: { Player: new (...args: unknown[]) => YTPlayer };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function CallGuideSongPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const song = callSongs.find((s) => s.slug === slug);
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!song) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('player', {
        videoId: song.videoId,
        events: {
          onReady: () => setReady(true),
        },
      }) as unknown as YTPlayer;
    };
  }, [song]);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      const t = playerRef.current?.getCurrentTime() ?? 0;
      setCurrentTime(t);
    }, 100);
    return () => clearInterval(interval);
  }, [ready]);

  const callActive = (line: LyricLine) =>
    line.call ? currentTime >= line.call.start && currentTime <= line.call.end : false;
  const charActive = (token: Token) => currentTime >= token.time;

  if (!song) return <main>노래를 찾을 수 없습니다.</main>;

  return (
    <main>
      <header className="header">
        <Link href="/call-guide" className="container header-content">
          <h1 className="header-title">콜 가이드</h1>
          <p className="header-subtitle">{song.title}</p>
        </Link>
      </header>

      <section className="container call-section">
        <div className="player-wrapper">
          <div id="player" className="video-player" />
        </div>

        <div className="glass-effect call-summary-box">
          <h3 className="call-summary-title">콜 정리</h3>
          <ul className="call-summary-list">
            {song.summary.map((c) => (
              <li key={c.time}>{c.text}</li>
            ))}
          </ul>
        </div>

        <div className="lyrics">
          {song.lyrics.map((line, idx) => (
            <div key={idx} className="lyric-line">
              <div className={`lyric-call${callActive(line) ? ' active' : ''}`}>{line.call?.text ?? ''}</div>
              <div className="lyric-row">
                {line.jp.map((token, i) => (
                  <span
                    key={i}
                    className={`lyric-char${charActive(token) ? ' active' : ''}`}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
              <div className="lyric-row">
                {line.pron.map((token, i) => (
                  <span
                    key={i}
                    className={`lyric-char${charActive(token) ? ' active' : ''}`}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
              <div className="lyric-row">
                {line.ko.map((token, i) => (
                  <span
                    key={i}
                    className={`lyric-char${charActive(token) ? ' active' : ''}`}
                  >
                    {token.text}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
