import React from 'react';

interface Props {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
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

const popupStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)',
  padding: '1rem',
  borderRadius: '12px',
  minWidth: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  textAlign: 'center',
};

const nameStyle: React.CSSProperties = {
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.1em',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
};

const buttonBase: React.CSSProperties = {
  padding: '1rem 2rem',
  fontSize: '1.25rem',
  borderRadius: '12px',
  border: '2px solid rgba(255,255,255,0.2)',
  backdropFilter: 'blur(20px)',
  cursor: 'pointer',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
};

const confirmStyle: React.CSSProperties = {
  ...buttonBase,
  background: 'rgba(57,197,187,0.8)',
  borderColor: 'rgba(57,197,187,0.6)',
  color: '#000',
};

const cancelStyle: React.CSSProperties = {
  ...buttonBase,
  background: 'rgba(0,0,0,0.5)',
  color: '#fff',
};

export default function PlaylistDeleteModal({ name, onConfirm, onCancel }: Props) {
  return (
    <div style={modalStyle} onClick={onCancel}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <p>
          ‘<span style={nameStyle}>{name}</span>’ 재생목록을
        </p>
        <p>삭제하시겠습니까?</p>
        <div style={actionsStyle}>
          <button style={confirmStyle} onClick={onConfirm}>예</button>
          <button style={cancelStyle} onClick={onCancel}>아니오</button>
        </div>
      </div>
    </div>
  );
}
