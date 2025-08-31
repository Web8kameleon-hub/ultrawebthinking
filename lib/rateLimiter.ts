/**
 * EuroWeb Ultra Rate Limiter
 * Protects API endpoints from abuse
 * @author Ledjan Ahmati
 */

interface RateLimitConfig {
  windowMs: number;        // Time window in milliseconds
  maxRequests: number;     // Max requests per window
  message?: string;        // Error message when limit exceeded
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests = new Map<string, RequestRecord>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Too many requests, please try again later.',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config
    };

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  isAllowed(identifier: string): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // First request or window expired, create new record
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      
      return {
        allowed: true,
        resetTime: now + this.config.windowMs,
        remaining: this.config.maxRequests - 1
      };
    }

    if (record.count >= this.config.maxRequests) {
      // Limit exceeded
      return {
        allowed: false,
        resetTime: record.resetTime,
        remaining: 0
      };
    }

    // Increment count
    record.count++;
    this.requests.set(identifier, record);

    return {
      allowed: true,
      resetTime: record.resetTime,
      remaining: this.config.maxRequests - record.count
    };
  }

  recordRequest(identifier: string, success: boolean): void {
    if (this.config.skipSuccessfulRequests && success) return;
    if (this.config.skipFailedRequests && !success) return;

    // Request counting is handled in isAllowed
    // This method is for additional tracking if needed
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  getStats(): { totalClients: number; activeWindows: number } {
    const now = Date.now();
    let activeWindows = 0;

    for (const record of this.requests.values()) {
      if (now <= record.resetTime) {
        activeWindows++;
      }
    }

    return {
      totalClients: this.requests.size,
      activeWindows
    };
  }

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

// Predefined limiters for different endpoints
export const rateLimiters = {
  // General API - 100 requests per minute
  general: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'Too many requests to API. Please wait before trying again.'
  }),

  // Chat API - 30 requests per minute (more restrictive due to AI processing)
  chat: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many chat requests. Please wait before sending another message.'
  }),

  // Search API - 60 requests per minute
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Too many search requests. Please wait before searching again.'
  }),

  // Auth API - 10 requests per minute (very restrictive)
  auth: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many authentication attempts. Please wait before trying again.'
  }),

  // File upload - 5 requests per minute
  upload: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many upload attempts. Please wait before uploading again.'
  })
};

// Helper function to get client identifier
export function getClientIdentifier(req: any): string {
  // Try to get real IP from various headers
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;

  let ip = '';
  
  if (forwarded) {
    ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0];
  } else if (realIp) {
    ip = realIp as string;
  } else if (remoteAddress) {
    ip = remoteAddress;
  } else {
    ip = 'unknown';
  }

  // Clean up IPv6 mapped IPv4 addresses
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return ip;
}

// Middleware factory for Next.js API routes
export function createRateLimit(limiter: RateLimiter) {
  return function rateLimit(req: any, res: any, next?: () => void): boolean {
    const identifier = getClientIdentifier(req);
    const result = limiter.isAllowed(identifier);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', limiter['config'].maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining || 0);
    
    if (result.resetTime) {
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));
    }

    if (!result.allowed) {
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: limiter['config'].message,
        retryAfter: result.resetTime ? Math.ceil((result.resetTime - Date.now()) / 1000) : 60
      });
      return false;
    }

    if (next) next();
    return true;
  };
}

export { RateLimiter };
export default RateLimiter;
