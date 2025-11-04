'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  storageKey?: string;
  overlayClassName?: string;
  redirectPath?: string;
}

const SpoilerGate: React.FC<Props> = ({
  children,
  storageKey = 'spoilerConfirmed',
  overlayClassName,
  redirectPath,
}) => {
  const [showWarning, setShowWarning] = useState(true);
  const disabledKey = `${storageKey}:disabled`;

  useLayoutEffect(() => {
    // Remove legacy spoilerConfirmed key on first mount
    if (storageKey !== 'spoilerConfirmed' && localStorage.getItem('spoilerConfirmed')) {
      localStorage.removeItem('spoilerConfirmed');
    }
    if (storageKey !== 'spoilerConfirmed' && localStorage.getItem('spoilerConfirmed:disabled')) {
      localStorage.removeItem('spoilerConfirmed:disabled');
    }

    const isDisabled = localStorage.getItem(disabledKey) === 'true';
    if (!isDisabled && localStorage.getItem(storageKey) === 'true') {
      setShowWarning(false);
    }
  }, [storageKey, disabledKey]);

  useEffect(() => {
    if (typeof document === 'undefined' || !redirectPath) return;
    const previous = document.body.dataset.spoilerRedirect;
    document.body.dataset.spoilerRedirect = redirectPath;
    return () => {
      if (previous) document.body.dataset.spoilerRedirect = previous;
      else delete document.body.dataset.spoilerRedirect;
    };
  }, [redirectPath]);

  useEffect(() => {
    if (!showWarning) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [showWarning]);

  const handleYes = () => {
    const isDisabled = localStorage.getItem(disabledKey) === 'true';
    if (!isDisabled) {
      localStorage.setItem(storageKey, 'true');
      window.dispatchEvent(
        new CustomEvent('spoilerToggleChange', {
          detail: { key: storageKey, value: true },
        }),
      );
    }
    setShowWarning(false);
  };

  const handleNo = () => {
    window.location.href = '/';
  };

  return (
    <>
      {children}
      {showWarning && (
        <div className={`spoiler-overlay${overlayClassName ? ` ${overlayClassName}` : ''}`}>
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
