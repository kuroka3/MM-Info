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
import ScrollTopButton from '@/components/ScrollTopButton';
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

interface Playlist {
  name: string;
  slugs: string[];
}

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
}

declare global {
  interface Window {
    YT: { Player: new (...args: unknown[]) => YTPlayer };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface CallGuideClientProps {
  song: Song;
  songs: Song[];
}

export default function CallGuideClient({ song, songs }: CallGuideClientProps) {
  const router = useRouter();
  const [prevSong, setPrevSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
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
  const programmaticScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekingRef = useRef(false);
  const [activeLine, setActiveLine] = useState(0);
  const activeLineRef = useRef(0);
  const pendingSeekRef = useRef<number | null>(null);
  const [skipGap, setSkipGap] = useState<{ target: number; showAt: number; end: number } | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [autoNext, setAutoNext] = useState(true);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('callGuidePlaylists');
    if (storedPlaylists) {
      try {
        setPlaylists(JSON.parse(storedPlaylists));
      } catch {
        /* ignore */
      }
    }
    const activeStored = localStorage.getItem('callGuideActivePlaylist');
    let active: Playlist | null = null;
    if (activeStored) {
      try {
        active = JSON.parse(activeStored);
      } catch {
        /* ignore */
      }
    }
    if (!active || !Array.isArray(active.slugs)) {
      active = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
    }
    setActivePlaylist(active);
  }, [songs]);

  useEffect(() => {
    const playlistSlugs = activePlaylist?.slugs || songs.map((s) => s.slug!);
    const idx = playlistSlugs.indexOf(song.slug!);
    const prevSlug = playlistSlugs[idx - 1];
    const nextSlug = playlistSlugs[idx + 1];
    setPrevSong(songs.find((s) => s.slug === prevSlug) || null);
    setNextSong(songs.find((s) => s.slug === nextSlug) || null);
  }, [song, songs, activePlaylist]);

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => setShowPlaylistModal(false);

  const selectPlaylist = (pl: Playlist | 'default') => {
    const selected =
      pl === 'default'
        ? { name: '전체 곡', slugs: songs.map((s) => s.slug!) }
        : pl;
    setActivePlaylist(selected);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(selected));
    closePlaylistModal();
    if (!selected.slugs.includes(song.slug!)) {
      const firstSlug = selected.slugs[0];
      const firstSong = songs.find((s) => s.slug === firstSlug);
      if (firstSong) router.push(`/call-guide/${firstSong.slug}`);
    }
  };

  const openPlaylistSongs = () => setShowPlaylistSongs(true);
  const closePlaylistSongs = () => setShowPlaylistSongs(false);

  const toggleAutoNext = () => {
    setAutoNext((prev) => {
      const next = !prev;
      if (!next) setRepeatMode('off');
      return next;
    });
  };
  const cycleRepeat = () => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  };
  const toggleShuffle = () => setShuffle((prev) => !prev);

  const songListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (showPlaylistSongs && songListRef.current && activePlaylist) {
      const idx = activePlaylist.slugs.indexOf(song.slug!);
      const item = songListRef.current.children[idx] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'center' });
    }
  }, [showPlaylistSongs, activePlaylist, song.slug]);

  const toggleMute = () => {
    if (muted) {
      playerRef.current?.unMute?.();
      playerRef.current?.setVolume?.(volume);
      setMuted(false);
    } else {
      playerRef.current?.mute?.();
      setMuted(true);
    }
  };

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

  const gaps = useMemo(() => {
    const res: { start: number; showAt: number; end: number; target: number }[] = [];
    const firstStart = lyrics[0]?.jp[0]?.time ?? 0;
    if (firstStart >= 10) {
      res.push({ start: 0, showAt: 2, end: firstStart, target: firstStart });
    }
    for (let i = 0; i < lyrics.length - 1; i++) {
      const line = lyrics[i];
      const nextLine = lyrics[i + 1];
      const end = Math.max(
        line.jp[line.jp.length - 1]?.time ?? 0,
        line.pron[line.pron.length - 1]?.time ?? 0,
        line.ko[line.ko.length - 1]?.time ?? 0
      );
      const nextStart = nextLine.jp[0]?.time ?? 0;
      if (nextStart - end >= 10) {
        res.push({ start: end, showAt: end + 1, end: nextStart, target: nextStart });
      }
    }
    return res;
  }, [lyrics]);

  const scrollToLine = useCallback((idx: number) => {
    const el = lineRefs.current[idx];
    if (el) {
      programmaticScrollRef.current = true;
      if (programmaticScrollTimeout.current) clearTimeout(programmaticScrollTimeout.current);
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      programmaticScrollTimeout.current = setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (!song) return;
    tokenRefs.current = [];
    lineRefs.current = [];
    setCallPositions([]);

    const update = () => {
      if (seekingRef.current) return;
      let t = playerRef.current?.getCurrentTime?.() ?? 0;
      if (pendingSeekRef.current != null) {
        if (Math.abs(t - pendingSeekRef.current) > 0.3) {
          playerRef.current?.seekTo(pendingSeekRef.current, true);
          t = pendingSeekRef.current;
        } else {
          pendingSeekRef.current = null;
        }
      }
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
            setVolume(e.target.getVolume?.() ?? 100);
            const m = e.target.isMuted?.() ?? false;
            setMuted(m);
            autoScrollRef.current = true;
            scrollToLine(activeLineRef.current);
            if (pendingSeekRef.current != null) {
              playerRef.current?.seekTo(pendingSeekRef.current, true);
            }
          },
          onStateChange: (e: { data: number }) => {
            setIsPlaying(e.data === 1);
            if (e.data === 0) {
              if (repeatMode === 'one') {
                playerRef.current?.seekTo(0, true);
                playerRef.current?.playVideo?.();
              } else {
                let targetSlug: string | undefined;
                const playlistSlugs = activePlaylist?.slugs || songs.map((s) => s.slug!);
                if (shuffle) {
                  const others = playlistSlugs.filter((s) => s !== song.slug);
                  targetSlug = others[Math.floor(Math.random() * others.length)];
                } else {
                  const idx = playlistSlugs.indexOf(song.slug!);
                  targetSlug = playlistSlugs[idx + 1];
                  if (!targetSlug && repeatMode === 'all') targetSlug = playlistSlugs[0];
                }
                if (autoNext && targetSlug) {
                  router.push(`/call-guide/${targetSlug}`);
                }
              }
            }
            if (e.data === 1 || e.data === 3) {
              autoScrollRef.current = true;
              scrollToLine(activeLineRef.current);
              if (pendingSeekRef.current != null) {
                playerRef.current?.seekTo(pendingSeekRef.current, true);
              }
            }
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
  }, [song, scrollToLine, repeatMode, activePlaylist, songs, shuffle, autoNext, router]);

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

  useEffect(() => {
    activeLineRef.current = activeLine;
  }, [activeLine]);

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

  useEffect(() => {
    const gap = gaps.find((g) => currentTime >= g.start && currentTime < g.end);
    if (gap && currentTime >= gap.showAt) setSkipGap(gap);
    else setSkipGap(null);
  }, [currentTime, gaps]);

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
        pendingSeekRef.current = t;
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
                  pendingSeekRef.current = t;
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
          <div className="seek-container">
            {skipGap && (
              <button
                className="skip-button glass-effect"
                onClick={() => {
                  const t = skipGap.target;
                  pendingSeekRef.current = t;
                  playerRef.current?.seekTo(t, true);
                  currentTimeRef.current = t;
                  setCurrentTime(t);
                  setDisplayTime(t);
                  autoScrollRef.current = true;
                  const idx = timeToLine(t);
                  scrollToLine(idx);
                  setSkipGap(null);
                }}
              >
                간주 스킵
              </button>
            )}
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
              pendingSeekRef.current = t;
              playerRef.current?.seekTo(t, true);
              currentTimeRef.current = t;
              setCurrentTime(t);
              setDisplayTime(t);
            }}
            onPointerUp={(e) => {
              const t = Number(e.currentTarget.value);
              pendingSeekRef.current = t;
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
              pendingSeekRef.current = t;
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
              background: `linear-gradient(to right, #555 0%, #555 ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`,
              boxShadow: progress > 0 ? '0 0 8px #39c5bb' : undefined,
            }}
          />
          </div>
          <div className="player-bottom-row">
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
            <div className="volume-controls">
              <button className="control-button" onClick={toggleMute}>
                {muted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="3,9 7,9 12,4 12,20 7,15 3,15" />
                    <line x1="16" y1="8" x2="22" y2="16" stroke="currentColor" strokeWidth="2" />
                    <line x1="22" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="3,9 7,9 12,4 12,20 7,15 3,15" />
                    <path d="M16 8a5 5 0 010 8" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </button>
              <input
                className={`volume-bar${muted ? ' muted' : ''}`}
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  playerRef.current?.setVolume?.(v);
                }}
              />
            </div>
          </div>
        </div>

        <div className={`extra-toggle${extraOpen ? ' open' : ''}`}>
          <div className="extra-buttons">
            <button className="small-glass-button" onClick={openPlaylistSongs}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
            <button
              className={`small-glass-button${autoNext ? ' active' : ''}`}
              onClick={toggleAutoNext}
            >
              {autoNext ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <text x="2" y="17" fontSize="12">AUTO</text>
                  <polygon points="14,7 20,12 14,17" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <text x="2" y="17" fontSize="12">A</text>
                  <polygon points="10,7 16,12 10,17" />
                  <line x1="2" y1="7" x2="22" y2="17" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
            <button
              className={`small-glass-button repeat-${repeatMode}`}
              onClick={cycleRepeat}
            >
              {repeatMode === 'one' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11v-3a6 6 0 016-6h8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v3a6 6 0 01-6 6H7" stroke="currentColor" strokeWidth="2" fill="none" />
                  <text x="11" y="17" fontSize="8">1</text>
                </svg>
              ) : repeatMode === 'all' ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11v-3a6 6 0 016-6h8" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v3a6 6 0 01-6 6H7" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11v-3a6 6 0 016-6h8" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              )}
            </button>
            <button
              className={`small-glass-button${shuffle ? ' active' : ''}`}
              onClick={toggleShuffle}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h4l5 8 5-8h2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M4 20h4l5-8 5 8h2" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
          </div>
          <button className="triangle-toggle" onClick={() => setExtraOpen((p) => !p)}>
            {extraOpen ? '▼' : '▲'}
          </button>
        </div>

        <ScrollTopButton />
      </main>
      {activePlaylist && (
        <div className="current-playlist-bar" onClick={openPlaylistModal}>
          <span className="current-playlist-name">{activePlaylist.name}</span>
          <button
            className="glass-button"
            onClick={(e) => {
              e.stopPropagation();
              selectPlaylist('default');
            }}
          >
            전체 곡
          </button>
        </div>
      )}
      {showPlaylistModal && (
        <div className="playlist-modal" onClick={closePlaylistModal}>
          <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={() => selectPlaylist('default')}>전체 곡</li>
              {playlists.map((pl, i) => (
                <li key={i} onClick={() => selectPlaylist(pl)}>{pl.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showPlaylistSongs && activePlaylist && (
        <div className="playlist-modal" onClick={closePlaylistSongs}>
          <div className="playlist-songs-popup" onClick={(e) => e.stopPropagation()}>
            <ul ref={songListRef}>
              {activePlaylist.slugs.map((slug) => {
                const s = songs.find((song) => song.slug === slug);
                if (!s) return null;
                return (
                  <li
                    key={slug}
                    className={`playlist-song-item${slug === song.slug ? ' active' : ''}`}
                    onClick={() => {
                      router.push(`/call-guide/${slug}`);
                      closePlaylistSongs();
                    }}
                  >
                    {s.title}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </SpoilerGate>
  );
}
