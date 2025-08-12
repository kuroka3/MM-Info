export interface MemberLink {
  label: string;
  url: string;
}

export interface Member {
  name: string;
  koName?: string;
  links?: MemberLink[];
}

export interface Booth {
  id: string;
  row: string;
  col: number;
  span?: number;
  name: string;
  koPNames?: string;
  dates: string[];
  members: Member[];
  hidden?: boolean;
}
