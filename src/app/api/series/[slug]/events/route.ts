import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

type Params = {
  params: {
    slug: string
  }
}

export async function GET(_req: Request, { params }: Params) {
  const series = await prisma.series.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        orderBy: [{ year: 'desc' }, { name: 'asc' }],
        include: {
          _count: { select: { concerts: true } },
        },
      },
    },
  })

  if (!series) {
    return NextResponse.json({ message: 'Series not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: series.id,
    name: series.name,
    slug: series.slug,
    events: series.events.map((event) => ({
      id: event.id,
      name: event.name,
      year: event.year,
      slug: event.slug,
      concertCount: event._count.concerts,
    })),
  })
}
