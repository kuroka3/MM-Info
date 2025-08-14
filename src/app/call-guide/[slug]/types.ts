import type { Call } from '@/types/call-guide';

export interface Token {
  text: string;
  time?: number;
}

export interface ProcessedLine {
  jp: Token[];
  pron: Token[];
  ko: Token[];
  call?: Call;
}
