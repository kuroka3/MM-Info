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
  venueName?: string;
  blockName?: string;
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

const createGradientWithRinLenBoundary = (parts: string[]) => {
  const colors = parts.map(name => partColors[name as keyof typeof partColors]).filter(Boolean);

  if (colors.length === 0) return '';
  if (colors.length === 1) return colors[0];

  const hasRinAndLen = parts.includes('RIN') && parts.includes('LEN');

  if (!hasRinAndLen) {
    return `linear-gradient(to bottom right, ${colors.join(', ')})`;
  }

  const rinIndex = parts.indexOf('RIN');
  const lenIndex = parts.indexOf('LEN');
  const rinColor = partColors.RIN;
  const lenColor = partColors.LEN;

  if (colors.length === 2) {
    return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 49%, rgba(255,255,255,0.9) 50%, ${lenColor} 51%, ${lenColor} 100%)`;
  }

  if (colors.length === 3) {
    const otherPart = parts.find(p => p !== 'RIN' && p !== 'LEN');
    const otherColor = partColors[otherPart as keyof typeof partColors];

    if (rinIndex < lenIndex) {
      if (rinIndex === 0 && lenIndex === 1) {
        return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 32%, rgba(255,255,255,0.9) 33%, ${lenColor} 34%, ${lenColor} 65%, ${otherColor} 66%, ${otherColor} 100%)`;
      } else if (rinIndex === 0 && lenIndex === 2) {
        return `linear-gradient(to bottom right, ${rinColor} 0%, ${rinColor} 32%, ${otherColor} 33%, ${otherColor} 65%, rgba(255,255,255,0.9) 66%, ${lenColor} 67%, ${lenColor} 100%)`;
      } else {
        return `linear-gradient(to bottom right, ${otherColor} 0%, ${otherColor} 32%, ${rinColor} 33%, ${rinColor} 65%, rgba(255,255,255,0.9) 66%, ${lenColor} 67%, ${lenColor} 100%)`;
      }
    } else {
      if (lenIndex === 0 && rinIndex === 1) {
        return `linear-gradient(to bottom right, ${lenColor} 0%, ${lenColor} 32%, rgba(255,255,255,0.9) 33%, ${rinColor} 34%, ${rinColor} 65%, ${otherColor} 66%, ${otherColor} 100%)`;
      } else if (lenIndex === 0 && rinIndex === 2) {
        return `linear-gradient(to bottom right, ${lenColor} 0%, ${lenColor} 32%, ${otherColor} 33%, ${otherColor} 65%, rgba(255,255,255,0.9) 66%, ${rinColor} 67%, ${rinColor} 100%)`;
      } else {
        return `linear-gradient(to bottom right, ${otherColor} 0%, ${otherColor} 32%, ${lenColor} 33%, ${lenColor} 65%, rgba(255,255,255,0.9) 66%, ${rinColor} 67%, ${rinColor} 100%)`;
      }
    }
  }

  return `linear-gradient(to bottom right, ${colors.join(', ')})`;
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

        const background = song.part && song.part.length > 0
          ? createGradientWithRinLenBoundary(song.part)
          : '';

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
                    {song.locationgawari && song.venueName && (
                      <span className="venue-badge">{song.venueName}</span>
                    )}
                    {song.higawari && song.blockName && (
                      <span className="block-badge">{song.blockName}</span>
                    )}
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
                {song.locationgawari && song.venueName && (
                  <span className="venue-badge">{song.venueName}</span>
                )}
                {song.higawari && song.blockName && (
                  <span className="block-badge">{song.blockName}</span>
                )}
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
