import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;
  const role = token?.role;

  if (pathname.startsWith('/admin') || pathname === '/dashboard') {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/technician') || pathname === '/my-tasks') {
    if (role !== 'technician') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/subscriber') || pathname === '/my-account') {
    if (role !== 'subscriber') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/shared')) {
    return NextResponse.redirect(
      new URL(
        role === 'subscriber'
          ? '/subscriber/help'
          : role === 'technician'
          ? '/technician/my-tasks'
          : '/admin/notifications',
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/technician/:path*',
    '/subscriber/:path*',
    '/shared/:path*',
    '/dashboard',
    '/my-tasks',
    '/my-account',
  ],
};
