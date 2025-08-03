'use client';

import { useEffect, useRef, useState, use, useMemo, useLayoutEffect } from 'react';
import Link from 'next/link';
import SpoilerGate from '@/components/SpoilerGate';
import { callSongs, Call, LyricLine } from '@/data/songs';

interface Token {
  text: string;
  time?: number;
}

interface ProcessedLine {
  jp: Token[];
  pron: Token[];
  ko: Token[];
  call?: Call;
}

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
  const tokenRefs = useRef<HTMLSpanElement[][]>([]);
  const [callPositions, setCallPositions] = useState<number[]>([]);

  const interpolateTokens = (tokens: Token[]): Token[] => {
    const res = tokens.map((t) => ({ ...t }));
    let last = -1;
    for (let i = 0; i < res.length; i++) {
      if (res[i].time != null) {
        if (last >= 0 && i - last > 1) {
          const start = res[last].time ?? 0;
          const end = res[i].time ?? start;
          const step = (end - start) / (i - last);
          for (let j = last + 1; j < i; j++) {
            res[j].time = start + step * (j - last);
          }
        }
        last = i;
      }
    }
    if (last >= 0) {
      const lastTime = res[last].time ?? 0;
      for (let j = last + 1; j < res.length; j++) res[j].time = lastTime;
    }
    if (res[0].time == null) res[0].time = 0;
    for (let i = 1; i < res.length; i++) {
      if (res[i].time == null) res[i].time = res[i - 1].time ?? 0;
    }
    return res as Token[];
  };

  const lyrics = useMemo<ProcessedLine[]>(() => {
    if (!song) return [];
    return song.lyrics.map((line: LyricLine) => {
      const jpChars = Array.from(line.jp);
      const pronChars = Array.from(line.pron);
      const koChars = Array.from(line.ko);
      const jp = interpolateTokens(
        jpChars.map((text, i) => ({
          text,
          time: line.times?.jp?.[i]?.[0],
        }))
      );
      const pron = pronChars.map((text, i) => ({
        text,
        time: jp[i]?.time,
      }));
      const ko = koChars.map((text, i) => ({
        text,
        time: jp[i]?.time,
      }));
      return { jp, pron, ko, call: line.call };
    });
  }, [song]);

  useEffect(() => {
    if (!song) return;
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('player', {
        videoId: song.videoId,
        events: {
          onReady: () => setReady(true),
        },
      }) as unknown as YTPlayer;
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    } else if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, [song]);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      const t = playerRef.current?.getCurrentTime() ?? 0;
      setCurrentTime(t);
    }, 100);
    return () => clearInterval(interval);
  }, [ready]);

  useLayoutEffect(() => {
    setCallPositions(
      lyrics.map((line, idx) => {
        const pos = line.call?.pos;
        if (pos == null) return 0;
        const el = tokenRefs.current[idx]?.[pos];
        return el?.offsetLeft ?? 0;
      })
    );
  }, [lyrics]);

  const callActive = (line: ProcessedLine) =>
    line.call ? currentTime >= line.call.start && currentTime <= line.call.end : false;
  const charActive = (token: Token) => currentTime >= (token.time ?? 0);

  if (!song) return <main>노래를 찾을 수 없습니다.</main>;

  return (
    <SpoilerGate>
    <main>
      <header className="header">
        <Link href="/call-guide" className="container header-content" style={{ textDecoration: 'none' }}>
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
          {song.summary.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="lyrics">
          {lyrics.map((line, idx) => (
            <div key={idx} className="lyric-line">
              <div
                className={`lyric-call${callActive(line) ? ' active' : ''}`}
                style={
                  line.call?.pos != null
                    ? { left: callPositions[idx], transform: 'none' }
                    : undefined
                }
              >
                {line.call?.text ?? ''}
              </div>
              <div className="lyric-row">
                {line.jp.map((token, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      if (!tokenRefs.current[idx]) tokenRefs.current[idx] = [];
                      tokenRefs.current[idx][i] = el!;
                    }}
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
    </SpoilerGate>
  );
}
