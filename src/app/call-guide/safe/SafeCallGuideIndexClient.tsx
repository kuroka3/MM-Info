'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SongWithSetlist, Playlist } from '@/types/callGuide';
import SongList from '@/components/call-guide/SongList';
import PlaylistSelectModal from '@/components/call-guide/PlaylistSelectModal';
import React from 'react';

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
    const pls: Playlist[] = [
      { id: 'safe-all', name: '전체 곡', slugs: filtered.map((s) => s.slug!) },
      { id: 'album-songs', name: '앨범 곡', slugs: ALBUM_SLUGS },
    ];
    setPlaylists(pls);
    const listParam = searchParams.get('list');
    setActivePlaylist(pls.find((p) => p.id === listParam) || pls[0] || null);
  }, [songs, searchParams]);

  useEffect(() => {
    if (activePlaylist && searchParams.get('list') !== activePlaylist.id) {
      router.replace(`/call-guide/safe?list=${activePlaylist.id}`);
    }
  }, [activePlaylist, router, searchParams]);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const selectPlaylist = (pl: Playlist | 'default') => {
    setActivePlaylist(pl === 'default' ? playlists[0] : pl);
    setShowPlaylistModal(false);
  };

  const noop = () => {};

  return (
    <>
      <div className="call-guide-actions">
        <button className="glass-button" onClick={() => setShowPlaylistModal(true)}>
          <span className="button-text">재생목록: {activePlaylist?.name || ''}</span>
        </button>
      </div>
      <SongList
        songs={safeSongs}
        setPlaylists={noop as React.Dispatch<React.SetStateAction<Playlist[]>>}
        activePlaylist={activePlaylist}
        setActivePlaylist={noop as React.Dispatch<React.SetStateAction<Playlist | null>>}
        selectMode={false}
        selected={new Set()}
        toggleSelect={noop}
        onSortNeededChange={noop}
        removeMode={false}
        onRemoveSong={noop}
        linkExtraQuery="&safe=1"
      />
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
