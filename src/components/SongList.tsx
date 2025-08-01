import React from 'react';
import Image from 'next/image';

interface Song {
  title: string;
  artist: string;
  spotifyUrl: string;
  youtubeUrl: string;
  jacketUrl: string;
  higawari?: boolean;
  locationgawari?: boolean;
}

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  return (
    <div className="song-list">
      {songs.map((song, index) => {
        const itemClass = song.higawari
          ? 'song-item higawari'
          : song.locationgawari
          ? 'song-item locationgawari'
          : 'song-item';

        return (
          <div className={itemClass} key={index}>
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
                  <p className="song-title">{song.title}</p>
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
