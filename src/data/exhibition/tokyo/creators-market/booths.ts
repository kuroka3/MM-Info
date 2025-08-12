import type { Booth } from '@/types/booth';

export const ROWS: string[] = [];
export const COLS: number[] = [];
export const rowClasses: Record<string, string> = {};
export const BOOTHS: Booth[] = [];
export const findBooth = (r: string, c: number): Booth | undefined =>
  BOOTHS.find(b => b.row === r && b.col === c);
export const findBooths = (r: string, c: number): Booth[] =>
  BOOTHS.filter(b => b.row === r && b.col === c);