import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { concertInclude, serializeConcert } from '@/app/api/concerts/concert-utils'

type Params = {
  params: {
    slug: string
  }
}

export async function GET(_req: Request, { params }: Params) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      series: true,
      concerts: {
        orderBy: [
          { date: 'asc' },
          { block: 'asc' },
        ],
        include: concertInclude,
      },
    },
  })

  if (!event) {
    return NextResponse.json({ message: 'Event not found' }, { status: 404 })
  }

  return NextResponse.json({
    event: {
      id: event.id,
      name: event.name,
      year: event.year,
      slug: event.slug,
      series: event.series
        ? {
            id: event.series.id,
            name: event.series.name,
            slug: event.series.slug,
          }
        : null,
    },
    concerts: event.concerts.map(serializeConcert),
  })
}
