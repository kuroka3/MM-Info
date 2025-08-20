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
  currentSlug: string;
  playlistOrderRef: RefObject<string[]>;
  playlistId: string;
  safeMode?: boolean;
}

export default function PrevButton({
  song, showTooltip, setShowTooltip,
  router, autoScrollRef,
  currentSlug, playlistOrderRef, playlistId, safeMode = false,
}: PrevButtonProps) {
  const handlePrev = () => {
    if (!song) return;
    setShowTooltip(false);
    if (autoScrollRef.current != null) autoScrollRef.current = true;

    const order = playlistOrderRef.current ?? [];
    if (!order.length) return;
    const i = order.indexOf(currentSlug);
    if (i < 0) return;

    const prevSlug = i > 0 ? order[i - 1] : order[order.length - 1];
    router.push(`/call-guide/${prevSlug}?list=${encodeURIComponent(playlistId)}${safeMode ? '&safe=1' : ''}`);
  };

  return (
    <div className="tooltip-wrapper">
      <button
        className="control-button"
        disabled={!song}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handlePrev}
        aria-label="이전 곡"
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
