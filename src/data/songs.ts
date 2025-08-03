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
}

export interface Token {
  text: string;
  time: number;
}

export interface LyricLine {
  jp: Token[];
  pron: Token[];
  ko: Token[];
  call?: Call;
}

export interface CallSummary {
  time: number;
  text: string;
}

export interface CallSong {
  slug: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  summary: CallSummary[];
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
  