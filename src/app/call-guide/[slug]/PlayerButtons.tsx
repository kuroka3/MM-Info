'use client';

import { useRouter } from 'next/navigation';
import type { RefObject } from 'react';
import Image from 'next/image';
import type { Song } from '@prisma/client';
import type { Playlist, YTPlayer } from './types';

type RouterType = ReturnType<typeof useRouter>;

interface PlayerButtonsProps {
  prevSong: Song | null;
  nextSong: Song | null;
  showPrevTooltip: boolean;
  setShowPrevTooltip: (v: boolean) => void;
  showNextTooltip: boolean;
  setShowNextTooltip: (v: boolean) => void;
  playerButtonsRef: RefObject<HTMLDivElement>;
  isPlaying: boolean;
  playerRef: RefObject<YTPlayer | null>;
  autoScrollRef: RefObject<boolean>;
  scrollToLine: (line: number) => void;
  activeLine: number;
  router: RouterType;
  shuffle: boolean;
  activePlaylist: Playlist | null;
  songs: Song[];
  setPlaylistOrder: React.Dispatch<React.SetStateAction<string[]>>;
  playlistOrderRef: RefObject<string[]>;
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
  shuffle,
  activePlaylist,
  songs,
  setPlaylistOrder,
  playlistOrderRef,
}: PlayerButtonsProps) {
  return (
    <div className="player-buttons" ref={playerButtonsRef}>
      <div className="tooltip-wrapper">
        <button
          className="control-button"
          disabled={!prevSong}
          onMouseEnter={() => setShowPrevTooltip(true)}
          onMouseLeave={() => setShowPrevTooltip(false)}
          onClick={() => {
            if (!prevSong) return;
            setShowPrevTooltip(false);
            if (autoScrollRef.current != null) autoScrollRef.current = true;
            router.push(`/call-guide/${prevSong.slug}`);
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="15,5 7,12 15,19" />
            <rect x="5" y="5" width="2" height="14" />
          </svg>
        </button>
        {showPrevTooltip && prevSong && (
          <div className="song-tooltip">
            {prevSong.thumbnail && (
              <Image
                src={prevSong.thumbnail}
                alt={prevSong.krtitle || prevSong.title}
                width={80}
                height={80}
                className="song-tooltip-image"
              />
            )}
            <p className="song-tooltip-title">{prevSong.krtitle || prevSong.title}</p>
          </div>
        )}
      </div>

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

      <div className="tooltip-wrapper">
        <button
          className="control-button"
          disabled={!nextSong && !shuffle}
          onMouseEnter={() => setShowNextTooltip(true)}
          onMouseLeave={() => setShowNextTooltip(false)}
          onClick={() => {
            if (nextSong) {
              setShowNextTooltip(false);
              if (autoScrollRef.current != null) autoScrollRef.current = true;
              router.push(`/call-guide/${nextSong.slug}`);
            } else if (shuffle) {
              const base = activePlaylist?.slugs || songs.map((s) => s.slug!);
              const newOrder = [...base].sort(() => Math.random() - 0.5);
              setPlaylistOrder(newOrder);
              if (playlistOrderRef.current != null) playlistOrderRef.current = newOrder;
              localStorage.setItem('callGuidePlaylistOrder', JSON.stringify(newOrder));
              setShowNextTooltip(false);
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
        {showNextTooltip && nextSong && (
          <div className="song-tooltip">
            {nextSong.thumbnail && (
              <Image
                src={nextSong.thumbnail}
                alt={nextSong.krtitle || nextSong.title}
                width={80}
                height={80}
                className="song-tooltip-image"
              />
            )}
            <p className="song-tooltip-title">{nextSong.krtitle || nextSong.title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
