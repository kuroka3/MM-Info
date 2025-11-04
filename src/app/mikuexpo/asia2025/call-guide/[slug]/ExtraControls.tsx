'use client';

import React from 'react';

interface ExtraControlsProps {
  extraOpen: boolean;
  openPlaylistSongs: () => void;
  autoNext: boolean;
  toggleAutoNext: () => void;
  repeatMode: 'off' | 'all' | 'one';
  cycleRepeat: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  toggleExtra: () => void;
  toggleRotation: number;
}

export default function ExtraControls({
  extraOpen,
  openPlaylistSongs,
  autoNext,
  toggleAutoNext,
  repeatMode,
  cycleRepeat,
  shuffle,
  toggleShuffle,
  toggleExtra,
  toggleRotation,
}: ExtraControlsProps) {
  return (
    <div className={`extra-toggle${extraOpen ? ' open' : ''}`}>
      <div className="extra-buttons">
        <button className="small-glass-button" onClick={openPlaylistSongs}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="5" width="16" height="2" />
            <rect x="4" y="11" width="16" height="2" />
            <rect x="4" y="17" width="16" height="2" />
          </svg>
        </button>
        <button
          className={`small-glass-button${autoNext ? ' active' : ' inactive'}`}
          onClick={toggleAutoNext}
        >
          {autoNext ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="14" y2="12" />
              <polyline points="14,6 20,12 14,18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="14" y2="12" />
              <polyline points="14,6 20,12 14,18" />
              <line x1="6" y1="8" x2="10" y2="16" />
            </svg>
          )}
        </button>
        <button
          className={`small-glass-button${repeatMode !== 'off' ? ' active' : ' inactive'}`}
          onClick={cycleRepeat}
        >
          {repeatMode === 'one' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 1l6 4-6 4" />
              <path d="M3 11v-3a6 6 0 016-6h6" />
              <path d="M7 23l-6-4 6-4" />
              <path d="M21 13v3a6 6 0 01-6 6H7" />
              <path d="M12 9v6" strokeLinecap="round" />
              <path d="M11 9h2" strokeLinecap="round" />
            </svg>
          ) : repeatMode === 'all' ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 1l6 4-6 4" />
              <path d="M3 11v-3a6 6 0 016-6h6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M7 23l-6-4 6-4" />
              <path d="M21 13v3a6 6 0 01-6 6H7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 1l6 4-6 4" />
              <path d="M3 11v-3a6 6 0 016-6h6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M7 23l-6-4 6-4" />
              <path d="M21 13v3a6 6 0 01-6 6H7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </button>
        <button
          className={`small-glass-button${shuffle ? ' active' : ' inactive'}`}
          onClick={toggleShuffle}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h4l5 8 5-8" />
            <polyline points="16,4 23,4 20,7" />
            <path d="M4 20h4l5-8 5 8" />
            <polyline points="16,20 23,20 20,17" />
          </svg>
        </button>
      </div>
      <button className="triangle-toggle" onClick={toggleExtra}>
        <span
          className="triangle-icon"
          style={{ transform: `rotate(${toggleRotation}deg)` }}
        >
          ▲
        </span>
      </button>
    </div>
  );
}
