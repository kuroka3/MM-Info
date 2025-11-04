import type { Prisma } from '@prisma/client'

export const concertInclude = {
  event: {
    include: {
      series: true,
    },
  },
  venue: true,
} satisfies Prisma.ConcertInclude

export type ConcertWithRelations = Prisma.ConcertGetPayload<{ include: typeof concertInclude }>

export const serializeConcert = (concert: ConcertWithRelations) => ({
  id: concert.id,
  title: concert.title,
  date: concert.date,
  day: concert.day,
  block: concert.block,
  hidden: concert.hidden ?? false,
  showTime: concert.showTime ?? null,
  doorTime: concert.doorTime ?? null,
  vipTime: concert.vipTime ?? null,
  timeZone: concert.timeZone ?? null,
  timeOffset: concert.timeOffset ?? null,
  showTimeUTC: concert.showTimeUTC ?? null,
  doorTimeUTC: concert.doorTimeUTC ?? null,
  vipTimeUTC: concert.vipTimeUTC ?? null,
  setlistId: concert.setlistId,
  venue: concert.venue
    ? {
        id: concert.venue.id,
        name: concert.venue.name,
        name_en: concert.venue.name_en,
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
