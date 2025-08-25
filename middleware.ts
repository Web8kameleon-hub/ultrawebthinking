import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createRateLimitHeaders, createSecurityHeaders } from './LAYER_7_DEFENSE_MIRROR/backend/security-headers';
import { guardianMiddleware } from './lib/guardian-middleware';
import { routing } from './lib/i18n/routing';
import { checkRateLimit } from './lib/rate-limiter';

// Create i18n middleware
const intlMiddleware = createMiddleware(routing);

function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) { return cfConnectingIP; }
  if (realIP) { return realIP; }
  if (forwardedFor) { return forwardedFor.split(',')[0].trim(); }

  return request.ip ?? 'unknown';
}

export function middleware(_request: NextRequest) {
  const { pathname } = _request.nextUrl;
  const clientIP = getClientIP(_request);

  // Check rate limit for all requests
  const rateLimitResult = checkRateLimit(clientIP);

  // Skip security for static assets but apply headers
  if (
    pathname.startsWith('/_next/') ??
    pathname.startsWith('/favicon.ico')
  ) {
    const response = NextResponse.next();

    // Add security headers even for static assets
    const headers = createSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });

    // Add rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(
      rateLimitResult.remaining,
      rateLimitResult.resetTime
    );
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });

    return response;
  }

  // Rate limit check - block if exceeded
  if (!rateLimitResult.allowed) {
    const response = new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Add security headers to rate limit response
    const headers = createSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });

    response.headers.set('Retry-After', Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString());

    return response;
  }

  // Skip Guardian for API routes but add headers
  if (
    pathname.startsWith('/api/') ??
    pathname.startsWith('/api/_') ??
    pathname === '/guardian'
  ) {
    const response = NextResponse.next();

    // Add security headers for API routes
    const headers = createSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });

    // Add rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(
      rateLimitResult.remaining,
      rateLimitResult.resetTime
    );
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });

    return response;
  }

  // Apply Guardian security checks
  const guardianResponse = guardianMiddleware(request);
  if (guardianResponse) {
    // Add security headers to blocked responses
    const headers = createSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => {
      guardianResponse.headers.set(key, value as string);
    });
    return guardianResponse;
  }

  // Apply i18n middleware for localization
  const response = intlMiddleware(request);

  // Add security headers to all responses
  const headers = createSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value as string);
  });

  // Add rate limit headers
  const rateLimitHeaders = createRateLimitHeaders(
    rateLimitResult.remaining,
    rateLimitResult.resetTime
  );
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value as string);
  });

  // Add honeypot detection header
  response.headers.set('X-Honeypot-Active', 'true');
  response.headers.set('X-Defense-Layer', 'Mirror-Guardian-Ultra');

  return response;
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};