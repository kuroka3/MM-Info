import type { RepeatMode, PlaylistOrder, EndedDecision } from '@/types/playback';

export const ORDER_STORAGE_KEY_PREFIX = 'callGuidePlaylistOrder:';
export const makeOrderStorageKey = (playlistId: string) =>
  `${ORDER_STORAGE_KEY_PREFIX}${playlistId}`;

export const ALL_PLAYLIST_ID = 'all';

function fisherYates<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function isValidPermutation(base: string[], order: string[]): boolean {
  return (
    order.length === base.length &&
    new Set(order).size === base.length &&
    order.every((s) => base.includes(s))
  );
}

export function buildBaseSlugs(
  activeSlugs: string[] | null | undefined,
  songs: { slug: string | null }[],
): string[] {
  if (activeSlugs && activeSlugs.length) return activeSlugs.slice();
  return songs
    .map((s) => s.slug)
    .filter((s): s is string => typeof s === 'string' && s.length > 0);
}

export function makeAnchoredShuffle(
  base: string[],
  currentSlug: string | null | undefined,
): string[] {
  if (!currentSlug) return fisherYates([...base]);
  const k = base.indexOf(currentSlug);
  if (k < 0) return fisherYates([...base]);
  const before = base.slice(0, k);
  const after = base.slice(k + 1);
  fisherYates(before);
  fisherYates(after);
  return [currentSlug, ...after, ...before];
}

export function computeInitialOrder(args: {
  base: string[];
  currentSlug: string | null | undefined;
  shuffle: boolean;
  storedOrder?: string[] | null;
}): string[] {
  const { base, currentSlug, shuffle, storedOrder } = args;
  if (storedOrder && isValidPermutation(base, storedOrder)) {
    return storedOrder.slice();
  }
  if (shuffle) return makeAnchoredShuffle(base, currentSlug);
  return base.slice();
}

export function getPrevNext(order: string[], currentSlug: string): { prev?: string; next?: string } {
  const n = order.length;
  if (!n) return {};
  const i = order.indexOf(currentSlug);
  if (i < 0) return {};
  return {
    prev: order[(i - 1 + n) % n],
    next: order[(i + 1) % n],
  };
}

export function onEndedDecision(args: {
  order: PlaylistOrder;
  currentSlug: string | null | undefined;
  repeat: RepeatMode;
  shuffle: boolean;
  baseForReshuffle: string[];
}): EndedDecision {
  const { order, currentSlug, repeat, shuffle, baseForReshuffle } = args;
  const n = order.length;
  if (!n) return {};
  const i = currentSlug ? order.indexOf(currentSlug) : -1;

  if (repeat === 'one' && currentSlug) {
    return { nextSlug: currentSlug };
  }

  if (i >= 0 && i < n - 1) {
    return { nextSlug: order[i + 1] };
  }

  if (repeat === 'all') {
    if (shuffle) {
      if (n === 1) {
        return { nextSlug: currentSlug ?? order[0], newOrder: [...baseForReshuffle] };
      }
      const newOrder = fisherYates([...baseForReshuffle]);
      if (currentSlug && newOrder[0] === currentSlug) {
        newOrder.push(newOrder.shift()!);
      }
      return { nextSlug: newOrder[0], newOrder };
    }
    return { nextSlug: order[0] };
  }
  return {};
}

export function applyToggleShuffle(args: {
  base: string[];
  currentSlug: string | null | undefined;
  prevShuffle: boolean;
}): { shuffle: boolean; order: PlaylistOrder } {
  const { base, currentSlug, prevShuffle } = args;
  const nextShuffle = !prevShuffle;
  const order = nextShuffle ? makeAnchoredShuffle(base, currentSlug) : base.slice();
  return { shuffle: nextShuffle, order };
}

export const persistOrder = (storageKey: string, order: PlaylistOrder) =>
  localStorage.setItem(storageKey, JSON.stringify(order));

export const restoreOrder = (storageKey: string): PlaylistOrder | null =>
  JSON.parse(localStorage.getItem(storageKey) || 'null');

export const removeOrder = (storageKey: string) =>
  localStorage.removeItem(storageKey);

export const restoreOrderValidated = (
  storageKey: string,
  base: string[],
): PlaylistOrder | null => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && isValidPermutation(base, parsed)) {
      return parsed;
    }
  } catch {}
  removeOrder(storageKey);
  return null;
};

export function generateUUID(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
  } catch {}
  const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = (n: number) => n.toString(16).padStart(2, '0');
  const b = bytes.map(hex).join('');
  return `${b.slice(0, 8)}-${b.slice(8, 12)}-${b.slice(12, 16)}-${b.slice(16, 20)}-${b.slice(20)}`;
}

export function ensureUniquePlaylistId(existingIds: Iterable<string>, currentId?: string | null): string {
  const set = new Set(existingIds || []);
  if (currentId && !set.has(currentId)) return currentId;
  let id = generateUUID();
  let tries = 0;
  while (set.has(id) && tries < 5) {
    id = generateUUID();
    tries++;
  }
  if (set.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
  return id;
}