'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  eventSlug: string;
  eventBasePath?: string;
}

export default function CallGuideIndexClient({ songs, eventSlug, eventBasePath = '' }: Props) {
  const playlistsKey = `callGuidePlaylists:${eventSlug}`;
  const activeKey = `callGuideActivePlaylist:${eventSlug}`;
  const safePlaylistsKey = `callGuideSafePlaylists:${eventSlug}`;

  useEffect(() => {
    const migratedKey = 'callGuidePlaylists:migrated';
    if (!localStorage.getItem(migratedKey)) {
      const legacyPlaylists = localStorage.getItem(playlistsKey);
      const legacyActive = localStorage.getItem(activeKey);

      if (legacyPlaylists) {
        localStorage.setItem('callGuidePlaylists:magical-mirai-2025', legacyPlaylists);
        localStorage.removeItem('callGuidePlaylists');
      }

      if (legacyActive) {
        localStorage.setItem('callGuideActivePlaylist:magical-mirai-2025', legacyActive);
        localStorage.removeItem('callGuideActivePlaylist');
      }

      localStorage.setItem(migratedKey, 'true');
    }
  }, []);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sharedSafePlaylists, setSharedSafePlaylists] = useState<Playlist[]>([]);
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
  const editMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const ignoreActiveChange = useRef(false);

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
    let safePlaylists: Playlist[] = [];
    const safeStored = localStorage.getItem(safePlaylistsKey);
    if (safeStored) {
      try {
        const arr = JSON.parse(safeStored) as Playlist[];
        const seen = new Set<string>(arr.filter((p) => p.id).map((p) => p.id));
        safePlaylists = arr
          .map((pl) => {
            let newPl = pl;
            if (!pl.id) {
              const id = ensureUniquePlaylistId(seen);
              seen.add(id);
              newPl = { ...pl, id };
            }
            return newPl;
          })
          .filter((pl) => Array.isArray(pl.slugs) && pl.slugs.length > 0)
          .map((pl) => ({
            ...pl,
            id: `safe:${pl.id}`,
            name: pl.name && pl.name.includes('(SAFE)') ? pl.name : `${pl.name ?? 'SAFE 재생목록'} (SAFE)`,
          }));

        const safeOrderKey = safePlaylistsKey.replace('Playlists', 'PlaylistsOrder');
        const safeOrderStored = localStorage.getItem(safeOrderKey);
        if (safeOrderStored) {
          try {
            const orderedIds = JSON.parse(safeOrderStored) as string[];
            const prefixedOrderedIds = orderedIds.map((id) => `safe:${id}`);
            safePlaylists.sort((a, b) => {
              const indexA = prefixedOrderedIds.indexOf(a.id);
              const indexB = prefixedOrderedIds.indexOf(b.id);
              if (indexA === -1 && indexB === -1) return 0;
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });
          } catch {
          }
        }
      } catch {
        safePlaylists = [];
      }
    }
    setSharedSafePlaylists(safePlaylists);

    let migrated: Playlist[] = [];
    const stored = localStorage.getItem(playlistsKey);
    if (stored) {
      try {
        const arr = JSON.parse(stored) as Playlist[];
        const seen = new Set<string>(arr.filter(p => p.id).map(p => p.id));
        migrated = arr.map((pl) => {
          let newPl = pl;
          if (!pl.id) {
            const id = ensureUniquePlaylistId(seen);
            seen.add(id);
            newPl = { ...pl, id };
          }
          if (!newPl.eventSlug) {
            newPl = { ...newPl, eventSlug };
          }
          return newPl;
        }).filter(pl => pl.eventSlug === eventSlug);

        const orderKey = `${playlistsKey}:order`;
        const orderStored = localStorage.getItem(orderKey);
        if (orderStored) {
          try {
            const orderedIds = JSON.parse(orderStored) as string[];
            migrated.sort((a, b) => {
              const indexA = orderedIds.indexOf(a.id);
              const indexB = orderedIds.indexOf(b.id);
              if (indexA === -1 && indexB === -1) return 0;
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });
          } catch {
          }
        }

        setPlaylists(migrated);
        if (JSON.stringify(arr) !== JSON.stringify(migrated)) {
          localStorage.setItem(playlistsKey, JSON.stringify(migrated));
        }
      } catch {
        migrated = [];
        setPlaylists([]);
      }
    } else {
      setPlaylists([]);
    }

    const defaultPlaylist = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };

    const activeStored = localStorage.getItem(activeKey);
    if (activeStored) {
      try {
        let parsed = JSON.parse(activeStored) as Playlist | null;
        if (!parsed || !Array.isArray(parsed.slugs)) {
          parsed = defaultPlaylist;
        } else if (parsed?.id?.startsWith('safe:')) {
          const match = safePlaylists.find((pl) => pl.id === parsed!.id);
          parsed = match ?? defaultPlaylist;
        } else if (!parsed.id) {
          const match = migrated.find(pl => pl.name === parsed!.name && Array.isArray(pl.slugs) && pl.slugs.length === parsed!.slugs.length && pl.slugs.every(s => parsed!.slugs.includes(s)));
          const id = match?.id ?? generateShortId11();
          parsed = { ...parsed, id };
        }
        if (parsed.id === ALL_PLAYLIST_ID || parsed.name === 'default') {
          parsed = defaultPlaylist;
        }
        localStorage.setItem(activeKey, JSON.stringify(parsed));
        setActivePlaylist(parsed);
      } catch {
        localStorage.setItem(activeKey, JSON.stringify(defaultPlaylist));
        setActivePlaylist(defaultPlaylist);
      }
    } else {
      localStorage.setItem(activeKey, JSON.stringify(defaultPlaylist));
      setActivePlaylist(defaultPlaylist);
    }
  }, [songs, activeKey, playlistsKey, safePlaylistsKey, eventSlug]);

  const toggleSelect = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const confirmSelection = () => {
    if (editingExisting && previousActive.current) {
      const updated = { ...previousActive.current, slugs: Array.from(selected) };
      setActivePlaylist(updated);
      setPlaylists((prev) => {
        const idx = prev.findIndex((p) => p.id === updated.id);
        if (idx >= 0) {
          const arr = [...prev];
          arr[idx] = updated;
          localStorage.setItem(playlistsKey, JSON.stringify(arr));
          return arr;
        }
        return prev;
      });
      localStorage.setItem(activeKey, JSON.stringify(updated));
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
        activeKey,
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
      eventSlug,
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem(playlistsKey, JSON.stringify(updated));
    setActivePlaylist(newPlaylist);
    localStorage.setItem(activeKey, JSON.stringify(newPlaylist));
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
    ignoreActiveChange.current = true;
    setActivePlaylist(def);
    localStorage.setItem(activeKey, JSON.stringify(def));
    setSelected(new Set());
    setPlaylistColor('rgba(255,255,255,0.1)');
    setSelectMode(true);
    setRemoveMode(false);
  };

  const startAddSongs = () => {
    if (!activePlaylist) return;
    previousActive.current = activePlaylist;
    const def: Playlist = { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) };
    ignoreActiveChange.current = true;
    setActivePlaylist(def);
    localStorage.setItem(activeKey, JSON.stringify(def));
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
    if (
      !activePlaylist ||
      activePlaylist.id === ALL_PLAYLIST_ID ||
      activePlaylist.id === 'album-songs'
    )
      return;
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
        localStorage.setItem(playlistsKey, JSON.stringify(arr));
        return arr;
      }
      return prev;
    });
    localStorage.setItem(activeKey, JSON.stringify(updated));
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

  useEffect(() => {
    if (selectMode) cancelSelection();
    if (removeMode) setRemoveMode(false);
  }, [pathname]);

  const resetEditState = useCallback(() => {
    setSelectMode(false);
    setRemoveMode(false);
    setSelected(new Set());
    setShowNameModal(false);
    setPlaylistName('');
    setPlaylistColor('rgba(255,255,255,0.1)');
    setEditingExisting(false);
    previousActive.current = null;
  }, []);

  useEffect(() => {
    if (ignoreActiveChange.current) {
      ignoreActiveChange.current = false;
      return;
    }
    if (selectMode || removeMode || showNameModal) {
      resetEditState();
    }
  }, [activePlaylist?.id]);

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
      localStorage.setItem(playlistsKey, JSON.stringify(updated));
      return updated;
    });
    setDeleteIndex(null);
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
        {!selectMode && !removeMode && !showEditModal && !showNameModal && (
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
        )}
        {activePlaylist?.id !== ALL_PLAYLIST_ID &&
          activePlaylist?.id !== 'album-songs' &&
          !activePlaylist?.id?.startsWith('safe:') && (
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
              alt="목록 편집"
              width={24}
              height={24}
              className="button-icon"
            />
            <span className="button-text">목록 편집</span>
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
        eventBasePath={eventBasePath}
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
          defaultPlaylists={[
            { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) },
            ...sharedSafePlaylists,
          ]}
          playlistsKey={playlistsKey}
          activeKey={activeKey}
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
              localStorage.setItem(activeKey, JSON.stringify(def));
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
