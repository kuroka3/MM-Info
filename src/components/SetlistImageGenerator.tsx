'use client';

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';

interface Song {
  type?: string;
  title: string;
  krtitle?: string;
  artist: string;
  krartist?: string;
  jacketUrl: string;
  part?: string[];
  higawari?: boolean;
  locationgawari?: boolean;
  venueName?: string;
  blockName?: string;
}

interface SetlistImageGeneratorProps {
  songs: Song[];
  eventName: string;
  concertTitle: string;
  concertTime?: string;
  timeZone?: string;
  playlistImageUrl?: string;
  higawariLabel?: string;
}

const partColors = {
  'MIKU': '#39c5bb',
  'RIN': '#ffa500',
  'LEN': '#ffe211',
  'LUKA': '#ffc0cb',
  'KAITO': '#0000ff',
  'MEIKO': '#d80000',
};

const createGradientWithRinLenBoundary = (parts: string[]) => {
  const colors = parts.map(name => partColors[name as keyof typeof partColors]).filter(Boolean);

  if (colors.length === 0) return 'rgba(255, 255, 255, 0.6)';
  if (colors.length === 1) return colors[0];

  const hasRinAndLen = parts.includes('RIN') && parts.includes('LEN');

  if (colors.length === 2) {
    if (hasRinAndLen) {
      const rinColor = partColors.RIN;
      const lenColor = partColors.LEN;
      return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 20%, rgba(255,255,255,0.9) 49.75%, rgba(255,255,255,0.9) 50.25%, ${lenColor} 50%, ${lenColor} 100%)`;
    }
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 20%, ${colors[1]} 50%, ${colors[1]} 100%)`;
  }

  if (colors.length === 3) {
    if (hasRinAndLen) {
      const rinIndex = parts.indexOf('RIN');
      const lenIndex = parts.indexOf('LEN');
      const rinColor = partColors.RIN;
      const lenColor = partColors.LEN;
      const otherPart = parts.find(p => p !== 'RIN' && p !== 'LEN');
      const otherColor = partColors[otherPart as keyof typeof partColors];

      if (rinIndex < lenIndex) {
        if (rinIndex === 0 && lenIndex === 1) {
          return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 15%, rgba(255,255,255,0.9) 32.75%, rgba(255,255,255,0.9) 33.25%, ${lenColor} 40%, ${lenColor} 55%, ${otherColor} 55%, ${otherColor} 100%)`;
        } else if (rinIndex === 0 && lenIndex === 2) {
          return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 15%, ${otherColor} 40%, ${otherColor} 55%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${lenColor} 55%, ${lenColor} 100%)`;
        } else {
          return `linear-gradient(135deg, ${otherColor} 0%, ${otherColor} 15%, ${rinColor} 40%, ${rinColor} 55%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${lenColor} 55%, ${lenColor} 100%)`;
        }
      } else {
        if (lenIndex === 0 && rinIndex === 1) {
          return `linear-gradient(135deg, ${lenColor} 0%, ${lenColor} 15%, rgba(255,255,255,0.9) 32.75%, rgba(255,255,255,0.9) 33.25%, ${rinColor} 40%, ${rinColor} 55%, ${otherColor} 55%, ${otherColor} 100%)`;
        } else if (lenIndex === 0 && rinIndex === 2) {
          return `linear-gradient(135deg, ${lenColor} 0%, ${lenColor} 15%, ${otherColor} 40%, ${otherColor} 55%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${rinColor} 55%, ${rinColor} 100%)`;
        } else {
          return `linear-gradient(135deg, ${otherColor} 0%, ${otherColor} 15%, ${lenColor} 40%, ${lenColor} 55%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${rinColor} 55%, ${rinColor} 100%)`;
        }
      }
    }
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 15%, ${colors[1]} 40%, ${colors[1]} 55%, ${colors[2]} 55%, ${colors[2]} 100%)`;
  }

  if (colors.length === 4) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 12%, ${colors[1]} 28%, ${colors[1]} 40%, ${colors[2]} 52%, ${colors[2]} 58%, ${colors[3]} 58%, ${colors[3]} 100%)`;
  }

  if (colors.length === 5) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 10%, ${colors[1]} 24%, ${colors[1]} 34%, ${colors[2]} 44%, ${colors[2]} 54%, ${colors[3]} 60%, ${colors[3]} 62%, ${colors[4]} 62%, ${colors[4]} 100%)`;
  }

  if (colors.length === 6) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 8%, ${colors[1]} 18%, ${colors[1]} 28%, ${colors[2]} 38%, ${colors[2]} 48%, ${colors[3]} 54%, ${colors[3]} 60%, ${colors[4]} 63%, ${colors[4]} 65%, ${colors[5]} 65%, ${colors[5]} 100%)`;
  }

  return `linear-gradient(135deg, ${colors.join(', ')})`;
};

