'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface Props {
  onAdd: () => void;
  onRemove: () => void;
  onClose: () => void;
  parentRef: React.RefObject<HTMLDivElement>;
}

export default function PlaylistEditModal({
  onAdd,
  onRemove,
  onClose,
  parentRef,
}: Props) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        parentRef.current &&
        !parentRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose, parentRef]);

  return (
    <div className="playlist-edit-popup">
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
  );
}
