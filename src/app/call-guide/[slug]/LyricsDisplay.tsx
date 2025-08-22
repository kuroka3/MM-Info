'use client';

import type React from 'react';
import type { Token, ProcessedLine } from './types';
import type { CallItem } from '@/types/call-guide';

interface LyricsDisplayProps {
  lyrics: ProcessedLine[];
  activeLine: number;
  tokenRefs: React.MutableRefObject<HTMLSpanElement[][]>;
  lineRefs: React.MutableRefObject<HTMLDivElement[]>;
  callPositions: (number | undefined)[][];
  callActive: (line: ProcessedLine) => boolean;
  callItemActive: (item: CallItem) => boolean;
  charActive: (token: Token) => boolean;
  onLineClick: (index: number) => void;
  currentTime: number;
}

export default function LyricsDisplay({
  lyrics,
  activeLine,
  tokenRefs,
  lineRefs,
  callPositions,
  callActive,
  callItemActive,
  charActive,
  onLineClick,
  currentTime,
}: LyricsDisplayProps) {
  return (
    <div className="lyrics">
      {lyrics.map((line, idx) => (
        <div
          key={idx}
          className={`lyric-line${idx === activeLine ? ' focused' : ''}`}
          tabIndex={-1}
          ref={(el) => {
            lineRefs.current[idx] = el!;
          }}
          onClick={() => onLineClick(idx)}
        >
          <div
            className={`lyric-call${callActive(line) ? ' active' : ''}`}
            style={(() => {
              const left = callPositions[idx]?.[0];
              return line.call?.pos != null && left != null
                ? { left, transform: 'none' }
                : undefined;
            })()}
          >
            {line.call?.text ?? ''}
          </div>
          {(() => {
            let nonRepeatIdx = 0;
            return line.calls?.map((c, cIdx) => {
              if (c.isRepeat) {
                const sr = c.startRepeatIndex ?? 0;
                const starts = c.start || [];
                const ends = c.end || [];
                const positions = c.pos || [];
                let stage = 0;
                for (let i = 0; i < starts.length; i++) {
                  if (currentTime >= starts[i]) stage = i;
                  else break;
                }
                if (
                  stage === starts.length - 1 &&
                  positions.length > starts.length &&
                  currentTime > (ends[stage] ?? Infinity)
                ) {
                  stage = starts.length;
                }
                if (stage >= positions.length) stage = positions.length - 1;
                const active =
                  stage < starts.length &&
                  currentTime >= (starts[stage] ?? Infinity) &&
                  currentTime <= (ends[stage] ?? -Infinity);
                const lineEl = lineRefs.current[idx];
                const elements: React.ReactNode[] = [];
                if (stage > 0) {
                  const firstIdx = positions[0];
                  const firstEl = tokenRefs.current[idx]?.[firstIdx];
                  const firstLeft =
                    lineEl && firstEl
                      ? firstEl.getBoundingClientRect().left - lineEl.getBoundingClientRect().left
                      : undefined;
                  elements.push(
                    <div
                      key={`${cIdx}-arrow`}
                      className="lyric-call"
                      style={firstLeft != null ? { left: firstLeft, transform: 'none' } : undefined}
                    >
                      {'→'}
                    </div>,
                  );
                }
                const number = stage + sr + 1;
                const digits = String(number).length;
                const label = (
                  <>
                    {c.text}
                    <span className="call-suffix">
                      <span className="call-x">x</span>
                      <span
                        key={number}
                        className="call-number"
                        style={{
                          width: `${digits}ch`,
                          animation: `typing 0.03s steps(${digits}, end)`,
                        }}
                      >
                        {number}
                      </span>
                    </span>
                  </>
                );
                const charIdx = positions[stage];
                const charEl = tokenRefs.current[idx]?.[charIdx];
                const left =
                  lineEl && charEl
                    ? charEl.getBoundingClientRect().left - lineEl.getBoundingClientRect().left
                    : undefined;
                elements.push(
                  <div
                    key={cIdx}
                    className={`lyric-call${active ? ' active' : ''}`}
                    style={left != null ? { left, transform: 'none' } : undefined}
                  >
                    {label}
                  </div>,
                );
                return elements;
              }
              nonRepeatIdx++;
              const pos0 = c.pos?.[0];
              return (
                <div
                  key={cIdx}
                  className={`lyric-call${callItemActive(c) ? ' active' : ''}`}
                  style={(() => {
                    const left = callPositions[idx]?.[nonRepeatIdx];
                    return pos0 != null && left != null
                      ? { left, transform: 'none' }
                      : undefined;
                  })()}
                >
                  {c.text}
                </div>
              );
            });
          })()}
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
