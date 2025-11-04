'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { SongWithSetlist } from '@/types/callGuide';

interface Props {
  songs: SongWithSetlist[];
  safeSongs: SongWithSetlist[];
  onClose: () => void;
  onUnlock: (song: SongWithSetlist) => void;
  storageKey: string;
}

export default function SongSearchOverlay({ songs, safeSongs, onClose, onUnlock, storageKey }: Props) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SongWithSetlist | null>(null);
  const [confirmSong, setConfirmSong] = useState<SongWithSetlist | null>(null);
  const [unlockedMsg, setUnlockedMsg] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const [searched, setSearched] = useState(false);
  const [closing, setClosing] = useState(false);
  const [confirmClosing, setConfirmClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose]);

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
      setSearched(false);
      return;
    }
    const match = songs.find((s) => {
      const names = [s.title, s.krtitle, ...(s.anotherName || [])];
      return names.some((name) => name && normalize(name) === n);
    });
    setResult(match ?? null);
    setSearched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const already = result ? safeSongs.some((s) => s.slug === result.slug) : false;
  const closeConfirm = () => {
    setConfirmClosing(true);
    setTimeout(() => {
      setConfirmSong(null);
      setConfirmClosing(false);
    }, 200);
  };

  const addSong = () => {
    if (!result) return;
    const stored = JSON.parse(
      localStorage.getItem(storageKey) || '[]',
    ) as string[];
    if (!stored.includes(result.slug!)) {
      stored.push(result.slug!);
      localStorage.setItem(storageKey, JSON.stringify(stored));
      onUnlock(result);
      setUnlockedMsg(`${result.krtitle || result.title}이 해금되었습니다.`);
      resultRef.current?.classList.add('slide-out');
      setTimeout(() => {
        setResult(null);
        setQuery('');
        setUnlockedMsg('');
        setSearched(false);
      }, 400);
    }
    closeConfirm();
  };

  return (
    <div
      className={`search-overlay${closing ? ' fade-out' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
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
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (val === '') {
              setResult(null);
              setSearched(false);
            }
          }}
          autoFocus
        />
      </form>
      {!searched && (
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
      )}
      {result && (
        <div
          className="search-result"
          ref={resultRef}
          onClick={() => {
            if (!already) setConfirmSong(result);
          }}
        >
          <div className="search-result-info">
            {result.thumbnail && (
              <Image
                src={result.thumbnail}
                alt=""
                width={60}
                height={60}
                className="song-jacket search-result-thumb"
              />
            )}
            <span>{result.krtitle || result.title}</span>
          </div>
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
      {!result && searched && (
        <div className="search-no-result">검색 결과가 없습니다.</div>
      )}
      {unlockedMsg && <div className="unlock-message">{unlockedMsg}</div>}
      {confirmSong && (
        <div className={`search-confirm${confirmClosing ? ' pop-out' : ''}`}>
          <p>
            <strong>{confirmSong.krtitle || confirmSong.title}</strong>
            <br />해금하시겠습니까?
          </p>
          <div className="search-confirm-buttons">
            <button type="button" className="yes" onClick={addSong}>
              예
            </button>
            <button type="button" className="no" onClick={closeConfirm}>
              아니오
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
