import React from 'react';
import Image from 'next/image';

interface Song {
  title: string;
  krtitle?: string;
  artist: string;
  spotifyUrl: string;
  youtubeUrl: string;
  jacketUrl: string;
  higawari?: boolean;
  locationgawari?: boolean;
  part?: string[];
}

interface SongListProps {
  songs: Song[];
}

const partColors = {
  'MIKU': '#39c5bbaa',
  'RIN': '#ffa500aa',
  'LEN': '#ffe211aa',
  'LUKA': '#ffc0cbaa',
  'KAITO': '#0000ffaa',
  'MEIKO': '#d80000aa',
};

const SongList: React.FC<SongListProps> = ({ songs }) => {
  return (
    <div className="song-list">
      {songs.map((song, index) => {
        const itemClass = song.higawari
          ? 'song-item higawari'
          : song.locationgawari
          ? 'song-item locationgawari'
          : 'song-item';

        const finalTitle = song.krtitle ? `${song.krtitle} (${song.title})` : song.title;

        const colors = song.part
          ? song.part.map(name => partColors[name as keyof typeof partColors]).filter(Boolean)
          : [];

        const borderStyle: React.CSSProperties =
          colors.length > 0
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '20px',
                padding: '2px',
                background:
                  colors.length === 1
                    ? colors[0]
                    : `linear-gradient(to bottom right, ${colors.join(', ')})`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
              }
            : {};

        return (
          <div className={itemClass} key={index}>
            {colors.length > 0 && <div style={borderStyle} />}
            <div className="song-info">
              <span className="song-index">{index + 1}</span>
              <div className="song-details">
                <Image
                  src={song.jacketUrl}
                  alt={song.title}
                  width={125}
                  height={125}
                  className="song-jacket"
                />
                <div className="song-text-info">
                  <p className="song-title">{finalTitle}</p>
                  <p className="song-artist">{song.artist}</p>
                </div>
              </div>
            </div>
            <div className="song-links">
              <a
                href={song.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/spotify.svg"
                  alt="Spotify"
                  width={24}
                  height={24}
                />
              </a>
              <a
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/youtube.svg"
                  alt="YouTube"
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
