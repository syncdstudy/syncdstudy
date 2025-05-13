// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/calendar/:path*',
    '/study-session/:path*',
    '/profile/:path*', // ← add this
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get('supabase-auth-token')?.value
    || req.cookies.get('sb-access-token')?.value;

  if (!token) {
    url.pathname = '/auth/signin';
    url.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
