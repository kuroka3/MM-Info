'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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
import SongSearchOverlay from '@/components/call-guide/SongSearchOverlay';
import {
  makeOrderStorageKey,
  generateShortId11,
  ensureUniquePlaylistId,
} from '@/utils/playlistOrder';
import { SongWithSetlist, Playlist } from '@/types/callGuide';
import { SAFE_SONG_INDEX } from '@/data/safeSongIndex';

const SAFE_ALL_ID = 'safe-all';

interface Props {
  songs: SongWithSetlist[];
}

export default function SafeCallGuideIndexClient({ songs }: Props) {
  const [safeSongs, setSafeSongs] = useState<SongWithSetlist[]>([]);
  const computeSafeSongs = useCallback(() => {
    const stored = JSON.parse(
      localStorage.getItem('callGuideSafeSongs') || '[]',
    ) as string[];
    const orderMap = new Map<string, number>();
    SAFE_SONG_INDEX.forEach((slug, i) => orderMap.set(slug, i + 1));
    stored.forEach((slug) => {
      if (!orderMap.has(slug)) {
        orderMap.set(slug, orderMap.size + 1);
      }
    });
    return songs
      .filter((s) => s.slug && orderMap.has(s.slug))
      .sort((a, b) => orderMap.get(a.slug!)! - orderMap.get(b.slug!)!)
      .map((s) => ({ ...s, safeIndex: orderMap.get(s.slug!) }));
  }, [songs]);

  useEffect(() => {
    setSafeSongs(computeSafeSongs());
  }, [computeSafeSongs]);

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
  const [showSearch, setShowSearch] = useState(false);
  const editMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const ignoreActiveChange = useRef(false);
  const safeAll = React.useMemo(
    () => ({ id: SAFE_ALL_ID, name: '전체 곡', slugs: safeSongs.map((s) => s.slug!) }),
    [safeSongs],
  );
  const albumPlaylist = React.useMemo(
    () => ({ id: 'album-songs', name: '앨범 곡', slugs: SAFE_SONG_INDEX }),
    [],
  );

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
    if (!safeSongs.length) return;
    let migrated: Playlist[] = [];
    const stored = localStorage.getItem('callGuideSafePlaylists');
    if (stored) {
      try {
        const arr = JSON.parse(stored) as Playlist[];
        const seen = new Set<string>(arr.filter((p) => p.id).map((p) => p.id));
        migrated = arr.map((pl) => {
          if (pl.id) return pl;
          const id = ensureUniquePlaylistId(seen);
          seen.add(id);
          return { ...pl, id };
        });
        if (JSON.stringify(arr) !== JSON.stringify(migrated)) {
          localStorage.setItem('callGuideSafePlaylists', JSON.stringify(migrated));
        }
      } catch {
        migrated = [];
      }
    }
    setPlaylists(migrated);

    const activeStored = localStorage.getItem('callGuideSafeActivePlaylist');
    if (activeStored) {
      try {
        let parsed = JSON.parse(activeStored) as Playlist | null;
        if (!parsed || !Array.isArray(parsed.slugs)) {
          parsed = safeAll;
        } else if (parsed.id === SAFE_ALL_ID) {
          parsed = safeAll;
        } else if (parsed.id === 'album-songs') {
          parsed = albumPlaylist;
        } else if (!parsed.id) {
          const match = migrated.find(
            (pl) =>
              pl.name === parsed!.name &&
              Array.isArray(pl.slugs) &&
              pl.slugs.length === parsed!.slugs.length &&
              pl.slugs.every((s) => parsed!.slugs.includes(s)),
          );
          const id = match?.id ?? generateShortId11();
          parsed = { ...parsed, id };
        } else {
          const match = migrated.find((pl) => pl.id === parsed!.id);
          if (!match) parsed = safeAll;
        }
        localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(parsed));
        setActivePlaylist(parsed);
      } catch {
        localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(safeAll));
        setActivePlaylist(safeAll);
      }
    } else {
      localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(safeAll));
      setActivePlaylist(safeAll);
    }
  }, [safeSongs, safeAll, albumPlaylist]);

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
          localStorage.setItem('callGuideSafePlaylists', JSON.stringify(arr));
          return arr;
        }
        return prev;
      });
      localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(updated));
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
        'callGuideSafeActivePlaylist',
        JSON.stringify(previousActive.current),
      );
      previousActive.current = null;
    }
  };

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    const color = playlistColor === 'rgba(255,255,255,0.1)' ? undefined : playlistColor;
    const existingIds = playlists.map((p) => p.id);
    const id = ensureUniquePlaylistId(existingIds);
    const newPlaylist: Playlist = {
      id,
      name: playlistName.trim(),
      slugs: Array.from(selected),
      color,
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    localStorage.setItem('callGuideSafePlaylists', JSON.stringify(updated));
    setActivePlaylist(newPlaylist);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(newPlaylist));
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
    const def = { ...safeAll };
    ignoreActiveChange.current = true;
    setActivePlaylist(def);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(def));
    setSelected(new Set());
    setPlaylistColor('rgba(255,255,255,0.1)');
    setSelectMode(true);
    setRemoveMode(false);
  };

  const startAddSongs = () => {
    if (!activePlaylist) return;
    previousActive.current = activePlaylist;
    const def = { ...safeAll };
    ignoreActiveChange.current = true;
    setActivePlaylist(def);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(def));
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
      activePlaylist.id === SAFE_ALL_ID ||
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
        localStorage.setItem('callGuideSafePlaylists', JSON.stringify(arr));
        return arr;
      }
      return prev;
    });
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(updated));
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
        localStorage.removeItem(
          makeOrderStorageKey(toDelete.name as unknown as string),
        );
      }
      const updated = prev.filter((_, i) => i !== deleteIndex);
      localStorage.setItem('callGuideSafePlaylists', JSON.stringify(updated));
      return updated;
    });
    setDeleteIndex(null);
  };

  return (
    <>
      <div className="call-guide-actions">
        <button className="glass-button" onClick={() => setShowSearch(true)}>
          <Image
            src="/images/search.svg"
            alt="곡 검색"
            width={24}
            height={24}
            className="button-icon"
          />
          <span className="button-text">곡 검색</span>
        </button>
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
        {activePlaylist?.id !== SAFE_ALL_ID &&
          activePlaylist?.id !== 'album-songs' && (
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
        songs={safeSongs}
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
        linkExtraQuery="&safe=1"
        playlistsKey="callGuideSafePlaylists"
        activeKey="callGuideSafeActivePlaylist"
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
          songs={safeSongs}
          activePlaylist={activePlaylist}
          setPlaylists={setPlaylists}
          setActivePlaylist={setActivePlaylist}
          onClose={closePlaylistModal}
          onDeleteRequest={openDeleteModal}
          defaultPlaylists={[safeAll, albumPlaylist]}
          playlistsKey="callGuideSafePlaylists"
          activeKey="callGuideSafeActivePlaylist"
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
              const def = { ...safeAll };
              localStorage.setItem(
                'callGuideSafeActivePlaylist',
                JSON.stringify(def),
              );
              setActivePlaylist(def);
            }}
          >
            전체 곡
          </button>
        </div>
      )}

      {showSearch && (
        <SongSearchOverlay
          songs={songs}
          safeSongs={safeSongs}
          onClose={() => setShowSearch(false)}
          onUnlock={() => setSafeSongs(computeSafeSongs())}
        />
      )}
    </>
  );
}

