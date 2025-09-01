/**
 * AGEIM Monitor Dashboard
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-MONITOR
 * PURPOSE: Real-time monitoring interface for AGEIM development
 */

'use client'

import React, { useState, useEffect } from 'react'
import { cva } from 'class-variance-authority'

const dashboardVariants = cva('p-6 min-h-screen', {
  variants: {
    theme: {
      dark: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white',
      light: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900'
    }
  },
  defaultVariants: {
    theme: 'dark'
  }
})

const cardVariants = cva('rounded-lg p-4 shadow-lg', {
  variants: {
    theme: {
      dark: 'bg-slate-800/80 border border-slate-700',
      light: 'bg-white/80 border border-slate-200'
    },
    status: {
      success: 'border-green-500/50 bg-green-900/20',
      warning: 'border-yellow-500/50 bg-yellow-900/20',
      error: 'border-red-500/50 bg-red-900/20',
      info: 'border-blue-500/50 bg-blue-900/20'
    }
  },
  defaultVariants: {
    theme: 'dark'
  }
})

interface AGEIMStatus {
  isRunning: boolean
  errorCount: number
  lastErrorScan: number
  watchedPaths: string[]
  config: any
}

interface ScanHistory {
  timestamp: number
  errorCount: number
  scanDuration: number
}

export const AGEIMMonitor = () => {
  const [status, setStatus] = useState<AGEIMStatus | null>(null)
  const [history, setHistory] = useState<ScanHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    fetchStatus()
    fetchHistory()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchStatus()
      fetchHistory()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/ageim/monitor?action=status')
      const data = await response.json()
      if (data.ok) {
        setStatus(data.sandbox)
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/ageim/monitor?action=history')
      const data = await response.json()
      if (data.ok) {
        setHistory(data.history)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const startSandbox = async () => {
    try {
      const response = await fetch('/api/ageim/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      const data = await response.json()
      if (data.ok) {
        await fetchStatus()
      }
    } catch (error) {
      console.error('Failed to start sandbox:', error)
    }
  }

  const stopSandbox = async () => {
    try {
      const response = await fetch('/api/ageim/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      })
      const data = await response.json()
      if (data.ok) {
        await fetchStatus()
      }
    } catch (error) {
      console.error('Failed to stop sandbox:', error)
    }
  }

  const triggerScan = async () => {
    try {
      await fetch('/api/ageim/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan' })
      })
    } catch (error) {
      console.error('Failed to trigger scan:', error)
    }
  }

  const triggerFix = async () => {
    try {
      await fetch('/api/ageim/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fix' })
      })
    } catch (error) {
      console.error('Failed to trigger fix:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={dashboardVariants({ theme })}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4">Loading AGEIM Monitor...</span>
        </div>
      </div>
    )
  }

  const getStatusColor = (errorCount: number, isRunning: boolean) => {
    if (!isRunning) return 'error'
    if (errorCount === 0) return 'success'
    if (errorCount < 10) return 'warning'
    return 'error'
  }

  return (
    <div className={dashboardVariants({ theme })}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🧠 AGEIM Development Monitor
          </h1>
          <p className="text-slate-400 mt-2">Real-time TypeScript error monitoring and auto-fixing</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sandbox Status */}
        <div className={cardVariants({ 
          theme, 
          status: status ? getStatusColor(status.errorCount, status.isRunning) : 'info'
        })}>
          <h3 className="text-lg font-semibold mb-2">🏗️ Sandbox Status</h3>
          <p className={`text-2xl font-bold ${status?.isRunning ? 'text-green-400' : 'text-red-400'}`}>
            {status?.isRunning ? 'RUNNING' : 'STOPPED'}
          </p>
          <div className="flex gap-2 mt-4">
            {!status?.isRunning ? (
              <button
                onClick={startSandbox}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopSandbox}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Error Count */}
        <div className={cardVariants({ theme })}>
          <h3 className="text-lg font-semibold mb-2">🚨 TypeScript Errors</h3>
          <p className={`text-2xl font-bold ${
            !status ? 'text-gray-400' :
            status.errorCount === 0 ? 'text-green-400' :
            status.errorCount < 10 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {status?.errorCount ?? '—'}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={triggerScan}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              Scan Now
            </button>
            <button
              onClick={triggerFix}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              Auto Fix
            </button>
          </div>
        </div>

        {/* Last Scan */}
        <div className={cardVariants({ theme })}>
          <h3 className="text-lg font-semibold mb-2">⏰ Last Scan</h3>
          <p className="text-2xl font-bold text-blue-400">
            {status?.lastErrorScan ? 
              new Date(status.lastErrorScan).toLocaleTimeString() : 
              'Never'
            }
          </p>
          <p className="text-sm text-slate-400 mt-2">
            {status?.config?.monitorInterval ? 
              `Next scan in ${Math.ceil(status.config.monitorInterval / 1000)}s` :
              'Auto-scan disabled'
            }
          </p>
        </div>
      </div>

      {/* Error History Chart */}
      <div className={cardVariants({ theme })}>
        <h3 className="text-lg font-semibold mb-4">📊 Error History</h3>
        <div className="h-64 relative">
          {history.length > 0 ? (
            <div className="flex items-end justify-between h-full gap-1">
              {history.slice(-20).map((scan, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{
                    height: `${Math.max(5, (scan.errorCount / Math.max(...history.map(h => h.errorCount))) * 100)}%`
                  }}
                >
                  <div
                    className={`w-4 rounded-t ${
                      scan.errorCount === 0 ? 'bg-green-500' :
                      scan.errorCount < 10 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ height: '100%' }}
                    title={`${scan.errorCount} errors at ${new Date(scan.timestamp).toLocaleTimeString()}`}
                  />
                  <span className="text-xs mt-1 text-slate-400">
                    {scan.errorCount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              No scan history available
            </div>
          )}
        </div>
      </div>

      {/* Configuration */}
      {status?.config && (
        <div className={cardVariants({ theme })}>
          <h3 className="text-lg font-semibold mb-4">⚙️ Configuration</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Auto Fix:</strong> {status.config.autoFix ? '✅' : '❌'}
            </div>
            <div>
              <strong>Auto Restart:</strong> {status.config.autoRestart ? '✅' : '❌'}
            </div>
            <div>
              <strong>Monitor Interval:</strong> {status.config.monitorInterval / 1000}s
            </div>
            <div>
              <strong>Max Errors:</strong> {status.config.maxErrors}
            </div>
          </div>
          <div className="mt-4">
            <strong>Watched Paths:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {status.watchedPaths.map((path, index) => (
                <span key={index} className="px-2 py-1 bg-slate-700 rounded text-xs">
                  {path}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AGEIMMonitor
