'use client';

import React from 'react';

interface VolumeControlsProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (value: number) => void;
  toggleMute: () => void;
}

const VolumeControls = React.forwardRef<HTMLDivElement, VolumeControlsProps>(
  ({ volume, muted, onVolumeChange, toggleMute }, ref) => {
    return (
      <div ref={ref} className={`volume-controls${muted ? ' disabled' : ''}`}>
        <button
          className={`control-button${muted ? ' muted' : ''}`}
          onClick={toggleMute}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="3,9 7,9 12,4 12,20 7,15 3,15" />
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="3,9 7,9 12,4 12,20 7,15 3,15" />
              <path
                d="M16 8a5 5 0 010 8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
        </button>
        <input
          className={`volume-bar${muted ? ' muted' : ''}`}
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, ${muted ? '#aaa' : '#39c5bb'} 0%, ${
              muted ? '#aaa' : '#39c5bb'
            } ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`,
            boxShadow: volume > 0 && !muted ? '0 0 8px #39c5bb' : undefined,
          }}
          suppressHydrationWarning
        />
      </div>
    );
  },
);

VolumeControls.displayName = 'VolumeControls';

export default VolumeControls;
