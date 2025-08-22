'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { SongWithSetlist } from '@/types/callGuide';

interface Props {
  songs: SongWithSetlist[];
  safeSongs: SongWithSetlist[];
  onClose: () => void;
  onUnlock: (song: SongWithSetlist) => void;
}

export default function SongSearchOverlay({ songs, safeSongs, onClose, onUnlock }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SongWithSetlist | null>(null);
  const [confirmSong, setConfirmSong] = useState<SongWithSetlist | null>(null);
  const [unlockedMsg, setUnlockedMsg] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toHalfWidth = (str: string) =>
    str
      .replace(/\u3000/g, ' ')
      .replace(/[\uFF01-\uFF5E]/g, (ch) =>
        String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
      );

  const normalize = useCallback((str: string) => {
    return toHalfWidth(str)
      .toLowerCase()
      .replace(/\s+/g, '')
  }, []);

  const handleSearch = () => {
    const n = normalize(query);
    if (!n) {
      setResult(null);
      return;
    }
    const match = songs.find((s) => {
      const names = [s.title, s.krtitle, ...(s.anotherName || [])];
      return names.some((name) => name && normalize(name) === n);
    });
    setResult(match ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const already = result ? safeSongs.some((s) => s.slug === result.slug) : false;

  const addSong = () => {
    if (!result) return;
    const stored = JSON.parse(
      localStorage.getItem('callGuideSafeSongs') || '[]',
    ) as string[];
    if (!stored.includes(result.slug!)) {
      stored.push(result.slug!);
      localStorage.setItem('callGuideSafeSongs', JSON.stringify(stored));
      onUnlock(result);
      setUnlockedMsg(`${result.krtitle || result.title}이 해금되었습니다.`);
      resultRef.current?.classList.add('slide-out');
      setTimeout(() => {
        setResult(null);
        setQuery('');
        setUnlockedMsg('');
      }, 400);
    }
    setConfirmSong(null);
  };

  return (
    <div
      className="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="search-bar" onSubmit={handleSubmit}>
        <Image
          src="/images/search.svg"
          alt="검색"
          width={20}
          height={20}
          className="search-icon"
        />
        <input
          placeholder="검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </form>
      <div className="search-messages">
        <p className="warn"><strong>⚠️ 주의!</strong> 곡 검색 시 <strong>스포일러</strong>가 포함될 수 있습니다.</p>
        <p className="warn">
          검색한 곡은 스포일러에서 <strong>해금</strong>하여 스포 X의 전체 곡 리스트에
          추가할 수 있습니다.
        </p>
        <p>
          * 곡의 <strong>전체 제목</strong>을 원 제목(일본어 / 영어)이나 번역된 한글 제목으로
          입력해주세요.
        </p>
        <p>* 일부 곡은 한글 약어 입력도 가능합니다.</p>
      </div>
      {result && (
        <div
          className="search-result"
          ref={resultRef}
          onClick={() => {
            if (!already) setConfirmSong(result);
          }}
        >
          <span>{result.krtitle || result.title}</span>
          <span className="status">
            {already ? (
              <>
                <Image
                  src="/images/check.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="status-icon"
                />
                이미 추가된 곡입니다.
              </>
            ) : (
              <>
                <Image
                  src="/images/plus.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="status-icon"
                />
                전체 곡에 추가
              </>
            )}
          </span>
        </div>
      )}
      {unlockedMsg && <div className="unlock-message">{unlockedMsg}</div>}
      {confirmSong && (
        <div className="search-confirm">
          <p>{`${confirmSong.krtitle || confirmSong.title}을 해금하시겠습니까?`}</p>
          <div className="search-confirm-buttons">
            <button type="button" className="no" onClick={() => setConfirmSong(null)}>
              아니오
            </button>
            <button type="button" className="yes" onClick={addSong}>
              예
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
