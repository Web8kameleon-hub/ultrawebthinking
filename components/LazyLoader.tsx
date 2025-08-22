/**
 * LazyLoader.tsx - Advanced Dynamic Loading System for EuroWeb Ultra
 * High-Performance Component Loading with AGI Intelligence
 * © Web8 UltraThinking - Ledjan Ahmati
 */

'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Advanced loading metrics and performance monitoring
interface LoadingMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  retryCount: number;
  chunkSize?: number;
  networkLatency?: number;
  memoryUsage?: number;
  cacheHit: boolean;
}

interface ComponentCache {
  [key: string]: {
    component: React.ComponentType<any>;
    timestamp: number;
    accessCount: number;
    priority: number;
    memoryFootprint: number;
  };
}

interface LoaderConfig {
  id: string;
  name: string;
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  priority: 'critical' | 'high' | 'normal' | 'low';
  preload?: boolean;
  retryAttempts?: number;
  timeout?: number;
  chunkSizeLimit?: number;
  dependencies?: string[];
  fallbackComponent?: React.ComponentType<any>;
}

interface LazyLoaderProps {
  config: LoaderConfig;
  fallback?: React.ReactNode;
  errorBoundary?: React.ComponentType<any>;
  onLoadStart?: (config: LoaderConfig) => void;
  onLoadComplete?: (config: LoaderConfig, metrics: LoadingMetrics) => void;
  onLoadError?: (config: LoaderConfig, error: Error) => void;
  performanceMode?: 'ultra' | 'balanced' | 'conservative';
  children?: React.ReactNode;
}

// Advanced loading states with detailed information
type LoadingState = 
  | { status: 'idle' }
  | { status: 'preloading'; progress: number }
  | { status: 'loading'; progress: number; phase: string }
  | { status: 'success'; component: React.ComponentType<any>; metrics: LoadingMetrics }
  | { status: 'error'; error: Error; retryCount: number }
  | { status: 'timeout'; duration: number };

