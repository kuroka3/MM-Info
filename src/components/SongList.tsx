import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ALL_PLAYLIST_ID } from '@/utils/playlistOrder';

interface Song {
  type?: string;
  title: string;
  krtitle?: string;
  artist: string;
  krartist?: string;
  spotifyUrl: string;
  youtubeUrl: string;
  jacketUrl: string;
  higawari?: boolean;
  locationgawari?: boolean;
  part?: string[];
  slug?: string;
  lyrics?: unknown;
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
  let songIndex = 0;

  return (
    <div className="song-list">
      {songs.map((song, index) => {
        const isSegment = song.type && song.type !== 'song' && song.type !== 'final-playlist';
        const isFinalPlaylist = song.type === 'final-playlist';

        const prevSong = index > 0 ? songs[index - 1] : null;
        const showSeparator = isFinalPlaylist && prevSong && !isSegment;

        if (!isSegment && !isFinalPlaylist) {
          songIndex++;
        }
        const displayIndex = songIndex;

        const itemClass = isSegment
          ? 'song-item segment-item'
          : isFinalPlaylist
          ? 'song-item final-playlist'
          : song.higawari
          ? 'song-item higawari'
          : song.locationgawari
          ? 'song-item locationgawari'
          : 'song-item';

        const hasKoreanTitle = song.krtitle && song.krtitle !== song.title;
        const hasKoreanArtist = song.krartist && song.krartist !== song.artist;

        const colors = song.part
          ? song.part.map(name => partColors[name as keyof typeof partColors]).filter(Boolean)
          : [];

        const hasRinLen =
          colors.length === 2 &&
          colors.includes(partColors.RIN) &&
          colors.includes(partColors.LEN);

        const background =
          colors.length === 1
            ? colors[0]
            : hasRinLen
            ? `linear-gradient(to bottom right, ${partColors.RIN}, ${partColors.RIN} 49%, rgba(255,255,255,0.9) 50%, ${partColors.LEN} 51%, ${partColors.LEN})`
            : `linear-gradient(to bottom right, ${colors.join(', ')})`;

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
                background,
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                pointerEvents: 'none',
              }
            : {};

        if (isSegment) {
          return (
            <div className={itemClass} key={index}>
              <div className="segment-content">
                <p className="segment-title">{song.title}</p>
              </div>
            </div>
          );
        }

        if (showSeparator) {
          return (
            <React.Fragment key={index}>
              <div className="setlist-separator" />
              <div className="song-item segment-item">
                <div className="segment-content">
                  <p className="segment-title">최종 플레이리스트</p>
                </div>
              </div>
              <div
                className={itemClass}
                style={{ borderColor: colors.length > 0 ? 'transparent' : undefined }}
              >
                {colors.length > 0 && <div style={borderStyle} />}
                {!isFinalPlaylist && (
                  <div className="song-index-wrapper">
                    <span className="song-index">{displayIndex}</span>
                  </div>
                )}
                <div className="song-info">
                  <div className="song-details">
                    <Image
                      src={song.jacketUrl}
                      alt={song.title}
                      width={125}
                      height={125}
                      className="song-jacket"
                    />
                    <div className="song-text-info">
                      <p className="song-title">
                        {isFinalPlaylist ? (
                          <>
                            최종 플레이<wbr />리스트
                          </>
                        ) : song.krtitle ? (
                          hasKoreanTitle ? (
                            <>
                              <span>{song.krtitle}</span>
                              <span style={{ fontSize: '0.85em', color: '#999' }}>
                                {song.title}
                              </span>
                            </>
                          ) : (
                            song.krtitle
                          )
                        ) : (
                          song.title
                        )}
                      </p>
                      {song.artist && (
                        <p className="song-artist">
                          {song.krartist ? (
                            hasKoreanArtist ? (
                              <>
                                <span>{song.krartist}</span>
                                <span style={{ fontSize: '0.9em', color: '#999' }}>
                                  {song.artist}
                                </span>
                              </>
                            ) : (
                              song.krartist
                            )
                          ) : (
                            song.artist
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="song-links">
                  {song.slug && song.lyrics != null && (
                    <Link
                      href={`/call-guide/${song.slug}?list=${ALL_PLAYLIST_ID}`}
                      className="glow-link glow-link--call-guide"
                    >
                      <Image
                        src="/images/megaphone.svg"
                        alt="Call Guide"
                        width={24}
                        height={24}
                      />
                    </Link>
                  )}
                  {song.spotifyUrl && (
                    <a
                      href={song.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glow-link glow-link--spotify"
                    >
                      <Image
                        src="/images/spotify.svg"
                        alt="Spotify"
                        width={24}
                        height={24}
                      />
                    </a>
                  )}
                  {song.youtubeUrl && (
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glow-link glow-link--youtube"
                    >
                      <Image
                        src="/images/youtube.svg"
                        alt="YouTube"
                        width={24}
                        height={24}
                      />
                    </a>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        }

        return (
          <div
            className={itemClass}
            key={index}
            style={{ borderColor: colors.length > 0 ? 'transparent' : undefined }}
          >
            {colors.length > 0 && <div style={borderStyle} />}
            {!isFinalPlaylist && (
              <div className="song-index-wrapper">
                <span className="song-index">{displayIndex}</span>
              </div>
            )}
            <div className="song-info">
              <div className="song-details">
                <Image
                  src={song.jacketUrl}
                  alt={song.title}
                  width={125}
                  height={125}
                  className="song-jacket"
                />
                <div className="song-text-info">
                  <p className="song-title">
                    {isFinalPlaylist ? (
                      <>
                        최종 플레이<wbr />리스트
                      </>
                    ) : song.krtitle ? (
                      hasKoreanTitle ? (
                        <>
                          <span>{song.krtitle}</span>
                          <span style={{ fontSize: '0.85em', color: '#999' }}>
                            {song.title}
                          </span>
                        </>
                      ) : (
                        song.krtitle
                      )
                    ) : (
                      song.title
                    )}
                  </p>
                  {song.artist && (
                    <p className="song-artist" style={{ fontWeight: 300 }}>
                      {song.krartist ? (
                        hasKoreanArtist ? (
                          <>
                            <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{song.krartist}</span>
                            <span style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.5)' }}>
                              {song.artist}
                            </span>
                          </>
                        ) : (
                          <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{song.krartist}</span>
                        )
                      ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.95)' }}>{song.artist}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="song-links">
              {song.slug && song.lyrics != null && (
                <Link
                  href={`/call-guide/${song.slug}?list=${ALL_PLAYLIST_ID}`}
                  className="glow-link glow-link--call-guide"
                >
                  <Image
                    src="/images/megaphone.svg"
                    alt="Call Guide"
                    width={24}
                    height={24}
                  />
                </Link>
              )}
              {song.spotifyUrl && (
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-link glow-link--spotify"
                >
                  <Image
                    src="/images/spotify.svg"
                    alt="Spotify"
                    width={24}
                    height={24}
                  />
                </a>
              )}
              {song.youtubeUrl && (
                <a
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-link glow-link--youtube"
                >
                  <Image
                    src="/images/youtube.svg"
                    alt="YouTube"
                    width={24}
                    height={24}
                  />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
