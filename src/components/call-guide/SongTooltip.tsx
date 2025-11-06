'use client';

import Image from 'next/image';
import type { Song } from '@prisma/client';

interface SongTooltipProps {
  song: Song;
}

export default function SongTooltip({ song }: SongTooltipProps) {
  const hasKoreanTitle = song.krtitle && song.krtitle !== song.title;

  return (
    <div className="song-tooltip">
      {song.thumbnail && (
        <Image
          src={song.thumbnail}
          alt={song.krtitle || song.title}
          width={80}
          height={80}
          className="song-tooltip-image"
        />
      )}
      <p className="song-tooltip-title" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {song.krtitle ? (
          hasKoreanTitle ? (
            <>
              <span>{song.krtitle}</span>
              <span style={{ fontSize: '0.85em', color: '#999' }}>{song.title}</span>
            </>
          ) : (
            song.krtitle
          )
        ) : (
          song.title
        )}
      </p>
    </div>
  );
}