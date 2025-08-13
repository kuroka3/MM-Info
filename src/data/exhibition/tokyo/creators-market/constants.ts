export const DAYS = [
  { value: '8/29(금)', date: '8/29', day: '금', cls: 'fri' },
  { value: '8/30(토)', date: '8/30', day: '토', cls: 'sat' },
  { value: '8/31(일)', date: '8/31', day: '일', cls: 'sun' },
] as const;

export const jacketSrc = (id: string) => `/images/tokyo/creators-market/cc_${id}.jpg`;
export const displayBoothId = (id: string) => id.replace(/[a-z]$/i, '');

export const rowColors: Record<string, string> = {
  A: '135,64,93',
  B: '87,127,166',
  C: '187,139,56',
  D: '102,151,55',
  E: '145,106,173',
  F: '161,87,121',
};

export const dayClass: Record<string, string> = {
  금: 'fri',
  토: 'sat',
  일: 'sun',
};
