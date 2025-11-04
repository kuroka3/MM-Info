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
import { useRouter, useSearchParams } from 'next/navigation';
import SpoilerGate from '@/components/SpoilerGate';
import ScrollTopButton from '@/components/ScrollTopButton';
import type { Song } from '@prisma/client';
import type { LyricLine, CallItem } from '@/types/call-guide';
import PlaylistSelectModal from '@/components/call-guide/PlaylistSelectModal';
import useStoredState from '@/hooks/useStoredState';
import type { Playlist } from '@/types/callGuide';
import { animateReorder } from '@/utils/flip';
import LyricsDisplay from './LyricsDisplay';
import VolumeControls from './VolumeControls';
import ExtraControls from './ExtraControls';
import PlayerButtons from './PlayerButtons';
import type {
  Token,
  ProcessedLine,
  YTPlayer,
  CallGuideClientProps,
} from './types';
import {
  buildBaseSlugs,
  computeInitialOrder,
  onEndedDecision,
  applyToggleShuffle,
  persistOrder,
  restoreOrderValidated,
  isValidPermutation,
  makeOrderStorageKey,
  generateShortId11,
  ensureUniquePlaylistId,
  ALL_PLAYLIST_ID,
  removeOrder,
} from '@/utils/playlistOrder';
import { SAFE_SONG_INDEX } from '@/data/safeSongIndex';

