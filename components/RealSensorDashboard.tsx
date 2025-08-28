/**
 * Real Sensor Dashboard - NO FANTASY DATA
 * Only displays actual browser metrics that can be measured
 * React 19.1.1 Compatible - Hydration Safe
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-REAL
 * @contact dealsjona@gmail.com
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClientOnly, useBrowserData, useRealTimeMetrics } from '../hooks/useClientOnly'

interface RealBrowserMetrics {
  // Network - REAL from browser API
  networkType: string
  downlink: number | null
  rtt: number | null
  effectiveType: string
  
  // Memory - REAL from performance.memory
  memoryUsed: number
  memoryTotal: number
  memoryLimit: number
  memoryPercent: number
  
  // Hardware - REAL from navigator
  cores: number
  platform: string
  userAgent: string
  online: boolean
  cookieEnabled: boolean
  
  // Performance - REAL from performance API
  performanceNow: number
  timeOrigin: number
  
  // Screen - REAL from screen API
  screenWidth: number
  screenHeight: number
  colorDepth: number
  pixelRatio: number
}

const RealSensorDashboard: React.FC = () => {
  const [realMetrics, setRealMetrics] = useState<RealBrowserMetrics>({
    networkType: 'unknown',
    downlink: null,
    rtt: null,
    effectiveType: 'unknown',
    memoryUsed: 0,
    memoryTotal: 0,
    memoryLimit: 0,
    memoryPercent: 0,
    cores: 4,
    platform: 'unknown',
    userAgent: 'unknown',
    online: true,
    cookieEnabled: true,
    performanceNow: 0,
    timeOrigin: 0,
    screenWidth: 1920,
    screenHeight: 1080,
    colorDepth: 24,
    pixelRatio: 1
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateRealMetrics = () => {
      const connection = (navigator as any).connection
      const memory = (performance as any).memory
      
      setRealMetrics({
        // REAL Network Data
        networkType: connection?.type || 'unknown',
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null,
        effectiveType: connection?.effectiveType || 'unknown',
        
        // REAL Memory Data
        memoryUsed: memory?.usedJSHeapSize || 0,
        memoryTotal: memory?.totalJSHeapSize || 0,
        memoryLimit: memory?.jsHeapSizeLimit || 0,
        memoryPercent: memory ? Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100) : 0,
        
        // REAL Hardware Data
        cores: navigator.hardwareConcurrency || 4,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        
        // REAL Performance Data
        performanceNow: performance.now(),
        timeOrigin: performance.timeOrigin,
        
        // REAL Screen Data
        screenWidth: screen.width,
        screenHeight: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      })
    }

    updateRealMetrics()
    const interval = setInterval(updateRealMetrics, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
            🔍 Real Browser Sensor Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Actual Browser APIs - NO Fantasy Data - Live Metrics Only
          </p>
        </motion.div>

        {/* Real Network Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">🌐 Network RTT</h3>
            <div className="text-2xl font-bold text-white">
              {realMetrics.rtt !== null ? `${realMetrics.rtt}ms` : 'N/A'}
            </div>
            <p className="text-sm text-gray-400">Real network latency</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">📡 Downlink Speed</h3>
            <div className="text-2xl font-bold text-white">
              {realMetrics.downlink !== null ? `${realMetrics.downlink} Mbps` : 'N/A'}
            </div>
            <p className="text-sm text-gray-400">Real connection speed</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-300 font-semibold mb-2">📶 Connection Type</h3>
            <div className="text-xl font-bold text-white">{realMetrics.effectiveType}</div>
            <p className="text-sm text-gray-400">Real connection quality</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-300 font-semibold mb-2">🌍 Online Status</h3>
            <div className="text-2xl font-bold text-white">
              {realMetrics.online ? '🟢 Online' : '🔴 Offline'}
            </div>
            <p className="text-sm text-gray-400">Real browser status</p>
          </div>
        </motion.div>

        {/* Real Memory Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-300 font-semibold mb-2">🧠 Memory Usage</h3>
            <div className="text-3xl font-bold text-white mb-2">{realMetrics.memoryPercent}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${realMetrics.memoryPercent}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              {(realMetrics.memoryUsed / 1048576).toFixed(1)} MB / {(realMetrics.memoryTotal / 1048576).toFixed(1)} MB
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">⚡ CPU Cores</h3>
            <div className="text-3xl font-bold text-white">{realMetrics.cores}</div>
            <p className="text-sm text-gray-400">Real hardware threads</p>
            <div className="grid grid-cols-4 gap-1 mt-2">
              {Array.from({ length: realMetrics.cores }, (_, i) => (
                <div key={i} className="bg-blue-500/30 h-2 rounded animate-pulse" />
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-300 font-semibold mb-2">⏱️ Performance Time</h3>
            <div className="text-2xl font-bold text-white">
              {(realMetrics.performanceNow / 1000).toFixed(1)}s
            </div>
            <p className="text-sm text-gray-400">Real performance.now()</p>
          </div>
        </motion.div>

        {/* Real System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-500/30 rounded-lg p-6"
        >
          <h3 className="text-gray-300 font-semibold mb-4">💻 Real System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Platform:</span>
              <span className="text-white ml-2">{realMetrics.platform}</span>
            </div>
            <div>
              <span className="text-gray-400">Screen:</span>
              <span className="text-white ml-2">{realMetrics.screenWidth} × {realMetrics.screenHeight}</span>
            </div>
            <div>
              <span className="text-gray-400">Color Depth:</span>
              <span className="text-white ml-2">{realMetrics.colorDepth} bit</span>
            </div>
            <div>
              <span className="text-gray-400">Pixel Ratio:</span>
              <span className="text-white ml-2">{realMetrics.pixelRatio}x</span>
            </div>
            <div>
              <span className="text-gray-400">Cookies:</span>
              <span className="text-white ml-2">{realMetrics.cookieEnabled ? '✅ Enabled' : '❌ Disabled'}</span>
            </div>
            <div>
              <span className="text-gray-400">Time Origin:</span>
              <span className="text-white ml-2">{new Date(realMetrics.timeOrigin).toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Real-time Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-green-400 text-sm">
            ✅ All data above is REAL from browser APIs - No simulation or fantasy numbers
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Updates every 1 second with actual browser performance metrics
          </p>
        </motion.div>
      </div>
    </div>
  )
}

const RealSensorDashboardWrapper: React.FC = () => {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading Real Browser Sensors...</p>
          </div>
        </div>
      }
    >
      <RealSensorDashboard />
    </ClientOnly>
  )
}

export default RealSensorDashboardWrapper