const LazyLoader: React.FC<LazyLoaderProps> = ({
  config,
  fallback,
  errorBoundary: ErrorBoundary,
  onLoadStart,
  onLoadComplete,
  onLoadError,
  performanceMode = 'ultra',
  children
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' });
  const [metrics, setMetrics] = useState<LoadingMetrics>({
    startTime: 0,
    retryCount: 0,
    cacheHit: false
  });
  
  const componentCache = useRef<ComponentCache>({});
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const abortController = useRef<AbortController | null>(null);

  // Memoized performance configuration based on mode
  const performanceConfig = useMemo(() => {
    switch (performanceMode) {
      case 'ultra':
        return {
          preloadThreshold: 100, // ms
          maxRetries: 5,
          timeout: 30000, // 30s
          cacheSize: 50,
          chunkSizeLimit: 10 * 1024 * 1024, // 10MB
          enablePrefetch: true,
          enableServiceWorker: true
        };
      case 'balanced':
        return {
          preloadThreshold: 300,
          maxRetries: 3,
          timeout: 15000,
          cacheSize: 25,
          chunkSizeLimit: 5 * 1024 * 1024,
          enablePrefetch: true,
          enableServiceWorker: false
        };
      case 'conservative':
        return {
          preloadThreshold: 1000,
          maxRetries: 1,
          timeout: 10000,
          cacheSize: 10,
          chunkSizeLimit: 2 * 1024 * 1024,
          enablePrefetch: false,
          enableServiceWorker: false
        };
    }
  }, [performanceMode]);

  // Advanced component caching system
  const getCachedComponent = useCallback((configId: string) => {
    const cached = componentCache.current[configId];
    if (cached) {
      // Update access metrics
      cached.accessCount++;
      cached.timestamp = Date.now();
      return cached.component;
    }
    return null;
  }, []);

  const setCachedComponent = useCallback((
    configId: string, 
    component: React.ComponentType<any>, 
    memoryFootprint: number = 0
  ) => {
    // Cache size management
    const cache = componentCache.current;
    const cacheKeys = Object.keys(cache);
    
    if (cacheKeys.length >= performanceConfig.cacheSize) {
      // Remove least recently used components
      const sortedKeys = cacheKeys.sort((a, b) => 
        cache[a].timestamp - cache[b].timestamp
      );
      delete cache[sortedKeys[0]];
    }

    cache[configId] = {
      component,
      timestamp: Date.now(),
      accessCount: 1,
      priority: config.priority === 'critical' ? 5 : 
                config.priority === 'high' ? 4 :
                config.priority === 'normal' ? 3 : 2,
      memoryFootprint
    };
  }, [config.priority, performanceConfig.cacheSize]);

  // Performance monitoring
  const measurePerformance = useCallback(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes(config.id)) {
            setMetrics(prev => ({
              ...prev,
              networkLatency: entry.duration,
              memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
            }));
          }
        });
      });
      
      performanceObserver.current.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }, [config.id]);

  // Advanced loading function with retry logic and error handling
  const loadComponent = useCallback(async (retryCount: number = 0): Promise<void> => {
    try {
      // Check cache first
      const cachedComponent = getCachedComponent(config.id);
      if (cachedComponent) {
        setLoadingState({ 
          status: 'success', 
          component: cachedComponent,
          metrics: { ...metrics, cacheHit: true, endTime: Date.now() }
        });
        return;
      }

      // Start loading process
      const startTime = Date.now();
      setMetrics({ startTime, retryCount, cacheHit: false });
      setLoadingState({ status: 'loading', progress: 0, phase: 'initializing' });
      
      onLoadStart?.(config);

      // Create abort controller for this load attempt
      abortController.current = new AbortController();
      
      // Set timeout
      loadingTimeout.current = setTimeout(() => {
        abortController.current?.abort();
        setLoadingState({ 
          status: 'timeout', 
          duration: Date.now() - startTime 
        });
      }, config.timeout || performanceConfig.timeout);

      // Load dependencies first if any
      if (config.dependencies && config.dependencies.length > 0) {
        setLoadingState({ status: 'loading', progress: 20, phase: 'loading dependencies' });
        
        for (const dep of config.dependencies) {
          await import(dep);
        }
      }

      // Load main component
      setLoadingState({ status: 'loading', progress: 60, phase: 'loading component' });
      
      const module = await config.loader();
      
      if (abortController.current?.signal.aborted) {
        throw new Error('Loading aborted');
      }

      setLoadingState({ status: 'loading', progress: 90, phase: 'finalizing' });

      // Measure memory footprint (approximate)
      const memoryBefore = (performance as any).memory?.usedJSHeapSize || 0;
      const component = module.default;
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryFootprint = memoryAfter - memoryBefore;

      // Cache the component
      setCachedComponent(config.id, component, memoryFootprint);

      const endTime = Date.now();
      const finalMetrics: LoadingMetrics = {
        startTime,
        endTime,
        duration: endTime - startTime,
        retryCount,
        memoryUsage: memoryAfter,
        cacheHit: false
      };

      setMetrics(finalMetrics);
      setLoadingState({ 
        status: 'success', 
        component,
        metrics: finalMetrics
      });

      onLoadComplete?.(config, finalMetrics);
      
      // Clear timeout
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }

    } catch (error) {
      const loadError = error as Error;
      
      // Clear timeout
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }

      // Retry logic
      const maxRetries = config.retryAttempts || performanceConfig.maxRetries;
      if (retryCount < maxRetries && !abortController.current?.signal.aborted) {
        console.warn(`🔄 LazyLoader: Retrying ${config.name} (${retryCount + 1}/${maxRetries})`);
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setTimeout(() => loadComponent(retryCount + 1), delay);
        return;
      }

      // Final error state
      setLoadingState({ 
        status: 'error', 
        error: loadError, 
        retryCount 
      });
      
      onLoadError?.(config, loadError);
      console.error(`❌ LazyLoader: Failed to load ${config.name}:`, loadError);
    }
  }, [config, metrics, getCachedComponent, setCachedComponent, onLoadStart, onLoadComplete, onLoadError, performanceConfig]);

  // Preloading logic
  useEffect(() => {
    if (config.preload && performanceConfig.enablePrefetch) {
      // Preload with delay based on priority
      const preloadDelay = config.priority === 'critical' ? 0 :
                          config.priority === 'high' ? 100 :
                          config.priority === 'normal' ? 500 : 1000;
      
      const timer = setTimeout(() => {
        setLoadingState({ status: 'preloading', progress: 0 });
        loadComponent();
      }, preloadDelay);

      return () => clearTimeout(timer);
    }
  }, [config.preload, config.priority, loadComponent, performanceConfig.enablePrefetch]);

  // Initialize performance monitoring
  useEffect(() => {
    measurePerformance();
    return () => {
      performanceObserver.current?.disconnect();
    };
  }, [measurePerformance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      abortController.current?.abort();
      performanceObserver.current?.disconnect();
    };
  }, []);

  // Load component on demand
  useEffect(() => {
    if (loadingState.status === 'idle' && !config.preload) {
      loadComponent();
    }
  }, [loadComponent, loadingState.status, config.preload]);

  // Advanced loading animation component
  const LoadingAnimation = () => (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-slate-900 to-blue-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        {/* Quantum Loading Ring */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 w-12 h-12 border-2 border-transparent border-r-yellow-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          🧠 Loading {config.name}
        </h3>
        
        {loadingState.status === 'loading' && (
          <>
            <p className="text-blue-300 text-sm mb-2">
              Phase: {loadingState.phase}
            </p>
            <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${loadingState.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {loadingState.progress}% • Retry: {metrics.retryCount}
            </p>
          </>
        )}
        
        {performanceMode === 'ultra' && (
          <div className="mt-4 text-xs text-slate-500 space-y-1">
            <div>Priority: {config.priority.toUpperCase()}</div>
            {metrics.duration && <div>Load Time: {metrics.duration}ms</div>}
            {metrics.memoryUsage && <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>}
          </div>
        )}
      </div>
    </motion.div>
  );

  // Error display component
  const ErrorDisplay = ({ error, retryCount }: { error: Error; retryCount: number }) => (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-red-900 to-slate-900 p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-red-400 mb-2">Loading Failed</h3>
      <p className="text-red-300 text-center mb-4">
        Failed to load component: {config.name}
      </p>
      <div className="bg-red-950/50 p-4 rounded-lg border border-red-800 mb-4">
        <p className="text-red-200 text-sm font-mono">
          {error.message}
        </p>
      </div>
      <p className="text-red-400 text-sm mb-4">
        Retry attempts: {retryCount}
      </p>
      
      {config.fallbackComponent && (
        <motion.button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLoadingState({ status: 'idle' })}
        >
          Use Fallback Component
        </motion.button>
      )}
    </motion.div>
  );

  // Render component based on loading state
  const renderContent = () => {
    switch (loadingState.status) {
      case 'idle':
      case 'preloading':
      case 'loading':
        return fallback || <LoadingAnimation />;
        
      case 'success':
        const Component = loadingState.component;
        return ErrorBoundary ? (
          <ErrorBoundary>
            <Component />
            {children}
          </ErrorBoundary>
        ) : (
          <>
            <Component />
            {children}
          </>
        );
        
      case 'error':
        return config.fallbackComponent ? (
          <config.fallbackComponent />
        ) : (
          <ErrorDisplay error={loadingState.error} retryCount={loadingState.retryCount} />
        );
        
      case 'timeout':
        return (
          <motion.div className="flex flex-col items-center justify-center h-full">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-lg font-semibold text-yellow-400">Loading Timeout</h3>
            <p className="text-yellow-300">Component took too long to load ({loadingState.duration}ms)</p>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderContent()}
    </AnimatePresence>
  );
};

// Advanced loader configurations for EuroWeb components  
export const componentLoaders: Record<string, LoaderConfig> = {
  Web8TabSystem: {
    id: 'web8-tab-system',
    name: 'Web8 Tab System',
    loader: async () => {
      try {
        const module = await import('./Web8TabSystem');
        // 🧠 Dynamic Export Detection - Try multiple patterns
        const component = module.default || 
                          (module as any).Web8TabSystem || 
                          (module as any)[Object.keys(module).find(k => k.includes('Web8')) ?? Object.keys(module)[0]];
        return { default: component };
      } catch (error) {
        console.error('🚨 Web8TabSystem loading failed:', error);
        throw error;
      }
    },
    priority: 'critical',
    preload: true,
    retryAttempts: 3,
    timeout: 15000
  },
  
  AGISheetOfficeSuite: {
    id: 'agi-sheet-office',
    name: 'AGI Office Suite',
    loader: async () => {
      try {
        const module = await import('./AGISheetOfficeSuite');
        const component = module.default || 
                          (module as any).AGISheetOfficeSuite || 
                          (module as any)[Object.keys(module).find(k => k.includes('AGI')) ?? Object.keys(module)[0]];
        return { default: component };
      } catch (error) {
        console.error('🚨 AGISheetOfficeSuite loading failed:', error);
        throw error;
      }
    },
    priority: 'high',
    preload: true,
    dependencies: ['./AGISheet/AGISheet']
  },
  
  UTTDashboard: {
    id: 'utt-dashboard',
    name: 'Universal Token Transfer',
    loader: async () => {
      try {
        const module = await import('./UTTDashboard');
        const component = module.default || 
                          (module as any).UTTDashboard || 
                          (module as any)[Object.keys(module).find(k => k.includes('UTT')) ?? Object.keys(module)[0]];
        return { default: component };
      } catch (error) {
        console.error('🚨 UTTDashboard loading failed:', error);
        throw error;
      }
    },
    priority: 'high',
    preload: false
  },
  
  ALBSecurityDashboard: {
    id: 'alb-security',
    name: 'ALB Security System',
    loader: async () => {
      try {
        const module = await import('./ALBSecurityDashboard');
        const component = module.default || 
                          (module as any).ALBSecurityDashboard || 
                          (module as any)[Object.keys(module).find(k => k.includes('ALB')) ?? Object.keys(module)[0]];
        return { default: component };
      } catch (error) {
        console.error('🚨 ALBSecurityDashboard loading failed:', error);
        throw error;
      }
    },
    priority: 'critical',
    preload: true
  },
  
  LoRaPhysicalDashboard: {
    id: 'lora-physical',
    name: 'LoRa Physical Verification',
    loader: async () => {
      try {
        const module = await import('./LoRaPhysicalDashboard');
        const component = module.default || 
                          (module as any).LoRaPhysicalDashboard || 
                          (module as any)[Object.keys(module).find(k => k.includes('LoRa')) ?? Object.keys(module)[0]];
        return { default: component };
      } catch (error) {
        console.error('🚨 LoRaPhysicalDashboard loading failed:', error);
        throw error;
      }
    },
    priority: 'normal',
    preload: false
  }
};

export default LazyLoader;
