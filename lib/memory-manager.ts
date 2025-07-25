/**
 * 💾 MEMORY MANAGER - ADVANCED MEMORY OPTIMIZATION
 * Menaxhon memorjen dhe optimizon performance
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-MEMORY-MANAGER
 * @license MIT
 */

interface MemoryConfig {
  maxCacheSize: number;
  cleanupInterval: number;
  compressionEnabled: boolean;
  debugMode: boolean;
}

interface MemoryStats {
  totalAllocated: number;
  totalFreed: number;
  cacheHits: number;
  cacheMisses: number;
  cleanupCycles: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  size: number;
}

/**
 * 🧠 MEMORY MANAGER CLASS
 */
export class MemoryManager {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: MemoryStats = {
    totalAllocated: 0,
    totalFreed: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cleanupCycles: 0
  };
  
  private cleanupTimer?: NodeJS.Timeout;
  private config: MemoryConfig;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      maxCacheSize: config.maxCacheSize || 100 * 1024 * 1024, // 100MB
      cleanupInterval: config.cleanupInterval || 60000, // 1 minute
      compressionEnabled: config.compressionEnabled || false,
      debugMode: config.debugMode || false
    };

    this.startCleanupCycle();
  }

  /**
   * 💾 SET CACHE ENTRY
   */
  public set<T>(key: string, data: T, ttl?: number): void {
    const size = this.calculateSize(data);
    
    // Check if we have space
    if (this.getTotalCacheSize() + size > this.config.maxCacheSize) {
      this.cleanup();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 0,
      size
    };

    this.cache.set(key, entry);
    this.stats.totalAllocated += size;

    if (this.config.debugMode) {
      console.log(`💾 Memory: Cached ${key} (${size} bytes)`);
    }
  }

  /**
   * 📖 GET CACHE ENTRY
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.cacheMisses++;
      return null;
    }

    entry.accessCount++;
    this.stats.cacheHits++;

    if (this.config.debugMode) {
      console.log(`📖 Memory: Cache hit for ${key}`);
    }

    return entry.data as T;
  }

  /**
   * 🗑️ DELETE CACHE ENTRY
   */
  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.totalFreed += entry.size;
      this.cache.delete(key);
      
      if (this.config.debugMode) {
        console.log(`🗑️ Memory: Deleted ${key} (${entry.size} bytes)`);
      }
      
      return true;
    }
    return false;
  }

  /**
   * 🧹 CLEANUP EXPIRED ENTRIES
   */
  public cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Sort by access frequency and timestamp (LRU + LFU hybrid)
    entries.sort((a, b) => {
      const scoreA = a[1].accessCount / (now - a[1].timestamp + 1);
      const scoreB = b[1].accessCount / (now - b[1].timestamp + 1);
      return scoreA - scoreB;
    });

    // Remove least valuable entries if over limit
    const targetSize = this.config.maxCacheSize * 0.8; // 80% of max
    let currentSize = this.getTotalCacheSize();
    let removedCount = 0;

    for (const [key, entry] of entries) {
      if (currentSize <= targetSize) break;
      
      this.delete(key);
      currentSize -= entry.size;
      removedCount++;
    }

    this.stats.cleanupCycles++;

    if (this.config.debugMode && removedCount > 0) {
      console.log(`🧹 Memory: Cleaned up ${removedCount} entries`);
    }
  }

  /**
   * 📊 GET MEMORY STATISTICS
   */
  public getStats(): MemoryStats & { cacheSize: number; entryCount: number } {
    return {
      ...this.stats,
      cacheSize: this.getTotalCacheSize(),
      entryCount: this.cache.size
    };
  }

  /**
   * 🔧 GET MEMORY USAGE PERCENTAGE
   */
  public getUsagePercentage(): number {
    return (this.getTotalCacheSize() / this.config.maxCacheSize) * 100;
  }

  /**
   * 🚀 OPTIMIZE MEMORY
   */
  public optimize(): void {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Cleanup cache
    this.cleanup();

    // Report optimization
    if (this.config.debugMode) {
      const stats = this.getStats();
      console.log('🚀 Memory optimized:', stats);
    }
  }

  /**
   * 🔄 START CLEANUP CYCLE
   */
  private startCleanupCycle(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 🛑 STOP CLEANUP CYCLE
   */
  public stopCleanupCycle(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * 📏 CALCULATE DATA SIZE
   */
  private calculateSize(data: any): number {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      // Fallback size estimation
      if (typeof data === 'string') return data.length * 2;
      if (typeof data === 'number') return 8;
      if (typeof data === 'boolean') return 4;
      return 1024; // Default size for complex objects
    }
  }

  /**
   * 📊 GET TOTAL CACHE SIZE
   */
  private getTotalCacheSize(): number {
    return Array.from(this.cache.values()).reduce((total, entry) => total + entry.size, 0);
  }

  /**
   * 🧼 CLEAR ALL CACHE
   */
  public clear(): void {
    const totalSize = this.getTotalCacheSize();
    this.cache.clear();
    this.stats.totalFreed += totalSize;
    
    if (this.config.debugMode) {
      console.log(`🧼 Memory: Cleared all cache (${totalSize} bytes)`);
    }
  }

  /**
   * 🔧 UPDATE CONFIG
   */
  public updateConfig(newConfig: Partial<MemoryConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart cleanup cycle if interval changed
    if (newConfig.cleanupInterval !== undefined) {
      this.stopCleanupCycle();
      this.startCleanupCycle();
    }
  }

  /**
   * 💾 EXPORT CACHE STATE
   */
  public exportState(): any {
    const entries: Record<string, any> = {};
    
    this.cache.forEach((entry, key) => {
      entries[key] = {
        data: entry.data,
        timestamp: entry.timestamp,
        accessCount: entry.accessCount
      };
    });

    return {
      entries,
      stats: this.stats,
      config: this.config
    };
  }

  /**
   * 📥 IMPORT CACHE STATE
   */
  public importState(state: any): void {
    this.clear();
    
    if (state.entries) {
      Object.entries(state.entries).forEach(([key, value]: [string, any]) => {
        this.cache.set(key, {
          data: value.data,
          timestamp: value.timestamp || Date.now(),
          accessCount: value.accessCount || 0,
          size: this.calculateSize(value.data)
        });
      });
    }

    if (state.stats) {
      this.stats = { ...this.stats, ...state.stats };
    }

    if (state.config) {
      this.updateConfig(state.config);
    }
  }

  /**
   * 🏥 HEALTH CHECK
   */
  public healthCheck(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const usage = this.getUsagePercentage();

    // Check memory usage
    if (usage > 90) {
      issues.push('Memory usage over 90%');
      recommendations.push('Increase maxCacheSize or reduce cache usage');
    } else if (usage > 75) {
      issues.push('Memory usage over 75%');
      recommendations.push('Monitor memory usage closely');
    }

    // Check cache hit ratio
    const totalRequests = this.stats.cacheHits + this.stats.cacheMisses;
    const hitRatio = totalRequests > 0 ? (this.stats.cacheHits / totalRequests) * 100 : 100;
    
    if (hitRatio < 60) {
      issues.push(`Cache hit ratio low: ${hitRatio.toFixed(1)}%`);
      recommendations.push('Review caching strategy or increase cache size');
    }

    // Check cleanup frequency
    if (this.stats.cleanupCycles > 10 && usage > 50) {
      issues.push('Frequent cleanup cycles detected');
      recommendations.push('Consider increasing maxCacheSize');
    }

    const status = issues.length === 0 ? 'healthy' : 
                  issues.some(issue => issue.includes('90%') || issue.includes('critical')) ? 'critical' : 'warning';

    return { status, issues, recommendations };
  }

  /**
   * 🔚 DESTROY MEMORY MANAGER
   */
  public destroy(): void {
    this.stopCleanupCycle();
    this.clear();
    
    if (this.config.debugMode) {
      console.log('🔚 Memory Manager destroyed');
    }
  }
}

/**
 * 🌍 SINGLETON INSTANCE
 */
let globalMemoryManager: MemoryManager | null = null;

export function getMemoryManager(config?: Partial<MemoryConfig>): MemoryManager {
  if (!globalMemoryManager) {
    globalMemoryManager = new MemoryManager(config);
  }
  return globalMemoryManager;
}

export function resetMemoryManager(): void {
  if (globalMemoryManager) {
    globalMemoryManager.destroy();
    globalMemoryManager = null;
  }
}

export default MemoryManager;
