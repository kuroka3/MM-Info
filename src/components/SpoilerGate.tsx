'use client';

import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const SpoilerGate: React.FC<Props> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('setlistSpoilerConfirmed') === 'true') {
      setShowWarning(false);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('setlistSpoilerConfirmed', 'true');
    setShowWarning(false);
  };

  const handleNo = () => {
    window.location.href = '/';
  };

  return (
    <>
      {children}
      {showWarning && (
        <div className="spoiler-overlay">
          <p className="spoiler-warning">⚠️ 스포일러 주의</p>
          <p className="spoiler-question">내용을 정말 확인하시겠습니까?</p>
          <div className="spoiler-actions">
            <button className="spoiler-yes" onClick={handleYes}>
              예
            </button>
            <button className="spoiler-no" onClick={handleNo}>
              아니오
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SpoilerGate;
