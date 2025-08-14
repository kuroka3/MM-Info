import React from 'react';

interface Props {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const infoStyle: React.CSSProperties = {
  position: 'fixed',
  left: '1rem',
  bottom: '1rem',
  padding: '0.5rem 1rem',
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  backdropFilter: 'blur(20px)',
  zIndex: 20,
};

const actionsStyle: React.CSSProperties = {
  position: 'fixed',
  right: '1rem',
  bottom: '1rem',
  display: 'flex',
  gap: '1rem',
  zIndex: 20,
};

const buttonBase: React.CSSProperties = {
  padding: '1rem 2rem',
  fontSize: '1.25rem',
  borderRadius: '12px',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(20px)',
  cursor: 'pointer',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
};

const confirmStyle: React.CSSProperties = {
  ...buttonBase,
  background: 'rgba(57, 197, 187, 0.8)',
  borderColor: 'rgba(57, 197, 187, 0.6)',
  color: '#000',
};

const cancelStyle: React.CSSProperties = {
  ...buttonBase,
  background: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
};

export default function SelectionOverlay({ count, onConfirm, onCancel }: Props) {
  if (count === 0) return null;
  return (
    <>
      <div style={infoStyle}>{count}곡 선택됨</div>
      <div style={actionsStyle}>
        <button style={confirmStyle} onClick={onConfirm}>
          선택 완료
        </button>
        <button style={cancelStyle} onClick={onCancel}>
          취소
        </button>
      </div>
    </>
  );
}
