import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { concertInclude, serializeConcert } from './concert-utils'

export async function GET() {
  const concerts = await prisma.concert.findMany({
    orderBy: [
      { date: 'asc' },
      { block: 'asc' },
    ],
    include: concertInclude,
  })

  return NextResponse.json(concerts.map(serializeConcert))
}

type ConcertCreateBody = {
  title?: string
  date?: string
  day?: string
  block?: string
  venueId?: number
  setlistId?: number
  eventId?: number
  hidden?: boolean
  showTime?: string | null
  doorTime?: string | null
  vipTime?: string | null
  timeZone?: string | null
  timeOffset?: string | null
  showTimeUTC?: string | null
  doorTimeUTC?: string | null
  vipTimeUTC?: string | null
}

const parseTimeInput = (value?: string | null) => {
  if (!value) {
    return null
  }

  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  const candidates = [
    trimmed,
    `1970-01-01T${trimmed}`,
    `1970-01-01 ${trimmed}`,
  ]

  for (const candidate of candidates) {
    const parsed = new Date(candidate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

const parseDateTimeInput = (value?: string | null) => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

export async function POST(req: Request) {
  const body = (await req.json()) as ConcertCreateBody
  const {
    title,
    date,
    day,
    block,
    venueId,
    setlistId,
    eventId,
    hidden,
    showTime,
    doorTime,
    vipTime,
    timeZone,
    timeOffset,
    showTimeUTC,
    doorTimeUTC,
    vipTimeUTC,
  } = body

  if (!title || !date || !day || !block) {
    return NextResponse.json({ message: 'title, date, day, block are required' }, { status: 400 })
  }

  const data: Prisma.ConcertCreateInput = {
    title,
    date: new Date(date),
    day,
    block,
    hidden: hidden ?? false,
    showTime: parseTimeInput(showTime),
    doorTime: parseTimeInput(doorTime),
    vipTime: parseTimeInput(vipTime),
    timeZone: timeZone ?? null,
    timeOffset: timeOffset ?? null,
    showTimeUTC: parseDateTimeInput(showTimeUTC),
    doorTimeUTC: parseDateTimeInput(doorTimeUTC),
    vipTimeUTC: parseDateTimeInput(vipTimeUTC),
  }

  if (typeof venueId === 'number') {
    data.venue = { connect: { id: venueId } }
  }

  if (typeof eventId === 'number') {
    data.event = { connect: { id: eventId } }
  }

  if (typeof setlistId === 'number') {
    data.setlist = { connect: { id: setlistId } }
  }

  const concert = await prisma.concert.create({
    data,
    include: concertInclude,
  })

  return NextResponse.json(serializeConcert(concert), { status: 201 })
}
