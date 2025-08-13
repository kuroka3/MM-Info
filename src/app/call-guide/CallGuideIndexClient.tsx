'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
} from 'react';
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
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

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
        if (parsed.name === 'default') {
          parsed.name = '전체 곡';
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

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    const newPlaylist = { name: playlistName.trim(), slugs: Array.from(selected) };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
    setSelected(new Set());
    setSelectMode(false);
    setPlaylistName('');
    setShowNameModal(false);
  };

  const cancelNameModal = () => {
    setPlaylistName('');
    setShowNameModal(false);
  };

  const cancelSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => setShowPlaylistModal(false);

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

  const handleTouchEnd = (e: React.TouchEvent) => {
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
          onClick={() => setSelectMode(true)}
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
      </div>

      <div className="call-list">
        {(activePlaylist
          ? songs.filter((s) => activePlaylist.slugs.includes(s.slug!))
          : songs
        ).map((song) => {
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
                <span className="song-index">{order}</span>
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
            >
              {colors.length > 0 && <div style={borderStyle} />}
              <span className="song-index">{order}</span>
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
                  onTouchEnd={handleTouchEnd}
                >
                  <Image
                    src="/images/drag.svg"
                    alt="drag"
                    width={16}
                    height={16}
                    className="drag-handle"
                  />
                  <span className="playlist-item-name">{pl.name}</span>
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
            <p className="delete-playlist-title">{playlists[deleteIndex].name}</p>
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
    </>
  );
}
