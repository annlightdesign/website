import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Exclude auth endpoints from intl
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  if (pathname.includes('/admin') && !pathname.includes('/login')) {
    const token = req.cookies.get('adminToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/he/admin/login', req.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'v3ry_s3cur3_s3cr3t');
      await jwtVerify(token, secret);
    } catch (err) {
      return NextResponse.redirect(new URL('/he/admin/login', req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)']
};
