'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
  onAdd: () => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function PlaylistEditModal({ onAdd, onRemove, onClose }: Props) {
  return (
    <div className="playlist-edit-modal" onClick={onClose}>
      <div className="playlist-edit-content" onClick={(e) => e.stopPropagation()}>
        <button className="glass-button edit-option" onClick={onAdd}>
          <Image
            src="/images/plus-circle.svg"
            alt="추가"
            width={32}
            height={32}
            className="button-icon"
          />
          <span className="button-text">+ 추가</span>
        </button>
        <button className="glass-button edit-option remove" onClick={onRemove}>
          <Image
            src="/images/minus-circle-red.svg"
            alt="삭제"
            width={32}
            height={32}
            className="button-icon"
          />
          <span className="button-text">- 삭제</span>
        </button>
      </div>
    </div>
  );
}
