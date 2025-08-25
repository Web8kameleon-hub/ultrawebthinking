/**
 * 🚀 LazyLoader - Web8 AGI Optimized Component Loading
 * Neural-Enhanced Lazy Loading with Performance Monitoring
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-PERFORMANCE
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

// Performance metrics tracking
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

// Component registry with neural optimization
const componentRegistry = new Map<string, () => Promise<any>>()

// Initialize Web8 component registry
const initializeWeb8Components = () => {
  // AGI Core Modules - Existing Components Only
  componentRegistry.set('UltraAIChat', () => import('./UltraAIChat'))
  componentRegistry.set('TranslatorUI', () => import('./TranslatorUI'))
  componentRegistry.set('AGIControlCenter', () => import('./AGIControlCenter'))
  
  // Web8 System Components - Existing Only
  componentRegistry.set('Web8TabSystem', () => import('./Web8TabSystem'))
  componentRegistry.set('AGITabSystem', () => import('./AGITabSystem'))
  componentRegistry.set('RealTimeAGI', () => import('./RealTimeAGI'))
  
  // AGI Specialized Modules - Existing Only
  componentRegistry.set('AGIBioNature', () => import('./AGISheet/AGIBioNature'))
  componentRegistry.set('AGIxBioNature', () => import('./AGISheet/AGIxBioNature'))
  
  // UltraAGI Chat System
  componentRegistry.set('UltraAGIChat', () => import('./UltraAGIChat/UltraAGIChat'))
}

// Performance cache for loaded components
const performanceCache = new Map<string, LazyMetrics>()

// Loading animations with neural theme
const LoadingSpinner: React.FC<{ variant: string }> = ({ variant }) => {
  const variants = {
    neural: {
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      animation: 'pulse',
      icon: '🧠'
    },
    industrial: {
      gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
      animation: 'spin',
      icon: '⚙️'
    },
    royal: {
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
      animation: 'bounce',
      icon: '👑'
    },
    minimal: {
      gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
      animation: 'pulse',
      icon: '●'
    }
  }

  const style = variants[variant as keyof typeof variants] || variants.neural

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-8 min-h-[200px]"
      style={{
        background: 'rgba(15, 15, 35, 0.8)',
        borderRadius: '15px',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}
    >
      <motion.div
        animate={{
          rotate: style.animation === 'spin' ? 360 : 0,
          scale: style.animation === 'pulse' ? [1, 1.1, 1] : 1,
          y: style.animation === 'bounce' ? [0, -10, 0] : 0
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          fontSize: '2rem',
          background: style.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}
      >
        {style.icon}
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        Loading {variant} module...
        <br />
        <span style={{ fontSize: '12px', opacity: 0.6 }}>
          Neural optimization in progress
        </span>
      </motion.div>
    </motion.div>
  )
}

// Intersection Observer hook for viewport loading
const useIntersectionObserver = (ref: React.RefObject<HTMLDivElement | null>, options: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Main LazyLoader component
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

  // Viewport intersection detection
  const isInViewport = useIntersectionObserver(componentRef, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  // Determine if component should load
  const shouldLoad = !viewport || isInViewport || preload

  // Component loading logic
  useEffect(() => {
    if (!shouldLoad) return

    const loadComponent = async () => {
      try {
        loadStartTime.current = performance.now()
        setIsLoading(true)
        setLoadError(null)

        // Check if component exists in registry
        const componentLoader = componentRegistry.get(component)
        if (!componentLoader) {
          throw new Error(`Component "${component}" not found in registry`)
        }

        // Load component with performance tracking
        const loadedModule = await componentLoader()
        const Component = loadedModule.default || loadedModule[component]

        if (!Component) {
          throw new Error(`Component "${component}" has no default export`)
        }

        // Calculate performance metrics
        const loadTime = performance.now() - loadStartTime.current
        const metrics: LazyMetrics = {
          loadTime,
          componentSize: JSON.stringify(Component).length,
          memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
          cacheHit: performanceCache.has(component),
          priority
        }

        // Cache metrics
        performanceCache.set(component, metrics)

        // Set loaded component
        setLoadedComponent(() => Component)
        setIsLoading(false)

        // Notify parent of successful load
        onLoad?.(metrics)

        console.log(`🚀 LazyLoader: ${component} loaded in ${loadTime.toFixed(2)}ms`)

      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load component')
        setIsLoading(false)
        console.error(`❌ LazyLoader: Failed to load ${component}:`, error)
      }
    }

    loadComponent()
  }, [component, shouldLoad, priority, onLoad])

  // Preload logic
  useEffect(() => {
    if (preload && priority === 'critical') {
      // Preload critical components immediately
      const preloadComponent = componentRegistry.get(component)
      if (preloadComponent) {
        preloadComponent().catch(() => {
          // Silent fail for preload
        })
      }
    }
  }, [component, preload, priority])

  // Error boundary
  if (loadError) {
    return (
      <div className={`lazy-loader-error ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Failed to load {component}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            {loadError}
          </div>
        </motion.div>
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

// Performance monitoring hook
export const useLazyLoaderMetrics = () => {
  const [metrics, setMetrics] = useState<Map<string, LazyMetrics>>(new Map())

  useEffect(() => {
    setMetrics(new Map(performanceCache))
  }, [])

  const getComponentMetrics = (component: string) => {
    return performanceCache.get(component)
  }

  const getAllMetrics = () => {
    return Array.from(performanceCache.entries()).map(([name, metrics]) => ({
      component: name,
      ...metrics
    }))
  }

  const clearMetrics = () => {
    performanceCache.clear()
    setMetrics(new Map())
  }

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
