'use client';

import type { RefObject } from 'react';
import type { YTPlayer } from './types';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  playerRef: RefObject<YTPlayer | null>;
  autoScrollRef: RefObject<boolean>;
  scrollToLine: (line: number) => void;
  activeLine: number;
}

export default function PlayPauseButton({
  isPlaying,
  playerRef,
  autoScrollRef,
  scrollToLine,
  activeLine,
}: PlayPauseButtonProps) {
  return (
    <button
      className="control-button"
      onClick={() => {
        if (!playerRef.current) return;
        if (isPlaying) playerRef.current.pauseVideo?.();
        else playerRef.current.playVideo?.();
        if (autoScrollRef.current != null) autoScrollRef.current = true;
        scrollToLine(activeLine);
      }}
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
