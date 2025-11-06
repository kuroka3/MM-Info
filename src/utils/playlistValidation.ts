import type { Playlist } from '@/types/callGuide';

export function ensureValidPlaylist(playlist: Playlist | null | undefined): Playlist | null {
  if (!playlist) return null;

  if (!playlist.slugs || !Array.isArray(playlist.slugs)) {
    return { ...playlist, slugs: [] };
  }

  return playlist;
}

export function ensureValidPlaylists(playlists: Playlist[]): Playlist[] {
  return playlists.map(pl => ensureValidPlaylist(pl)!).filter(Boolean);
}
