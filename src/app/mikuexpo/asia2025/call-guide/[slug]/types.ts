import type { Call, CallItem } from '@/types/call-guide';
import type { Song } from '@prisma/client';
import type { Playlist } from '@/types/callGuide';

export interface Token {
  text: string;
  time?: number;
}

export interface ProcessedLine {
  jp: Token[];
  pron: Token[];
  ko: Token[];
  call?: Call;
  calls?: CallItem[];
}

export interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getIframe?: () => HTMLIFrameElement;
  getPlayerState(): number;
}

export interface CallGuideClientProps {
  song: Song;
  songs: Song[];
  safeSongIndex: string[];
  albumSongs: string[];
  eventSlug: string;
  defaultPlaylists?: Array<{ id: string; name: string; slugs: string[] }>;
}

declare global {
  interface Window {
    YT: { Player: new (...args: unknown[]) => YTPlayer };
    onYouTubeIframeAPIReady: () => void;
  }
}

export type { Playlist };
export { };
