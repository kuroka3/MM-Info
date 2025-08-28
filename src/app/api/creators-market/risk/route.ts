import { NextResponse } from 'next/server'
import { runRisk } from '@cm/cmo-run'

export async function POST(req: Request){
  const body = await req.json()
  const result = runRisk(body.route, { trials: body.trials, cvWait: body.cvWait })
  return NextResponse.json(result)
}
