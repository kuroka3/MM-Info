import type { Song } from '@prisma/client';
import type { RefObject } from 'react';
import SongTooltip from './SongTooltip';
import type { RouterType } from './PlayerButtons';

interface NextButtonProps {
  song: Song | null;
  currentSlug: string;
  showTooltip: boolean;
  setShowTooltip: (v: boolean) => void;
  router: RouterType;
  autoScrollRef: RefObject<boolean>;
  playlistOrderRef: RefObject<string[]>;
  playlistId: string;
  onNext: () => void;
}

export default function NextButton({
  song,
  showTooltip,
  setShowTooltip,
  onNext,
}: NextButtonProps) {
  const handleNext = () => {
    if (!song) return;
    setShowTooltip(false);
    onNext();
  };

  return (
    <div className="tooltip-wrapper">
      <button
        className="control-button"
        disabled={!song}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleNext}
        aria-label="다음 곡"
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
