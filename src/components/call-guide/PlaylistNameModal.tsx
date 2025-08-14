import React from 'react';

interface Props {
  name: string;
  color: string;
  setName: (v: string) => void;
  setColor: (v: string) => void;
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
  minWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '8px',
  border: '1px solid var(--glass-border)',
  background: 'rgba(0,0,0,0.3)',
  color: 'inherit',
};

const paletteStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.25rem',
  justifyContent: 'center',
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

const paletteColors = ['rgba(255,255,255,0.1)', '#39c5bbaa', '#ffa500aa', '#ffe211aa', '#ffc0cbaa', '#0000ffaa', '#d80000aa'];

export default function PlaylistNameModal({ name, color, setName, setColor, onConfirm, onCancel }: Props) {
  return (
    <div style={modalStyle} onClick={onCancel}>
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <h3>재생목록 이름</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          autoFocus
          style={inputStyle}
        />
        <div style={paletteStyle}>
          {paletteColors.map((c) => (
            <span
              key={c}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.6)',
                background: c,
                cursor: 'pointer',
                outline: color === c ? '2px solid #fff' : undefined,
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div style={actionsStyle}>
          <button style={confirmStyle} onClick={onConfirm}>선택</button>
          <button style={cancelStyle} onClick={onCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}