import type { Concert, Venue } from '@prisma/client'

export type ConcertWithVenue = Concert & { venue: Venue | null }

const formatTimeFromOffset = (date: Date, offset: string) => {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(offset.trim())
  if (!match) return null

  const [, sign, hours, minutes] = match
  const totalMinutes = Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10)
  const adjusted = new Date(date.getTime() + (sign === '-' ? -totalMinutes : totalMinutes) * 60_000)
  return adjusted.toISOString().slice(11, 16)
}

const formatConcertBlockLabel = (concert: ConcertWithVenue) => {
  if (concert.block !== '공연') {
    return concert.block
  }

  if (concert.showTime) {
    return concert.showTime.toISOString().slice(11, 16)
  }

  if (concert.showTimeUTC) {
    if (concert.timeZone) {
      try {
        return new Intl.DateTimeFormat('en-GB', {
          timeZone: concert.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(concert.showTimeUTC)
      } catch {
        // fall through to other strategies
      }
    }

    if (concert.timeOffset) {
      const formatted = formatTimeFromOffset(concert.showTimeUTC, concert.timeOffset)
      if (formatted) {
        return formatted
      }
    }

    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(concert.showTimeUTC)
  }

  return concert.block
}

type DateGroup = {
  date: string
  day: string
  blocks: {
    block: string
    label: string
    id: number | null
    concertId: number
    hidden?: boolean | null
  }[]
}

export type VenueGroup = {
  venueName: string
  concerts: DateGroup[]
}

export const formatConcertDate = (date: Date, timeZone?: string | null) => {
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date)
    } catch {
      // fall back to UTC formatting if the timezone is invalid
    }
  }

  return date.toISOString().slice(0, 10)
}

const groupByDate = (concerts: ConcertWithVenue[]): DateGroup[] => {
  const map = new Map<string, { day: string; blocks: DateGroup['blocks'] }>()
  concerts.forEach((concert) => {
    const dateKey = formatConcertDate(concert.date, concert.timeZone)
    if (!map.has(dateKey)) {
      map.set(dateKey, { day: concert.day, blocks: [] })
    }
    map.get(dateKey)!.blocks.push({
      block: concert.block,
      label: formatConcertBlockLabel(concert),
      id: concert.setlistId,
      concertId: concert.id,
      hidden: concert.hidden ?? false,
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
    const key = concert.venue?.name ?? '미정'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(concert)
  })

  return [...map.entries()].map(([venueName, groupedConcerts]) => ({
    venueName,
    concerts: groupByDate(groupedConcerts),
  }))
}
