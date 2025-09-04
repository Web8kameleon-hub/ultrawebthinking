'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, lazy, useEffect, useState } from 'react';

// Lazy load components
/**
 * Lazily loaded HeavyChart component for improved performance.
 * 
 * This component is loaded on-demand using React's lazy loading functionality
 * to reduce the initial bundle size and improve application startup time.
 * The chart will only be loaded when it's actually needed in the UI.
 * 
 * @
 * ```tsx
 * <Suspense fallback={<div>Loading chart...</div>}>
 *   <HeavyChart data={chartData} />
 * </Suspense>
 * ```
 */
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));
const ImageGallery = lazy(() => import('./ImageGallery'));
const VideoPlayer = lazy(() => import('./VideoPlayer'));

// Loading spinner component
const LoadingSpinner = ({ message = 'Duke ngarkuar...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <motion.div
      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);

// Error boundary for lazy loaded components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Component performance tracker
const useComponentLoadTime = (componentName: string) => {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    setLoadTime(duration);
    console.log(`${componentName} loaded in ${duration}ms`);
  }, [componentName, startTime]);

  return loadTime;
};

export default function LazyLoadingDemo() {
  const [activeTab, setActiveTab] = useState('charts');
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, number>>({});

  const tabs = [
    { id: 'charts', label: '📊 Grafikë', icon: '📈' },
    { id: 'data', label: '📋 Të dhëna', icon: '🗂️' },
    { id: 'gallery', label: '🖼️ Galeri', icon: '🎨' },
    { id: 'video', label: '🎬 Video', icon: '📺' }
  ];

  const handleComponentLoad = (componentName: string) => {
    setLoadedComponents(prev => new Set(prev.add(componentName)));
  };

  const trackPerformance = (componentName: string, loadTime: number) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      [componentName]: loadTime
    }));
  };

  // Error fallback component
  const ErrorFallback = ({ componentName }: { componentName: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Gabim në ngarkimin e komponentit
      </h3>
      <p className="text-red-600 mb-4">
        Komponenti "{componentName}" nuk mund të ngarkohet.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Rifresko faqen
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6"
      >
        <h1 className="text-3xl font-bold mb-2">🚀  e Ngarkimit të Vonuar</h1>
        <p className="text-blue-100">
          Eksploroni komponentët e ngarkuar dinamikisht me React.lazy dhe Suspense
        </p>
      </motion.div>

      {/* Performance Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4">📈 Performanca</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{loadedComponents.size}</div>
            <div className="text-sm text-gray-600">Komponentë të ngarkuar</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{tabs.length}</div>
            <div className="text-sm text-gray-600">Komponentë total</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(performanceMetrics).length > 0
                ? Math.round(Object.values(performanceMetrics).reduce((a, b) => a + b, 0) / Object.values(performanceMetrics).length)
                : 0}ms
            </div>
            <div className="text-sm text-gray-600">Kohë mesatare</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {loadedComponents.size > 0 ? Math.round((loadedComponents.size / tabs.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Progres</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-0 px-6 py-4 text-center font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
              {loadedComponents.has(tab.id) && (
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {activeTab === 'charts' && (
                <LazyErrorBoundary fallback={<ErrorFallback componentName="Grafikë" />}>
                  <Suspense fallback={<LoadingSpinner message="Duke ngarkuar grafikët..." />}>
                    <HeavyChart onLoad={() => handleComponentLoad('charts')} />
                  </Suspense>
                </LazyErrorBoundary>
              )}

              {activeTab === 'data' && (
                <LazyErrorBoundary fallback={<ErrorFallback componentName="Të dhëna" />}>
                  <Suspense fallback={<LoadingSpinner message="Duke ngarkuar tabelën..." />}>
                    <DataTable onLoad={() => handleComponentLoad('data')} />
                  </Suspense>
                </LazyErrorBoundary>
              )}

              {activeTab === 'gallery' && (
                <LazyErrorBoundary fallback={<ErrorFallback componentName="Galeri" />}>
                  <Suspense fallback={<LoadingSpinner message="Duke ngarkuar galerinë..." />}>
                    <ImageGallery onLoad={() => handleComponentLoad('gallery')} />
                  </Suspense>
                </LazyErrorBoundary>
              )}

              {activeTab === 'video' && (
                <LazyErrorBoundary fallback={<ErrorFallback componentName="Video" />}>
                  <Suspense fallback={<LoadingSpinner message="Duke ngarkuar video player..." />}>
                    <VideoPlayer onLoad={() => handleComponentLoad('video')} />
                  </Suspense>
                </LazyErrorBoundary>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

