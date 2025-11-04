import type { Concert, Venue } from '@prisma/client'

export type ConcertWithVenue = Concert & { Venue: Venue | null }

type DateGroup = {
  date: string
  day: string
  blocks: { block: string; id: number | null; hidden?: boolean | null }[]
}

export type VenueGroup = {
  venueName: string
  concerts: DateGroup[]
}

const groupByDate = (concerts: ConcertWithVenue[]): DateGroup[] => {
  const map = new Map<string, { day: string; blocks: DateGroup['blocks'] }>()
  concerts.forEach((concert) => {
    if (!map.has(concert.date)) {
      map.set(concert.date, { day: concert.day, blocks: [] })
    }
    map.get(concert.date)!.blocks.push({
      block: concert.block,
      id: concert.setlistId,
      hidden: concert.hidden,
    })
  })

  return [...map.entries()].map(([date, { day, blocks }]) => ({
    date,
    day,
    blocks,
  }))
}

export const groupConcertsByVenue = (concerts: ConcertWithVenue[]): VenueGroup[] => {
  const map = new Map<string, ConcertWithVenue[]>()
  concerts.forEach((concert) => {
    const key = concert.Venue?.name ?? '미정'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(concert)
  })

  return [...map.entries()].map(([venueName, groupedConcerts]) => ({
    venueName,
    concerts: groupByDate(groupedConcerts),
  }))
}
