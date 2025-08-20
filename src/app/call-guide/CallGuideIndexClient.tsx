'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import SelectionOverlay from '@/components/call-guide/SelectionOverlay';
import PlaylistNameModal from '@/components/call-guide/PlaylistNameModal';
import PlaylistDeleteModal from '@/components/call-guide/PlaylistDeleteModal';
import PlaylistModal from '@/components/call-guide/PlaylistModal';
import PlaylistEditModal from '@/components/call-guide/PlaylistEditModal';
import SongList, {
  type SongListHandle,
} from '@/components/call-guide/SongList';
import { makeOrderStorageKey, generateShortId11, ensureUniquePlaylistId, ALL_PLAYLIST_ID } from '@/utils/playlistOrder';
import { SongWithSetlist, Playlist } from '@/types/callGuide';

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
  const [playlistColor, setPlaylistColor] = useState('rgba(255,255,255,0.1)');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const previousActive = useRef<Playlist | null>(null);
  const songListRef = useRef<SongListHandle | null>(null);
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const [sortNeeded, setSortNeeded] = useState(false);
  const [showSortButton, setShowSortButton] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [editingExisting, setEditingExisting] = useState(false);
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sortNeeded) {
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
  }, [sortNeeded]);

  useEffect(() => {
    if (showSortButton) {
      const btn = sortButtonRef.current;
      requestAnimationFrame(() => {
        btn?.classList.add('show');
        btn?.classList.remove('hide');
      });
    }
  }, [showSortButton]);

  useEffect(() => {
    let migrated: Playlist[] = [];
    const stored = localStorage.getItem('callGuidePlaylists');
    if (stored) {
      try {
        const arr = JSON.parse(stored) as Playlist[];
        const seen = new Set<string>(arr.filter(p => p.id).map(p => p.id));
        migrated = arr.map((pl) => {
          if (pl.id) return pl;
          const id = ensureUniquePlaylistId(seen);
          seen.add(id);
          return { ...pl, id };
        });
        setPlaylists(migrated);
        if (JSON.stringify(arr) !== JSON.stringify(migrated)) {
          localStorage.setItem('callGuidePlaylists', JSON.stringify(migrated));
        }
      } catch {
        migrated = [];
        setPlaylists([]);
      }
    } else {
      setPlaylists([]);
    }

    const activeStored = localStorage.getItem('callGuideActivePlaylist');
    if (activeStored) {
      try {
        let parsed = JSON.parse(activeStored) as Playlist | null;
        if (!parsed || !Array.isArray(parsed.slugs)) {
          parsed = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
        } else if (!parsed.id) {
          const match = migrated.find(pl => pl.name === parsed!.name && Array.isArray(pl.slugs) && pl.slugs.length === parsed!.slugs.length && pl.slugs.every(s => parsed!.slugs.includes(s)));
          const id = match?.id ?? generateShortId11();
          parsed = { ...parsed, id };
        }
        if (parsed.name === 'default') {
          parsed = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
        }
        localStorage.setItem('callGuideActivePlaylist', JSON.stringify(parsed));
        setActivePlaylist(parsed);
      } catch {
        const def = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
        localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
        setActivePlaylist(def);
      }
    } else {
      const def = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
      setActivePlaylist(def);
    }
  }, [songs]);

  const toggleSelect = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const confirmSelection = () => {
    if (selected.size === 0) return;
    if (editingExisting && previousActive.current) {
      const updated = { ...previousActive.current, slugs: Array.from(selected) };
      setActivePlaylist(updated);
      setPlaylists((prev) => {
        const idx = prev.findIndex((p) => p.id === updated.id);
        if (idx >= 0) {
          const arr = [...prev];
          arr[idx] = updated;
          localStorage.setItem('callGuidePlaylists', JSON.stringify(arr));
          return arr;
        }
        return prev;
      });
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
      setSelected(new Set());
      setSelectMode(false);
      setEditingExisting(false);
      previousActive.current = null;
      return;
    }
    setShowNameModal(true);
  };

  const restorePrevious = () => {
    if (previousActive.current) {
      setActivePlaylist(previousActive.current);
      localStorage.setItem(
        'callGuideActivePlaylist',
        JSON.stringify(previousActive.current),
      );
      previousActive.current = null;
    }
  };

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    const color = playlistColor === 'rgba(255,255,255,0.1)' ? undefined : playlistColor;
    const existingIds = playlists.map(p => p.id);
    const id = ensureUniquePlaylistId(existingIds);
    const newPlaylist: Playlist = {
      id,
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

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => setShowPlaylistModal(false);

  const startNewPlaylist = () => {
    previousActive.current = activePlaylist;
    const def: Playlist = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
    setActivePlaylist(def);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
    setSelected(new Set());
    setPlaylistColor('rgba(255,255,255,0.1)');
    setSelectMode(true);
    setRemoveMode(false);
  };

  const startAddSongs = () => {
    if (!activePlaylist) return;
    previousActive.current = activePlaylist;
    const def: Playlist = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
    setActivePlaylist(def);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
    setSelected(new Set(activePlaylist.slugs));
    setPlaylistColor(activePlaylist.color ?? 'rgba(255,255,255,0.1)');
    setSelectMode(true);
    setEditingExisting(true);
    setRemoveMode(false);
  };

  const startRemoveSongs = () => {
    setRemoveMode(true);
  };

  const handleRemoveSong = (slug: string) => {
    if (!activePlaylist || activePlaylist.id === ALL_PLAYLIST_ID) return;
    const updated = {
      ...activePlaylist,
      slugs: activePlaylist.slugs.filter((s) => s !== slug),
    };
    setActivePlaylist(updated);
    setPlaylists((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const arr = [...prev];
        arr[idx] = updated;
        localStorage.setItem('callGuidePlaylists', JSON.stringify(arr));
        return arr;
      }
      return prev;
    });
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(updated));
  };

  useEffect(() => {
    if (!removeMode) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.remove-button')) return;
      setRemoveMode(false);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [removeMode]);

  const openDeleteModal = (index: number) => setDeleteIndex(index);
  const cancelDelete = () => setDeleteIndex(null);
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setPlaylists((prev) => {
      const toDelete = prev[deleteIndex];
      if (toDelete?.id) {
        localStorage.removeItem(makeOrderStorageKey(toDelete.id));
      }
      if (toDelete?.name) {
        localStorage.removeItem(makeOrderStorageKey(toDelete.name as unknown as string));
      }
      const updated = prev.filter((_, i) => i !== deleteIndex);
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
      return updated;
    });
    setDeleteIndex(null);
  };

  // TODO
  const _renamePlaylist = (oldName: string, newName: string, slugs: string[]) => {};

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
        <button className="glass-button" onClick={startNewPlaylist}>
          <Image
            src="/images/plus.svg"
            alt="새 재생목록"
            width={28}
            height={28}
            className="button-icon plus-icon"
          />
          <span className="button-text">새 재생목록</span>
        </button>
        {activePlaylist?.id !== ALL_PLAYLIST_ID && (
          <div className="edit-menu-wrapper" ref={editMenuRef}>
            <button
              className="glass-button"
              onClick={() => {
                setRemoveMode(false);
                setShowEditModal((v) => !v);
              }}
            >
              <Image
                src="/images/edit.svg"
                alt="곡 편집"
                width={24}
                height={24}
                className="button-icon"
              />
              <span className="button-text">곡 편집</span>
            </button>
            {showEditModal && (
              <PlaylistEditModal
                onAdd={() => {
                  setShowEditModal(false);
                  startAddSongs();
                }}
                onRemove={() => {
                  setShowEditModal(false);
                  startRemoveSongs();
                }}
                onClose={() => setShowEditModal(false)}
                parentRef={editMenuRef}
              />
            )}
          </div>
        )}
        {showSortButton && (
          <button
            ref={sortButtonRef}
            className="glass-button sort-button"
            onClick={() => songListRef.current?.restoreSongOrder()}
          >
            <span className="sort-text-full">재생목록 정렬</span>
            <span className="sort-text-short">정렬</span>
          </button>
        )}
      </div>

      <SongList
        songs={songs}
        setPlaylists={setPlaylists}
        activePlaylist={activePlaylist}
        setActivePlaylist={setActivePlaylist}
        selectMode={selectMode}
        selected={selected}
        toggleSelect={toggleSelect}
        onSortNeededChange={setSortNeeded}
        removeMode={removeMode}
        onRemoveSong={handleRemoveSong}
        ref={songListRef}
      />

      {selectMode && (
        <SelectionOverlay
          count={selected.size}
          onConfirm={confirmSelection}
          onCancel={cancelSelection}
        />
      )}

      {showPlaylistModal && (
        <PlaylistModal
          playlists={playlists}
          songs={songs}
          activePlaylist={activePlaylist}
          setPlaylists={setPlaylists}
          setActivePlaylist={setActivePlaylist}
          onClose={closePlaylistModal}
          onDeleteRequest={openDeleteModal}
        />
      )}

      {showNameModal && (
        <PlaylistNameModal
          name={playlistName}
          color={playlistColor}
          setName={setPlaylistName}
          setColor={setPlaylistColor}
          onConfirm={createPlaylist}
          onCancel={cancelNameModal}
        />
      )}

      {deleteIndex !== null && (
        <PlaylistDeleteModal
          name={playlists[deleteIndex].name}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
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
              const def: Playlist = {
                id: ALL_PLAYLIST_ID,
                name: '전체 곡',
                slugs: songs.map((s) => s.slug!),
              };
              localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
              setActivePlaylist(def);
            }}
          >
            전체 곡
          </button>
        </div>
      )}
    </>
  );
}
