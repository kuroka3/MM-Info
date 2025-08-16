import { Playlist } from '@/app/call-guide/[slug]/types';
import React from 'react';


interface Props {
  playlists: Playlist[];
  onSelect: (pl: Playlist | 'default') => void;
  onClose: () => void;
}

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 30,
};

const contentStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)',
  padding: '1rem',
  borderRadius: '12px',
  minWidth: 200,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const itemStyle: React.CSSProperties = {
  padding: '0.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
};

export default function PlaylistSelectModal({ playlists, onSelect, onClose }: Props) {
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <ul style={listStyle}>
          <li style={itemStyle} onClick={() => onSelect('default')}>전체 곡</li>
          {playlists.map((pl) => (
            <li key={pl.id} style={itemStyle} onClick={() => onSelect(pl)}>
              {pl.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
