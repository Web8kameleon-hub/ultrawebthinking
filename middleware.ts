import { NextRequest, NextResponse } from 'next/server';
import { guardianMiddleware } from './lib/guardian-middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

// Create i18n middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  // Skip Guardian for static assets and specific paths
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/_') ||
    pathname === '/guardian' // Allow access to Guardian panel
  ) {
    return NextResponse.next();
  }

  // Apply Guardian security checks first
  const guardianResponse = guardianMiddleware(request);
  if (guardianResponse) {
    return guardianResponse;
  }

  // Apply i18n middleware for localization
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};