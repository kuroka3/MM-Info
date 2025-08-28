import { NextResponse } from 'next/server'
import { BOOTHS } from '@/data/exhibition/tokyo/creators-market/booths'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const day = searchParams.get('day')
  const booths = BOOTHS.filter(b => !('hidden' in b && b.hidden))
  const filtered = day ? booths.filter(b => b.dates?.includes(day)) : booths
  return NextResponse.json(filtered)
}
