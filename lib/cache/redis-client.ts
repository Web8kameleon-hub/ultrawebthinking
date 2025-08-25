import { Redis } from 'ioredis';

// Redis Client Configuration
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  connectTimeout: number;
  commandTimeout: number;
}

class RedisClient {
  private client: Redis | null = null;
  private isConnected: boolean = false;

  private config: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    commandTimeout: 5000,
  };

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.client = new Redis(this.config);
      
      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis connection error:', error);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('🔌 Redis connection closed');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to initialize Redis client:', error);
      this.isConnected = false;
    }
  }

  // Generic Cache Operations
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.client || !this.isConnected) return null;
      
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`❌ Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) return false;
      
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      console.error(`❌ Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string | string[]): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) return false;
      
      if (Array.isArray(key)) {
        await this.client.del(...key);
      } else {
        await this.client.del(key);
      }
      return true;
    } catch (error) {
      console.error(`❌ Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) return false;
      
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  // AGI-Specific Cache Methods
  async cacheAGIResponse(endpoint: string, params: Record<string, any>, response: any, ttl: number = 1800): Promise<void> {
    const cacheKey = `agi:${endpoint}:${this.hashParams(params)}`;
    await this.set(cacheKey, {
      response,
      timestamp: Date.now(),
      params
    }, ttl);
  }

  async getAGICachedResponse(endpoint: string, params: Record<string, any>): Promise<any | null> {
    const cacheKey = `agi:${endpoint}:${this.hashParams(params)}`;
    return await this.get(cacheKey);
  }

  // Language-specific Cache
  async cacheTranslation(text: string, from: string, to: string, translation: string): Promise<void> {
    const cacheKey = `translation:${from}:${to}:${this.hashText(text)}`;
    await this.set(cacheKey, translation, 86400); // 24 hours
  }

  async getTranslation(text: string, from: string, to: string): Promise<string | null> {
    const cacheKey = `translation:${from}:${to}:${this.hashText(text)}`;
    return await this.get(cacheKey);
  }

  // Analytics Cache
  async cacheAnalytics(type: string, timeframe: string, data: any): Promise<void> {
    const cacheKey = `analytics:${type}:${timeframe}`;
    await this.set(cacheKey, data, 900); // 15 minutes
  }

  async getAnalytics(type: string, timeframe: string): Promise<any | null> {
    const cacheKey = `analytics:${type}:${timeframe}`;
    return await this.get(cacheKey);
  }

  // User Session Cache
  async cacheUserSession(userId: string, sessionData: any): Promise<void> {
    const cacheKey = `session:${userId}`;
    await this.set(cacheKey, sessionData, 7200); // 2 hours
  }

  async getUserSession(userId: string): Promise<any | null> {
    const cacheKey = `session:${userId}`;
    return await this.get(cacheKey);
  }

  // Cache Statistics
  async getCacheStats(): Promise<Record<string, any>> {
    try {
      if (!this.client || !this.isConnected) return {};
      
      const info = await this.client.info('memory');
      const dbSize = await this.client.dbsize();
      
      return {
        connected: this.isConnected,
        dbSize,
        memory: this.parseRedisInfo(info),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Redis stats error:', error);
      return { connected: false };
    }
  }

  // Utility Methods
  private hashParams(params: Record<string, any>): string {
    const sorted = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, any>);
    
    return Buffer.from(JSON.stringify(sorted)).toString('base64').slice(0, 16);
  }

  private hashText(text: string): string {
    return Buffer.from(text).toString('base64').slice(0, 16);
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    info.split('\r\n').forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    });
    return result;
  }

  // Cleanup
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
    }
  }

  // Health Check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.client || !this.isConnected) return false;
      
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('❌ Redis health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const redisClient = new RedisClient();
export default redisClient;
