import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ concertId: string }> }
) {
  try {
    const { concertId } = await params
    const id = Number.parseInt(concertId, 10)

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid concert ID' }, { status: 400 })
    }

    const concert = await prisma.concert.findFirst({
      where: {
        id,
        setlistId: { not: null },
      },
      include: {
        venue: true,
        event: {
          include: {
            series: true,
            songVariations: true,
          },
        },
        setlist: {
          include: {
            songs: {
              include: {
                song: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!concert) {
      return NextResponse.json({ error: 'Concert not found' }, { status: 404 })
    }

    const allEventConcertsWithVenues = await prisma.concert.findMany({
      where: {
        eventId: concert.eventId,
        setlistId: { not: null },
      },
      include: {
        venue: true,
        setlist: {
          include: {
            songs: {
              include: {
                song: true,
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: [{ date: 'asc' }, { block: 'asc' }],
    })

    return NextResponse.json(
      {
        concert,
        allEventConcerts: allEventConcertsWithVenues,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching concert:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
