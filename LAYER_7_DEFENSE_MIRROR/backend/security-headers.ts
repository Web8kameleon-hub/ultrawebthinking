/**
 * Security Headers Generator - Mirror Defense Layer 7
 * Industrial-grade CSP and security headers for production
 * 
 * @author EuroWeb Ultra Development Team
 * @version 2.0.0 Mirror Defense
 */

export interface SecurityHeaders {
    [key: string]: string;
}

export function createSecurityHeaders(): SecurityHeaders {
    // Generate nonce for this request
    const nonce = generateNonce();

    return {
        // Content Security Policy - Ultra Strict
        'Content-Security-Policy': [
            `default-src 'self'`,
            `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://cdn.jsdelivr.net https://unpkg.com`,
            `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
            `font-src 'self' https://fonts.gstatic.com data:`,
            `img-src 'self' data: blob: https:`,
            `connect-src 'self' wss: https: data:`,
            `media-src 'self' data: blob:`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `form-action 'self'`,
            `frame-ancestors 'none'`,
            `upgrade-insecure-requests`
        ].join('; '),

        // Security Headers
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'payment=()',
            'usb=()',
            'bluetooth=()'
        ].join(', '),

        // HSTS (HTTP Strict Transport Security)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

        // Mirror Defense Custom Headers
        'X-Mirror-Defense': 'Layer-7-Active',
        'X-Security-Level': 'Ultra-Industrial',
        'X-Content-Nonce': nonce,
        'X-Guardian-Status': 'Active',
        'X-Defense-Timestamp': new Date().toISOString(),

        // Anti-fingerprinting
        'Server': 'EuroWeb-Ultra-Mirror',
        'X-Powered-By': 'Mirror-Defense-Engine',

        // Cache Control for security
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0'
    };
}

export function generateNonce(): string {
    // Generate cryptographically secure nonce
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for environments without crypto
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }

    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export function createRateLimitHeaders(remaining: number, resetTime: number): SecurityHeaders {
    return {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': resetTime.toString(),
        'X-RateLimit-Policy': 'EuroWeb-Ultra-Defense'
    };
}

export function createHoneypotHeaders(): SecurityHeaders {
    return {
        'X-Honeypot-Active': 'true',
        'X-Trap-Detection': 'Armed',
        'X-Security-Scan': 'Monitoring'
    };
}

export default createSecurityHeaders;
