import { getSafeSongIndex, getAlbumSongs } from '../src/data/safeSongIndex';

console.log('🔍 Checking safeSongIndex runtime values...\n');

const events = ['magical-mirai-2025', 'miku-expo-2025-asia'];

for (const eventSlug of events) {
  const safeSongIndex = getSafeSongIndex(eventSlug);
  const albumSongs = getAlbumSongs(eventSlug);

  console.log(`Event: ${eventSlug}`);
  console.log(`  safeSongIndex type: ${typeof safeSongIndex}`);
  console.log(`  safeSongIndex isArray: ${Array.isArray(safeSongIndex)}`);
  console.log(`  safeSongIndex value: ${JSON.stringify(safeSongIndex)}`);
  console.log(`  albumSongs type: ${typeof albumSongs}`);
  console.log(`  albumSongs isArray: ${Array.isArray(albumSongs)}`);
  console.log(`  albumSongs value: ${JSON.stringify(albumSongs)}`);
  console.log();
}
