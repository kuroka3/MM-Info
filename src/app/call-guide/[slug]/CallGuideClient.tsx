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
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SpoilerGate from '@/components/SpoilerGate';
import type { Song } from '@prisma/client';
import type { Call, LyricLine } from '@/types/call-guide';

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

interface CallGuideClientProps {
    song: Song;
    prevSong: Song | null;
    nextSong: Song | null;
}

export default function CallGuideClient({ song, prevSong, nextSong }: CallGuideClientProps) {
  const router = useRouter();
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const currentTimeRef = useRef(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const tokenRefs = useRef<HTMLSpanElement[][]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const [callPositions, setCallPositions] = useState<number[]>([]);
  const autoScrollRef = useRef(true);
  const programmaticScrollRef = useRef(false);
  const seekingRef = useRef(false);
  const [activeLine, setActiveLine] = useState(0);

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
    if (!song || !song.lyrics) return [];
    const parsedLyrics = song.lyrics as unknown as LyricLine[];
    return parsedLyrics.map((line: LyricLine) => {
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

    const update = () => {
      if (seekingRef.current) return;
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      currentTimeRef.current = t;
      setCurrentTime(t);
    };

    update();
    const interval = window.setInterval(update, 100);

    const createPlayer = () => {
      playerRef.current = new window.YT.Player('player', {
        videoId: song.videoId!,
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
    setDisplayTime(0);
    currentTimeRef.current = 0;

    return () => {
      clearInterval(interval);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [song]);

  useEffect(() => {
    let frame: number;
    const smooth = () => {
      setDisplayTime((prev) => prev + (currentTimeRef.current - prev) * 0.2);
      frame = requestAnimationFrame(smooth);
    };
    frame = requestAnimationFrame(smooth);
    return () => cancelAnimationFrame(frame);
  }, []);

  const timeToLine = useCallback(
    (t: number) => {
      for (let i = lyrics.length - 1; i >= 0; i--) {
        const start = lyrics[i].jp[0]?.time ?? 0;
        if (t >= start) return i;
      }
      return 0;
    },
    [lyrics]
  );

  useEffect(() => {
    const baseTime = seekingRef.current ? displayTime : currentTime;
    const idx = timeToLine(baseTime);
    if (idx !== activeLine) setActiveLine(idx);
  }, [currentTime, displayTime, timeToLine, activeLine]);

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
    document.fonts?.ready.then(computeCallPositions);
    window.addEventListener('resize', computeCallPositions);
    return () => window.removeEventListener('resize', computeCallPositions);
  }, [computeCallPositions]);

  const scrollToLine = useCallback((idx: number) => {
    const el = lineRefs.current[idx];
    if (el) {
      programmaticScrollRef.current = true;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!autoScrollRef.current) return;
    scrollToLine(activeLine);
  }, [activeLine, scrollToLine]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) playerRef.current.pauseVideo?.();
        else playerRef.current.playVideo?.();
        autoScrollRef.current = true;
        scrollToLine(activeLine);
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        const delta = e.code === 'ArrowLeft' ? -5 : 5;
        const t = Math.max(0, Math.min((playerRef.current.getDuration?.() ?? 0), currentTime + delta));
        playerRef.current.seekTo?.(t, true);
        currentTimeRef.current = t;
        setCurrentTime(t);
        setDisplayTime(t);
        autoScrollRef.current = true;
        const idx = timeToLine(t);
        setTimeout(() => scrollToLine(idx), 100);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, currentTime, scrollToLine, timeToLine, activeLine]);

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

  const progress = duration ? (displayTime / duration) * 100 : 0;

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
          <div className="call-song-jacket">
            <Image
              src={song.thumbnail!}
              alt={song.title}
              width={200}
              height={200}
              className="song-jacket"
            />
          </div>
          <div className="glass-effect call-summary-box">
            <h3 className="call-summary-title">콜 정리</h3>
            {song.summary!.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="lyrics">
            {lyrics.map((line, idx) => (
              <div
                key={idx}
                className={`lyric-line${idx === activeLine ? ' focused' : ''}`}
                ref={(el) => {
                  lineRefs.current[idx] = el!;
                }}
                onClick={() => {
                  const t = line.jp[0]?.time ?? 0;
                  playerRef.current?.seekTo(t, true);
                  currentTimeRef.current = t;
                  setCurrentTime(t);
                  setDisplayTime(t);
                  autoScrollRef.current = true;
                  scrollToLine(idx);
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
          <input
            suppressHydrationWarning
            className="player-seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={displayTime}
            onPointerDown={() => {
              seekingRef.current = true;
              autoScrollRef.current = false;
            }}
            onChange={(e) => {
              const t = Number(e.target.value);
              playerRef.current?.seekTo(t, true);
              currentTimeRef.current = t;
              setCurrentTime(t);
              setDisplayTime(t);
            }}
            onPointerUp={(e) => {
              const t = Number(e.currentTarget.value);
              playerRef.current?.seekTo(t, true);
              currentTimeRef.current = t;
              setCurrentTime(t);
              setDisplayTime(t);
              autoScrollRef.current = true;
              const idx = timeToLine(t);
              scrollToLine(idx);
              setTimeout(() => {
                seekingRef.current = false;
              }, 200);
            }}
            onPointerCancel={(e) => {
              const t = Number(e.currentTarget.value);
              playerRef.current?.seekTo(t, true);
              currentTimeRef.current = t;
              setCurrentTime(t);
              setDisplayTime(t);
              autoScrollRef.current = true;
              const idx = timeToLine(t);
              scrollToLine(idx);
              setTimeout(() => {
                seekingRef.current = false;
              }, 200);
            }}
            style={{
              background: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.8) ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
          <div className="player-buttons">
            <button
              className="control-button"
              disabled={!prevSong}
              onClick={() => {
                if (!prevSong) return;
                autoScrollRef.current = true;
                router.push(`/call-guide/${prevSong.slug}`);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="15,5 7,12 15,19" />
                <rect x="5" y="5" width="2" height="14" />
              </svg>
            </button>
            <button
              className="control-button"
              onClick={() => {
                if (!playerRef.current) return;
                if (isPlaying) playerRef.current.pauseVideo?.();
                else playerRef.current.playVideo?.();
                autoScrollRef.current = true;
                scrollToLine(activeLine);
              }}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="8,5 19,12 8,19" />
                </svg>
              )}
            </button>
            <button
              className="control-button"
              disabled={!nextSong}
              onClick={() => {
                if (!nextSong) return;
                autoScrollRef.current = true;
                router.push(`/call-guide/${nextSong.slug}`);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="9,5 17,12 9,19" />
                <rect x="17" y="5" width="2" height="14" />
              </svg>
            </button>
          </div>
        </div>

        <button
          className="scroll-top control-button"
          onClick={() => {
            autoScrollRef.current = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polyline points="6,15 12,9 18,15" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
      </main>
    </SpoilerGate>
  );
}
