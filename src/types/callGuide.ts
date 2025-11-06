import type { Prisma } from '@prisma/client';

export type SongWithSetlist = Prisma.SongGetPayload<{
  include: {
    setlists: {
      select: { order: true };
      orderBy: { order: 'asc' };
      take: 1;
    };
    eventVariations: {
      select: { isHigawari: true; isLocationgawari: true; eventId: true };
    };
  };
}> & { safeIndex?: number };

export interface Playlist {
  id: string;
  name: string;
  slugs: string[];
  color?: string;
  eventSlug?: string;
}
