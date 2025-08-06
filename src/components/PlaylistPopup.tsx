'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PlaylistPopupProps {
  spotifyUrl?: string;
  youtubeUrl?: string;
  jacketUrl?: string;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({
  spotifyUrl,
  youtubeUrl,
  jacketUrl,
}) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  return (
    <div className="playlist-container" ref={containerRef}>
      <button
        className="playlist-button glass-effect"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close playlist' : 'Open playlist'}
      >
        {open ? '✕' : (
          <Image src="/images/list.svg" alt="playlist" width={24} height={24} />
        )}
      </button>
      {visible && (
        <div
          className={`playlist-panel glass-effect ${open ? 'open' : 'close'}`}
          onAnimationEnd={() => {
            if (!open) setVisible(false);
          }}
        >
          <div className="playlist-header">
            {jacketUrl && (
              <Image
                src={jacketUrl}
                alt="playlist jacket"
                width={48}
                height={48}
              />
            )}
            <span className="playlist-title">
              최종 플레이<wbr />리스트
            </span>
            <div className="song-links playlist-links">
              {spotifyUrl && (
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/spotify.svg" alt="Spotify" width={24} height={24} />
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/youtube.svg" alt="YouTube" width={24} height={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPopup;
