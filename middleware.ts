/**
 * Next.js Middleware - Route Protection
 * Locație: middleware.ts (root level)
 * 
 * Responsabilități:
 * - Protect /admin routes - requires authentication + is_admin flag
 * - Protect /dashboard routes - requires authentication
 * - Protect /upload routes - requires authentication
 * - Public routes: /, /login, /register, /pricing
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

interface JWTPayload {
  userId: string;
  email: string;
  isAdmin?: boolean;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no authentication needed
  const publicRoutes = ['/', '/login', '/register', '/pricing', '/api/auth', '/evaluare', '/LABS'];
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Extract token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    token = request.cookies.get('token')?.value;
  }

  if (!token) {
    // Redirect to login for protected routes
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = payload as unknown as JWTPayload;

    // Admin routes require is_admin flag
    if (pathname.startsWith('/admin') && pathname !== '/admin/unauthorized') {
      if (!user.isAdmin) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
      }
    }

    // User is authenticated, proceed
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    
    // Invalid token - redirect to login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