const createGradientForNumber = (parts: string[]) => {
  const colors = parts.map(name => partColors[name as keyof typeof partColors]).filter(Boolean);

  if (colors.length === 0) return 'rgba(255, 255, 255, 0.6)';
  if (colors.length === 1) return colors[0];

  const hasRinAndLen = parts.includes('RIN') && parts.includes('LEN');

  if (colors.length === 2) {
    if (hasRinAndLen) {
      const rinColor = partColors.RIN;
      const lenColor = partColors.LEN;
      return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 35%, rgba(255,255,255,0.9) 49.75%, rgba(255,255,255,0.9) 50.25%, ${lenColor} 60%, ${lenColor} 100%)`;
    }
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 35%, ${colors[1]} 60%, ${colors[1]} 100%)`;
  }

  if (colors.length === 3) {
    if (hasRinAndLen) {
      const rinIndex = parts.indexOf('RIN');
      const lenIndex = parts.indexOf('LEN');
      const rinColor = partColors.RIN;
      const lenColor = partColors.LEN;
      const otherPart = parts.find(p => p !== 'RIN' && p !== 'LEN');
      const otherColor = partColors[otherPart as keyof typeof partColors];

      if (rinIndex < lenIndex) {
        if (rinIndex === 0 && lenIndex === 1) {
          return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 25%, rgba(255,255,255,0.9) 32.75%, rgba(255,255,255,0.9) 33.25%, ${lenColor} 40%, ${lenColor} 50%, ${otherColor} 65%, ${otherColor} 100%)`;
        } else if (rinIndex === 0 && lenIndex === 2) {
          return `linear-gradient(135deg, ${rinColor} 0%, ${rinColor} 25%, ${otherColor} 40%, ${otherColor} 50%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${lenColor} 65%, ${lenColor} 100%)`;
        } else {
          return `linear-gradient(135deg, ${otherColor} 0%, ${otherColor} 25%, ${rinColor} 40%, ${rinColor} 50%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${lenColor} 65%, ${lenColor} 100%)`;
        }
      } else {
        if (lenIndex === 0 && rinIndex === 1) {
          return `linear-gradient(135deg, ${lenColor} 0%, ${lenColor} 25%, rgba(255,255,255,0.9) 32.75%, rgba(255,255,255,0.9) 33.25%, ${rinColor} 40%, ${rinColor} 50%, ${otherColor} 65%, ${otherColor} 100%)`;
        } else if (lenIndex === 0 && rinIndex === 2) {
          return `linear-gradient(135deg, ${lenColor} 0%, ${lenColor} 25%, ${otherColor} 40%, ${otherColor} 50%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${rinColor} 65%, ${rinColor} 100%)`;
        } else {
          return `linear-gradient(135deg, ${otherColor} 0%, ${otherColor} 25%, ${lenColor} 40%, ${lenColor} 50%, rgba(255,255,255,0.9) 65.75%, rgba(255,255,255,0.9) 66.25%, ${rinColor} 65%, ${rinColor} 100%)`;
        }
      }
    }
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 25%, ${colors[1]} 40%, ${colors[1]} 50%, ${colors[2]} 65%, ${colors[2]} 100%)`;
  }

  if (colors.length === 4) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 22%, ${colors[1]} 32%, ${colors[1]} 40%, ${colors[2]} 48%, ${colors[2]} 56%, ${colors[3]} 66%, ${colors[3]} 100%)`;
  }

  if (colors.length === 5) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 20%, ${colors[1]} 28%, ${colors[1]} 34%, ${colors[2]} 40%, ${colors[2]} 46%, ${colors[3]} 52%, ${colors[3]} 58%, ${colors[4]} 66%, ${colors[4]} 100%)`;
  }

  if (colors.length === 6) {
    return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 30%, ${colors[1]} 36%, ${colors[1]} 42%, ${colors[2]} 46%, ${colors[2]} 50%, ${colors[3]} 54%, ${colors[3]} 58%, ${colors[4]} 62%, ${colors[4]} 68%, ${colors[5]} 74%, ${colors[5]} 100%)`;
  }

  return `linear-gradient(135deg, ${colors.join(', ')})`;
};

const parseGradient = (gradientStr: string) => {
  const stops: { color: string; position: number }[] = [];
  const stopRegex = /(#[0-9a-f]{6}|rgba?\([^)]+\))\s+(\d+)%/gi;
  let match;

  while ((match = stopRegex.exec(gradientStr)) !== null) {
    stops.push({
      color: match[1],
      position: parseInt(match[2]) / 100,
    });
  }

  return stops;
};

const createNumberImage = (num: number, gradient: string | null, parts?: string[]): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  ctx.font = 'bold 36px Pretendard, Inter, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const text = num.toString();
  const metrics = ctx.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = 36;

  canvas.width = textWidth + 4;
  canvas.height = textHeight + 4;

  ctx.font = 'bold 36px Pretendard, Inter, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const numberGradient = parts && parts.length > 0 ? createGradientForNumber(parts) : gradient;

  if (numberGradient && numberGradient.startsWith('linear-gradient')) {
    const stops = parseGradient(numberGradient);

    if (stops.length > 0) {
      const diagonalLength = Math.sqrt(textWidth * textWidth + textHeight * textHeight);
      const gradientObj = ctx.createLinearGradient(0, 0, diagonalLength * 0.707, diagonalLength * 0.707);
      stops.forEach(stop => {
        gradientObj.addColorStop(stop.position, stop.color);
      });
      ctx.fillStyle = gradientObj;
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillText(text, 2, 2);
  } else if (numberGradient) {
    ctx.fillStyle = numberGradient;
    ctx.fillText(text, 2, 2);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 2, 2);
  }

  return canvas.toDataURL();
};

const createBorderImage = (gradient: string, width: number, height: number, borderWidth: number, parts?: string[]): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const radius = 10;

  const stops = parseGradient(gradient);

  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.clip();

  if (stops.length > 0) {
    const diagonalLength = Math.sqrt(width * width + height * height);
    const gradientObj = ctx.createLinearGradient(0, 0, diagonalLength * 0.707, diagonalLength * 0.707);
    stops.forEach(stop => {
      gradientObj.addColorStop(stop.position, stop.color);
    });
    ctx.fillStyle = gradientObj;
  } else {
    ctx.fillStyle = gradient;
  }

  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.roundRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2, radius - borderWidth);
  ctx.fill();

  return canvas.toDataURL();
};

const SetlistImageGenerator: React.FC<SetlistImageGeneratorProps> = ({
  songs,
  eventName,
  concertTitle,
  concertTime,
  timeZone,
  playlistImageUrl,
  higawariLabel,
}) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberImages, setNumberImages] = useState<Map<string, string>>(new Map());
  const [borderImages, setBorderImages] = useState<Map<string, string>>(new Map());

  const finalPlaylistSong = songs.find(s => s.type === 'final-playlist');
  const displaySongs = songs.filter(s => s.type !== 'final-playlist');

  const getProxiedImageUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('/')) return url;
    const encodedUrl = encodeURIComponent(url);
    return `/_next/image?url=${encodedUrl}&w=640&q=75`;
  };

  useEffect(() => {
    const newNumberImages = new Map<string, string>();
    const newBorderImages = new Map<string, string>();
    let index = 1;

    displaySongs.forEach(song => {
      if (song.type && song.type !== 'song') return;

      const gradient = song.part && song.part.length > 0
        ? createGradientWithRinLenBoundary(song.part)
        : null;

      const key = `${index}-${gradient || 'white'}`;
      if (!newNumberImages.has(key)) {
        newNumberImages.set(key, createNumberImage(index, gradient, song.part));
      }

      if (gradient && song.part && song.part.length > 1) {
        const borderKey = gradient;
        if (!newBorderImages.has(borderKey)) {
          newBorderImages.set(borderKey, createBorderImage(gradient, 680, 76, 3, song.part));
        }
      }

      index++;
    });

    setNumberImages(newNumberImages);
    setBorderImages(newBorderImages);
  }, []);

  const waitForImages = async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
    const imagePromises = images.map(img => {
      if (img.complete) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        img.onload = () => resolve(undefined);
        img.onerror = () => resolve(undefined);
        setTimeout(() => resolve(undefined), 5000);
      });
    });
    await Promise.all(imagePromises);
  };

  const generateImage = async () => {
    if (!imageRef.current) return;

    setIsGenerating(true);
    try {
      const hiddenImages = imageRef.current.querySelectorAll<HTMLImageElement>('img[src^="http"]');
      const imagePromises = Array.from(hiddenImages).map(img => {
        if (img.complete && img.naturalWidth > 0) {
          return Promise.resolve();
        }
        return new Promise((resolve) => {
          img.onload = () => resolve(undefined);
          img.onerror = () => resolve(undefined);
          setTimeout(() => resolve(undefined), 10000);
        });
      });

      await Promise.all(imagePromises);
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(imageRef.current, {
        scale: 2,
        backgroundColor: '#1a1a2e',
        logging: false,
        useCORS: true,
        allowTaint: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('setlist-image-content');
          if (clonedElement) {
            clonedElement.style.visibility = 'visible';
          }
        }
      });

      const link = document.createElement('a');
      const filename = `${eventName}_${concertTitle}.png`.replace(/\s+/g, '_');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 생성 실패:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  let songIndex = 1;
  const totalSongs = displaySongs.filter(s => s.type === 'song' || !s.type).length;

  const playlistImage = getProxiedImageUrl(finalPlaylistSong?.jacketUrl || playlistImageUrl || '');

  return (
    <>
      <button
        onClick={generateImage}
        disabled={isGenerating}
        className="glass-button"
        style={{
          padding: '12px 24px',
          fontSize: '1rem',
          marginBottom: '16px',
          cursor: isGenerating ? 'wait' : 'pointer',
          opacity: isGenerating ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: '#ffffff',
          minWidth: '120px',
          marginLeft: 'auto',
        }}
      >
        {isGenerating ? (
          <>
            <div style={{
              width: '24px',
              height: '24px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </>
        ) : (
          <>
            <Image src="/images/image.svg" alt="" width={24} height={24} style={{ filter: 'invert(1)' }} />
            <Image src="/images/download.svg" alt="" width={24} height={24} style={{ filter: 'invert(1)' }} />
          </>
        )}
      </button>

      <div
        ref={imageRef}
        id="setlist-image-content"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1400px',
          padding: '30px 40px',
          backgroundColor: '#1a1a2e',
          fontFamily: 'Pretendard, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          visibility: 'hidden',
        }}
      >
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '20px',
          alignItems: 'center',
        }}>
          {playlistImage && (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '16px',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={playlistImage}
                alt="Playlist"
                crossOrigin="anonymous"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
            {concertTitle.split('\n').map((line, idx, arr) => (
              <h1 key={idx} style={{
                fontSize: '44px',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
              }}>
                {line}
                {idx === arr.length - 1 && higawariLabel && (
                  <span style={{
                    fontSize: '28px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginLeft: '12px',
                  }}>
                    - {higawariLabel} 세트리
                  </span>
                )}
              </h1>
            ))}
            {concertTime && (
              <p style={{
                fontSize: '20px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}>
                {concertTime} {timeZone && `(UTC${timeZone.replace(/^([+-])0?/, '$1')})`}
              </p>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          columnGap: '30px',
        }}>
          {(() => {
            const midpoint = Math.ceil(displaySongs.length / 2);
            const leftColumn = displaySongs.slice(0, midpoint);
            const rightColumn = displaySongs.slice(midpoint);

            return (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '6px 0 6px 8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.6)',
                    letterSpacing: '1px',
                  }}>
                    ▼START▼
                  </div>
                  {leftColumn.map((song, index) => {
                    const isSegment = song.type && song.type !== 'song';

                    if (isSegment) {
                      return (
                        <div
                          key={index}
                          style={{
                            padding: '3px 20px',
                            background: 'rgba(128, 128, 128, 0.3)',
                            border: '1px solid rgba(128, 128, 128, 0.5)',
                            borderRadius: '10px',
                            textAlign: 'center',
                          }}
                        >
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            lineHeight: 1.3,
                          }}>
                            {song.title}
                          </p>
                        </div>
                      );
                    }

                    const currentIndex = songIndex++;
                    const colors = song.part
                      ? song.part.map(name => partColors[name as keyof typeof partColors]).filter(Boolean)
                      : [];

                    const gradientBg = song.part && song.part.length > 0
                      ? createGradientWithRinLenBoundary(song.part)
                      : 'rgba(255, 255, 255, 0.6)';

                    const numberKey = `${currentIndex}-${gradientBg}`;
                    const isSingleColor = colors.length === 1;
                    const isGradient = colors.length > 1;

                    return (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                        }}
                      >
                        {isGradient && borderImages.has(gradientBg) && (
                          <img
                            src={borderImages.get(gradientBg)}
                            alt=""
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              pointerEvents: 'none',
                              zIndex: 1,
                            }}
                          />
                        )}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 50px 1fr',
                            gap: '12px',
                            alignItems: 'center',
                            padding: '10px 16px',
                            background: song.higawari
                              ? 'rgba(0, 122, 255, 0.15)'
                              : song.locationgawari
                              ? 'rgba(48, 209, 88, 0.15)'
                              : 'rgba(255, 255, 255, 0.03)',
                            border: isSingleColor ? `3px solid ${colors[0]}` : 'none',
                            borderRadius: '10px',
                            position: 'relative',
                          }}
                        >
                          <div style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            textAlign: 'center',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '40px',
                          }}>
                            {numberImages.has(numberKey) ? (
                              <img
                                src={numberImages.get(numberKey)}
                                alt={currentIndex.toString()}
                                style={{
                                  height: '36px',
                                  width: 'auto',
                                  objectFit: 'contain',
                                }}
                              />
                            ) : (
                              <span style={{ color: '#ffffff' }}>
                                {currentIndex}
                              </span>
                            )}
                          </div>

                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <img
                              src={getProxiedImageUrl(song.jacketUrl)}
                              alt=""
                              crossOrigin="anonymous"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            minWidth: 0,
                            flex: 1,
                          }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              flex: 1,
                              minWidth: 0,
                            }}>
                              <div style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#ffffff',
                                lineHeight: 1.2,
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}>
                                {song.krtitle || song.title}
                              </div>
                              <div style={{
                                fontSize: '18px',
                                fontWeight: '300',
                                color: 'rgba(255, 255, 255, 0.9)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {song.krartist || song.artist}
                              </div>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              flexShrink: 0,
                            }}>
                              {song.locationgawari && song.venueName && (
                                <div style={{
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: '#ffffff',
                                  padding: '4px 10px',
                                  background: 'rgba(48, 209, 88, 0.35)',
                                  border: '1.5px solid rgba(48, 209, 88, 0.7)',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {song.venueName}
                                </div>
                              )}
                              {song.higawari && song.blockName && (
                                <div style={{
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: '#ffffff',
                                  padding: '4px 10px',
                                  background: 'rgba(0, 122, 255, 0.35)',
                                  border: '1.5px solid rgba(0, 122, 255, 0.7)',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {song.blockName}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {rightColumn.map((song, index) => {
                    const isSegment = song.type && song.type !== 'song';
                    const actualIndex = midpoint + index;

                    if (isSegment) {
                      return (
                        <div
                          key={actualIndex}
                          style={{
                            padding: '3px 20px',
                            background: 'rgba(128, 128, 128, 0.3)',
                            border: '1px solid rgba(128, 128, 128, 0.5)',
                            borderRadius: '10px',
                            textAlign: 'center',
                          }}
                        >
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            lineHeight: 1.3,
                          }}>
                            {song.title}
                          </p>
                        </div>
                      );
                    }

                    const currentIndex = songIndex++;
                    const colors = song.part
                      ? song.part.map(name => partColors[name as keyof typeof partColors]).filter(Boolean)
                      : [];

                    const gradientBg = song.part && song.part.length > 0
                      ? createGradientWithRinLenBoundary(song.part)
                      : 'rgba(255, 255, 255, 0.6)';

                    const numberKey = `${currentIndex}-${gradientBg}`;
                    const isSingleColor = colors.length === 1;
                    const isGradient = colors.length > 1;

                    return (
                      <React.Fragment key={actualIndex}>
                        <div
                          style={{
                            position: 'relative',
                          }}
                        >
                          {isGradient && borderImages.has(gradientBg) && (
                            <img
                              src={borderImages.get(gradientBg)}
                              alt=""
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                                zIndex: 1,
                              }}
                            />
                          )}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '60px 50px 1fr',
                              gap: '12px',
                              alignItems: 'center',
                              padding: '10px 16px',
                              background: song.higawari
                                ? 'rgba(0, 122, 255, 0.15)'
                                : song.locationgawari
                                ? 'rgba(48, 209, 88, 0.15)'
                                : 'rgba(255, 255, 255, 0.03)',
                              border: isSingleColor ? `3px solid ${colors[0]}` : 'none',
                              borderRadius: '10px',
                              position: 'relative',
                            }}
                          >
                            <div style={{
                              fontSize: '22px',
                              fontWeight: '700',
                              textAlign: 'center',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '40px',
                            }}>
                              {numberImages.has(numberKey) ? (
                                <img
                                  src={numberImages.get(numberKey)}
                                  alt={currentIndex.toString()}
                                  style={{
                                    height: '36px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                  }}
                                />
                              ) : (
                                <span style={{ color: '#ffffff' }}>
                                  {currentIndex}
                                </span>
                              )}
                            </div>

                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              backgroundColor: '#000',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <img
                                src={getProxiedImageUrl(song.jacketUrl)}
                                alt=""
                                crossOrigin="anonymous"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </div>

                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minWidth: 0,
                              flex: 1,
                            }}>
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                flex: 1,
                                minWidth: 0,
                              }}>
                                <div style={{
                                  fontSize: '24px',
                                  fontWeight: '700',
                                  color: '#ffffff',
                                  lineHeight: 1.2,
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                }}>
                                  {song.krtitle || song.title}
                                </div>
                                <div style={{
                                  fontSize: '18px',
                                  fontWeight: '300',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}>
                                  {song.krartist || song.artist}
                                </div>
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexShrink: 0,
                              }}>
                                {song.locationgawari && song.venueName && (
                                  <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    padding: '4px 10px',
                                    background: 'rgba(48, 209, 88, 0.35)',
                                    border: '1.5px solid rgba(48, 209, 88, 0.7)',
                                    borderRadius: '6px',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {song.venueName}
                                  </div>
                                )}
                                {song.higawari && song.blockName && (
                                  <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#ffffff',
                                    padding: '4px 10px',
                                    background: 'rgba(0, 122, 255, 0.35)',
                                    border: '1.5px solid rgba(0, 122, 255, 0.7)',
                                    borderRadius: '6px',
                                    whiteSpace: 'nowrap',
                                  }}>
                                    {song.blockName}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>

        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.35)',
          fontWeight: '400',
        }}>
          mm-info.miku.kr
        </div>
      </div>
    </>
  );
};

export default SetlistImageGenerator;
