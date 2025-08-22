/**
 * EuroWeb Ultra Lazy Loading System
 * Industrial-Grade Dynamic Component Loading with Neural Optimization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

import React, { Suspense, lazy, memo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import styles from './LazyLoader.module.css'

// Lazy Loading Variants with CVA
const lazyVariants = cva(styles.container, {
  variants: {
    variant: {
      default: styles.default,
      industrial: styles.industrial,
      neural: styles.neural,
      quantum: styles.quantum
    },
    loading: {
      true: styles.loading,
      false: styles.loaded
    },
    priority: {
      low: styles.lowPriority,
      normal: styles.normalPriority,
      high: styles.highPriority,
      critical: styles.criticalPriority
    }
  },
  defaultVariants: {
    variant: 'default',
    loading: false,
    priority: 'normal'
  }
})

// Lazy Component Registry
export interface LazyComponentConfig {
  name: string
  loader: () => Promise<{ default: React.ComponentType<any> }>
  fallback?: React.ReactNode
  priority?: 'low' | 'normal' | 'high' | 'critical'
  preload?: boolean
  chunk?: string
}

// Neural Lazy Loading Engine
class NeuralLazyEngine {
  public componentCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>()
  private loadingStates = new Map<string, boolean>()
  private preloadQueue: string[] = []
  private observers = new Map<string, IntersectionObserver>()

  // Dynamic Component Registration
  register(config: LazyComponentConfig): React.LazyExoticComponent<React.ComponentType<any>> {
    if (this.componentCache.has(config.name)) {
      return this.componentCache.get(config.name)!
    }

    const LazyComponent = lazy(() => {
      this.setLoading(config.name, true)
      return config.loader().finally(() => {
        this.setLoading(config.name, false)
      })
    })

    this.componentCache.set(config.name, LazyComponent)

    // Auto-preload high priority components
    if (config.preload || config.priority === 'critical' || config.priority === 'high') {
      this.preload(config.name)
    }

    return LazyComponent
  }

  // Intelligent Preloading
  preload(componentName: string): void {
    const component = this.componentCache.get(componentName)
    if (component && !this.preloadQueue.includes(componentName)) {
      this.preloadQueue.push(componentName)
      // Trigger preload by creating component instance
      React.createElement(component)
    }
  }

  // Loading State Management
  setLoading(componentName: string, loading: boolean): void {
    this.loadingStates.set(componentName, loading)
  }

  isLoading(componentName: string): boolean {
    return this.loadingStates.get(componentName) || false
  }

  // Intersection Observer for Viewport Loading
  observeViewport(element: Element, componentName: string, callback: () => void): void {
    if (!this.observers.has(componentName)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
              observer.disconnect()
            }
          })
        },
        { rootMargin: '50px' }
      )
      this.observers.set(componentName, observer)
    }
    this.observers.get(componentName)!.observe(element)
  }
}

// Global Neural Engine Instance
export const neuralLazyEngine = new NeuralLazyEngine()

// Ultra Loading Spinner Component
export const UltraSpinner = memo(() => (
  <motion.div
    className={styles.spinner}
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  >
    <div className={styles.spinnerCore} />
    <div className={styles.spinnerRing} />
  </motion.div>
))

UltraSpinner.displayName = 'UltraSpinner'

// Industrial Loading Fallback
export const IndustrialFallback = memo(({ 
  message = 'Loading Neural Component...', 
  variant = 'default' 
}: { 
  message?: string
  variant?: 'default' | 'industrial' | 'neural' | 'quantum'
}) => (
  <motion.div
    className={lazyVariants({ variant: variant || 'default', loading: true })}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
  >
    <UltraSpinner />
    <span className={styles.loadingText}>{message}</span>
  </motion.div>
))

IndustrialFallback.displayName = 'IndustrialFallback'

// Main Lazy Loader Component
export interface LazyLoaderProps extends VariantProps<typeof lazyVariants> {
  component: string
  fallback?: React.ReactNode
  onLoad?: () => void
  onError?: (error: Error) => void
  viewport?: boolean
  preload?: boolean
  className?: string
  children?: React.ReactNode
}

export const LazyLoader = memo<LazyLoaderProps>(({
  component,
  fallback,
  onLoad,
  onError,
  viewport = false,
  preload = false,
  variant = 'default',
  priority = 'normal',
  className,
  children,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = React.useState(!viewport || preload)

  // Viewport Intersection Logic
  useEffect(() => {
    if (viewport && containerRef.current && !shouldLoad) {
      neuralLazyEngine.observeViewport(
        containerRef.current,
        component,
        () => setShouldLoad(true)
      )
    }
  }, [viewport, component, shouldLoad])

  // Get Lazy Component
  const LazyComponent = neuralLazyEngine.componentCache.get(component)

  if (!LazyComponent) {
    console.warn(`LazyLoader: Component "${component}" not registered`)
    return (
      <div className={lazyVariants({ variant, className })}>
        Error: Component not found
      </div>
    )
  }

  const defaultFallback = (
    <IndustrialFallback 
      message={`Loading ${component}...`}
      variant={variant || 'default'}
    />
  )

  return (
    <div
      ref={containerRef}
      className={lazyVariants({ variant, loading: !shouldLoad, priority, className })}
      {...props}
    >
      <AnimatePresence mode="wait">
        {shouldLoad ? (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={onLoad}
          >
            <Suspense fallback={fallback || defaultFallback}>
              <LazyComponent {...props}>
                {children}
              </LazyComponent>
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.placeholder}
          >
            {fallback || defaultFallback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

LazyLoader.displayName = 'LazyLoader'

// Component Registry Functions
export const registerLazyComponent = (config: LazyComponentConfig) => {
  return neuralLazyEngine.register(config)
}

export const preloadComponent = (componentName: string) => {
  neuralLazyEngine.preload(componentName)
}

// AGI Components Lazy Registration
export const AGISheetLazy = registerLazyComponent({
  name: 'AGISheet',
  loader: async () => {
    const module = await import('./AGISheet/AGISheet')
    return { default: module.AGISheet }
  },
  priority: 'high',
  preload: true,
  chunk: 'agi-core'
})

export const AGIEcoLazy = registerLazyComponent({
  name: 'AGIEco',
  loader: async () => {
    const module = await import('./AGISheet/AGIEco')
    return { default: module.AGIEco }
  },
  priority: 'normal',
  chunk: 'agi-eco'
})

export const AGIBioNatureLazy = registerLazyComponent({
  name: 'AGIBioNature',
  loader: async () => {
    const module = await import('./AGISheet/AGIBioNature')
    return { default: module.AGIBioNature }
  },
  priority: 'normal',
  chunk: 'agi-bio'
})

export const Web8TabSystemLazy = registerLazyComponent({
  name: 'Web8TabSystem',
  loader: async () => {
    const module = await import('./Web8TabSystem')
    return { default: module.default }
  },
  priority: 'critical',
  preload: true,
  chunk: 'core-ui'
})

export default LazyLoader
