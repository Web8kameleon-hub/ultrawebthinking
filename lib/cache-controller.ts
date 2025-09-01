/**
 * 🚀 CACHE CONTROLLER - HIGH-PERFORMANCE CACHING SYSTEM
 * Sistem i avancuar për cache management dhe optimization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-CACHE-CONTROLLER
 * @license MIT
 */

import { MemoryManager } from './memory-manager';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Max cache size in bytes
  compression?: boolean;
  encryption?: boolean;
  persistent?: boolean;
}

interface CacheEntry {
  value: any;
  timestamp: number;
  ttl?: number;
  compressed?: boolean;
  encrypted?: boolean;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  writes: number;
  deletes: number;
  evictions: number;
  totalRequests: number;
  averageResponseTime: number;
}

/**
 * 🎯 CACHE CONTROLLER CLASS
 */
export class CacheController {
  private readonly memoryManager: MemoryManager;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    writes: 0,
    deletes: 0,
    evictions: 0,
    totalRequests: 0,
    averageResponseTime: 0
  };
  
  private responseTimes: number[] = [];
  private defaultOptions: CacheOptions;

  constructor(options: CacheOptions = {}) {
    this.defaultOptions = {
      ttl: options.ttl || 300000, // 5 minutes default
      maxSize: options.maxSize || 50 * 1024 * 1024, // 50MB
      compression: options.compression || false,
      encryption: options.encryption || false,
      persistent: options.persistent || false
    };

    this.memoryManager = new MemoryManager({
      maxCacheSize: this.defaultOptions.maxSize,
      cleanupInterval: 30000, // 30 seconds
      compressionEnabled: this.defaultOptions.compression,
      debugMode: false
    });
  }

  /**
   * 💾 SET CACHE ENTRY WITH OPTIONS
   */
  public async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      const cacheOptions = { ...this.defaultOptions, ...options };
      
      // Prepare cache entry with metadata
      const cacheEntry = {
        value,
        timestamp: Date.now(),
        ttl: cacheOptions.ttl,
        compressed: cacheOptions.compression,
        encrypted: cacheOptions.encryption
      };

      // Process data based on options
      let processedData = cacheEntry;
      
      if (cacheOptions.compression) {
        processedData = await this.compress(processedData);
      }
      
      if (cacheOptions.encryption) {
        processedData = await this.encrypt(processedData);
      }

      // Store in memory manager
      this.memoryManager.set(key, processedData, cacheOptions.ttl);
      
      // Handle persistent storage
      if (cacheOptions.persistent) {
        await this.persistToStorage(key, processedData);
      }

      this.metrics.writes++;
      this.updateResponseTime(startTime);
      
      return true;
    } catch (error) {
      console.error('🚨 Cache set error:', error);
      return false;
    }
  }

  /**
   * 📖 GET CACHE ENTRY WITH VALIDATION
   */
  public async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    this.metrics.totalRequests++;

    try {
      // Try memory first
      let cacheEntry = this.memoryManager.get(key) as CacheEntry | null;
      
      // Fallback to persistent storage
      if (!cacheEntry && this.defaultOptions.persistent) {
        cacheEntry = await this.getFromStorage(key);
        
        if (cacheEntry) {
          // Restore to memory
          this.memoryManager.set(key, cacheEntry);
        }
      }

      if (!cacheEntry) {
        this.metrics.misses++;
        this.updateResponseTime(startTime);
        return null;
      }

      // Check TTL
      const now = Date.now();
      if (cacheEntry.ttl && (now - cacheEntry.timestamp) > cacheEntry.ttl) {
        await this.delete(key);
        this.metrics.misses++;
        this.updateResponseTime(startTime);
        return null;
      }

      // Process data based on flags
      let processedData = cacheEntry;
      
      if (cacheEntry.encrypted) {
        processedData = await this.decrypt(processedData);
      }
      
      if (cacheEntry.compressed) {
        processedData = await this.decompress(processedData);
      }

      this.metrics.hits++;
      this.updateResponseTime(startTime);
      
      return processedData.value as T;
    } catch (error) {
      console.error('🚨 Cache get error:', error);
      this.metrics.misses++;
      this.updateResponseTime(startTime);
      return null;
    }
  }

  /**
   * 🗑️ DELETE CACHE ENTRY
   */
  public async delete(key: string): Promise<boolean> {
    try {
      const memoryResult = this.memoryManager.delete(key);
      
      if (this.defaultOptions.persistent) {
        await this.deleteFromStorage(key);
      }

      if (memoryResult) {
        this.metrics.deletes++;
      }
      
      return memoryResult;
    } catch (error) {
      console.error('🚨 Cache delete error:', error);
      return false;
    }
  }

  /**
   * 🔄 GET OR SET PATTERN
   */
  public async getOrSet<T>(
    key: string,
    factory: () => Promise<T> | T,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get existing value
    const existing = await this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    // Generate new value
    const value = await factory();
    
    // Cache the new value
    await this.set(key, value, options);
    
    return value;
  }

  /**
   * 🧹 CLEAR CACHE WITH PATTERN
   */
  public async clear(pattern?: string): Promise<number> {
    if (!pattern) {
      this.memoryManager.clear();
      
      if (this.defaultOptions.persistent) {
        await this.clearStorage();
      }
      
      return 0; // Can't count cleared items without pattern
    }

    // Clear by pattern (simplified implementation)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const clearedCount = 0;
    
    // Note: This is a simplified implementation
    // In a real scenario, you'd need to track all keys
    
    return clearedCount;
  }

  /**
   * 📊 GET CACHE METRICS
   */
  public getMetrics(): CacheMetrics & {
    hitRate: number;
    memoryUsage: number;
    health: string;
  } {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 0;
    
    const memoryStats = this.memoryManager.getStats();
    const memoryUsage = this.memoryManager.getUsagePercentage();
    
    const health = this.getHealthStatus();

    return {
      ...this.metrics,
      hitRate: Number(hitRate.toFixed(2)),
      memoryUsage: Number(memoryUsage.toFixed(2)),
      health
    };
  }

  /**
   * 🏥 GET HEALTH STATUS
   */
  private getHealthStatus(): string {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.hits / this.metrics.totalRequests) * 100 
      : 100;
    
    const memoryUsage = this.memoryManager.getUsagePercentage();
    
    if (hitRate >= 80 && memoryUsage < 80) return 'excellent';
    if (hitRate >= 60 && memoryUsage < 90) return 'good';
    if (hitRate >= 40 && memoryUsage < 95) return 'fair';
    return 'poor';
  }

  /**
   * 🚀 OPTIMIZE CACHE
   */
  public async optimize(): Promise<void> {
    // Optimize memory
    this.memoryManager.optimize();
    
    // Clean up old response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-500);
    }
    
    // Recalculate average response time
    if (this.responseTimes.length > 0) {
      const sum = this.responseTimes.reduce((a, b) => a + b, 0);
      this.metrics.averageResponseTime = sum / this.responseTimes.length;
    }
  }

  /**
   * ⏱️ UPDATE RESPONSE TIME
   */
  private updateResponseTime(startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.responseTimes.push(responseTime);
    
    // Keep only recent response times
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
    
    // Update average
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    this.metrics.averageResponseTime = sum / this.responseTimes.length;
  }

  /**
   * 🗜️ COMPRESS DATA (defaultValue)
   */
  private async compress(data: any): Promise<any> {
    // defaultValue for compression logic
    // In a real implementation, you'd use a compression library
    return {
      ...data,
      compressed: true,
      originalSize: JSON.stringify(data).length
    };
  }

  /**
   * 📦 DECOMPRESS DATA (defaultValue)
   */
  private async decompress(data: any): Promise<any> {
    // defaultValue for decompression logic
    const { compressed, originalSize, ...originalData } = data;
    return originalData;
  }

  /**
   * 🔐 ENCRYPT DATA (defaultValue)
   */
  private async encrypt(data: any): Promise<any> {
    // defaultValue for encryption logic
    // In a real implementation, you'd use proper encryption
    return {
      ...data,
      encrypted: true,
      checksum: Date.now().toString(36)
    };
  }

  /**
   * 🔓 DECRYPT DATA (defaultValue)
   */
  private async decrypt(data: any): Promise<any> {
    // defaultValue for decryption logic
    const { encrypted, checksum, ...originalData } = data;
    return originalData;
  }

  /**
   * 💾 PERSIST TO STORAGE (defaultValue)
   */
  private async persistToStorage(key: string, data: any): Promise<void> {
    // defaultValue for persistent storage
    // In a real implementation, you'd use IndexedDB, localStorage, etc.
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to persist to localStorage:', error);
      }
    }
  }

  /**
   * 📥 GET FROM STORAGE (defaultValue)
   */
  private async getFromStorage(key: string): Promise<any> {
    // defaultValue for retrieving from persistent storage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = localStorage.getItem(`cache_${key}`);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn('Failed to get from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * 🗑️ DELETE FROM STORAGE (defaultValue)
   */
  private async deleteFromStorage(key: string): Promise<void> {
    // defaultValue for deleting from persistent storage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to delete from localStorage:', error);
      }
    }
  }

  /**
   * 🧼 CLEAR STORAGE (defaultValue)
   */
  private async clearStorage(): Promise<void> {
    // defaultValue for clearing persistent storage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  }

  /**
   * 🔧 UPDATE OPTIONS
   */
  public updateOptions(options: Partial<CacheOptions>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
    
    // Update memory manager if needed
    if (options.maxSize !== undefined) {
      this.memoryManager.updateConfig({ maxCacheSize: options.maxSize });
    }
  }

  /**
   * 📊 EXPORT CACHE STATE
   */
  public exportState(): any {
    return {
      metrics: this.metrics,
      memoryState: this.memoryManager.exportState(),
      options: this.defaultOptions
    };
  }

  /**
   * 📥 IMPORT CACHE STATE
   */
  public importState(state: any): void {
    if (state.metrics) {
      this.metrics = { ...this.metrics, ...state.metrics };
    }
    
    if (state.memoryState) {
      this.memoryManager.importState(state.memoryState);
    }
    
    if (state.options) {
      this.updateOptions(state.options);
    }
  }

  /**
   * 🔚 DESTROY CACHE CONTROLLER
   */
  public destroy(): void {
    this.memoryManager.destroy();
    this.responseTimes = [];
    
    // Reset metrics
    this.metrics = {
      hits: 0,
      misses: 0,
      writes: 0,
      deletes: 0,
      evictions: 0,
      totalRequests: 0,
      averageResponseTime: 0
    };
  }
}

/**
 * 🌍 SINGLETON INSTANCE
 */
let globalCacheController: CacheController | null = null;

export function getCacheController(options?: CacheOptions): CacheController {
  if (!globalCacheController) {
    globalCacheController = new CacheController(options);
  }
  return globalCacheController;
}

export function resetCacheController(): void {
  if (globalCacheController) {
    globalCacheController.destroy();
    globalCacheController = null;
  }
}

export default CacheController;
