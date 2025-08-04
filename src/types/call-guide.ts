export interface Call {
  text: string;
  start: number;
  end: number;
  pos?: number;
}

export type TimeMap = Record<string, number>;

export interface LyricLine {
  jp: string;
  pron: string;
  ko: string;
  times?: TimeMap;
  call?: Call;
}
