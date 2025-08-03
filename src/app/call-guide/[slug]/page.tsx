'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: { Player: new (...args: unknown[]) => YTPlayer };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function CallGuideSongPage() {
  const { slug } = useParams<{ slug: string }>();
  const song = callSongs.find((s) => s.slug === slug);
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const tokenRefs = useRef<HTMLSpanElement[][]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const [callPositions, setCallPositions] = useState<number[]>([]);
  const autoScrollRef = useRef(true);
  const programmaticScrollRef = useRef(false);

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
    if (last < 0) return res as Token[];

    const lastTime = res[last].time ?? 0;
    for (let j = last + 1; j < res.length; j++) res[j].time = lastTime;

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
      const jp = jpChars.map<Token>((text) => ({ text }));
      const pron = pronChars.map<Token>((text) => ({ text }));
      const ko = koChars.map<Token>((text) => ({ text }));

      if (line.times) {
        Object.entries(line.times).forEach(([key, time]) => {
          const [ji, pi, ki] = key.split('-').map((n) => parseInt(n, 10));
          if (!isNaN(ji) && jp[ji]) jp[ji].time = time;
          if (!isNaN(pi) && pron[pi]) pron[pi].time = time;
          if (!isNaN(ki) && ko[ki]) ko[ki].time = time;
        });
      }

      return {
        jp: interpolateTokens(jp),
        pron: interpolateTokens(pron),
        ko: interpolateTokens(ko),
        call: line.call,
      };
    });
  }, [song]);

  useEffect(() => {
    if (!song) return;
    tokenRefs.current = [];
    lineRefs.current = [];
    setCallPositions([]);

    let frame: number;

    const update = () => {
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);

    const createPlayer = () => {
      playerRef.current = new window.YT.Player('player', {
        videoId: song.videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration?.() ?? 0);
          },
          onStateChange: (e: { data: number }) => {
            setIsPlaying(e.data === 1);
          },
        },
      }) as unknown as YTPlayer;
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }

    setCurrentTime(0);

    return () => {
      cancelAnimationFrame(frame);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [slug, song]);

  const computeCallPositions = useCallback(() => {
    setCallPositions(
      lyrics.map((line, idx) => {
        const pos = line.call?.pos;
        if (pos == null) return 0;
        const charEl = tokenRefs.current[idx]?.[pos];
        const lineEl = lineRefs.current[idx];
        if (!charEl || !lineEl) return 0;
        const charRect = charEl.getBoundingClientRect();
        const lineRect = lineEl.getBoundingClientRect();
        return charRect.left - lineRect.left;
      })
    );
  }, [lyrics]);

  useLayoutEffect(computeCallPositions, [computeCallPositions]);
  useEffect(() => {
    window.addEventListener('resize', computeCallPositions);
    return () => window.removeEventListener('resize', computeCallPositions);
  }, [computeCallPositions]);

  const scrollToActiveLine = useCallback(() => {
    if (!autoScrollRef.current) return;
    const idx = (() => {
      for (let i = lyrics.length - 1; i >= 0; i--) {
        const start = lyrics[i].jp[0]?.time ?? 0;
        if (currentTime >= start) return i;
      }
      return 0;
    })();
    const el = lineRefs.current[idx];
    if (el) {
      programmaticScrollRef.current = true;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 500);
    }
  }, [lyrics, currentTime]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
        autoScrollRef.current = true;
        scrollToActiveLine();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        const delta = e.code === 'ArrowLeft' ? -5 : 5;
        const t = Math.max(0, Math.min((playerRef.current.getDuration?.() ?? 0), currentTime + delta));
        playerRef.current.seekTo(t, true);
        setCurrentTime(t);
        autoScrollRef.current = true;
        setTimeout(scrollToActiveLine, 100);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, currentTime, scrollToActiveLine]);

  useEffect(() => {
    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      autoScrollRef.current = false;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const callActive = (line: ProcessedLine) =>
    line.call ? currentTime >= line.call.start && currentTime <= line.call.end : false;
  const charActive = (token: Token) =>
    token.time != null && currentTime >= token.time;

  if (!song) return <main>노래를 찾을 수 없습니다.</main>;

  return (
    <SpoilerGate>
      <main>
        <div id="player" className="video-background" />
        <header className="header">
          <Link href="/call-guide" className="container header-content" style={{ textDecoration: 'none' }}>
            <h1 className="header-title">콜 가이드</h1>
            <p className="header-subtitle">{song.title}</p>
          </Link>
        </header>

        <section className="container call-section">
          <div className="glass-effect call-summary-box">
            <h3 className="call-summary-title">콜 정리</h3>
            {song.summary.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="lyrics">
            {lyrics.map((line, idx) => (
              <div
                key={idx}
                className="lyric-line"
                ref={(el) => {
                  lineRefs.current[idx] = el!;
                }}
              >
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

        <div className="player-controls">
          <button
            onClick={() => {
              if (!playerRef.current) return;
              if (isPlaying) playerRef.current.pauseVideo();
              else playerRef.current.playVideo();
            }}
          >
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              const t = Number(e.target.value);
              playerRef.current?.seekTo(t, true);
              setCurrentTime(t);
              autoScrollRef.current = true;
              scrollToActiveLine();
            }}
            style={{ flex: 1 }}
          />
        </div>

        <button
          className="scroll-top"
          onClick={() => {
            autoScrollRef.current = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          ↑
        </button>
      </main>
    </SpoilerGate>
  );
}
