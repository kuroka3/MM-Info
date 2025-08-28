import { NextResponse } from 'next/server'
import { runOptimize } from '@cm/cmo-run'

export async function POST(req: Request){
  const body = await req.json()
  const { dayLabel, options } = body
  const result = runOptimize(dayLabel, options)
  return NextResponse.json(result)
}
