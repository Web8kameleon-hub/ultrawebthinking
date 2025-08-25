/**
 * 🚀 Optimized LazyLoader - Memory-Efficient Web8 Component Loading
 * Fixed memory leaks and performance issues
 * 
 * @author Ledjan Ahmati
 * @version 8.0.1-OPTIMIZED
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// Optimized performance metrics
interface LazyMetrics {
  loadTime: number
  componentSize: number
  memoryUsage: number
  cacheHit: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
}

interface LazyLoaderProps {
  component: string
  variant?: 'neural' | 'industrial' | 'minimal' | 'royal'
  priority?: 'critical' | 'high' | 'medium' | 'low'
  preload?: boolean
  viewport?: boolean
  fallback?: React.ReactNode
  className?: string
  onLoad?: (metrics: LazyMetrics) => void
}

// Component registry - no changes needed here
const componentRegistry = new Map<string, () => Promise<any>>()

// Limited performance cache with cleanup
const MAX_CACHE_SIZE = 50
const performanceCache = new Map<string, LazyMetrics>()

// Clean cache when it gets too large
const cleanupCache = () => {
  if (performanceCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(performanceCache.entries())
    // Keep only the most recent 25 entries
    const recentEntries = entries.slice(-25)
    performanceCache.clear()
    recentEntries.forEach(([key, value]) => {
      performanceCache.set(key, value)
    })
    console.log('🧹 LazyLoader cache cleaned up')
  }
}

// Initialize Web8 component registry
const initializeWeb8Components = () => {
  // Only essential AGI Core components
  componentRegistry.set('UltraAIChat', () => import('./UltraAIChat'))
  componentRegistry.set('TranslatorUI', () => import('./TranslatorUI'))
  componentRegistry.set('AGIControlCenter', () => import('./AGIControlCenter'))
  
  // Core Web8 System components
  componentRegistry.set('Web8TabSystem', () => import('./Web8TabSystem'))
  componentRegistry.set('AGITabSystem', () => import('./AGITabSystem'))
  componentRegistry.set('RealTimeAGI', () => import('./RealTimeAGI'))
  
  // Essential AGI modules only
  componentRegistry.set('AGIBioNature', () => import('./AGISheet/AGIBioNature'))
  componentRegistry.set('AGIxBioNature', () => import('./AGISheet/AGIxBioNature'))
  
  // LoRa Dashboard
  componentRegistry.set('Web8LoRaDashboard', () => import('./Web8LoRaDashboard'))
}

// Optimized loading spinner with reduced animations
const LoadingSpinner: React.FC<{ variant: string }> = React.memo(({ variant }) => {
  const variants = {
    neural: { icon: '🧠', color: '#8B5CF6' },
    industrial: { icon: '⚙️', color: '#64748B' },
    royal: { icon: '👑', color: '#7C3AED' },
    minimal: { icon: '●', color: '#6B7280' }
  }

  const style = variants[variant as keyof typeof variants] || variants.neural

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[150px] bg-slate-900/50 rounded-lg border border-slate-700">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-2xl mb-3"
        style={{ color: style.color }}
      >
        {style.icon}
      </motion.div>
      
      <div className="text-sm text-slate-400 text-center">
        Loading {variant} module...
      </div>
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

// Optimized intersection observer hook with cleanup
const useIntersectionObserver = (
  ref: React.RefObject<HTMLDivElement | null>, 
  options: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!ref.current) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observerRef.current.observe(ref.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [ref, options])

  return isIntersecting
}

// Main optimized LazyLoader component
export const LazyLoader: React.FC<LazyLoaderProps> = ({
  component,
  variant = 'neural',
  priority = 'medium',
  preload = false,
  viewport = false,
  fallback,
  className = '',
  onLoad
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const loadStartTime = useRef<number>(0)
  const isMountedRef = useRef(true)

  // Viewport intersection detection
  const isInViewport = useIntersectionObserver(componentRef, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  // Determine if component should load
  const shouldLoad = !viewport || isInViewport || preload

  // Optimized component loading with memory management
  const loadComponent = useCallback(async () => {
    if (!isMountedRef.current) return

    try {
      loadStartTime.current = performance.now()
      setIsLoading(true)
      setLoadError(null)

      // Check if component exists in registry
      const componentLoader = componentRegistry.get(component)
      if (!componentLoader) {
        throw new Error(`Component "${component}" not found in registry`)
      }

      // Load component with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Component load timeout')), 10000)
      })

      const loadedModule = await Promise.race([
        componentLoader(),
        timeoutPromise
      ])

      if (!isMountedRef.current) return

      const Component = loadedModule.default || loadedModule[component]

      if (!Component) {
        throw new Error(`Component "${component}" has no default export`)
      }

      // Calculate performance metrics
      const loadTime = performance.now() - loadStartTime.current
      const metrics: LazyMetrics = {
        loadTime,
        componentSize: 0, // Skip expensive size calculation
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        cacheHit: performanceCache.has(component),
        priority
      }

      // Cache metrics with cleanup
      performanceCache.set(component, metrics)
      cleanupCache()

      // Set loaded component
      setLoadedComponent(() => Component)
      setIsLoading(false)

      // Notify parent of successful load
      onLoad?.(metrics)

      console.log(`🚀 LazyLoader: ${component} loaded in ${loadTime.toFixed(2)}ms`)

    } catch (error) {
      if (!isMountedRef.current) return
      
      setLoadError(error instanceof Error ? error.message : 'Failed to load component')
      setIsLoading(false)
      console.error(`❌ LazyLoader: Failed to load ${component}:`, error)
    }
  }, [component, priority, onLoad])

  // Component loading effect
  useEffect(() => {
    if (!shouldLoad) return
    loadComponent()
  }, [shouldLoad, loadComponent])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Selective preload for critical components only
  useEffect(() => {
    if (preload && priority === 'critical' && !viewport) {
      // Only preload if not using viewport loading
      const preloadComponent = componentRegistry.get(component)
      if (preloadComponent) {
        preloadComponent().catch(() => {
          // Silent fail for preload
        })
      }
    }
  }, [component, preload, priority, viewport])

  // Error boundary
  if (loadError) {
    return (
      <div className={`lazy-loader-error ${className}`}>
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="font-bold text-red-400 mb-1">
            Failed to load {component}
          </div>
          <div className="text-xs text-red-300 opacity-80">
            {loadError}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading || !LoadedComponent) {
    return (
      <div ref={componentRef} className={`lazy-loader ${className}`}>
        {fallback || <LoadingSpinner variant={variant} />}
      </div>
    )
  }

  // Render loaded component
  return (
    <div ref={componentRef} className={`lazy-loaded ${className}`}>
      <Suspense fallback={fallback || <LoadingSpinner variant={variant} />}>
        <LoadedComponent />
      </Suspense>
    </div>
  )
}

// Optimized performance monitoring hook
export const useLazyLoaderMetrics = () => {
  const [metrics, setMetrics] = useState<Map<string, LazyMetrics>>(new Map())

  useEffect(() => {
    setMetrics(new Map(performanceCache))
  }, [])

  const getComponentMetrics = useCallback((component: string) => {
    return performanceCache.get(component)
  }, [])

  const getAllMetrics = useCallback(() => {
    return Array.from(performanceCache.entries()).map(([name, metrics]) => ({
      component: name,
      ...metrics
    }))
  }, [])

  const clearMetrics = useCallback(() => {
    performanceCache.clear()
    setMetrics(new Map())
    console.log('🧹 LazyLoader metrics cleared')
  }, [])

  return {
    metrics,
    getComponentMetrics,
    getAllMetrics,
    clearMetrics
  }
}

// Initialize registry on module load
initializeWeb8Components()

export default LazyLoader
