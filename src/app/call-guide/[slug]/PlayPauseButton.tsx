'use client';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function PlayPauseButton({ isPlaying, onToggle }: PlayPauseButtonProps) {
  return (
    <button
      className="control-button"
      aria-label={isPlaying ? '일시정지' : '재생'}
      onClick={onToggle}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" />
          <rect x="14" y="5" width="4" height="14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="8,5 19,12 8,19" />
        </svg>
      )}
    </button>
  );
}
