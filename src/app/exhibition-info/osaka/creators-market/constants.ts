export const DAYS = [
  { value: '8/9(토)', date: '8/9', day: '토', cls: 'sat' },
  { value: '8/10(일)', date: '8/10', day: '일', cls: 'sun' },
  { value: '8/11(월)', date: '8/11', day: '월', cls: 'mon' },
] as const;

export const jacketSrc = (id: string) => `/images/osaka/creators-market/cc_${id}.jpg`;
export const displayBoothId = (id: string) => id.replace(/[a-z]$/i, '');

export const rowColors: Record<string, string> = {
  A: '255,71,133',
  B: '0,122,255',
  C: '255,149,0',
  D: '48,209,88',
  E: '175,82,222',
  F: '94,92,230',
  G: '255,45,85',
};

export const dayClass: Record<string, string> = {
  토: 'sat',
  일: 'sun',
  월: 'mon',
};
