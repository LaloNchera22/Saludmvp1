import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = false; // mock state
  const userRole: string = 'guest'; // force string type to avoid 'always false' ts error

  if (pathname.startsWith('/paciente')) {
    if (!isAuthenticated || (userRole !== 'paciente' && userRole !== 'admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/paciente/:path*', '/admin/:path*'],
};
