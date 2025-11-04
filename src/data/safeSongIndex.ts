const MAGICAL_MIRAI_2025_ALBUM_SONGS = [
  'lustrous',
  'dama-rock',
  'lavie',
  'hiasobi',
  'maga-maga',
  'genten',
  'street-light',
];

const EVENT_ALBUM_SONGS: Record<string, string[]> = {
  'magical-mirai-2025': MAGICAL_MIRAI_2025_ALBUM_SONGS,
  'miku-expo-2025-asia': [],
};

const EVENT_SAFE_SONG_INDEX: Record<string, string[] | undefined> = {
  'magical-mirai-2025': MAGICAL_MIRAI_2025_ALBUM_SONGS,
  'miku-expo-2025-asia': undefined,
};

export function getAlbumSongs(eventSlug: string): string[] {
  return EVENT_ALBUM_SONGS[eventSlug] ? [...EVENT_ALBUM_SONGS[eventSlug]] : [];
}

export function getSafeSongIndex(eventSlug: string): string[] {
  const safeSongs = EVENT_SAFE_SONG_INDEX[eventSlug];
  if (safeSongs) return [...safeSongs];
  return [];
}
