'use client';

import Image from 'next/image';
import type { Song } from '@prisma/client';

interface SongTooltipProps {
  song: Song;
}

export default function SongTooltip({ song }: SongTooltipProps) {
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
      <p className="song-tooltip-title">{song.krtitle || song.title}</p>
    </div>
  );
}