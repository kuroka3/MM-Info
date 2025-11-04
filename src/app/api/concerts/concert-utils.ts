import type { Prisma } from '@prisma/client'

export const concertInclude = {
  event: {
    include: {
      series: true,
    },
  },
  Venue: true,
} satisfies Prisma.ConcertInclude

export type ConcertWithRelations = Prisma.ConcertGetPayload<{ include: typeof concertInclude }>

export const serializeConcert = (concert: ConcertWithRelations) => ({
  id: concert.id,
  title: concert.title,
  date: concert.date,
  day: concert.day,
  block: concert.block,
  hidden: concert.hidden ?? false,
  setlistId: concert.setlistId,
  venue: concert.Venue
    ? {
        id: concert.Venue.id,
        name: concert.Venue.name,
      }
    : null,
  event: concert.event
    ? {
        id: concert.event.id,
        name: concert.event.name,
        year: concert.event.year,
        slug: concert.event.slug,
        series: concert.event.series
          ? {
              id: concert.event.series.id,
              name: concert.event.series.name,
              slug: concert.event.series.slug,
            }
          : null,
      }
    : null,
})
