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
}

export async function POST(req: Request) {
  const body = (await req.json()) as ConcertCreateBody
  const { title, date, day, block, venueId, setlistId, eventId, hidden } = body

  if (!title || !date || !day || !block) {
    return NextResponse.json({ message: 'title, date, day, block are required' }, { status: 400 })
  }

  const data: Prisma.ConcertCreateInput = {
    title,
    date,
    day,
    block,
    hidden: hidden ?? false,
  }

  if (typeof venueId === 'number') {
    data.Venue = { connect: { id: venueId } }
  }

  if (typeof setlistId === 'number') {
    data.setlist = { connect: { id: setlistId } }
  }

  if (typeof eventId === 'number') {
    data.event = { connect: { id: eventId } }
  }

  const concert = await prisma.concert.create({
    data,
    include: concertInclude,
  })

  return NextResponse.json(serializeConcert(concert), { status: 201 })
}
