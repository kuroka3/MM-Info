'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import SelectionOverlay from '@/components/call-guide/SelectionOverlay';
import PlaylistNameModal from '@/components/call-guide/PlaylistNameModal';
import PlaylistDeleteModal from '@/components/call-guide/PlaylistDeleteModal';
import PlaylistModal from '@/components/call-guide/PlaylistModal';
import SongList, {
  type SongListHandle,
} from '@/components/call-guide/SongList';
import type { Playlist, SongWithSetlist } from '@/types/callGuide';

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
    const stored = localStorage.getItem('callGuidePlaylists');
    if (stored) {
      try {
        setPlaylists(JSON.parse(stored));
      } catch {
        /* ignore */
      }
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
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
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
      localStorage.setItem(
        'callGuideActivePlaylist',
        JSON.stringify(previousActive.current),
      );
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

  const openPlaylistModal = () => setShowPlaylistModal(true);
  const closePlaylistModal = () => setShowPlaylistModal(false);

  const startNewPlaylist = () => {
    previousActive.current = activePlaylist;
    const def = { name: '전체 곡', slugs: songs.map((s) => s.slug!) };
    setActivePlaylist(def);
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(def));
    setSelected(new Set());
    setPlaylistColor('rgba(255,255,255,0.1)');
    setSelectMode(true);
  };

  const openDeleteModal = (index: number) => setDeleteIndex(index);
  const cancelDelete = () => setDeleteIndex(null);
  const confirmDelete = () => {
    if (deleteIndex === null) return;
    setPlaylists((prev) => {
      const updated = prev.filter((_, i) => i !== deleteIndex);
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
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
              const def = {
                name: '전체 곡',
                slugs: songs.map((s) => s.slug!),
              };
              localStorage.setItem(
                'callGuideActivePlaylist',
                JSON.stringify(def),
              );
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
