'use client';

import type React from 'react';
import type { Token, ProcessedLine } from './types';

interface LyricsDisplayProps {
  lyrics: ProcessedLine[];
  activeLine: number;
  tokenRefs: React.MutableRefObject<HTMLSpanElement[][]>;
  lineRefs: React.MutableRefObject<HTMLDivElement[]>;
  callPositions: number[];
  callActive: (line: ProcessedLine) => boolean;
  charActive: (token: Token) => boolean;
  onLineClick: (index: number) => void;
}

export default function LyricsDisplay({
  lyrics,
  activeLine,
  tokenRefs,
  lineRefs,
  callPositions,
  callActive,
  charActive,
  onLineClick,
}: LyricsDisplayProps) {
  return (
    <div className="lyrics">
      {lyrics.map((line, idx) => (
        <div
          key={idx}
          className={`lyric-line${idx === activeLine ? ' focused' : ''}`}
          ref={(el) => {
            lineRefs.current[idx] = el!;
          }}
          onClick={() => onLineClick(idx)}
        >
          <div
            className={`lyric-call${callActive(line) ? ' active' : ''}`}
            style={
              line.call?.pos != null
                ? { left: callPositions[idx], transform: 'none' }
                : undefined
            }
          >
            {line.call?.text ?? ''}
          </div>
          <div className="lyric-row">
            {line.jp.map((token, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (!tokenRefs.current[idx]) tokenRefs.current[idx] = [];
                  tokenRefs.current[idx][i] = el!;
                }}
                className={`lyric-char${charActive(token) ? ' active' : ''}`}
              >
                {token.text}
              </span>
            ))}
          </div>
          <div className="lyric-row">
            {line.pron.map((token, i) => (
              <span
                key={i}
                className={`lyric-char${charActive(token) ? ' active' : ''}`}
              >
                {token.text}
              </span>
            ))}
          </div>
          <div className="lyric-row">
            {line.ko.map((token, i) => (
              <span
                key={i}
                className={`lyric-char${charActive(token) ? ' active' : ''}`}
              >
                {token.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
