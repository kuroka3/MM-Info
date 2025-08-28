import { NextResponse } from 'next/server'
import { runOptimize } from '@cm/cmo-run'

export async function POST(req: Request) {
  const body = await req.json()
  const { dayLabel, boothIds, mustIds, options } = body
  const result = runOptimize(dayLabel, { boothIds, mustIds, ...(options || {}) })
  return NextResponse.json(result)
}
