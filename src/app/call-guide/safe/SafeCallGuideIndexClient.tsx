'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SongWithSetlist, Playlist } from '@/types/callGuide';
import SongList from '@/components/call-guide/SongList';
import PlaylistSelectModal from '@/components/call-guide/PlaylistSelectModal';
import PlaylistNameModal from '@/components/call-guide/PlaylistNameModal';
import SelectionOverlay from '@/components/call-guide/SelectionOverlay';
import { ensureUniquePlaylistId } from '@/utils/playlistOrder';

const ALBUM_SLUGS = ['lustrous','dama-rock','lavie','hiasobi','maga-maga','genten','street-light'];

interface Props {
  songs: SongWithSetlist[];
}

export default function SafeCallGuideIndexClient({ songs }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [safeSongs, setSafeSongs] = useState<SongWithSetlist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('callGuideSafeSongs') || '[]') as string[];
    const safeSet = new Set<string>([...ALBUM_SLUGS, ...stored]);
    const filtered = songs.filter((s) => safeSet.has(s.slug!));
    setSafeSongs(filtered);

    let custom: Playlist[] = [];
    const storedPls = localStorage.getItem('callGuideSafePlaylists');
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
      slugs: filtered.map((s) => s.slug!),
    };
    const album: Playlist = { id: 'album-songs', name: '앨범 곡', slugs: ALBUM_SLUGS };
    const pls = [safeAll, album, ...custom];
    setPlaylists(pls);

    const listParam = searchParams.get('list');
    const activeStored = localStorage.getItem('callGuideSafeActivePlaylist');
    let active = pls.find((p) => p.id === listParam) || null;
    if (!active && activeStored) {
      try {
        active = JSON.parse(activeStored) as Playlist;
      } catch {
        active = null;
      }
    }
    if (!active || !Array.isArray(active.slugs)) active = safeAll;
    setActivePlaylist(active);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(active));
  }, [songs, searchParams]);

  useEffect(() => {
    if (activePlaylist && searchParams.get('list') !== activePlaylist.id) {
      router.replace(`/call-guide/safe?list=${activePlaylist.id}`);
    }
  }, [activePlaylist, router, searchParams]);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showNameModal, setShowNameModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistColor, setPlaylistColor] = useState('rgba(255,255,255,0.1)');

  const toggleSelect = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const confirmSelection = () => {
    if (selected.size === 0) {
      setSelectMode(false);
      return;
    }
    setShowNameModal(true);
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
    localStorage.setItem(
      'callGuideSafePlaylists',
      JSON.stringify(updated.filter((p) => p.id !== 'safe-all' && p.id !== 'album-songs')),
    );
    setActivePlaylist(newPlaylist);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(newPlaylist));
    setSelected(new Set());
    setSelectMode(false);
    setPlaylistName('');
    setPlaylistColor('rgba(255,255,255,0.1)');
    setShowNameModal(false);
  };

  const cancelSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  const selectPlaylist = (pl: Playlist | 'default') => {
    const selectedPl = pl === 'default' ? playlists[0] : pl;
    setActivePlaylist(selectedPl);
    localStorage.setItem('callGuideSafeActivePlaylist', JSON.stringify(selectedPl));
    setShowPlaylistModal(false);
  };

  const persistPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>> = (value) => {
    setPlaylists((prev) => {
      const next =
        typeof value === 'function'
          ? (value as (p: Playlist[]) => Playlist[])(prev)
          : value;
      localStorage.setItem(
        'callGuideSafePlaylists',
        JSON.stringify(next.filter((p) => p.id !== 'safe-all' && p.id !== 'album-songs')),
      );
      return next;
    });
  };

  return (
    <>
      <div className="call-guide-actions">
        <button className="glass-button" onClick={() => setShowPlaylistModal(true)}>
          <span className="button-text">재생목록: {activePlaylist?.name || ''}</span>
        </button>
        <button className="glass-button" onClick={() => setSelectMode(true)}>
          <span className="button-text">커스텀 추가</span>
        </button>
      </div>
      <SongList
        songs={safeSongs}
        setPlaylists={persistPlaylists}
        activePlaylist={activePlaylist}
        setActivePlaylist={setActivePlaylist}
        selectMode={selectMode}
        selected={selected}
        toggleSelect={toggleSelect}
        onSortNeededChange={() => {}}
        removeMode={false}
        onRemoveSong={() => {}}
        linkExtraQuery="&safe=1"
        playlistsKey="callGuideSafePlaylists"
        activeKey="callGuideSafeActivePlaylist"
        filterPersist={(pls) => pls.filter((p) => p.id !== 'safe-all' && p.id !== 'album-songs')}
      />
      {selectMode && (
        <SelectionOverlay
          count={selected.size}
          onConfirm={confirmSelection}
          onCancel={cancelSelection}
        />
      )}
      {showNameModal && (
        <PlaylistNameModal
          name={playlistName}
          color={playlistColor}
          setName={setPlaylistName}
          setColor={setPlaylistColor}
          onConfirm={createPlaylist}
          onCancel={() => {
            setShowNameModal(false);
            setSelectMode(false);
            setSelected(new Set());
          }}
        />
      )}
      {showPlaylistModal && (
        <PlaylistSelectModal
          playlists={playlists.slice(1)}
          onSelect={selectPlaylist}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}
