'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Ref, RefObject } from 'react';
import type { Song } from '@prisma/client';
import type { YTPlayer } from './types';
import PrevButton from './PrevButton';
import PlayPauseButton from './PlayPauseButton';
import NextButton from './NextButton';

export type RouterType = ReturnType<typeof useRouter>;

interface PlayerButtonsProps {
  prevSong: Song | null;
  nextSong: Song | null;
  showPrevTooltip: boolean;
  setShowPrevTooltip: (v: boolean) => void;
  showNextTooltip: boolean;
  setShowNextTooltip: (v: boolean) => void;
  playerButtonsRef: Ref<HTMLDivElement>;
  isPlaying: boolean;
  playerRef: RefObject<YTPlayer | null>;
  autoScrollRef: RefObject<boolean>;
  scrollToLine: (line: number) => void;
  activeLine: number;
  router: RouterType;
  playlistId: string;
  currentSlug: string;
  playlistOrderRef: RefObject<string[]>;
  onNext: () => void;
  safeMode?: boolean;
}

export default function PlayerButtons({
  prevSong,
  nextSong,
  showPrevTooltip,
  setShowPrevTooltip,
  showNextTooltip,
  setShowNextTooltip,
  playerButtonsRef,
  isPlaying,
  playerRef,
  autoScrollRef,
  scrollToLine,
  activeLine,
  router,
  currentSlug,
  playlistOrderRef,
  playlistId,
  onNext,
  safeMode = false,
}: PlayerButtonsProps) {
  const handleTogglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) p.pauseVideo();
    else p.playVideo();
  }, [isPlaying, playerRef]);

  return (
    <div className="player-buttons" ref={playerButtonsRef}>
      <PrevButton
        song={prevSong}
        showTooltip={showPrevTooltip}
        setShowTooltip={setShowPrevTooltip}
        router={router}
        autoScrollRef={autoScrollRef}
        currentSlug={currentSlug}
        playlistOrderRef={playlistOrderRef}
        playlistId={playlistId}
        safeMode={safeMode}
      />
      <PlayPauseButton
        isPlaying={isPlaying}
        playerRef={playerRef}
        autoScrollRef={autoScrollRef}
        scrollToLine={scrollToLine}
        activeLine={activeLine}
        onToggle={handleTogglePlay}
      />
      <NextButton
        song={nextSong}
        currentSlug={currentSlug}
        showTooltip={showNextTooltip}
        setShowTooltip={setShowNextTooltip}
        router={router}
        autoScrollRef={autoScrollRef}
        playlistOrderRef={playlistOrderRef}
        playlistId={playlistId}
        onNext={onNext}
      />
    </div>
  );
}
