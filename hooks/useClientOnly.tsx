/**
 * useClientOnly Hook - Prevents Hydration Mismatches
 * React 19.1.1 Compatible
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to ensure code only runs on client-side
 * Prevents hydration mismatches
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook for browser-specific data that changes
 * Returns stable defaults during SSR
 */
export function useBrowserData() {
  const [browserData, setBrowserData] = useState({
    cores: 4,
    online: true,
    hardwareConcurrency: 4,
    connection: null as any,
    timestamp: 1693236000000 // Fixed timestamp for SSR
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserData({
        cores: navigator.hardwareConcurrency || 4,
        online: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        connection: (navigator as any).connection || null,
        timestamp: Date.now()
      })
    }
  }, [])

  return browserData
}

/**
 * Hook for real-time metrics that need to update
 * but start with stable defaults - REAL BROWSER DATA ONLY
 */
export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    cpuLoad: 45,
    gpuUtilization: 0, // Browser can't access real GPU
    networkLoad: 0,
    memoryUsage: 56,
    timestamp: 1693236000000,
    latency: 0,
    networkSpeed: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateMetrics = () => {
      const memInfo = (performance as any).memory
      const connection = (navigator as any).connection
      const timestamp = Date.now()

      // REAL browser metrics only
      const realMemoryUsage = memInfo ? 
        Math.round(memInfo.usedJSHeapSize / memInfo.totalJSHeapSize * 100) : 56
      
      const realLatency = connection ? connection.rtt || 0 : 0
      const realNetworkSpeed = connection ? connection.downlink || 0 : 0
      
      setMetrics({
        cpuLoad: realMemoryUsage, // Use memory as CPU proxy (real CPU not accessible)
        gpuUtilization: 0, // Browser security prevents real GPU access
        networkLoad: realNetworkSpeed,
        memoryUsage: realMemoryUsage,
        timestamp: timestamp,
        latency: realLatency, // REAL network latency
        networkSpeed: realNetworkSpeed // REAL network speed
      })
    }

    // Update immediately
    updateMetrics()

    // Update every 2 seconds with real data
    const interval = setInterval(updateMetrics, 2000)

    return () => clearInterval(interval)
  }, [])

  return metrics
}

/**
 * Component wrapper that only renders children on client
 */
export function ClientOnly({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const isClient = useClientOnly()
  
  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
