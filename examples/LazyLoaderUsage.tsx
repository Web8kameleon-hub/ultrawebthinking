/**
 * 🚀 LazyLoader Usage Example - Performance Optimized Ultra AI Chat
 * Shows how to use Web8 LazyLoader for maximum performance
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-EXAMPLE
 */

"use client"
import React from 'react'
import { LazyLoader, useLazyLoaderMetrics } from '../components/LazyLoader'

// Example: Using LazyLoader in a page
export default function UltraAIChatPage() {
  const { getAllMetrics } = useLazyLoaderMetrics()

  const handleComponentLoad = (metrics: any) => {
    console.log('🎯 Component loaded with metrics:', metrics)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Critical component - loads immediately */}
      <LazyLoader
        component="UltraAIChat"
        variant="neural"
        priority="critical"
        preload={true}
        className="w-full h-full"
        onLoad={handleComponentLoad}
      />

      {/* Viewport optimized component - loads when visible */}
      <LazyLoader
        component="TranslatorUI"
        variant="industrial"
        priority="medium"
        viewport={true}
        className="mt-8"
      />

      {/* Performance metrics display */}
      <div className="fixed bottom-4 right-4 bg-black/50 text-white p-4 rounded-lg text-xs">
        <div>📊 LazyLoader Metrics:</div>
        {getAllMetrics().map((metric, i) => (
          <div key={i}>
            {metric.component}: {metric.loadTime.toFixed(1)}ms
          </div>
        ))}
      </div>
    </div>
  )
}

// Example: Advanced usage with multiple AGI modules
export function AGIDashboardWithLazyLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
      {/* Critical AGI Chat */}
      <LazyLoader
        component="UltraAGIChat"
        variant="royal"
        priority="critical"
        preload={true}
      />

      {/* Bio Analysis - loads on viewport */}
      <LazyLoader
        component="AGIBioNature"
        variant="neural"
        priority="high"
        viewport={true}
      />

      {/* Tab System - low priority */}
      <LazyLoader
        component="Web8TabSystem"
        variant="industrial"
        priority="low"
        viewport={true}
      />

      {/* Real-time AGI - medium priority */}
      <LazyLoader
        component="RealTimeAGI"
        variant="neural"
        priority="medium"
        viewport={true}
      />
    </div>
  )
}
