// src\types\playback.ts
export type RepeatMode = 'off' | 'one' | 'all';

export type PlaylistOrder = string[];

export interface EndedDecision {
  nextSlug?: string;
  newOrder?: PlaylistOrder;
}

export interface OrderState {
  order: PlaylistOrder;
  shuffle: boolean;
  repeat: RepeatMode;
}
