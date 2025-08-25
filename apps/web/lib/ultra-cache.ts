/**
 * Advanced API Cache Manager
 * Redis-like in-memory caching with TTL and intelligent invalidation
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 1.0.0
 * @license MIT
 */

import { useEffect, useState } from 'react'

interface CacheEntry<T> {
    data: T
    timestamp: number
    ttl: number
    hits: number
    tags: string[]
}

interface CacheOptions {
    ttl?: number // Time to live in ms
    tags?: string[] // Cache tags for group invalidation
    _priority?: 'low' | 'medium' | 'high'
}

class UltraCache {
    private cache = new Map<string, CacheEntry<any>>()
    private maxSize: number
    private defaultTTL: number
    private hitCount = 0
    private missCount = 0

    constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) { // 5 minutes default
        this.maxSize = maxSize
        this.defaultTTL = defaultTTL

        // Cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60 * 1000)
    }

    /**
     * Get cached data with automatic expiration check
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key)

        if (!entry) {
            this.missCount++
            return null
        }

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key)
            this.missCount++
            return null
        }

        // Update hit statistics
        entry.hits++
        this.hitCount++

        return entry.data
    }

    /**
     * Set cache entry with options
     */
    set<T>(key: string, data: T, options: CacheOptions = {}): void {
        const {
            ttl = this.defaultTTL,
            tags = [],
            _priority = 'medium'
        } = options

        // Evict if cache is full
        if (this.cache.size >= this.maxSize) {
            this.evictLeastUsed()
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
            hits: 0,
            tags
        })
    }

    /**
     * Invalidate cache by tags
     */
    invalidateByTags(tags: string[]): number {
        let invalidated = 0

        for (const [key, entry] of this.cache.entries()) {
            if (entry.tags.some(tag => tags.includes(tag))) {
                this.cache.delete(key)
                invalidated++
            }
        }

        return invalidated
    }

    /**
     * Clear expired entries
     */
    private cleanup(): void {
        const now = Date.now()
        const toDelete: string[] = []

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                toDelete.push(key)
            }
        }

        toDelete.forEach(key => this.cache.delete(key))
    }

    /**
     * Evict least recently used entries
     */
    private evictLeastUsed(): void {
        let leastUsedKey = ''
        let minHits = Infinity

        for (const [key, entry] of this.cache.entries()) {
            if (entry.hits < minHits) {
                minHits = entry.hits
                leastUsedKey = key
            }
        }

        if (leastUsedKey) {
            this.cache.delete(leastUsedKey)
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const totalRequests = this.hitCount + this.missCount
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0,
            hits: this.hitCount,
            misses: this.missCount
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear()
        this.hitCount = 0
        this.missCount = 0
    }
}

// Global cache instance
export const apiCache = new UltraCache()

/**
 * Cache decorator for API functions
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
    ttl: number = 5 * 60 * 1000,
    tags: string[] = []
) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value

        descriptor.value = async function (...args: any[]) {
            const cacheKey = `${propertyKey}:${JSON.stringify(args)}`

            // Try to get from cache first
            const cached = apiCache.get(cacheKey)
            if (cached) {
                return cached
            }

            // Execute original method
            const result = await originalMethod.apply(this, args)

            // Cache the result
            apiCache.set(cacheKey, result, { ttl, tags })

            return result
        }

        return descriptor
    }
}

/**
 * React hook for cached API calls
 */
export function useCachedAPI<T>(
    apiCall: () => Promise<T>,
    deps: any[] = [],
    options: CacheOptions = {}
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, _setError] = useState<Error | null>(null)

    useEffect(() => {
        const cacheKey = `api:${JSON.stringify(deps)}`

        // Check cache first
        const cached = apiCache.get<T>(cacheKey)
        if (cached) {
            setData(cached)
            setLoading(false)
            return
        }

        // Make API call
        setLoading(true)
        apiCall()
            .then(result => {
                setData(result)
                apiCache.set(cacheKey, result, options)
            })
            .catch (_setError)
            .finally(() => setLoading(false))
    }, deps)

    return { data, loading, error }
}

// Export for Next.js API routes
export default apiCache
