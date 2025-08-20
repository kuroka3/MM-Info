import type { Prisma } from '@prisma/client';

export type SongWithSetlist = Prisma.SongGetPayload<{
  include: {
    setlists: {
      select: { order: true; higawari: true; locationgawari: true };
      orderBy: { order: 'asc' };
      take: 1;
    };
  };
}> & { safeIndex?: number };

export interface Playlist {
  id: string;
  name: string;
  slugs: string[];
  color?: string;
}
