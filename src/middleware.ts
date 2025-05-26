import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Skip authentication for login and public routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for protected routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    // For asset management, only allow ADMIN users to create, update, or delete
    if (request.nextUrl.pathname.startsWith('/api/assets')) {
      const isReadOperation = request.method === 'GET';
      const isAdminOperation = ['POST', 'PUT', 'DELETE'].includes(request.method);

      if (isAdminOperation && user.role !== 'ADMIN') {
        return new NextResponse(
          JSON.stringify({ error: 'Admin access required' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    // Add user info to request headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId.toString());
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-user-email', user.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 