export default function CallGuideClient({ song, songs }: CallGuideClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSafeMode = searchParams.get('safe') === '1';
  const playlistsKey = isSafeMode ? 'callGuideSafePlaylists' : 'callGuidePlaylists';
  const activeKey = isSafeMode ? 'callGuideSafeActivePlaylist' : 'callGuideActivePlaylist';
  const [prevSong, setPrevSong] = useState<Song | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const currentTimeRef = useRef(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const tokenRefs = useRef<HTMLSpanElement[][]>([]);
  const lineRefs = useRef<HTMLDivElement[]>([]);
  const [callPositions, setCallPositions] = useState<(number | undefined)[][]>([]);
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
  const isPlayingRef = useRef(false);
  const isTogglingRef = useRef(false);
  const toggleWatchdogRef = useRef<number | null>(null);
  const [spoilerAllowed, setSpoilerAllowed] = useState(false);
  useEffect(() => {
    setSpoilerAllowed(localStorage.getItem('spoilerConfirmed') === 'true');
  }, []);

  const safeAllRef = useRef<Playlist | null>(null);
  useEffect(() => {
    if (!isSafeMode) return;
    const stored = JSON.parse(localStorage.getItem('callGuideSafeSongs') || '[]') as string[];
    const safeSet = new Set<string>([...SAFE_SONG_INDEX, ...stored]);
    if (!song.slug || !safeSet.has(song.slug)) {
      router.replace('/mikuexpo/asia2025/call-guide/safe');
      return;
    }
    let custom: Playlist[] = [];
    const storedPls = localStorage.getItem(playlistsKey);
    if (storedPls) {
      try {
        custom = JSON.parse(storedPls) as Playlist[];
      } catch {
        custom = [];
      }
    }
    const safeAll: Playlist = {
      id: 'safe-all',
      name: '전체 곡',
      slugs: songs.filter((s) => safeSet.has(s.slug!)).map((s) => s.slug!),
    };
    const album: Playlist = { id: 'album-songs', name: '앨범 곡', slugs: SAFE_SONG_INDEX };
    safeAllRef.current = safeAll;
    setPlaylists([album, ...custom]);
    const list = searchParams.get('list');
    const activeStored = localStorage.getItem(activeKey);
    let active: Playlist | null = null;
    if (list === 'safe-all') active = safeAll;
    else if (list === 'album-songs') active = album;
    else active = custom.find((p) => p.id === list) || null;
    if (!active && activeStored) {
      try {
        const parsed = JSON.parse(activeStored) as Playlist;
        if (parsed.id === 'safe-all') active = safeAll;
        else if (parsed.id === 'album-songs') active = album;
        else active = custom.find((p) => p.id === parsed.id) || null;
      } catch {
        active = null;
      }
    }
    if (!active || !Array.isArray(active.slugs)) active = safeAll;
    setActivePlaylist(active);
    localStorage.setItem(activeKey, JSON.stringify(active));
  }, [isSafeMode, songs, song.slug, searchParams, router, playlistsKey, activeKey]);

  const prevPlaylistIdRef = useRef<string | null>(null);
  const prevBaseRef = useRef<string[] | null>(null);
  const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every(x => b.includes(x));

  const applyPlaying = (playing: boolean) => {
    setIsPlaying(playing);
    isPlayingRef.current = playing;
  };

  const togglePlayPause = useCallback(() => {
    const p = playerRef.current;
    if (!p || isTogglingRef.current) return;
    isTogglingRef.current = true;

    const target = !isPlayingRef.current;
    if (target) {
      p.playVideo?.();
    } else {
      p.pauseVideo?.();
      requestAnimationFrame(() => p.pauseVideo?.());
    }

    if (toggleWatchdogRef.current != null) clearTimeout(toggleWatchdogRef.current);
    toggleWatchdogRef.current = window.setTimeout(() => {
      try {
        const s = p.getPlayerState?.();
        if (s === 1) applyPlaying(true);
        else if (s === 2) applyPlaying(false);
      } catch { }
      isTogglingRef.current = false;
    }, 900);
  }, [playerRef]);

  const playlistId = useMemo(
    () => activePlaylist?.id ?? 'all',
    [activePlaylist]
  );
  const pendingReshuffleRef = useRef<{ nextSlug: string; newOrder: string[] } | null>(null);
  const parseBoolean = useCallback((v: string) => v === 'true', []);
  const parseRepeatMode = useCallback(
    (v: string) =>
      v === 'off' || v === 'all' || v === 'one' ? (v as 'off' | 'all' | 'one') : 'off',
    [],
  );

  const [autoNext, setAutoNext, autoNextRef, autoNextLoaded] = useStoredState(
    'callGuideAutoNext',
    true,
    parseBoolean,
    String,
  );
  const [repeatMode, setRepeatMode, repeatModeRef, repeatModeLoaded] = useStoredState<'off' | 'all' | 'one'>(
    'callGuideRepeatMode',
    'off',
    parseRepeatMode,
    String,
  );
  const [shuffle, setShuffle, shuffleRef, shuffleLoaded] = useStoredState(
    'callGuideShuffle',
    false,
    parseBoolean,
    String,
  );
  const [volume, setVolume, volumeRef, volumeLoaded] = useStoredState('callGuideVolume', 100, Number, String);
  const [muted, setMuted, mutedRef, mutedLoaded] = useStoredState('callGuideMuted', false, parseBoolean, String);

  const predictedNext = useMemo(() => {
    if (!playlistOrder.length || !song.slug) return { slug: undefined as string | undefined, order: undefined as string[] | undefined };
    const idx = playlistOrder.indexOf(song.slug);
    if (idx < 0) return { slug: undefined, order: undefined };
    const last = playlistOrder.length - 1;

    if (repeatMode === 'all' && shuffle && idx === last) {
      const base = buildBaseSlugs(activePlaylist?.slugs, songs);
      const { nextSlug, newOrder } = onEndedDecision({
        order: playlistOrder,
        currentSlug: song.slug,
        repeat: 'all',
        shuffle: true,
        baseForReshuffle: base,
      });
      if (nextSlug && newOrder) return { slug: nextSlug, order: newOrder };
    }
    return { slug: playlistOrder[(idx + 1) % playlistOrder.length], order: undefined };
  }, [playlistOrder, song.slug, repeatMode, shuffle, activePlaylist, songs]);

  const settingsLoaded =
    autoNextLoaded && repeatModeLoaded && shuffleLoaded && volumeLoaded && mutedLoaded;

  const [showPrevTooltip, setShowPrevTooltip] = useState(false);
  const [showNextTooltip, setShowNextTooltip] = useState(false);

  const uiNextSong = useMemo(
    () => (predictedNext.slug ? (songs.find((s) => s.slug === predictedNext.slug) || null) : null),
    [predictedNext.slug, songs]
  );

  const adjustVolume = useCallback((delta: number) => {
    const base = typeof volumeRef.current === 'number' ? volumeRef.current : 0;
    const v = Math.max(0, Math.min(100, base + delta));
    setVolume(v);
    playerRef.current?.setVolume?.(v);
    if (v > 0 && mutedRef.current) {
      playerRef.current?.unMute?.();
      setMuted(false);
    }
  }, [playerRef, setVolume, volumeRef, mutedRef, setMuted]);

  useEffect(() => {
    if (predictedNext.order && predictedNext.slug) {
      pendingReshuffleRef.current = { nextSlug: predictedNext.slug, newOrder: predictedNext.order };
    } else {
      pendingReshuffleRef.current = null;
    }
  }, [predictedNext.slug, predictedNext.order]);




  useEffect(() => {
    if (!activePlaylist) return;
    const urlList = searchParams.get('list');
    if (urlList !== playlistId) {
      router.replace(`/mikuexpo/asia2025/call-guide/${song.slug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`);
    }
  }, [activePlaylist, playlistId, router, searchParams, song.slug, isSafeMode]);

  useEffect(() => {
    if (!volumeLoaded) return;
    playerRef.current?.setVolume?.(volume);
  }, [volume, volumeLoaded]);

  useEffect(() => {
    if (!mutedLoaded) return;
    if (muted) playerRef.current?.mute?.();
    else playerRef.current?.unMute?.();
  }, [muted, mutedLoaded]);

  const playlistOrderRef = useRef<string[]>([]);
  useEffect(() => {
    playlistOrderRef.current = playlistOrder;
  }, [playlistOrder]);

  const activePlaylistRef = useRef<Playlist | null>(null);
  useEffect(() => {
    activePlaylistRef.current = activePlaylist;
  }, [activePlaylist]);

  const songsRef = useRef(songs);
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    if (!activePlaylist?.id) return;
    const base = Array.isArray(activePlaylist.slugs) ? activePlaylist.slugs : [];
    originalOrderRef.current = [...base];
  }, [activePlaylist?.id]);

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
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (isSafeMode) return;
    const storedPlaylists = localStorage.getItem(playlistsKey);
    if (storedPlaylists) {
      try {
        const arr = JSON.parse(storedPlaylists) as Playlist[];
        const seen = new Set<string>();
        arr.forEach(pl => { if (pl.id) seen.add(pl.id); });

        const migrated = arr.map((pl) => {
          if (pl.id) return pl;
          const id = ensureUniquePlaylistId(seen);
          seen.add(id);
          return { ...pl, id };
        });

        setPlaylists(migrated);
        if (JSON.stringify(arr) !== JSON.stringify(migrated)) {
          localStorage.setItem(playlistsKey, JSON.stringify(migrated));
        }
      } catch { }
    }

    const activeStored = localStorage.getItem(activeKey);
    let active: Playlist | null = null;
    if (activeStored) {
      try {
        active = JSON.parse(activeStored);
        if (active?.name === 'default' || active?.name === '전체 곡') {
          active = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
          localStorage.setItem(activeKey, JSON.stringify(active));
        }
      } catch { }
    }
    if (!active || !Array.isArray(active.slugs)) {
      active = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem(activeKey, JSON.stringify(active));
    } else if (!active.id) {
      const currentList = JSON.parse(localStorage.getItem(playlistsKey) || '[]') as Playlist[];
      const match = currentList.find(pl => pl.name === active!.name && sameSet(pl.slugs, active!.slugs));
      const id = match?.id ?? generateShortId11();
      active = { ...active, id };
      localStorage.setItem(activeKey, JSON.stringify(active));
    }

    setActivePlaylist(active);
  }, [songs, isSafeMode, playlistsKey, activeKey]);

  const focusThenScroll = (idx: number) => {
    const el = lineRefs.current[idx];
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }
    setTimeout(() => {
      if (!el.isConnected) return;
      scrollToLine(idx);
    }, 200);
  };

  const storageKey = useMemo(
    () => (playlistId ? makeOrderStorageKey(playlistId) : ''),
    [playlistId],
  );

  const handleToggleShuffle = useCallback(() => {
    if (!activePlaylist?.slugs?.length) return;
    const base = buildBaseSlugs(activePlaylist.slugs, songs);
    animateReorder(() => {
      const { shuffle: nextShuffle, order } = applyToggleShuffle({
        base,
        currentSlug: song.slug ?? null,
        prevShuffle: shuffleRef.current,
      });
      setShuffle(nextShuffle);
      shuffleRef.current = nextShuffle;
      setPlaylistOrder(order);
      playlistOrderRef.current = order;
      if (storageKey) persistOrder(storageKey, order);
    }, { container: '.playlist-songs-popup' });
  }, [activePlaylist?.slugs, songs, song.slug, storageKey]);

  useEffect(() => {
    const apl = activePlaylist;
    if (!apl || !apl.id || !Array.isArray(apl.slugs) || apl.slugs.length === 0) return;
    const base = apl.slugs.slice();
    const prevId = prevPlaylistIdRef.current;
    const prevBase = prevBaseRef.current;
    if (prevId === apl.id && prevBase && !sameSet(prevBase, base)) {
      removeOrder(storageKey);
    }
    prevPlaylistIdRef.current = apl.id;
    prevBaseRef.current = base;
  }, [activePlaylist?.id, activePlaylist?.slugs, storageKey]);

  useEffect(() => {
    const base = buildBaseSlugs(activePlaylistRef.current?.slugs, songsRef.current);
    const prevBase = prevBaseRef.current;

    const changed =
      !prevBase ||
      prevBase.length !== base.length ||
      !prevBase.every((s, i) => s === base[i]);

    if (changed && storageKey) {
      localStorage.removeItem(storageKey);
    }
    prevBaseRef.current = base;
  }, [activePlaylist, songs, storageKey]);

  useEffect(() => {
    if (!activePlaylist?.id || !activePlaylist.slugs?.length || !storageKey) return;

    const base = activePlaylist.slugs;

    const prev = playlistOrderRef.current;
    if (prev && isValidPermutation(base, prev)) {
      if (prev !== playlistOrder) setPlaylistOrder(prev);
      persistOrder(storageKey, prev);
      return;
    }

    const stored = restoreOrderValidated(storageKey, base);
    const order = computeInitialOrder({
      base,
      currentSlug: song.slug ?? null,
      shuffle,
      storedOrder: stored,
    });

    playlistOrderRef.current = order;
    setPlaylistOrder(order);
    persistOrder(storageKey, order);
  }, [activePlaylist?.id, activePlaylist?.slugs, storageKey, song.slug, shuffle]);

  useEffect(() => {
    if (!playlistOrder.length || !song.slug) {
      setPrevSong(null);
      return;
    }
    const idx = playlistOrder.indexOf(song.slug);
    if (idx < 0) {
      setPrevSong(null);
      return;
    }
    const last = playlistOrder.length - 1;

    let prevSlug: string | undefined = idx > 0 ? playlistOrder[idx - 1] : undefined;
    if (repeatMode === 'all' && !prevSlug) prevSlug = playlistOrder[last];

    setPrevSong(songs.find((s) => s.slug === prevSlug) ?? null);
  }, [song.slug, songs, playlistOrder, repeatMode]);

  const handleNextClick = () => {
    const pending = pendingReshuffleRef.current;
    if (pending && pending.newOrder && pending.nextSlug) {
      setPlaylistOrder(pending.newOrder);
      playlistOrderRef.current = pending.newOrder;
      if (storageKey) persistOrder(storageKey, pending.newOrder);
      router.push(`/mikuexpo/asia2025/call-guide/${pending.nextSlug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`);
      return;
    }
    if (predictedNext.slug) {
      router.push(`/mikuexpo/asia2025/call-guide/${predictedNext.slug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`);
    }
  };

  useEffect(() => {
    if (storageKey) persistOrder(storageKey, playlistOrder);
  }, [playlistOrder, storageKey]);

  useEffect(() => {
    const idx = playlistOrder.indexOf(song.slug!);
    const lastIdx = playlistOrder.length - 1;
    let prevSlug = playlistOrder[idx - 1];
    let nextSlug = playlistOrder[idx + 1];
    if (repeatMode === 'all') {
      if (!prevSlug) prevSlug = playlistOrder[lastIdx];
      if (!nextSlug) nextSlug = playlistOrder[0];
    }
    setPrevSong(songs.find((s) => s.slug === prevSlug) || null);
  }, [song, songs, playlistOrder, repeatMode]);

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => setShowPlaylistModal(false);

  const selectPlaylist = (pl: 'default' | Playlist) => {
    const selected: Playlist =
      pl === 'default'
        ? isSafeMode
          ? safeAllRef.current || {
            id: ALL_PLAYLIST_ID,
            name: '전체 곡',
            slugs: songs.map((s) => s.slug!),
          }
          : { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) }
        : pl;

    closePlaylistModal();

    if (!selected.slugs.includes(song.slug!)) {
      localStorage.setItem(activeKey, JSON.stringify(selected));
      const firstSlug = selected.slugs[0];
      const firstSong = songs.find((s) => s.slug === firstSlug);
      if (firstSong)
        router.push(`/mikuexpo/asia2025/call-guide/${firstSong.slug}?list=${selected.id}${isSafeMode ? '&safe=1' : ''}`);
      return;
    }

    setActivePlaylist(selected);
    localStorage.setItem(activeKey, JSON.stringify(selected));
    if (isSafeMode) {
      router.replace(`/mikuexpo/asia2025/call-guide/${song.slug}?list=${selected.id}&safe=1`);
    }
  };

  const toggleExtra = useCallback(() => {
    setExtraOpen((prev) => {
      setToggleRotation(prev ? 0 : 180);
      return !prev;
    });
  }, []);

  const openPlaylistSongs = useCallback(() => {
    setShowPlaylistSongs((p) => !p);
    setExtraOpen(false);
    setToggleRotation((r) => r + 180);
  }, []);

  const closePlaylistSongs = () => setShowPlaylistSongs(false);

  const toggleAutoNext = () => {
    setAutoNext((prev) => {
      const next = !prev;
      if (!next) setRepeatMode('off');
      return next;
    });
  };
  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      const next = prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off';
      if (next !== 'off') setAutoNext(true);
      return next;
    });
  }, [setRepeatMode, setAutoNext]);

  const songListRef = useRef<HTMLUListElement | null>(null);
  const [songDragIndex, setSongDragIndex] = useState<number | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDraggingRef = useRef(false);
  const originalOrderRef = useRef<string[]>([]);
  const playerButtonsRef = useRef<HTMLDivElement | null>(null);
  const volumeControlsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activePlaylist && activePlaylist.id !== prevPlaylistIdRef.current) {
      originalOrderRef.current = [...activePlaylist.slugs];
      prevPlaylistIdRef.current = activePlaylist.id;
    }
  }, [activePlaylist]);

  useEffect(() => {
    if (showPlaylistSongs && songListRef.current && activePlaylist) {
      const idx = playlistOrder.indexOf(song.slug!);
      const item = songListRef.current.children[idx] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'center' });
    }
  }, [showPlaylistSongs, playlistOrder, song.slug, activePlaylist]);

  const adjust = useCallback(() => {
    const buttons = playerButtonsRef.current;
    const volume = volumeControlsRef.current;
    const container = buttons?.parentElement;
    if (!buttons || !volume || !container) return;
    const gap = 0;
    const total = buttons.offsetWidth + gap + volume.offsetWidth;
    if (total > container.offsetWidth) volume.classList.add('compact');
    else volume.classList.remove('compact');
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, [settingsLoaded, adjust]);

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
      localStorage.setItem(activeKey, JSON.stringify(newActive));
      setPlaylists((pls) => {
        const updatedPls = pls.map((pl) => (pl.id === activePlaylist.id ? newActive : pl));
        const toStore = isSafeMode
          ? updatedPls.filter((p) => p.id !== 'safe-all' && p.id !== 'album-songs')
          : updatedPls;
        localStorage.setItem(playlistsKey, JSON.stringify(toStore));
        return updatedPls;
      });
      persistOrder(storageKey, updated);
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
    if (!activePlaylist) return;
    const base = buildBaseSlugs(activePlaylist.slugs, songs);
    const newOrder =
      originalOrderRef.current?.length ? [...originalOrderRef.current] : [...base];
    if (!newOrder.length) return;

    animateReorder(() => {
      setShuffle(false);
      shuffleRef.current = false;
      pendingReshuffleRef.current = null;

      setPlaylistOrder(newOrder);
      playlistOrderRef.current = newOrder;

      const newActive = { ...activePlaylist, slugs: newOrder };
      setActivePlaylist(newActive);
      setPlaylists((pls) => {
        const updated = pls.map((pl) => (pl.id === activePlaylist.id ? newActive : pl));
        const toStore = isSafeMode
          ? updated.filter((p) => p.id !== 'safe-all' && p.id !== 'album-songs')
          : updated;
        localStorage.setItem(playlistsKey, JSON.stringify(toStore));
        return updated;
      });
      localStorage.setItem(activeKey, JSON.stringify(newActive));
      if (storageKey) persistOrder(storageKey, newOrder);
    }, { container: '.playlist-songs-popup' });
  };

  const toggleMute = useCallback(() => {
    if (muted) {
      playerRef.current?.unMute?.();
      playerRef.current?.setVolume?.(volumeRef.current ?? 100);
      setMuted(false);
    } else {
      playerRef.current?.mute?.();
      setMuted(true);
    }
  }, [muted, playerRef, setMuted, volumeRef]);

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

  function normalizeCalls(input?: unknown): CallItem[] | undefined {
    if (!input) return undefined;

    const toNumArray = (v: unknown): number[] => {
      if (Array.isArray(v)) return v.map(Number).filter((x) => Number.isFinite(x));
      const n = Number(v);
      return Number.isFinite(n) ? [n] : [];
    };

    const toItem = (raw: unknown): CallItem | null => {
      if (!raw || typeof raw !== 'object') return null;
      const obj = raw as Record<string, unknown>;
      const item: CallItem = {
        isRepeat: !!obj.isRepeat,
        text: String(obj.text ?? ''),
        start: toNumArray(obj.start),
        end: toNumArray(obj.end),
        pos: toNumArray(obj.pos).map((x) => Math.max(0, Math.trunc(x))),
        startRepeatIndex: obj.startRepeatIndex != null ? Math.max(0, Math.trunc(Number(obj.startRepeatIndex))) : undefined,
      };
      return item.text ? item : null;
    };

    if (Array.isArray(input)) {
      const out = (input as unknown[]).map(toItem).filter((x): x is CallItem => !!x);
      return out.length ? out : undefined;
    }
    const single = toItem(input);
    return single ? [single] : undefined;
  }

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

      const calls = normalizeCalls(line.calls);

      return {
        jp: interpolateTokens(jp),
        pron: interpolateTokens(pron),
        ko: interpolateTokens(ko),
        call: line.call,
        ...(calls ? { calls } : {}),
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
      const rect = el.getBoundingClientRect();
      const top =
        rect.top + window.scrollY - (window.innerHeight * 3 / 7 - rect.height / 2);
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      el.focus({ preventScroll: true });
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
          autoplay: spoilerAllowed && autoNextRef.current ? 1 : 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration?.() ?? 0);
            e.target.setVolume?.(volumeRef.current);
            if (mutedRef.current) e.target.mute?.();
            else e.target.unMute?.();
            const iframe = e.target.getIframe?.();
            if (spoilerAllowed) iframe?.setAttribute('allow', 'autoplay');
            iframe?.setAttribute('playsinline', '1');
            autoScrollRef.current = true;
            scrollToLine(activeLineRef.current);
            if (pendingSeekRef.current != null) {
              playerRef.current?.seekTo?.(pendingSeekRef.current, true);
            }
            if (autoNextRef.current && spoilerAllowed) {
              e.target.playVideo?.();
            }
          },
          onStateChange: (e: { data: number }) => {
            const state = e.data;

            if (state === 0) {
              setIsPlaying(false);
              isPlayingRef.current = false;

              if (repeatModeRef.current === 'one') {
                playerRef.current?.seekTo?.(0, true);
                playerRef.current?.playVideo?.();
                return;
              }

              const base = buildBaseSlugs(activePlaylistRef.current?.slugs, songsRef.current);
              const { nextSlug, newOrder } = onEndedDecision({
                order: playlistOrderRef.current.length ? playlistOrderRef.current : base,
                currentSlug: song.slug!,
                repeat: repeatModeRef.current,
                shuffle: shuffleRef.current,
                baseForReshuffle: base,
              });

              if (newOrder) {
                setPlaylistOrder(newOrder);
                playlistOrderRef.current = newOrder;
                persistOrder(storageKey, newOrder);
              }

              if (autoNextRef.current && nextSlug) {
                router.push(`/mikuexpo/asia2025/call-guide/${nextSlug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`);
              }

              return;
            }

            if (state === 1) {
              setIsPlaying(true);
              isPlayingRef.current = true;
              if (toggleWatchdogRef.current != null) { clearTimeout(toggleWatchdogRef.current); toggleWatchdogRef.current = null; }
              isTogglingRef.current = false;

              autoScrollRef.current = true;
              scrollToLine(activeLineRef.current);
              if (pendingSeekRef.current != null) {
                playerRef.current?.seekTo?.(pendingSeekRef.current, true);
              }
              return;
            }

            if (state === 2) {
              setIsPlaying(false);
              isPlayingRef.current = false;
              if (toggleWatchdogRef.current != null) { clearTimeout(toggleWatchdogRef.current); toggleWatchdogRef.current = null; }
              isTogglingRef.current = false;
              return;
            }

            if (state === 3) {
              autoScrollRef.current = true;
              scrollToLine(activeLineRef.current);
              if (pendingSeekRef.current != null) {
                playerRef.current?.seekTo?.(pendingSeekRef.current, true);
              }
              return;
            }
          }
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
  }, [song, scrollToLine, router, autoNextRef, repeatModeRef, shuffleRef, volumeRef, mutedRef, storageKey]);

  useEffect(() => {
    setDisplayTime(currentTime);
  }, [currentTime]);

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

  useEffect(() => {
    const storageKey = 'callGuideSession';
    const saveState = () => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({
            slug: song.slug,
            time: currentTimeRef.current,
            playing: isPlayingRef.current,
            line: activeLineRef.current,
          })
        );
      } catch { }
    };

    const restoreState = () => {
      try {
        const t = playerRef.current?.getCurrentTime?.();
        if (typeof t === 'number' && !Number.isNaN(t) && t > 0) {
          pendingSeekRef.current = null;
          currentTimeRef.current = t;
          setCurrentTime(t);
          setDisplayTime(t);
          const idx = timeToLine(t);
          setActiveLine(idx);
          autoScrollRef.current = true;
          scrollToLine(idx);
          focusThenScroll(idx);
          return;
        }

        const raw = sessionStorage.getItem(storageKey);
        if (!raw) {
          focusThenScroll(activeLineRef.current);
          return;
        }
        const data = JSON.parse(raw) as {
          slug?: string;
          time?: number;
          playing?: boolean;
          line?: number;
        };
        if (data.slug === song.slug) {
          if (typeof data.time === 'number') {
            pendingSeekRef.current = data.time;
            setCurrentTime(data.time);
            setDisplayTime(data.time);
          }
          if (data.playing) {
            playerRef.current?.playVideo?.();
          }
          if (typeof data.line === 'number') {
            scrollToLine(data.line);
            focusThenScroll(data.line);
            return;
          }
        }
      } catch { }
      focusThenScroll(activeLineRef.current);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') saveState();
      else if (document.visibilityState === 'visible') restoreState();
    };

    restoreState();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', restoreState);
    window.addEventListener('focus', restoreState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pageshow', restoreState);
      window.removeEventListener('focus', restoreState);
    };
  }, [song.slug, scrollToLine, timeToLine]);

  const computeCallPositions = useCallback((): boolean => {
    let allOk = true;
    let anySet = false;

    const norm = (v: number) => Math.round(v);

    const next = lyrics.map((line, idx) => {
      const res: (number | undefined)[] = [];

      const calcPos = (posIdx: number | undefined): number | undefined => {
        if (posIdx == null) return undefined;
        const charEl = tokenRefs.current?.[idx]?.[posIdx] ?? null;
        const lineEl = lineRefs.current?.[idx] ?? null;
        if (!charEl || !lineEl) return undefined;
        const charRect = charEl.getBoundingClientRect();
        const lineRect = lineEl.getBoundingClientRect();
        if (!charRect || !lineRect || lineRect.width === 0) return undefined;
        const left = charRect.left - lineRect.left;
        return Number.isFinite(left) ? norm(left) : undefined;
      };

      res.push(line.call?.pos != null ? calcPos(line.call.pos) : undefined);

      line.calls?.forEach((c) => {
        if (c.isRepeat) return;
        const p0 = c.pos?.[0];
        res.push(typeof p0 === 'number' ? calcPos(p0) : undefined);
      });

      for (let j = 0; j < res.length; j++) {
        if (res[j] != null) {
          anySet = true;
        } else {
          allOk = false;
        }
      }

      return res;
    });

    setCallPositions((prev) => {
      if (prev.length !== next.length) return next;
      for (let i = 0; i < next.length; i++) {
        const prevLine = prev[i] ?? [];
        const nextLine = next[i] ?? [];
        if (prevLine.length !== nextLine.length) return next;
        for (let j = 0; j < nextLine.length; j++) {
          if (prevLine[j] !== nextLine[j]) return next;
        }
      }
      return prev;
    });

    return anySet && allOk;
  }, [lyrics, tokenRefs, lineRefs]);

  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;
    let tries = 0;
    const MAX_TRIES = 60;

    const measure = () => {
      if (cancelled) return;
      const ok = computeCallPositions();
      if (!ok && tries++ < MAX_TRIES) {
        raf = requestAnimationFrame(measure);
      }
    };

    const start = () => {
      if (cancelled) return;
      raf = requestAnimationFrame(measure);
    };

    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(() => { if (!cancelled) start(); });
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      tries = 0;
      measure();
    });
    ro.observe(document.documentElement);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [computeCallPositions, lyrics]);

  type DocumentWithFonts = Document & { fonts?: { ready?: Promise<unknown> } };
  useEffect(() => {
    const ready = (document as DocumentWithFonts).fonts?.ready;
    if (ready && typeof (ready as Promise<unknown>).then === 'function') {
      ready.then(() => { requestAnimationFrame(() => computeCallPositions()); });
    }
  }, [computeCallPositions]);
  const handleResize = useCallback(() => {
    computeCallPositions();
    requestAnimationFrame(() => computeCallPositions());
  }, [computeCallPositions]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const els = lineRefs.current.filter(Boolean);
    if (!els.length) return;
    const ro = new ResizeObserver(() => {
      handleResize();
    });
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [lyrics, handleResize]);

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
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;

      const keyLower = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        if (!playerRef.current) return;
        const delta = e.code === 'ArrowLeft' ? -5 : 5;
        const dur = playerRef.current.getDuration?.() ?? 0;
        const t = Math.max(0, Math.min(dur, currentTime + delta));
        pendingSeekRef.current = t;
        playerRef.current.seekTo?.(t, true);
        currentTimeRef.current = t;
        setCurrentTime(t);
        setDisplayTime(t);
        autoScrollRef.current = true;
        const idx = timeToLine(t);
        setTimeout(() => scrollToLine(idx), 100);
        return;
      }

      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        adjustVolume(e.code === 'ArrowUp' ? +5 : -5);
        return;
      }

      switch (keyLower) {
        case 'm':
          e.preventDefault();
          toggleMute();
          return;
        case 'r':
          e.preventDefault();
          cycleRepeat();
          return;
        case 's':
          e.preventDefault();
          handleToggleShuffle();
          return;
        case 'b':
        case 't':
          e.preventDefault();
          toggleExtra();
          return;
        case 'l':
        case 'p':
          e.preventDefault();
          openPlaylistSongs();
          return;
        default:
          return;
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    togglePlayPause,
    playerRef,
    currentTime,
    timeToLine,
    scrollToLine,
    adjustVolume,
    toggleMute,
    cycleRepeat,
    handleToggleShuffle,
    toggleExtra,
    openPlaylistSongs,
    setCurrentTime,
    setDisplayTime,
  ]);


  const onScroll = useCallback(() => {
    if (programmaticScrollRef.current) return;
    autoScrollRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  useEffect(() => {
    const ms = (navigator as Navigator & { mediaSession?: MediaSession }).mediaSession;
    if (!ms) return;
    ms.metadata = new MediaMetadata({
      title: song.krtitle || song.title,
      artwork: song.thumbnail ? [{ src: song.thumbnail, sizes: '512x512', type: 'image/png' }] : [],
    });
    ms.setActionHandler('play', () => playerRef.current?.playVideo?.());
    ms.setActionHandler('pause', () => playerRef.current?.pauseVideo?.());
    ms.setActionHandler(
      'previoustrack',
      prevSong?.slug
        ? () => router.push(`/mikuexpo/asia2025/call-guide/${prevSong.slug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`)
        : null,
    );
    ms.setActionHandler(
      'nexttrack',
      predictedNext?.slug
        ? () => router.push(`/mikuexpo/asia2025/call-guide/${predictedNext.slug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`)
        : null,
    );
  }, [song, playerRef, prevSong?.slug, predictedNext?.slug, router, playlistId]);

  useEffect(() => {
    const ms = (navigator as Navigator & { mediaSession?: MediaSession }).mediaSession;
    if (!ms || typeof ms.setPositionState !== 'function') return;
    try {
      ms.setPositionState({ duration, position: currentTime });
    } catch { }
  }, [currentTime, duration]);

  const callActive = (line: ProcessedLine) =>
    line.call ? currentTime >= line.call.start && currentTime <= line.call.end : false;
  const charActive = (token: Token) =>
    token.time != null && currentTime >= token.time;

  const callItemActive = (item: CallItem) => {
    const start = item.start?.[0];
    const end = item.end?.[0];
    if (start == null || end == null) return false;
    return currentTime >= start && currentTime <= end;
  };

  const progress = duration ? (displayTime / duration) * 100 : 0;

  if (!song) return <main>노래를 찾을 수 없습니다.</main>;

  const body = (
    <>
      <main>
        <div id="player" className="video-background" />
        <header className="header">
          <Link href={isSafeMode ? '/mikuexpo/asia2025/call-guide/safe' : '/mikuexpo/asia2025/call-guide'} className="container header-content" style={{ textDecoration: 'none' }}>
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

          <LyricsDisplay
            lyrics={lyrics}
            activeLine={activeLine}
            tokenRefs={tokenRefs}
            lineRefs={lineRefs}
            callPositions={callPositions}
            callActive={callActive}
            callItemActive={callItemActive}
            charActive={charActive}
            currentTime={currentTime}
            onLineClick={(idx) => {
              const t = lyrics[idx].jp[0]?.time ?? 0;
              pendingSeekRef.current = t;
              playerRef.current?.seekTo?.(t, true);
              currentTimeRef.current = t;
              setCurrentTime(t);
              setDisplayTime(t);
              autoScrollRef.current = true;
              scrollToLine(idx);
            }}
          />
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
            {settingsLoaded && (
              <>
                <PlayerButtons
                  prevSong={prevSong}
                  nextSong={uiNextSong}
                  showPrevTooltip={showPrevTooltip}
                  setShowPrevTooltip={setShowPrevTooltip}
                  showNextTooltip={showNextTooltip}
                  setShowNextTooltip={setShowNextTooltip}
                  playerButtonsRef={playerButtonsRef}
                  isPlaying={isPlaying}
                  playerRef={playerRef}
                  autoScrollRef={autoScrollRef}
                  scrollToLine={scrollToLine}
                  activeLine={activeLine}
                  router={router}
                  currentSlug={song.slug!}
                  playlistOrderRef={playlistOrderRef}
                  playlistId={playlistId}
                  onNext={handleNextClick}
                  safeMode={isSafeMode}
                />
                <VolumeControls
                  ref={volumeControlsRef}
                  muted={muted}
                  volume={volume}
                  toggleMute={toggleMute}
                  onVolumeChange={(v) => {
                    setVolume(v);
                    playerRef.current?.setVolume?.(v);
                  }}
                />
              </>
            )}
          </div>
        </div>

        {settingsLoaded && (
          <ExtraControls
            extraOpen={extraOpen}
            openPlaylistSongs={openPlaylistSongs}
            autoNext={autoNext}
            toggleAutoNext={toggleAutoNext}
            repeatMode={repeatMode}
            cycleRepeat={cycleRepeat}
            shuffle={shuffle}
            toggleShuffle={handleToggleShuffle}
            toggleExtra={toggleExtra}
            toggleRotation={toggleRotation}
          />
        )}
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
                      router.push(`/mikuexpo/asia2025/call-guide/${slug}?list=${playlistId}${isSafeMode ? '&safe=1' : ''}`);
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
    </>
  );

  return isSafeMode ? body : (
    <SpoilerGate overlayClassName="call-guide-spoiler">{body}</SpoilerGate>
  );
}
