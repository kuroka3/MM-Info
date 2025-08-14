'use client';

import React, { useState, useRef, useMemo, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { partColors } from './colors';
import type { SongWithSetlist, Playlist } from '@/types/callGuide';

interface Props {
  songs: SongWithSetlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  activePlaylist: Playlist | null;
  setActivePlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  selectMode: boolean;
  selected: Set<string>;
  toggleSelect: (slug: string) => void;
}

export default function SongList({
  songs,
  setPlaylists,
  activePlaylist,
  setActivePlaylist,
  selectMode,
  selected,
  toggleSelect,
}: Props) {
  const [songDragIndex, setSongDragIndex] = useState<number | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dragItemRef = useRef<HTMLElement | null>(null);
  const touchStartY = useRef(0);
  const swappingRef = useRef(false);
  const swapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showSortButton, setShowSortButton] = useState(false);

  const isDefaultPlaylist = activePlaylist?.name === '전체 곡';

  const getSongOrder = useMemo(
    () => (slug: string) => songs.findIndex((s) => s.slug === slug),
    [songs],
  );

  const defaultSortedSlugs = useMemo(() => {
    if (!activePlaylist || isDefaultPlaylist) return [] as string[];
    return [...activePlaylist.slugs].sort(
      (a, b) => getSongOrder(a) - getSongOrder(b),
    );
  }, [activePlaylist, getSongOrder, isDefaultPlaylist]);

  const isSorted = useMemo(() => {
    if (!activePlaylist || isDefaultPlaylist) return true;
    return activePlaylist.slugs.every(
      (slug, i) => slug === defaultSortedSlugs[i],
    );
  }, [activePlaylist, defaultSortedSlugs, isDefaultPlaylist]);

  const shouldShowSort = !isDefaultPlaylist && !isSorted;

  useEffect(() => {
    if (shouldShowSort) {
      setShowSortButton(true);
    } else {
      const btn = sortButtonRef.current;
      if (btn) {
        btn.classList.remove('show');
        btn.classList.add('hide');
      }
      const t = setTimeout(() => setShowSortButton(false), 300);
      return () => clearTimeout(t);
    }
  }, [shouldShowSort]);

  useEffect(() => {
    if (showSortButton) {
      const btn = sortButtonRef.current;
      requestAnimationFrame(() => {
        btn?.classList.add('show');
        btn?.classList.remove('hide');
      });
    }
  }, [showSortButton]);

  const playlistSongs = useMemo(() => {
    if (!activePlaylist) return songs;
    return activePlaylist.slugs
      .map((slug) => songs.find((s) => s.slug === slug))
      .filter(Boolean) as SongWithSetlist[];
  }, [activePlaylist, songs]);

  const handleSongDragStart = (index: number) => {
    if (isDefaultPlaylist) return;
    setSongDragIndex(index);
  };

  const handleSongTouchStart = (index: number, e: React.TouchEvent) => {
    if (isDefaultPlaylist) return;
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    const startY = e.touches[0].clientY;
    const currentTarget = e.currentTarget as HTMLElement;
    touchTimerRef.current = setTimeout(() => {
      setSongDragIndex(index);
      touchStartY.current = startY;
      const item = currentTarget.closest('.call-item') as HTMLElement | null;
      if (item) {
        dragItemRef.current = item;
        item.classList.add('dragging');
        item.style.transition = 'none';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        item.scrollIntoView({ block: 'center' });
      }
    }, 300);
  };

  const swapSong = (from: number, to: number) => {
    if (!activePlaylist || isDefaultPlaylist) return;
    if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    swappingRef.current = true;
    const container = document.querySelector('.call-list');
    if (!container) return;
    const rectMap = new Map<string, DOMRect>();
    const children = Array.from(container.children) as HTMLElement[];
    activePlaylist.slugs.forEach((slug, i) => {
      const el = children[i];
      if (el) rectMap.set(slug, el.getBoundingClientRect());
    });

    const updatedSlugs = [...activePlaylist.slugs];
    const [moved] = updatedSlugs.splice(from, 1);
    updatedSlugs.splice(to, 0, moved);

    setActivePlaylist((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, slugs: updatedSlugs };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setPlaylists((pls) => {
        const idx = pls.findIndex((p) => p.name === prev.name);
        if (idx >= 0) {
          const newPls = [...pls];
          newPls[idx] = { ...newPls[idx], slugs: updatedSlugs };
          localStorage.setItem('callGuidePlaylists', JSON.stringify(newPls));
          return newPls;
        }
        return pls;
      });
      return updated;
    });

    requestAnimationFrame(() => {
      const newChildren = Array.from(container.children) as HTMLElement[];
      updatedSlugs.forEach((slug, i) => {
        const el = newChildren[i];
        const prevRect = rectMap.get(slug);
        if (el && prevRect) {
          const newRect = el.getBoundingClientRect();
          const dy = prevRect.top - newRect.top;
          if (dy) {
            el.animate(
              [
                { transform: `translateY(${dy}px)` },
                { transform: 'translateY(0)' },
              ],
              { duration: 500, easing: 'ease-in-out' },
            );
          }
        }
      });
    });
    swapTimeoutRef.current = setTimeout(() => {
      swappingRef.current = false;
    }, 550);
  };

  const getDropIndex = (y: number) => {
    const container = document.querySelector('.call-list');
    if (!container) return null;
    const items = Array.from(
      container.querySelectorAll('[data-song-index]'),
    ) as HTMLElement[];
    for (let i = 0; i < items.length; i++) {
      const rect = items[i].getBoundingClientRect();
      if (y < rect.top + rect.height / 2) return i;
    }
    return items.length;
  };

  const handleSongTouchMove = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (swappingRef.current) return;
    if (songDragIndex !== null) {
      const touch = e.touches[0];
      const y = touch.clientY;
      const deltaY = y - touchStartY.current;
      if (dragItemRef.current) {
        dragItemRef.current.style.transform = `translateY(${deltaY}px) scale(1.05)`;
      }
      const target = document.elementFromPoint(window.innerWidth / 2, y);
      const item = target?.closest('[data-song-index]') as HTMLElement | null;
      if (item) {
        const overIndex = parseInt(item.dataset.songIndex || '', 10);
        if (!isNaN(overIndex) && overIndex !== songDragIndex) {
          swapSong(songDragIndex, overIndex);
          setSongDragIndex(overIndex);
          touchStartY.current = y;
          if (dragItemRef.current) {
            dragItemRef.current.style.transform = 'scale(1.05)';
          }
        }
      }
      const threshold = 50;
      if (y < threshold)
        window.scrollBy({ top: y - threshold, behavior: 'smooth' });
      else if (y > window.innerHeight - threshold)
        window.scrollBy({
          top: y - (window.innerHeight - threshold),
          behavior: 'smooth',
        });
    }
  };

  const handleSongDrop = (index: number) => {
    if (
      songDragIndex === null ||
      songDragIndex === index ||
      !activePlaylist ||
      isDefaultPlaylist
    )
      return;
    if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    swappingRef.current = true;
    const container = document.querySelector('.call-list');
    if (!container) return;
    const rectMap = new Map<string, DOMRect>();
    const children = Array.from(container.children) as HTMLElement[];
    activePlaylist.slugs.forEach((slug, i) => {
      const el = children[i];
      if (el) rectMap.set(slug, el.getBoundingClientRect());
    });

    const updatedSlugs = [...activePlaylist.slugs];
    const [moved] = updatedSlugs.splice(songDragIndex, 1);
    updatedSlugs.splice(index, 0, moved);

    setActivePlaylist((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, slugs: updatedSlugs };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setPlaylists((pls) => {
        const idx = pls.findIndex((p) => p.name === prev.name);
        if (idx >= 0) {
          const newPls = [...pls];
          newPls[idx] = { ...newPls[idx], slugs: updatedSlugs };
          localStorage.setItem('callGuidePlaylists', JSON.stringify(newPls));
          return newPls;
        }
        return pls;
      });
      return updated;
    });

    requestAnimationFrame(() => {
      const newChildren = Array.from(container.children) as HTMLElement[];
      updatedSlugs.forEach((slug, i) => {
        const el = newChildren[i];
        const prevRect = rectMap.get(slug);
        if (el && prevRect) {
          const newRect = el.getBoundingClientRect();
          const dy = prevRect.top - newRect.top;
          if (dy) {
            el.animate(
              [
                { transform: `translateY(${dy}px)` },
                { transform: 'translateY(0)' },
              ],
              { duration: 500, easing: 'ease-in-out' },
            );
          }
        }
      });
    });

    if (dragItemRef.current) {
      dragItemRef.current.style.transform = '';
      dragItemRef.current.classList.remove('dragging');
      dragItemRef.current = null;
    }
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    setSongDragIndex(null);
    swapTimeoutRef.current = setTimeout(() => {
      swappingRef.current = false;
    }, 550);
  };

  const handleSongTouchEnd = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (songDragIndex === null) return;
    if (dragItemRef.current) {
      dragItemRef.current.style.transform = '';
      dragItemRef.current.classList.remove('dragging');
      dragItemRef.current = null;
    }
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    const touch = e.changedTouches[0];
    const dropIndex = getDropIndex(touch.clientY);
    if (dropIndex !== null && dropIndex !== songDragIndex) {
      handleSongDrop(dropIndex);
    }
    setSongDragIndex(null);
  };

  const handleSongDragEnd = (e: React.DragEvent) => {
    if (songDragIndex === null) return;
    const dropIndex = getDropIndex(e.clientY);
    if (dropIndex !== null && dropIndex !== songDragIndex) {
      handleSongDrop(dropIndex);
    }
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    setSongDragIndex(null);
  };

  const restoreSongOrder = () => {
    if (!activePlaylist || isDefaultPlaylist) return;
    const container = document.querySelector('.call-list');
    if (!container) return;
    const rectMap = new Map<string, DOMRect>();
    const children = Array.from(container.children) as HTMLElement[];
    activePlaylist.slugs.forEach((slug, i) => {
      const el = children[i];
      if (el) rectMap.set(slug, el.getBoundingClientRect());
    });
    const sortedSlugs = defaultSortedSlugs;
    setActivePlaylist((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, slugs: sortedSlugs };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setPlaylists((pls) => {
        const idx = pls.findIndex((p) => p.name === prev.name);
        if (idx >= 0) {
          const newPls = [...pls];
          newPls[idx] = { ...newPls[idx], slugs: sortedSlugs };
          localStorage.setItem('callGuidePlaylists', JSON.stringify(newPls));
          return newPls;
        }
        return pls;
      });
      return updated;
    });
    requestAnimationFrame(() => {
      const newChildren = Array.from(container.children) as HTMLElement[];
      sortedSlugs.forEach((slug, i) => {
        const el = newChildren[i];
        const prevRect = rectMap.get(slug);
        if (el && prevRect) {
          const newRect = el.getBoundingClientRect();
          const dy = prevRect.top - newRect.top;
          if (dy) {
            el.animate(
              [
                { transform: `translateY(${dy}px)` },
                { transform: 'translateY(0)' },
              ],
              { duration: 500, easing: 'ease-in-out' },
            );
          }
        }
      });
    });
  };

  const handleSongClick = () => {
    if (!activePlaylist) {
      const def = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
      setActivePlaylist(def);
    }
  };

  return (
    <>
      <div className="call-list">
        {playlistSongs.map((song, index) => {
          const first = song.setlists[0];
          const order = first?.order ?? 0;
          const itemClass = first?.higawari
            ? 'call-item higawari'
            : first?.locationgawari
              ? 'call-item locationgawari'
              : 'call-item';

          const colors = song.part
            ? song.part
                .map((name) => partColors[name as keyof typeof partColors])
                .filter(Boolean)
            : [];

          const borderStyle: CSSProperties | undefined =
            colors.length > 0
              ? ({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '24px',
                  padding: '2px',
                  background:
                    colors.length === 1
                      ? colors[0]
                      : `linear-gradient(to bottom right, ${colors.join(', ')})`,
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                } as CSSProperties)
              : undefined;

          if (selectMode) {
            return (
              <div
                key={song.slug!}
                className={itemClass}
                onClick={() => toggleSelect(song.slug!)}
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                {colors.length > 0 && <div style={borderStyle} />}
                <div className="song-index-wrapper">
                  <span className="song-index">{order}</span>
                </div>
                <div className="call-info-link">
                  <Image
                    src={song.thumbnail!}
                    alt={song.title}
                    width={80}
                    height={80}
                    className="song-jacket"
                  />
                  <div className="song-text-info">
                    <p className="song-title">
                      {song.krtitle ? song.krtitle : song.title}
                    </p>
                    <p className="song-artist">{song.artist}</p>
                  </div>
                </div>
                <div className="call-item-summary">
                  {song.summary!.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="select-marker">
                  {selected.has(song.slug!) && <div className="select-marker-inner" />}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={song.slug!}
              href={`/call-guide/${song.slug}`}
              className={itemClass}
              style={{ textDecoration: 'none' }}
              onClick={handleSongClick}
              data-song-index={index}
              onDragOver={(e) => {
                if (!isDefaultPlaylist) e.preventDefault();
              }}
            >
              {colors.length > 0 && <div style={borderStyle} />}
              <div className="song-index-wrapper">
                <span className="song-index">{order}</span>
                {!isDefaultPlaylist && (
                  <Image
                    src="/images/drag.svg"
                    alt="drag"
                    width={24}
                    height={24}
                    className="song-drag-handle"
                    draggable
                    onDragStart={(e) => {
                      handleSongDragStart(index);
                      e.dataTransfer?.setDragImage(
                        e.currentTarget,
                        e.currentTarget.clientWidth / 2,
                        e.currentTarget.clientHeight / 2,
                      );
                    }}
                    onDragEnd={handleSongDragEnd}
                    onTouchStart={(e) => {
                      handleSongTouchStart(index, e);
                    }}
                    onTouchMove={handleSongTouchMove}
                    onTouchEnd={handleSongTouchEnd}
                  />
                )}
              </div>
              <div className="call-info-link">
                <Image
                  src={song.thumbnail!}
                  alt={song.title}
                  width={80}
                  height={80}
                  className="song-jacket"
                />
                <div className="song-text-info">
                  <p className="song-title">
                    {song.krtitle ? song.krtitle : song.title}
                  </p>
                  <p className="song-artist">{song.artist}</p>
                </div>
              </div>
              <div className="call-item-summary">
                {song.summary!.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
      {showSortButton && (
        <button
          ref={sortButtonRef}
          className="glass-button sort-button"
          onClick={restoreSongOrder}
        >
          <span className="sort-text-full">재생목록 정렬</span>
          <span className="sort-text-short">정렬</span>
        </button>
      )}
    </>
  );
}
