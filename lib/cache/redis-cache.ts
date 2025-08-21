// Redis Caching System for EuroWeb Ultra - TypeScript
// High-performance caching for AGI responses

import Redis from 'ioredis';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  version?: string;
  compress?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalOperations: number;
  avgResponseTime: number;
}

class EuroWebCache {
  private redis: Redis;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalOperations: 0,
    avgResponseTime: 0
  };
  private responseTimes: number[] = [];
  private readonly defaultTTL = 300; // 5 minutes
  private readonly version = '2.0.0';

  constructor() {
    // Initialize Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      family: 4,
      keyPrefix: 'euroweb:',
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      console.log('🔗 Redis connected successfully');
    });

    this.redis.on('error', (error: Error) => {
      console.error('❌ Redis connection error:', error);
    });

    this.redis.on('ready', () => {
      console.log('✅ Redis ready for operations');
    });

    this.redis.on('close', () => {
      console.log('🔒 Redis connection closed');
    });
  }

  // AGI-specific cache methods
  async cacheAGIResponse<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl || this.defaultTTL,
        version: options.version || this.version
      };

      const serializedData = options.compress 
        ? await this.compressData(JSON.stringify(entry))
        : JSON.stringify(entry);

      await this.redis.setex(
        `agi:${key}`,
        options.ttl || this.defaultTTL,
        serializedData
      );

      this.updateStats(Date.now() - startTime);
      console.log(`✅ Cached AGI response: agi:${key}`);
    } catch (error) {
      console.error(`❌ Failed to cache AGI response ${key}:`, error);
    }
  }

  async getAGIResponse<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      const cached = await this.redis.get(`agi:${key}`);
      
      if (!cached) {
        this.stats.misses++;
        this.updateStats(Date.now() - startTime);
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if cache entry is still valid
      if (this.isExpired(entry)) {
        await this.redis.del(`agi:${key}`);
        this.stats.misses++;
        this.updateStats(Date.now() - startTime);
        return null;
      }

      this.stats.hits++;
      this.updateStats(Date.now() - startTime);
      console.log(`🎯 Cache hit for AGI response: agi:${key}`);
      
      return entry.data;
    } catch (error) {
      console.error(`❌ Failed to get AGI response ${key}:`, error);
      this.stats.misses++;
      this.updateStats(Date.now() - startTime);
      return null;
    }
  }

  // Multi-language caching
  async cacheTranslation(
    locale: string,
    namespace: string,
    data: Record<string, any>,
    options: CacheOptions = {}
  ): Promise<void> {
    const key = `translation:${locale}:${namespace}`;
    
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl || 3600, // 1 hour for translations
        version: options.version || this.version
      };

      await this.redis.setex(
        key,
        options.ttl || 3600,
        JSON.stringify(entry)
      );

      console.log(`🌍 Cached translation: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to cache translation ${key}:`, error);
    }
  }

  async getTranslation(
    locale: string,
    namespace: string
  ): Promise<Record<string, any> | null> {
    const key = `translation:${locale}:${namespace}`;
    
    try {
      const cached = await this.redis.get(key);
      
      if (!cached) {
        return null;
      }

      const entry: CacheEntry = JSON.parse(cached);
      
      if (this.isExpired(entry)) {
        await this.redis.del(key);
        return null;
      }

      console.log(`🌍 Translation cache hit: ${key}`);
      return entry.data;
    } catch (error) {
      console.error(`❌ Failed to get translation ${key}:`, error);
      return null;
    }
  }

  // Session and user-specific caching
  async cacheUserSession(
    userId: string,
    sessionData: any,
    ttl: number = 1800 // 30 minutes
  ): Promise<void> {
    const key = `session:${userId}`;
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(sessionData));
      console.log(`👤 Cached user session: ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to cache session ${userId}:`, error);
    }
  }

  async getUserSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error(`❌ Failed to get session ${userId}:`, error);
      return null;
    }
  }

  // Bulk operations for performance
  async cacheBulkAGIResponses(
    entries: Array<{ key: string; data: any; options?: CacheOptions }>
  ): Promise<void> {
    const pipeline = this.redis.pipeline();
    
    entries.forEach(({ key, data, options = {} }) => {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl || this.defaultTTL,
        version: options.version || this.version
      };

      pipeline.setex(
        `agi:${key}`,
        options.ttl || this.defaultTTL,
        JSON.stringify(entry)
      );
    });

    try {
      await pipeline.exec();
      console.log(`✅ Bulk cached ${entries.length} AGI responses`);
    } catch (error) {
      console.error('❌ Failed to bulk cache AGI responses:', error);
    }
  }

  async getBulkAGIResponses<T>(keys: string[]): Promise<Record<string, T | null>> {
    const pipeline = this.redis.pipeline();
    
    keys.forEach(key => {
      pipeline.get(`agi:${key}`);
    });

    try {
      const results = await pipeline.exec();
      const responses: Record<string, T | null> = {};

      results?.forEach((result: [Error | null, unknown], index: number) => {
        const key = keys[index];
        const [error, cached] = result;
        
        if (!error && cached && typeof cached === 'string') {
          try {
            const entry: CacheEntry<T> = JSON.parse(cached);
            responses[key] = this.isExpired(entry) ? null : entry.data;
          } catch {
            responses[key] = null;
          }
        } else {
          responses[key] = null;
        }
      });

      return responses;
    } catch (error) {
      console.error('❌ Failed to bulk get AGI responses:', error);
      return {};
    }
  }

  // Cache invalidation
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(`*${pattern}*`);
      
      if (keys.length === 0) {
        return 0;
      }

      const deleted = await this.redis.del(...keys);
      console.log(`🗑️ Invalidated ${deleted} cache entries matching: ${pattern}`);
      
      return deleted;
    } catch (error) {
      console.error(`❌ Failed to invalidate pattern ${pattern}:`, error);
      return 0;
    }
  }

  async invalidateAGICache(): Promise<number> {
    return this.invalidatePattern('agi:');
  }

  async invalidateTranslationCache(): Promise<number> {
    return this.invalidatePattern('translation:');
  }

  // Cache analytics and monitoring
  getStats(): CacheStats {
    this.stats.totalOperations = this.stats.hits + this.stats.misses;
    this.stats.hitRate = this.stats.totalOperations > 0 
      ? (this.stats.hits / this.stats.totalOperations) * 100 
      : 0;
    
    this.stats.avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    return { ...this.stats };
  }

  async getCacheInfo(): Promise<any> {
    try {
      const info = await this.redis.info('memory');
      const dbsize = await this.redis.dbsize();
      
      return {
        ...this.getStats(),
        memoryInfo: info,
        totalKeys: dbsize,
        redisVersion: await this.redis.info('server')
      };
    } catch (error) {
      console.error('❌ Failed to get cache info:', error);
      return this.getStats();
    }
  }

  // Utility methods
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > (entry.ttl * 1000);
  }

  private updateStats(responseTime: number): void {
    this.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times for average calculation
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  private async compressData(data: string): Promise<string> {
    // Simple compression implementation
    // In production, use a proper compression library
    return Buffer.from(data).toString('base64');
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
      console.log('✅ Redis connection closed gracefully');
    } catch (error) {
      console.error('❌ Failed to close Redis connection:', error);
    }
  }
}

// Singleton instance
export const euroWebCache = new EuroWebCache();

// Express middleware for caching
export function cacheMiddleware(ttl: number = 300) {
  return async (req: any, res: any, next: any) => {
    const cacheKey = `route:${req.method}:${req.originalUrl}`;
    
    try {
      const cached = await euroWebCache.getAGIResponse(cacheKey);
      
      if (cached) {
        console.log(`🎯 Route cache hit: ${cacheKey}`);
        return res.json(cached);
      }
      
      // Store original json method
      const originalJson = res.json;
      
      // Override json method to cache response
      res.json = function(data: any) {
        euroWebCache.cacheAGIResponse(cacheKey, data, { ttl });
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('❌ Cache middleware error:', error);
      next();
    }
  };
}

export default EuroWebCache;
