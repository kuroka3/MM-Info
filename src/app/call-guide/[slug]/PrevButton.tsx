'use client';

import type { Song } from '@prisma/client';
import type { RefObject } from 'react';
import SongTooltip from './SongTooltip';
import type { RouterType } from './PlayerButtons';

interface PrevButtonProps {
  song: Song | null;
  showTooltip: boolean;
  setShowTooltip: (v: boolean) => void;
  router: RouterType;
  autoScrollRef: RefObject<boolean>;
}

export default function PrevButton({
  song,
  showTooltip,
  setShowTooltip,
  router,
  autoScrollRef,
}: PrevButtonProps) {
  return (
    <div className="tooltip-wrapper">
      <button
        className="control-button"
        disabled={!song}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          if (!song) return;
          setShowTooltip(false);
          if (autoScrollRef.current != null) autoScrollRef.current = true;
          router.push(`/call-guide/${song.slug}`);
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="15,5 7,12 15,19" />
          <rect x="5" y="5" width="2" height="14" />
        </svg>
      </button>
      {showTooltip && song && <SongTooltip song={song} />}
    </div>
  );
}
