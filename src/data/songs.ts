declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
};

export interface Call {
  text: string;
  start: number;
  end: number;
  pos?: number;
}

export type TimeMap = Record<number, number[]>;

export interface LyricLine {
  jp: string;
  pron: string;
  ko: string;
  times?: {
    jp?: TimeMap;
    pron?: TimeMap;
    ko?: TimeMap;
  };
  call?: Call;
}

export interface CallSong {
  slug: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  summary: string;
  lyrics: LyricLine[];
}

interface RequireContext {
  keys: () => string[];
  <T>(id: string): T;
}

const req = (require as {
  context: (
    path: string,
    deep?: boolean,
    filter?: RegExp
  ) => RequireContext;
}).context('./songs', false, /\.json$/);

export const callSongs: CallSong[] = req
  .keys()
  .map((key) => req<CallSong>(key));
  