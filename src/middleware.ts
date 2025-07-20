import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Handle Socket.IO upgrade requests
  if (request.headers.get('upgrade') === 'websocket') {
    const socketAuth = request.headers.get('socket-auth');
    if (!socketAuth) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    try {
      await verifyJWT(socketAuth);
      return NextResponse.next();
    } catch (error) {
      return new NextResponse('Invalid token', { status: 401 });
    }
  }

  // Protected API routes
  if (request.nextUrl.pathname.startsWith('/api') && 
      !request.nextUrl.pathname.startsWith('/api/auth')) {
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    try {
      await verifyJWT(token);
      return NextResponse.next();
    } catch (error) {
      return new NextResponse('Invalid token', { status: 401 });
    }
  }

  // Protected pages
  const protectedPaths = ['/dashboard', '/messages', '/bookings', '/settings'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      await verifyJWT(token);
      return NextResponse.next();
    } catch (error) {
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/messages/:path*',
    '/bookings/:path*',
    '/settings/:path*',
  ],
}; 