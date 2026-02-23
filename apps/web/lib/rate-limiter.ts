/**
 * Edge-Compatible Rate Limiter
 * Simple in-memory rate limiting for Edge Runtime
 * 
 * @author EuroWeb Ultra Defense Team
 * @version 2.0.0 Mirror Defense
 */

interface RateLimitInfo {
    count: number;
    resetTime: number;
    firstRequest: number;
}

// In-memory storage compatible with Edge Runtime
const rateLimitMap = new Map<string, RateLimitInfo>();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 50; // 50 requests per minute

export function checkRateLimit(ip: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
} {
    const now = Date.now();
    const key = `ratelimit:${ip}`;

    // Get or create rate limit info
    let rateLimitInfo = rateLimitMap.get(key);

    if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
        // Create new window
        rateLimitInfo = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
            firstRequest: now
        };
        rateLimitMap.set(key, rateLimitInfo);

        return {
            allowed: true,
            remaining: RATE_LIMIT_MAX_REQUESTS - 1,
            resetTime: rateLimitInfo.resetTime
        };
    }

    // Increment count
    rateLimitInfo.count++;

    // Check if limit exceeded
    if (rateLimitInfo.count > RATE_LIMIT_MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetTime: rateLimitInfo.resetTime
        };
    }

    return {
        allowed: true,
        remaining: RATE_LIMIT_MAX_REQUESTS - rateLimitInfo.count,
        resetTime: rateLimitInfo.resetTime
    };
}

export function cleanupRateLimits(): void {
    const now = Date.now();

    // Clean expired rate limits
    for (const [key, info] of rateLimitMap.entries()) {
        if (now > info.resetTime) {
            rateLimitMap.delete(key);
        }
    }

    // Prevent memory leaks - keep only latest 1000 IPs
    if (rateLimitMap.size > 1000) {
        const entries = Array.from(rateLimitMap.entries());
        const toDelete = entries.slice(0, entries.length - 1000);
        toDelete.forEach(([key]) => rateLimitMap.delete(key));
    }
}

// Auto cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

export default checkRateLimit;
