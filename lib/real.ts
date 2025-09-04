/**
 * Real Services Mode - Zero Mock/Fake Policy
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

export const REAL_MODE = process.env.REAL_MODE === "1";

export function assertReal(service: string) {
  if (!REAL_MODE) {
    throw new Error(`[REAL_MODE OFF] ${service} not allowed without REAL_MODE=1`);
  }
}

export function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[ENV MISSING] ${name} environment variable required`);
  }
  return value;
}

// Detects and rejects fake/mock data
export function looksFake(data: unknown): boolean {
  const text = typeof data === "string" ? data : JSON.stringify(data ?? "");
  const fakePatterns = [
    /\b(mock|lorem|faker|placeholder|demo|sample|test|dummy)\b/i,
    /\b(example\.com|test\.com|demo\.com|localhost)\b/i,
    /\bfake\b/i,
    /\bdemo\b/i,
    /\bplaceholder\b/i
  ];
  
  return fakePatterns.some(pattern => pattern.test(text));
}

export function validateSearchResults(results: any[]): boolean {
  if (!Array.isArray(results) || results.length === 0) return false;
  
  return results.every(result => {
    // Must have real URL, title, and snippet
    const hasRequiredFields = result.url && result.title && result.snippet;
    if (!hasRequiredFields) return false;
    
    // Check if URL is real (not localhost, test domains, etc.)
    try {
      const url = new URL(result.url);
      const domain = url.hostname.toLowerCase();
      const fakeDomains = ['localhost', 'test.com', 'example.com', 'demo.com', '127.0.0.1'];
      if (fakeDomains.some(fake => domain.includes(fake))) return false;
    } catch {
      return false;
    }
    
    // Check if content looks fake
    return !looksFake(result.title) && !looksFake(result.snippet);
  });
}

export class RealServiceError extends Error {
  constructor(service: string, reason: string) {
    super(`[REAL SERVICE ERROR] ${service}: ${reason}`);
    this.name = 'RealServiceError';
  }
}
