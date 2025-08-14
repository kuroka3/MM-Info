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
import PlaylistSelectModal from '@/components/call-guide/PlaylistSelectModal';

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
  color?: string;
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
  getIframe?: () => HTMLIFrameElement;
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
  const [playlistOrder, setPlaylistOrder] = useState<string[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showPlaylistSongs, setShowPlaylistSongs] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [toggleRotation, setToggleRotation] = useState(0);
  const [autoNext, setAutoNext] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('callGuideAutoNext');
      if (stored !== null) return stored === 'true';
    }
    return true;
  });
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('callGuideRepeatMode');
      if (stored === 'off' || stored === 'all' || stored === 'one') return stored as 'off' | 'all' | 'one';
    }
    return 'off';
  });
  const [shuffle, setShuffle] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('callGuideShuffle');
      if (stored !== null) return stored === 'true';
    }
    return false;
  });
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('callGuideVolume');
      if (stored !== null) return Number(stored);
    }
    return 100;
  });
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('callGuideMuted');
      if (stored !== null) return stored === 'true';
    }
    return false;
  });
  const [showPrevTooltip, setShowPrevTooltip] = useState(false);
  const [showNextTooltip, setShowNextTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem('callGuideAutoNext', String(autoNext));
  }, [autoNext]);

  useEffect(() => {
    localStorage.setItem('callGuideRepeatMode', repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem('callGuideShuffle', String(shuffle));
  }, [shuffle]);

  useEffect(() => {
    localStorage.setItem('callGuideVolume', String(volume));
    playerRef.current?.setVolume?.(volume);
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('callGuideMuted', String(muted));
    if (muted) playerRef.current?.mute?.();
    else playerRef.current?.unMute?.();
  }, [muted]);

  const playlistOrderRef = useRef<string[]>([]);
  useEffect(() => {
    playlistOrderRef.current = playlistOrder;
  }, [playlistOrder]);

  const repeatModeRef = useRef(repeatMode);
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  const autoNextRef = useRef(autoNext);
  useEffect(() => {
    autoNextRef.current = autoNext;
  }, [autoNext]);

  const shuffleRef = useRef(shuffle);
  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const activePlaylistRef = useRef<Playlist | null>(null);
  useEffect(() => {
    activePlaylistRef.current = activePlaylist;
  }, [activePlaylist]);

  const songsRef = useRef(songs);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && isPlaying) {
        playerRef.current?.playVideo?.();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isPlaying]);

  const songDurations = useMemo(() => {
    const map: Record<string, number> = {};
    songs.forEach((s) => {
      const lyrics = (s.lyrics as { times?: Record<string, number> }[] | null) || [];
      let max = 0;
      lyrics.forEach((line) => {
        if (line.times) {
          Object.values(line.times).forEach((v) => {
            const num = Number(v);
            if (num > max) max = num;
          });
        }
      });
      map[s.slug!] = max;
    });
    return map;
  }, [songs]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

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
        if (active?.name === 'default' || active?.name === '전체 곡') {
          active = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
          localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
        }
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
    const base = activePlaylist?.slugs || songs.map((s) => s.slug!);
    let order: string[] | null = null;
    if (shuffle) {
      const stored = localStorage.getItem('callGuidePlaylistOrder');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as string[];
          if (Array.isArray(parsed) && parsed.length === base.length && parsed.includes(song.slug!)) {
            order = parsed;
          }
        } catch {
          /* ignore */
        }
      }
      if (!order) {
        const k = base.indexOf(song.slug!);
        const before = base.slice(0, k);
        const after = base.slice(k + 1);
        const shuffledBefore = [...before].sort(() => Math.random() - 0.5);
        const shuffledAfter = [...after].sort(() => Math.random() - 0.5);
        order = [...shuffledBefore, song.slug!, ...shuffledAfter];
      }
    } else {
      order = base;
    }
    setPlaylistOrder(order);
  }, [activePlaylist, songs, shuffle, song.slug]);

  useEffect(() => {
    localStorage.setItem('callGuidePlaylistOrder', JSON.stringify(playlistOrder));
  }, [playlistOrder]);

  useEffect(() => {
    const idx = playlistOrder.indexOf(song.slug!);
    const prevSlug = playlistOrder[idx - 1];
    const nextSlug = playlistOrder[idx + 1];
    setPrevSong(songs.find((s) => s.slug === prevSlug) || null);
    setNextSong(songs.find((s) => s.slug === nextSlug) || null);
  }, [song, songs, playlistOrder]);

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

  const toggleExtra = () => {
    setExtraOpen((prev) => {
      setToggleRotation(prev ? 0 : 180);
      return !prev;
    });
  };

  const openPlaylistSongs = () => {
    setShowPlaylistSongs((p) => !p);
    if (extraOpen) {
      setExtraOpen(false);
      setToggleRotation((r) => r + 180);
    }
  };
  const closePlaylistSongs = () => setShowPlaylistSongs(false);

  const toggleAutoNext = () => {
    setAutoNext((prev) => {
      const next = !prev;
      if (!next) setRepeatMode('off');
      return next;
    });
  };
  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      if (next !== 'off') setAutoNext(true);
      return next;
    });
  };
  const toggleShuffle = () => setShuffle((prev) => !prev);

  const songListRef = useRef<HTMLUListElement | null>(null);
  const [songDragIndex, setSongDragIndex] = useState<number | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDraggingRef = useRef(false);
  const originalOrderRef = useRef<string[]>([]);
  const prevPlaylistNameRef = useRef<string | null>(null);
  const playerButtonsRef = useRef<HTMLDivElement | null>(null);
  const volumeControlsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activePlaylist && activePlaylist.name !== prevPlaylistNameRef.current) {
      originalOrderRef.current = [...activePlaylist.slugs];
      prevPlaylistNameRef.current = activePlaylist.name;
    }
  }, [activePlaylist]);

  useEffect(() => {
    if (showPlaylistSongs && songListRef.current && activePlaylist) {
      const idx = playlistOrder.indexOf(song.slug!);
      const item = songListRef.current.children[idx] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'center' });
    }
  }, [showPlaylistSongs, playlistOrder, song.slug, activePlaylist]);

  useEffect(() => {
    const adjust = () => {
      const buttons = playerButtonsRef.current;
      const volume = volumeControlsRef.current;
      const container = buttons?.parentElement;
      if (!buttons || !volume || !container) return;
      const gap = 0;
      const total = buttons.offsetWidth + gap + volume.offsetWidth;
      if (total > container.offsetWidth) volume.classList.add('compact');
      else volume.classList.remove('compact');
    };
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  const handleSongDragStart = (index: number) => {
    if (activePlaylistRef.current?.name === '전체 곡') return;
    setSongDragIndex(index);
    wasDraggingRef.current = true;
  };

  const handleSongDrop = (index: number) => {
    if (
      songDragIndex === null ||
      songDragIndex === index ||
      !activePlaylist ||
      activePlaylistRef.current?.name === '전체 곡'
    )
      return;
    setPlaylistOrder((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(songDragIndex, 1);
      updated.splice(index, 0, moved);
      const newActive = { ...activePlaylist, slugs: updated };
      setActivePlaylist(newActive);
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(newActive));
      setPlaylists((pls) => {
        const updatedPls = pls.map((pl) =>
          pl.name === activePlaylist.name ? newActive : pl,
        );
        localStorage.setItem('callGuidePlaylists', JSON.stringify(updatedPls));
        return updatedPls;
      });
      return updated;
    });
    setSongDragIndex(null);
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 0);
  };

  const handleSongTouchStart = (index: number) => {
    if (activePlaylistRef.current?.name === '전체 곡') return;
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => setSongDragIndex(index), 300);
  };

  const handleSongTouchMove = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (songDragIndex !== null) e.preventDefault();
  };

  const handleSongTouchEnd = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (songDragIndex === null) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const li = target?.closest('li[data-index]') as HTMLElement | null;
    if (li) {
      const dropIndex = parseInt(li.dataset.index || '', 10);
      if (!isNaN(dropIndex)) handleSongDrop(dropIndex);
    }
    e.preventDefault();
    setSongDragIndex(null);
    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 0);
  };

  const resetOrder = () => {
    if (!activePlaylist || !songListRef.current) return;
    const oldPositions: Record<string, DOMRect> = {};
    Array.from(songListRef.current.children).forEach((child) => {
      const el = child as HTMLElement;
      oldPositions[el.dataset.slug!] = el.getBoundingClientRect();
    });
    const newOrder = [...originalOrderRef.current];
    setPlaylistOrder(newOrder);
    const newActive = { ...activePlaylist, slugs: newOrder };
    setActivePlaylist(newActive);
    setPlaylists((pls) => {
      const updatedPls = pls.map((pl) =>
        pl.name === activePlaylist.name ? newActive : pl,
      );
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updatedPls));
      return updatedPls;
    });
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(newActive));
    requestAnimationFrame(() => {
      Array.from(songListRef.current!.children).forEach((child) => {
        const el = child as HTMLElement;
        const slug = el.dataset.slug!;
        const first = oldPositions[slug];
        const last = el.getBoundingClientRect();
        const invertX = first.left - last.left;
        const invertY = first.top - last.top;
        el.animate(
          [
            { transform: `translate(${invertX}px, ${invertY}px)` },
            { transform: 'translate(0,0)' },
          ],
          {
            duration: 500,
            easing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
          },
        );
      });
    });
  };

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
          playerRef.current?.seekTo?.(pendingSeekRef.current, true);
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
          playsinline: 1,
          autoplay: autoNextRef.current ? 1 : 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration?.() ?? 0);
            e.target.setVolume?.(volumeRef.current);
            if (mutedRef.current) e.target.mute?.();
            else e.target.unMute?.();
            const iframe = e.target.getIframe?.();
            iframe?.setAttribute('allow', 'autoplay');
            iframe?.setAttribute('playsinline', '1');
            autoScrollRef.current = true;
            scrollToLine(activeLineRef.current);
            if (pendingSeekRef.current != null) {
              playerRef.current?.seekTo?.(pendingSeekRef.current, true);
            }
            if (autoNextRef.current) {
              e.target.playVideo?.();
            }
          },
          onStateChange: (e: { data: number }) => {
            setIsPlaying(e.data === 1);
            if (e.data === 0) {
              if (repeatModeRef.current === 'one') {
                playerRef.current?.seekTo?.(0, true);
                playerRef.current?.playVideo?.();
              } else {
                let targetSlug: string | undefined;
                const playlistSlugs = playlistOrderRef.current.length
                  ? playlistOrderRef.current
                  : activePlaylistRef.current?.slugs || songsRef.current.map((s) => s.slug!);
                const idx = playlistSlugs.indexOf(song.slug!);
                targetSlug = playlistSlugs[idx + 1];
                if (!targetSlug && repeatModeRef.current === 'all') {
                  if (shuffleRef.current) {
                    const base = activePlaylistRef.current?.slugs || songsRef.current.map((s) => s.slug!);
                    const newOrder = [...base].sort(() => Math.random() - 0.5);
                    setPlaylistOrder(newOrder);
                    playlistOrderRef.current = newOrder;
                    localStorage.setItem('callGuidePlaylistOrder', JSON.stringify(newOrder));
                    targetSlug = newOrder[0];
                  } else {
                    targetSlug = playlistSlugs[0];
                  }
                }
                if (autoNextRef.current && targetSlug) {
                  router.push(`/call-guide/${targetSlug}`);
                }
              }
            }
            if (e.data === 1 || e.data === 3) {
              autoScrollRef.current = true;
              scrollToLine(activeLineRef.current);
              if (pendingSeekRef.current != null) {
                playerRef.current?.seekTo?.(pendingSeekRef.current, true);
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
  }, [song, scrollToLine, router]);

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
        playerRef.current?.seekTo?.(t, true);
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
            <p className="header-subtitle">{song.krtitle || song.title}</p>
          </Link>
        </header>

        <section className="container call-section">
          <div className="call-song-jacket">
            <Image
              src={song.thumbnail!}
              alt={song.krtitle || song.title}
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
                  playerRef.current?.seekTo?.(t, true);
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
                  playerRef.current?.seekTo?.(t, true);
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
                playerRef.current?.seekTo?.(t, true);
                currentTimeRef.current = t;
                setCurrentTime(t);
                setDisplayTime(t);
              }}
              onPointerUp={(e) => {
                const t = Number(e.currentTarget.value);
                pendingSeekRef.current = t;
                playerRef.current?.seekTo?.(t, true);
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
                playerRef.current?.seekTo?.(t, true);
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
                background: `linear-gradient(to right, #39c5bb 0%, #39c5bb ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`,
                boxShadow: progress > 0 ? '0 0 8px #39c5bb' : undefined,
              }}
            />
          </div>
          <div className="player-bottom-row">
            <div className="player-buttons" ref={playerButtonsRef}>
              <div className="tooltip-wrapper">
                <button
                  className="control-button"
                  disabled={!prevSong}
                  onMouseEnter={() => setShowPrevTooltip(true)}
                  onMouseLeave={() => setShowPrevTooltip(false)}
                  onClick={() => {
                    if (!prevSong) return;
                    setShowPrevTooltip(false);
                    autoScrollRef.current = true;
                    router.push(`/call-guide/${prevSong.slug}`);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="15,5 7,12 15,19" />
                    <rect x="5" y="5" width="2" height="14" />
                  </svg>
                </button>
                {showPrevTooltip && prevSong && (
                  <div className="song-tooltip">
                    {prevSong.thumbnail && (
                      <Image
                        src={prevSong.thumbnail}
                        alt={prevSong.krtitle || prevSong.title}
                        width={80}
                        height={80}
                        className="song-tooltip-image"
                      />
                    )}
                    <p className="song-tooltip-title">{prevSong.krtitle || prevSong.title}</p>
                  </div>
                )}
              </div>
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
              <div className="tooltip-wrapper">
                <button
                  className="control-button"
                  disabled={!nextSong && !shuffle}
                  onMouseEnter={() => setShowNextTooltip(true)}
                  onMouseLeave={() => setShowNextTooltip(false)}
                  onClick={() => {
                    if (nextSong) {
                      setShowNextTooltip(false);
                      autoScrollRef.current = true;
                      router.push(`/call-guide/${nextSong.slug}`);
                    } else if (shuffle) {
                      const base = activePlaylist?.slugs || songs.map((s) => s.slug!);
                      const newOrder = [...base].sort(() => Math.random() - 0.5);
                      setPlaylistOrder(newOrder);
                      playlistOrderRef.current = newOrder;
                      localStorage.setItem('callGuidePlaylistOrder', JSON.stringify(newOrder));
                      setShowNextTooltip(false);
                      autoScrollRef.current = true;
                      router.push(`/call-guide/${newOrder[0]}`);
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="9,5 17,12 9,19" />
                    <rect x="17" y="5" width="2" height="14" />
                  </svg>
                </button>
                {showNextTooltip && nextSong && (
                  <div className="song-tooltip">
                    {nextSong.thumbnail && (
                      <Image
                        src={nextSong.thumbnail}
                        alt={nextSong.krtitle || nextSong.title}
                        width={80}
                        height={80}
                        className="song-tooltip-image"
                      />
                    )}
                    <p className="song-tooltip-title">{nextSong.krtitle || nextSong.title}</p>
                  </div>
                )}
              </div>
            </div>
            <div
              ref={volumeControlsRef}
              className={`volume-controls${muted ? ' disabled' : ''}`}
            >
              <button className={`control-button${muted ? ' muted' : ''}`} onClick={toggleMute}>
                {muted ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="3,9 7,9 12,4 12,20 7,15 3,15" />
                    <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
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
                style={{
                  background: `linear-gradient(to right, ${muted ? '#aaa' : '#39c5bb'} 0%, ${muted ? '#aaa' : '#39c5bb'} ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`,
                  boxShadow: volume > 0 && !muted ? '0 0 8px #39c5bb' : undefined,
                }}
                suppressHydrationWarning
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
              className={`small-glass-button${autoNext ? ' active' : ' inactive'}`}
              onClick={toggleAutoNext}
            >
              {autoNext ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <polyline points="14,6 20,12 14,18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <polyline points="14,6 20,12 14,18" />
                  <line x1="6" y1="8" x2="10" y2="16" />
                </svg>
              )}
            </button>
            <button
              className={`small-glass-button${repeatMode !== 'off' ? ' active' : ' inactive'}`}
              onClick={cycleRepeat}
            >
              {repeatMode === 'one' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11v-3a6 6 0 016-6h8" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v3a6 6 0 01-6 6H7" />
                  <path d="M12 9v6" strokeLinecap="round" />
                  <path d="M11 9h2" strokeLinecap="round" />
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
              className={`small-glass-button${shuffle ? ' active' : ' inactive'}`}
              onClick={toggleShuffle}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h4l5 8 5-8" />
                <polyline points="18,4 22,4 20,6" />
                <path d="M4 20h4l5-8 5 8" />
                <polyline points="18,20 22,20 20,18" />
              </svg>
            </button>
          </div>
          <button
            className="triangle-toggle"
            onClick={toggleExtra}
          >
            <span
              className="triangle-icon"
              style={{ transform: `rotate(${toggleRotation}deg)` }}
            >
              ▲
            </span>
          </button>
        </div>

      </main>
      <ScrollTopButton className="between-bar" />
      {activePlaylist && (
        <div
          className="current-playlist-bar"
          onClick={openPlaylistModal}
          style={
            activePlaylist.color
              ? {
                background: activePlaylist.color,
                borderTop: `1px solid ${activePlaylist.color}`,
              }
              : undefined
          }
        >
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
        <PlaylistSelectModal
          playlists={playlists}
          onSelect={selectPlaylist}
          onClose={closePlaylistModal}
        />
      )}
      {showPlaylistSongs && activePlaylist && (
        <div className="playlist-modal" onClick={closePlaylistSongs}>
          <div
            className="playlist-songs-popup"
            onClick={(e) => e.stopPropagation()}
            style={
              activePlaylist.color
                ? ({ '--playlist-color': activePlaylist.color } as React.CSSProperties)
                : undefined
            }
          >
            {activePlaylist.name !== '전체 곡' && (
              <button className="reset-order-button" onClick={resetOrder}>
                원래대로
              </button>
            )}
            <ul ref={songListRef}>
              {playlistOrder.map((slug, i) => {
                const s = songs.find((song) => song.slug === slug);
                if (!s) return null;
                const draggable = activePlaylist.name !== '전체 곡';
                return (
                  <li
                    key={slug}
                    data-index={i}
                    data-slug={slug}
                    className={`playlist-song-item${slug === song.slug ? ' active' : ''}${draggable ? ' draggable' : ''}`}
                    draggable={draggable}
                    onDragStart={() => draggable && handleSongDragStart(i)}
                    onDragOver={(e) => {
                      if (draggable) e.preventDefault();
                    }}
                    onDrop={(e) => {
                      if (draggable) {
                        e.preventDefault();
                        handleSongDrop(i);
                      }
                    }}
                    onTouchStart={draggable ? () => handleSongTouchStart(i) : undefined}
                    onTouchMove={draggable ? handleSongTouchMove : undefined}
                    onTouchEnd={draggable ? handleSongTouchEnd : undefined}
                    onClick={() => {
                      if (wasDraggingRef.current) return;
                      router.push(`/call-guide/${slug}`);
                      closePlaylistSongs();
                    }}
                  >
                    <span className="playlist-song-title">{s.krtitle || s.title}</span>
                    <span className="song-duration">{formatTime(songDurations[slug] || 0)}</span>
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
