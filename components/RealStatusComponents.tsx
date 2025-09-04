/**
 * Real Status Components - Industrial Production UI
 * No mock, no fake - only real service states
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

'use client'

import { useEffect, useState } from 'react'

// Real Service Status Types
export type ServiceStatus = 'active' | 'error' | 'degraded' | 'maintenance' | 'unknown'

interface RealStatusBadgeProps {
  service: string
  status: ServiceStatus
  lastUpdate?: string
  metrics?: {
    latency?: number
    uptime?: number
    errorRate?: number
  }
}

interface RealMetric {
  label: string
  value: string | number
  unit?: string
  status: ServiceStatus
  trend?: 'up' | 'down' | 'stable'
  lastUpdate: string
}

interface LivePulseProps {
  isLive: boolean
  service: string
  className?: string
}

interface RealSkeletonProps {
  loading: boolean
  children: React.ReactNode
  className?: string
}

// ✅ 1. Real Status Badge Component
export function RealStatusBadge({ service, status, lastUpdate, metrics }: RealStatusBadgeProps) {
  const getStatusStyles = (status: ServiceStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'maintenance':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'active': return '●'
      case 'error': return '✕'
      case 'degraded': return '⚠'
      case 'maintenance': return '🔧'
      default: return '?'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`
        px-2 py-1 rounded text-xs font-medium border
        ${getStatusStyles(status)}
      `}>
        {getStatusIcon(status)} {service.toUpperCase()} {status.toUpperCase()}
      </span>
      
      {metrics && (
        <div className="text-xs text-neutral-500 space-x-2">
          {metrics.latency && <span>{metrics.latency}ms</span>}
          {metrics.uptime && <span>{metrics.uptime.toFixed(1)}%</span>}
          {metrics.errorRate && <span>{metrics.errorRate.toFixed(2)}% err</span>}
        </div>
      )}
      
      {lastUpdate && (
        <span className="text-xs text-neutral-600">
          {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

// ✅ 2. Real Skeleton Loader (only during actual loading)
export function RealSkeleton({ loading, children, className = "" }: RealSkeletonProps) {
  if (!loading) return <>{children}</>
  
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-6 w-32 bg-neutral-800 rounded" />
    </div>
  )
}

// ✅ 3. Live Pulse Indicator (real heartbeat from server)
export function LivePulse({ isLive, service, className = "" }: LivePulseProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`
        h-3 w-3 rounded-full
        ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
      `} />
      <span className={`text-xs font-medium ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
        {service} {isLive ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  )
}

// ✅ 4. Real Metrics Display
export function RealMetricCard({ label, value, unit, status, trend, lastUpdate }: RealMetric) {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      case 'stable': return '→'
      default: return ''
    }
  }

  const getValueColor = (status: ServiceStatus) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'degraded': return 'text-yellow-400'
      default: return 'text-neutral-300'
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold ${getValueColor(status)}`}>
            {value}{unit && <span className="text-sm text-neutral-500">{unit}</span>}
          </p>
        </div>
        
        {trend && (
          <span className={`text-lg ${getValueColor(status)}`}>
            {getTrendIcon(trend)}
          </span>
        )}
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <RealStatusBadge service={label} status={status} />
        <span className="text-xs text-neutral-600">
          {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

// ✅ 5. Real Service Panel (grouped service status)
interface ServicePanelProps {
  title: string
  services: Array<{
    name: string
    status: ServiceStatus
    isLive: boolean
    metrics?: any
  }>
}

export function RealServicePanel({ title, services }: ServicePanelProps) {
  const allActive = services.every(s => s.status === 'active')
  const hasErrors = services.some(s => s.status === 'error')
  
  return (
    <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-neutral-100">{title}</h3>
        <div className={`
          px-3 py-1 rounded text-sm font-medium
          ${allActive ? 'bg-green-500/20 text-green-400' : 
            hasErrors ? 'bg-red-500/20 text-red-400' : 
            'bg-yellow-500/20 text-yellow-400'}
        `}>
          {allActive ? 'ALL SYSTEMS NOMINAL' : hasErrors ? 'DEGRADED' : 'PARTIAL'}
        </div>
      </div>
      
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex justify-between items-center">
            <LivePulse 
              isLive={service.isLive} 
              service={service.name}
              className="flex-1"
            />
            <RealStatusBadge 
              service={service.name}
              status={service.status}
              metrics={service.metrics}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ✅ 6. Real Logs Display
interface RealLogsProps {
  logs: Array<{
    timestamp: string
    level: 'info' | 'warn' | 'error'
    service: string
    message: string
  }>
  maxLines?: number
}

export function RealLogs({ logs, maxLines = 10 }: RealLogsProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400'
      case 'warn': return 'text-yellow-400'
      default: return 'text-neutral-400'
    }
  }

  const recentLogs = logs.slice(-maxLines)

  return (
    <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
      <h3 className="text-sm font-bold text-neutral-100 mb-3">SYSTEM LOGS</h3>
      <ul className="text-xs font-mono space-y-1 max-h-48 overflow-y-auto">
        {recentLogs.map((log, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-neutral-600">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`font-medium ${getLevelColor(log.level)}`}>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-neutral-500">
              {log.service}:
            </span>
            <span className="text-neutral-300">
              {log.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ✅ Custom Hook for Real Service Status
export function useRealServiceStatus(serviceName: string) {
  const [status, setStatus] = useState<ServiceStatus>('unknown')
  const [isLive, setIsLive] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    let mounted = true
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status/${serviceName}`, {
          cache: 'no-store'
        })
        
        if (!mounted) return
        
        if (response.ok) {
          const data = await response.json()
          setStatus(data.status || 'active')
          setIsLive(data.isLive || true)
          setMetrics(data.metrics || null)
          setLastUpdate(new Date().toISOString())
        } else {
          setStatus('error')
          setIsLive(false)
        }
      } catch (error) {
        if (mounted) {
          setStatus('error')
          setIsLive(false)
        }
      }
    }

    // Initial check
    checkStatus()
    
    // Periodic checks every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [serviceName])

  return { status, isLive, metrics, lastUpdate }
}
