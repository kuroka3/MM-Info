import { revalidateTag } from 'next/cache';

export function revalidateEventCache(eventSlug: string) {
  revalidateTag(`event-${eventSlug}`);
  revalidateTag(`songs-${eventSlug}`);
  revalidateTag(`concerts-${eventSlug}`);
}

export function revalidateAllSongs(eventSlug: string) {
  revalidateTag(`songs-${eventSlug}`);
}

export function revalidateConcerts(eventSlug: string) {
  revalidateTag(`concerts-${eventSlug}`);
}
