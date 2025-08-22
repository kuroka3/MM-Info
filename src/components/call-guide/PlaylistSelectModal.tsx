import React from 'react';
import type { Playlist } from '@/types/callGuide';

interface Props {
  playlists: Playlist[];
  onSelect: (pl: Playlist | 'default') => void;
  onClose: () => void;
}

export default function PlaylistSelectModal({ playlists, onSelect, onClose }: Props) {
  return (
    <div className="playlist-modal" onClick={onClose}>
      <div className="playlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <ul>
          <li onClick={() => onSelect('default')}>
            <span
              className="playlist-color-indicator"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
            전체 곡
          </li>
          {playlists.map((pl) => (
            <li key={pl.id} onClick={() => onSelect(pl)}>
              <span
                className="playlist-color-indicator"
                style={{ background: pl.color || 'rgba(255,255,255,0.3)' }}
              />
              {pl.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
