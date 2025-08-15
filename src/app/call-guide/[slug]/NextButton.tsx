'use client';

import type { Song } from '@prisma/client';
import type { RefObject } from 'react';
import type { Playlist } from './types';
import SongTooltip from './SongTooltip';
import type { RouterType } from './PlayerButtons';

interface NextButtonProps {
  song: Song | null;
  currentSlug: string;
  showTooltip: boolean;
  setShowTooltip: (v: boolean) => void;
  router: RouterType;
  shuffle: boolean;
  autoScrollRef: RefObject<boolean>;
  activePlaylist: Playlist | null;
  songs: Song[];
  setPlaylistOrder: React.Dispatch<React.SetStateAction<string[]>>;
  playlistOrderRef: RefObject<string[]>;
}

export default function NextButton({
  song,
  currentSlug,
  showTooltip,
  setShowTooltip,
  router,
  shuffle,
  autoScrollRef,
  activePlaylist,
  songs,
  setPlaylistOrder,
  playlistOrderRef,
}: NextButtonProps) {
  return (
    <div className="tooltip-wrapper">
      <button
        className="control-button"
        disabled={!song && !shuffle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          if (song) {
            setShowTooltip(false);
            if (autoScrollRef.current != null) autoScrollRef.current = true;
            router.push(`/call-guide/${song.slug}`);
          } else if (shuffle) {
            const base = activePlaylist?.slugs || songs.map((s) => s.slug!);
            let newOrder = [...base];
            if (newOrder.length > 1) {
              do {
                newOrder = [...base].sort(() => Math.random() - 0.5);
              } while (newOrder[0] === currentSlug);
            }
            setPlaylistOrder(newOrder);
            if (playlistOrderRef.current != null) playlistOrderRef.current = newOrder;
            localStorage.setItem('callGuidePlaylistOrder', JSON.stringify(newOrder));
            setShowTooltip(false);
            if (autoScrollRef.current != null) autoScrollRef.current = true;
            router.push(`/call-guide/${newOrder[0]}`);
          }
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="9,5 17,12 9,19" />
          <rect x="17" y="5" width="2" height="14" />
        </svg>
      </button>
      {showTooltip && song && <SongTooltip song={song} />}
    </div>
  );
}
