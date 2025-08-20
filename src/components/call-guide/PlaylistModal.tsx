'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ALL_PLAYLIST_ID } from '@/utils/playlistOrder';
import type { Playlist, SongWithSetlist } from '@/types/callGuide';

interface Props {
  playlists: Playlist[];
  songs: SongWithSetlist[];
  activePlaylist: Playlist | null;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setActivePlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  onClose: () => void;
  onDeleteRequest: (index: number) => void;
}

export default function PlaylistModal({
  playlists,
  songs,
  activePlaylist,
  setPlaylists,
  setActivePlaylist,
  onClose,
  onDeleteRequest,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [colorIndex, setColorIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current?.focus();
    }
  }, [editingIndex]);

  const cancelEditing = (showWarning: boolean) => {
    if (showWarning && editValue.trim() === '') {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const saveEditing = (index: number) => {
    const newName = editValue.trim();
    if (!newName) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      cancelEditing(false);
      return;
    }
    const target = playlists[index];
    setPlaylists((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name: newName };
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
      return updated;
    });
    if (activePlaylist?.id === target.id) {
      const active = { ...target, name: newName };
      setActivePlaylist(active);
      localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
    }
    cancelEditing(false);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    setPlaylists((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      localStorage.setItem('callGuidePlaylists', JSON.stringify(updated));
      return updated;
    });
    setDragIndex(null);
  };

  const handlePlaylistTouchEnd = (e: React.TouchEvent) => {
    if (dragIndex === null) return;
    const touch = e.changedTouches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const li = target?.closest('li[data-index]') as HTMLElement | null;
    if (li) {
      const dropIndex = parseInt(li.dataset.index || '', 10);
      if (!isNaN(dropIndex) && dropIndex !== dragIndex) {
        handleDrop(dropIndex);
      }
    }
    setDragIndex(null);
  };

  const selectPlaylist = (pl: Playlist | 'default') => {
    const active: Playlist =
      pl === 'default'
        ? { id: ALL_PLAYLIST_ID, name: '전체 곡', slugs: songs.map((s) => s.slug!) }
        : pl;
    localStorage.setItem('callGuideActivePlaylist', JSON.stringify(active));
    setActivePlaylist(active);
    onClose();
  };

  return (
    <div className="playlist-modal" onClick={onClose}>
      <div
        className="playlist-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {showMessage && (
          <div className="fade-message">최소 1글자 이상 입력해주세요.</div>
        )}
        <h3>재생목록 선택</h3>
        <hr className="playlist-divider" />
        <ul>
          <li onClick={() => selectPlaylist('default')}>전체 곡</li>
          {playlists.map((pl, i) => (
            <li
              key={pl.id}
              data-index={i}
              onClick={() => (editingIndex === i ? undefined : selectPlaylist(pl))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              draggable
              onDragStart={(e) => {
                setDragIndex(i);
                e.dataTransfer?.setDragImage(
                  e.currentTarget,
                  e.currentTarget.clientWidth / 2,
                  e.currentTarget.clientHeight / 2,
                );
              }}
              onTouchStart={() => setDragIndex(i)}
              onTouchEnd={handlePlaylistTouchEnd}
            >
              <Image
                src="/images/drag.svg"
                alt="drag"
                width={16}
                height={16}
                className="drag-handle"
              />
              {editingIndex === i ? (
                <input
                  ref={inputRef}
                  className="playlist-edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => cancelEditing(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEditing(i);
                    if (e.key === 'Escape') cancelEditing(false);
                  }}
                />
              ) : (
                <>
                  <span className="playlist-item-name">{pl.name}</span>
                  <Image
                    src="/images/edit.svg"
                    alt="수정"
                    width={16}
                    height={16}
                    className="edit-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndex(i);
                      setEditValue(pl.name);
                    }}
                  />
                </>
              )}
              <span
                className="playlist-color"
                style={{ background: pl.color || 'rgba(255,255,255,0.3)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setColorIndex(colorIndex === i ? null : i);
                }}
              />
              {colorIndex === i && (
                <div className="color-palette" onClick={(e) => e.stopPropagation()}>
                  {[
                    'rgba(255,255,255,0.1)',
                    '#39c5bbaa',
                    '#ffa500aa',
                    '#ffe211aa',
                    '#ffc0cbaa',
                    '#0000ffaa',
                    '#d80000aa',
                  ].map((c) => (
                    <span
                      key={c}
                      className="palette-color"
                      style={{ background: c }}
                      onClick={() => {
                        setPlaylists((prev) => {
                          const updated = [...prev];
                          const color = c === 'rgba(255,255,255,0.1)' ? undefined : c;
                          updated[i] = { ...updated[i], color };
                          localStorage.setItem(
                            'callGuidePlaylists',
                            JSON.stringify(updated),
                          );
                          return updated;
                        });
                        if (activePlaylist?.id === pl.id) {
                          const active = {
                            ...pl,
                            color: c === 'rgba(255,255,255,0.1)' ? undefined : c,
                          };
                          setActivePlaylist(active);
                          localStorage.setItem(
                            'callGuideActivePlaylist',
                            JSON.stringify(active),
                          );
                        }
                        setColorIndex(null);
                      }}
                    />
                  ))}
                </div>
              )}
              <Image
                src="/images/minus-circle.svg"
                alt="삭제"
                width={20}
                height={20}
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest(i);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
