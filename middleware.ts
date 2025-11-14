import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? ''

  if (
    host === 'mm-info.vercel.app' ||
    host === 'www.mm-info.vercel.app' ||
    host === 'mm-info.miku.kr' ||
    host === 'www.mm-info.miku.kr'
  ) {
    const url = new URL(req.url)
    url.hostname = 'voca-info.vercel.app'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
