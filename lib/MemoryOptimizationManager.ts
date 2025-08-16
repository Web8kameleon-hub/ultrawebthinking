/**
 * Memory Optimization & Caching System
 * Maximum memory efficiency and intelligent caching
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { LRUCache } from 'lru-cache'
import { performance } from 'perf_hooks'
import { EventEmitter } from 'events'

// Type definitions first
interface SmartCacheOptions<K extends string | number, V extends {}> {
  maxSize?: number
  ttl?: number
  compressionEnabled?: boolean
  predictiveLoading?: boolean
  sizeCalculation?: (value: V, key: K) => number
}

interface CacheStats {
  hits: number
  misses: number
  sets: number
  deletes: number
  compressionRatio: number
  memoryUsage: number
}

interface MemoryStats {
  heapUsed: number
  heapTotal: number
  external: number
  rss: number
  totalMemoryUsage: number
  gcCount: number
  lastGC: number
}

// Memory Pool for object reuse
class MemoryPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize: number = 10) {
    this.createFn = createFn
    this.resetFn = resetFn
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn())
    }
  }

  acquire(): T {
    const obj = this.pool.pop()
    if (obj) {
      this.resetFn(obj)
      return obj
    }
    return this.createFn()
  }

  release(obj: T): void {
    this.pool.push(obj)
  }

  size(): number {
    return this.pool.length
  }
}

// Smart Cache with compression and predictive loading
class SmartCache<K extends string | number, V extends {}> extends EventEmitter {
  private cache: LRUCache<K, V>
  private accessCounts: Map<K, number> = new Map()
  private lastAccess: Map<K, number> = new Map()
  private compressionEnabled: boolean
  private predictiveLoading: boolean
  private stats: CacheStats

  constructor(options: SmartCacheOptions<K, V>) {
    super()
    
    this.cache = new LRUCache<K, V>({
      max: options.maxSize || 10000,
      ttl: options.ttl || 1000 * 60 * 60, // 1 hour default
      sizeCalculation: options.sizeCalculation,
      dispose: (value: V, key: K) => {
        this.accessCounts.delete(key)
        this.lastAccess.delete(key)
        this.emit('dispose', { key, value })
      }
    })

    this.compressionEnabled = options.compressionEnabled ?? true
    this.predictiveLoading = options.predictiveLoading ?? true
    
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      compressionRatio: 0,
      memoryUsage: 0
    }
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key)
    
    if (value !== undefined) {
      this.stats.hits++
      this.updateAccessPattern(key)
      
      // Predictive loading
      if (this.predictiveLoading) {
        this.predictiveLoad(key)
      }
      
      return value
    } else {
      this.stats.misses++
      return undefined
    }
  }

  set(key: K, value: V): void {
    let processedValue: V = value
    
    // Apply compression if enabled
    if (this.compressionEnabled && typeof value === 'string') {
      processedValue = this.compress(value) as unknown as V
    }
    
    this.cache.set(key, processedValue)
    this.stats.sets++
    this.updateAccessPattern(key)
    
    this.emit('set', { key, value: processedValue })
  }

  delete(key: K): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
      this.accessCounts.delete(key)
      this.lastAccess.delete(key)
    }
    return deleted
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  clear(): void {
    this.cache.clear()
    this.accessCounts.clear()
    this.lastAccess.clear()
    this.resetStats()
  }

  private updateAccessPattern(key: K): void {
    const now = performance.now()
    this.accessCounts.set(key, (this.accessCounts.get(key) || 0) + 1)
    this.lastAccess.set(key, now)
  }

  private predictiveLoad(key: K): void {
    // Simple predictive loading based on access patterns
    const relatedKeys = this.findRelatedKeys(key)
    relatedKeys.forEach(relatedKey => {
      if (!this.cache.has(relatedKey)) {
        this.emit('predictiveLoad', relatedKey)
      }
    })
  }

  private findRelatedKeys(key: K): K[] {
    // Basic pattern recognition - can be enhanced
    const keyStr = String(key)
    const related: K[] = []
    
    this.accessCounts.forEach((count, otherKey) => {
      const otherKeyStr = String(otherKey)
      if (otherKeyStr !== keyStr && this.isRelated(keyStr, otherKeyStr)) {
        related.push(otherKey)
      }
    })
    
    return related.slice(0, 3) // Limit to top 3 related keys
  }

  private isRelated(key1: string, key2: string): boolean {
    // Simple string similarity check
    const commonPrefix = this.getCommonPrefix(key1, key2)
    return commonPrefix.length > Math.min(key1.length, key2.length) * 0.3
  }

  private getCommonPrefix(str1: string, str2: string): string {
    let i = 0
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++
    }
    return str1.slice(0, i)
  }

  private compress(value: string): string {
    // Simple compression using run-length encoding
    if (value.length < 50) return value // Don't compress small strings
    
    let compressed = ''
    let current = value[0]
    let count = 1
    
    for (let i = 1; i < value.length; i++) {
      if (value[i] === current) {
        count++
      } else {
        compressed += count > 3 ? `${count}${current}` : current.repeat(count)
        current = value[i]
        count = 1
      }
    }
    
    compressed += count > 3 ? `${count}${current}` : current.repeat(count)
    
    const ratio = compressed.length / value.length
    this.stats.compressionRatio = (this.stats.compressionRatio + ratio) / 2
    
    return compressed.length < value.length ? compressed : value
  }

  getStats(): CacheStats {
    this.stats.memoryUsage = this.cache.size
    return { ...this.stats }
  }

  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses
    return total > 0 ? this.stats.hits / total : 0
  }

  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      compressionRatio: 0,
      memoryUsage: 0
    }
  }
}

// Memory Manager for system-wide optimization
export class MemoryOptimizationManager extends EventEmitter {
  private caches: Map<string, SmartCache<any, any>> = new Map()
  private memoryPools: Map<string, MemoryPool<any>> = new Map()
  private gcThreshold: number = 0.8 // Trigger GC at 80% memory usage
  private monitoringInterval: NodeJS.Timeout | null = null
  private memoryStats: MemoryStats

  constructor() {
    super()
    
    this.memoryStats = {
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      rss: 0,
      totalMemoryUsage: 0,
      gcCount: 0,
      lastGC: 0
    }
    
    this.startMonitoring()
    this.setupMemoryPools()
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.updateMemoryStats()
      this.optimizeMemory()
    }, 1000) // Check every second
  }

  private updateMemoryStats(): void {
    const memUsage = process.memoryUsage()
    
    this.memoryStats.heapUsed = memUsage.heapUsed
    this.memoryStats.heapTotal = memUsage.heapTotal
    this.memoryStats.external = memUsage.external
    this.memoryStats.rss = memUsage.rss
    this.memoryStats.totalMemoryUsage = memUsage.heapUsed / memUsage.heapTotal
    
    this.emit('memoryUpdate', this.memoryStats)
  }

  private optimizeMemory(): void {
    // Trigger GC if memory usage is high
    if (this.memoryStats.totalMemoryUsage > this.gcThreshold && global.gc) {
      console.log('🧹 High memory usage detected, triggering garbage collection...')
      global.gc()
      this.memoryStats.gcCount++
      this.memoryStats.lastGC = performance.now()
      this.emit('gc', this.memoryStats)
    }

    // Optimize caches
    this.caches.forEach((cache, name) => {
      const stats = cache.getStats()
      if (stats.memoryUsage > 5000) { // Large cache
        console.log(`🗑️ Optimizing large cache: ${name}`)
        this.optimizeCache(cache)
      }
    })
  }

  private optimizeCache(cache: SmartCache<any, any>): void {
    const stats = cache.getStats()
    if (stats.hits + stats.misses > 1000 && cache.getHitRate() < 0.5) {
      // Poor hit rate, consider clearing cache
      cache.clear()
      console.log('📊 Cache cleared due to poor hit rate')
    }
  }

  private setupMemoryPools(): void {
    // Create common object pools
    this.createMemoryPool('arrays', () => [], (arr: any[]) => { arr.length = 0 })
    this.createMemoryPool('objects', () => ({}), (obj: any) => {
      Object.keys(obj).forEach(key => delete obj[key])
    })
    this.createMemoryPool('matrices', () => [], (matrix: number[][]) => {
      matrix.length = 0
    })
  }

  // Public API methods
  public createCache<K extends string | number, V extends {}>(name: string, options?: SmartCacheOptions<K, V>): SmartCache<K, V> {
    const cache = new SmartCache<K, V>(options || {})
    this.caches.set(name, cache)
    
    cache.on('predictiveLoad', (key) => {
      this.emit('predictiveLoad', { cache: name, key })
    })
    
    return cache
  }

  public getCache<K extends string | number, V extends {}>(name: string): SmartCache<K, V> | undefined {
    return this.caches.get(name) as SmartCache<K, V>
  }

  public deleteCache(name: string): boolean {
    const cache = this.caches.get(name)
    if (cache) {
      cache.clear()
      this.caches.delete(name)
      return true
    }
    return false
  }

  public createMemoryPool<T>(name: string, createFn: () => T, resetFn: (obj: T) => void, initialSize?: number): MemoryPool<T> {
    const pool = new MemoryPool(createFn, resetFn, initialSize)
    this.memoryPools.set(name, pool)
    return pool
  }

  public getMemoryPool<T>(name: string): MemoryPool<T> | undefined {
    return this.memoryPools.get(name) as MemoryPool<T>
  }

  public acquireFromPool<T>(poolName: string): T | undefined {
    const pool = this.memoryPools.get(poolName)
    return pool ? pool.acquire() : undefined
  }

  public releaseToPool<T>(poolName: string, obj: T): void {
    const pool = this.memoryPools.get(poolName)
    if (pool) {
      pool.release(obj)
    }
  }

  public forceGC(): void {
    if (global.gc) {
      global.gc()
      this.memoryStats.gcCount++
      this.memoryStats.lastGC = performance.now()
      console.log('🧹 Manual garbage collection triggered')
    } else {
      console.warn('⚠️ Garbage collection not available (use --expose-gc flag)')
    }
  }

  public getMemoryStats(): MemoryStats {
    this.updateMemoryStats()
    return { ...this.memoryStats }
  }

  public getAllCacheStats(): Record<string, CacheStats> {
    const stats: Record<string, CacheStats> = {}
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats()
    })
    return stats
  }

  public getMemoryPoolStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    this.memoryPools.forEach((pool, name) => {
      stats[name] = pool.size()
    })
    return stats
  }

  public optimizeAll(): void {
    console.log('🚀 Starting full memory optimization...')
    
    // Force GC
    this.forceGC()
    
    // Optimize all caches
    this.caches.forEach((cache, name) => {
      this.optimizeCache(cache)
    })
    
    console.log('✅ Memory optimization complete')
    this.emit('optimizationComplete', this.getMemoryStats())
  }

  public shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
    
    // Clear all caches
    this.caches.forEach(cache => cache.clear())
    this.caches.clear()
    
    // Clear memory pools
    this.memoryPools.clear()
    
    console.log('🛑 Memory optimization manager shutdown')
  }
}

// Singleton instance
export const memoryOptimizationManager = new MemoryOptimizationManager()

// Create default caches
export const defaultCache = memoryOptimizationManager.createCache('default', {
  maxSize: 10000,
  compressionEnabled: true,
  predictiveLoading: true
})

export const highPerformanceCache = memoryOptimizationManager.createCache('highPerformance', {
  maxSize: 50000,
  ttl: 1000 * 60 * 30, // 30 minutes
  compressionEnabled: false, // No compression for speed
  predictiveLoading: true
})

export const longTermCache = memoryOptimizationManager.createCache('longTerm', {
  maxSize: 5000,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
  compressionEnabled: true,
  predictiveLoading: false
})

// Utility functions
export const cacheGet = <T>(key: string): T | undefined => {
  return defaultCache.get(key) as T
}

export const cacheSet = <T extends {}>(key: string, value: T): void => {
  defaultCache.set(key, value)
}

export const acquireArray = (): any[] => {
  return memoryOptimizationManager.acquireFromPool('arrays') || []
}

export const releaseArray = (arr: any[]): void => {
  memoryOptimizationManager.releaseToPool('arrays', arr)
}

export const acquireObject = (): any => {
  return memoryOptimizationManager.acquireFromPool('objects') || {}
}

export const releaseObject = (obj: any): void => {
  memoryOptimizationManager.releaseToPool('objects', obj)
}

export const getMemoryInfo = () => {
  return {
    stats: memoryOptimizationManager.getMemoryStats(),
    caches: memoryOptimizationManager.getAllCacheStats(),
    pools: memoryOptimizationManager.getMemoryPoolStats()
  }
}

// Auto-optimization events
memoryOptimizationManager.on('memoryUpdate', (stats) => {
  if (stats.totalMemoryUsage > 0.9) {
    console.log('🚨 Critical memory usage detected!')
  }
})

memoryOptimizationManager.on('gc', (stats) => {
  console.log(`🧹 GC #${stats.gcCount} completed. Memory usage: ${(stats.totalMemoryUsage * 100).toFixed(1)}%`)
})

export { MemoryPool, SmartCache }
export default memoryOptimizationManager
