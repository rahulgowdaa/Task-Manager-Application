import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware - Requested URL:', request.url)
  return NextResponse.next()
}

export const config = {
  matcher: ['/signup', '/login'],
} 