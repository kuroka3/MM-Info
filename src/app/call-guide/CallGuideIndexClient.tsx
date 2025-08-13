'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Prisma } from '@prisma/client';

const partColors = {
  MIKU: '#39c5bbaa',
  RIN: '#ffa500aa',
  LEN: '#ffe211aa',
  LUKA: '#ffc0cbaa',
  KAITO: '#0000ffaa',
  MEIKO: '#d80000aa',
} as const;

type SongWithSetlist = Prisma.SongGetPayload<{ include: { setlists: { select: { order: true; higawari: true; locationgawari: true }; orderBy: { order: 'asc' }; take: 1 } } }>;

interface Playlist {
  name: string;
  slugs: string[];
  color?: string;
}

interface Props {
  songs: SongWithSetlist[];
}

export default function CallGuideIndexClient({ songs }: Props) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [songDragIndex, setSongDragIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [colorIndex, setColorIndex] = useState<number | null>(null);
  const [playlistColor, setPlaylistColor] = useState('rgba(255,255,255,0.1)');
  const previousActive = useRef<Playlist | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showSortButton, setShowSortButton] = useState(false);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('callGuidePlaylists');
    if (stored) {
      try {
        setPlaylists(JSON.parse(stored));
      } catch { }
    }

    const activeStored = localStorage.getItem('callGuideActivePlaylist');
    if (activeStored) {
      try {
        const parsed = JSON.parse(activeStored);
        if (parsed.name === 'default' || parsed.name === '전체 곡') {
          parsed.name = '전체 곡';
          parsed.slugs = songs.map((s) => s.slug!);
          localStorage.setItem('callGuideActivePlaylist', JSON.stringify(parsed));
        }
        setActivePlaylist(parsed);
      } catch {
        /* ignore */
      }
    } else {
      const def = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
      setActivePlaylist(def);
    }
  }, [songs]);

  const toggleSelect = useCallback((slug: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }, []);

  const confirmSelection = () => {
    if (selected.size === 0) return;
    setShowNameModal(true);
  };

  const restorePrevious = () => {
    if (previousActive.current) {
      setActivePlaylist(previousActive.current);
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(previousActive.current));
      previousActive.current = null;
    }
  };

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    const color =
      playlistColor === 'rgba(255,255,255,0.1)' ? undefined : playlistColor;
    const newPlaylist = {
      name: playlistName.trim(),
      slugs: Array.from(selected),
      color,
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
    setActivePlaylist(newPlaylist);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(newPlaylist));
    setSelected(new Set());
    setSelectMode(false);
    setPlaylistName('');
    setPlaylistColor('rgba(255,255,255,0.1)');
    setShowNameModal(false);
    previousActive.current = null;
  };

  const cancelNameModal = () => {
    setPlaylistName('');
    setShowNameModal(false);
  };

  const cancelSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
    restorePrevious();
  };

  const isDefaultPlaylist = activePlaylist?.name === '전체 곡';

  const getSongOrder = useCallback(
    (slug: string) => songs.findIndex((s) => s.slug === slug),
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
    const btn = sortButtonRef.current;
    if (shouldShowSort) {
      setShowSortButton(true);
      requestAnimationFrame(() => {
        btn?.classList.add('show');
        btn?.classList.remove('hide');
      });
    } else if (btn) {
      btn.classList.remove('show');
      btn.classList.add('hide');
      const t = setTimeout(() => {
        setShowSortButton(false);
      }, 300);
      return () => clearTimeout(t);
    } else {
      setShowSortButton(false);
    }
  }, [shouldShowSort]);

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
    setColorIndex(null);
  };

  const startNewPlaylist = () => {
    previousActive.current = activePlaylist;
    const def = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
    setActivePlaylist(def);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
    setSelected(new Set());
    setPlaylistColor('rgba(255,255,255,0.1)');
    setSelectMode(true);
  };

  const selectPlaylist = (pl: Playlist | 'default') => {
    const active =
      pl === 'default'
        ? { name: '전체 곡', slugs: songs.map((s) => s.slug!) }
        : pl;
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
    setActivePlaylist(active);
    closePlaylistModal();
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setPlaylists(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
      return updated;
    });
    setDragIndex(null);
  };

  const openDeleteModal = (index: number) => setDeleteIndex(index);
  const cancelDelete = () => setDeleteIndex(null);
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setPlaylists(prev => {
      const updated = prev.filter((_, i) => i !== deleteIndex);
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
      return updated;
    });
    setDeleteIndex(null);
  };

  const handleSongClick = () => {
    if (!activePlaylist) {
      const def = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
      setActivePlaylist(def);
    }
  };

  const handlePlaylistTouchEnd = (e: React.TouchEvent) => {
    if (dragIndex === null) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const li = target?.closest('li[data-index]') as HTMLElement | null;
    if (li) {
      const dropIndex = parseInt(li.dataset.index || '', 10);
      if (!isNaN(dropIndex) && dropIndex !== dragIndex) {
        handleDrop(dropIndex);
        e.preventDefault();
      }
    }
    setDragIndex(null);
  };

  const handleSongDragStart = (index: number) => {
    if (isDefaultPlaylist) return;
    setSongDragIndex(index);
  };

  const handleSongTouchStart = (index: number) => {
    if (isDefaultPlaylist) return;
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => setSongDragIndex(index), 300);
  };

  const handleSongTouchMove = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (songDragIndex !== null) {
      const touch = e.touches[0];
      const y = touch.clientY;
      const threshold = 50;
      if (y < threshold) window.scrollBy({ top: -10, behavior: 'smooth' });
      else if (y > window.innerHeight - threshold) window.scrollBy({ top: 10, behavior: 'smooth' });
      e.preventDefault();
    }
  };

  const handleSongDrop = (index: number) => {
    if (songDragIndex === null || songDragIndex === index || !activePlaylist || isDefaultPlaylist) return;
    setActivePlaylist(prev => {
      if (!prev) return prev;
      const updatedSlugs = [...prev.slugs];
      const [moved] = updatedSlugs.splice(songDragIndex, 1);
      updatedSlugs.splice(index, 0, moved);
      const updated = { ...prev, slugs: updatedSlugs };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setPlaylists(pls => {
        const idx = pls.findIndex(p => p.name === prev.name);
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
    setSongDragIndex(null);
  };

  const handleSongTouchEnd = (e: React.TouchEvent) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (songDragIndex === null) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(window.innerWidth / 2, touch.clientY);
    const item = target?.closest('[data-song-index]') as HTMLElement | null;
    if (item) {
      const dropIndex = parseInt(item.dataset.songIndex || '', 10);
      if (!isNaN(dropIndex) && dropIndex !== songDragIndex) {
        handleSongDrop(dropIndex);
        e.preventDefault();
      }
    }
    setSongDragIndex(null);
  };

  const handleSongDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    if (songDragIndex === null) return;
    const target = document.elementFromPoint(window.innerWidth / 2, e.clientY);
    const item = target?.closest('[data-song-index]') as HTMLElement | null;
    if (item) {
      const dropIndex = parseInt(item.dataset.songIndex || '', 10);
      if (!isNaN(dropIndex) && dropIndex !== songDragIndex) {
        handleSongDrop(dropIndex);
      }
    }
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
    setActivePlaylist(prev => {
      if (!prev) return prev;
      const updated = { ...prev, slugs: sortedSlugs };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setPlaylists(pls => {
        const idx = pls.findIndex(p => p.name === prev.name);
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
              {
                duration: 500,
                easing: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
              },
            );
          }
        }
      });
    });
  };

  const playlistSongs = useMemo(() => {
    if (!activePlaylist) return songs;
    return activePlaylist.slugs
      .map((slug) => songs.find((s) => s.slug === slug))
      .filter(Boolean) as SongWithSetlist[];
  }, [activePlaylist, songs]);

  return (
    <>
      <div className="call-guide-actions">
        <button className="glass-button" onClick={openPlaylistModal}>
          <Image
            src="/images/list.svg"
            alt="목록 리스트"
            width={24}
            height={24}
            className="button-icon"
          />
          <span className="button-text">목록 리스트</span>
        </button>
        <button
          className="glass-button"
          onClick={startNewPlaylist}
        >
          <Image
            src="/images/plus.svg"
            alt="새 재생목록"
            width={28}
            height={28}
            className="button-icon plus-icon"
          />
          <span className="button-text">새 재생목록</span>
        </button>
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
      </div>

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

          const borderStyle: React.CSSProperties | undefined =
            colors.length > 0
              ? ({
                position: 'absolute' as const,
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
                pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
              } satisfies CSSProperties)
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
                draggable={!isDefaultPlaylist}
                onDragStart={(e) => {
                  handleSongDragStart(index);
                  e.dataTransfer?.setDragImage(
                    e.currentTarget,
                    e.currentTarget.clientWidth / 2,
                    e.currentTarget.clientHeight / 2,
                  );
                }}
                onDragOver={(e) => {
                  if (!isDefaultPlaylist) e.preventDefault();
                }}
                onDrop={handleSongDragEnd}
                onDragEnd={handleSongDragEnd}
                onTouchStart={() => handleSongTouchStart(index)}
                onTouchMove={handleSongTouchMove}
                onTouchEnd={handleSongTouchEnd}
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

      {selectMode && (
        <>
          <div className="selection-info">
            {selected.size}곡 선택됨
          </div>
          <div className="selection-actions">
            <button className="confirm-button" onClick={confirmSelection}>
              선택 완료
            </button>
            <button className="cancel-button" onClick={cancelSelection}>
              취소
            </button>
          </div>
        </>
      )}

      {showPlaylistModal && (
        <div className="playlist-modal" onClick={closePlaylistModal}>
          <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>재생목록 선택</h3>
            <hr className="playlist-divider" />
            <ul>
              <li onClick={() => selectPlaylist('default')}>전체 곡</li>
              {playlists.map((pl, i) => (
                <li
                  key={pl.name}
                  data-index={i}
                  onClick={() => selectPlaylist(pl)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  draggable
                  onDragStart={(e) => {
                    handleDragStart(i);
                    e.dataTransfer?.setDragImage(
                      e.currentTarget,
                      e.currentTarget.clientWidth / 2,
                      e.currentTarget.clientHeight / 2,
                    );
                  }}
                  onTouchStart={() => handleDragStart(i)}
                    onTouchEnd={handlePlaylistTouchEnd}
                >
                  <Image
                    src="/images/drag.svg"
                    alt="drag"
                    width={16}
                    height={16}
                    className="drag-handle"
                  />
                  <span className="playlist-item-name">{pl.name}</span>
                  <span
                    className="playlist-color"
                    style={{ background: pl.color || 'rgba(255,255,255,0.3)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorIndex(colorIndex === i ? null : i);
                    }}
                  />
                  {colorIndex === i && (
                    <div className="color-palette" onClick={(e) => e.stopPropagation()}>
                      {['rgba(255,255,255,0.1)', '#39c5bbaa', '#ffa500aa', '#ffe211aa', '#ffc0cbaa', '#0000ffaa', '#d80000aa'].map((c) => (
                        <span
                          key={c}
                          className="palette-color"
                          style={{ background: c }}
                          onClick={() => {
                            setPlaylists(prev => {
                              const updated = [...prev];
                              const color = c === 'rgba(255,255,255,0.1)' ? undefined : c;
                              updated[i] = { ...updated[i], color };
                              localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
                              return updated;
                            });
                            if (activePlaylist?.name === pl.name) {
                              const active = { ...pl, color: c === 'rgba(255,255,255,0.1)' ? undefined : c };
                              setActivePlaylist(active);
                              localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
                            }
                            setColorIndex(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <Image
                    src="/images/minus-circle.svg"
                    alt="삭제"
                    width={20}
                    height={20}
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(i);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showNameModal && (
        <div className="playlist-modal" onClick={cancelNameModal}>
          <div
            className="playlist-name-popup"
            onClick={(e) => e.stopPropagation()}
          >
          <h3>재생목록 이름</h3>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="이름 입력"
            autoFocus
          />
          <div className="color-palette">
            {['rgba(255,255,255,0.1)', '#39c5bbaa', '#ffa500aa', '#ffe211aa', '#ffc0cbaa', '#0000ffaa', '#d80000aa'].map((c) => (
              <span
                key={c}
                className={`palette-color${playlistColor === c ? ' selected' : ''}`}
                style={{ background: c }}
                onClick={() => setPlaylistColor(c)}
              />
            ))}
          </div>
          <div className="name-modal-actions">
            <button className="confirm-button" onClick={createPlaylist}>
              선택
            </button>
            <button className="cancel-button" onClick={cancelNameModal}>
              취소
            </button>
          </div>
          </div>
        </div>
      )}

      {deleteIndex !== null && (
        <div className="playlist-modal" onClick={cancelDelete}>
          <div className="playlist-delete-popup" onClick={(e) => e.stopPropagation()}>
            <p>
              &apos;<span className="delete-playlist-name">{playlists[deleteIndex].name}</span>&apos; 재생목록을
            </p>
            <p>삭제하시겠습니까?</p>
            <div className="name-modal-actions">
              <button className="confirm-button" onClick={confirmDelete}>
                예
              </button>
              <button className="cancel-button" onClick={cancelDelete}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectMode && activePlaylist && (
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
    </>
  );
}
