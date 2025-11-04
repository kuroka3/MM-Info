import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const seriesList = await prisma.series.findMany({
    include: {
      events: {
        include: {
          _count: {
            select: { concerts: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  const payload = seriesList.map((series) => ({
    id: series.id,
    name: series.name,
    slug: series.slug,
    note: series.note,
    eventCount: series.events.length,
    concertCount: series.events.reduce((total, event) => total + event._count.concerts, 0),
  }))

  return NextResponse.json(payload)
}
