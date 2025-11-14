import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const songs = await prisma.song.findMany({
      where: {
        slug: { not: null },
        videoId: { not: null },
        OR: [
          { setlists: { some: {} } },
          { eventVariations: { some: { eventId: event.id } } },
        ],
      },
      include: {
        setlists: {
          select: { order: true },
          take: 1,
        },
        eventVariations: {
          where: { eventId: event.id },
        },
      },
      orderBy: [{ slug: 'asc' }],
    })

    return NextResponse.json(
      { songs },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
