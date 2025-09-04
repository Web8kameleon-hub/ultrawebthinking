/**
 * Real Charts Components - No Mock Data
 * Connected to real APIs with live metrics
 * @author Ledjan Ahmati  
 * @version 8.0.0 Industrial Production
 */

'use client'

import { useEffect, useState } from 'react'

interface ChartDataPoint {
  timestamp: string
  value: number
  label?: string
}

interface RealMetricsChartProps {
  title: string
  apiEndpoint: string
  dataKey: string
  unit?: string
  color?: string
  className?: string
  refreshInterval?: number
}

interface SystemMetric {
  cpu: number
  memory: number
  network: number
  timestamp: string
}

// ✅ Real-time Line Chart Component
export function RealMetricsChart({ 
  title, 
  apiEndpoint, 
  dataKey, 
  unit = '', 
  color = '#22c55e',
  className = '',
  refreshInterval = 5000 
}: RealMetricsChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, { cache: 'no-store' })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const result = await response.json()
        
        if (!mounted) return
        
        if (result && typeof result[dataKey] !== 'undefined') {
          const newPoint: ChartDataPoint = {
            timestamp: new Date().toISOString(),
            value: Number(result[dataKey]) || 0
          }
          
          setData(prev => {
            const updated = [...prev, newPoint]
            // Keep only last 20 points for performance
            return updated.slice(-20)
          })
          setError(null)
        }
        setLoading(false)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Fetch failed')
          setLoading(false)
        }
      }
    }

    // Initial fetch
    fetchData()
    
    // Set up interval
    const interval = setInterval(fetchData, refreshInterval)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [apiEndpoint, dataKey, refreshInterval])

  if (loading) {
    return (
      <div className={`bg-neutral-900 border border-neutral-700 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 w-32 bg-neutral-800 rounded mb-4" />
          <div className="h-32 bg-neutral-800 rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-neutral-900 border border-red-500/30 rounded-lg p-4 ${className}`}>
        <h3 className="text-sm font-bold text-neutral-100 mb-2">{title}</h3>
        <div className="text-red-400 text-sm">
          ⚠ {error}
        </div>
      </div>
    )
  }

  const currentValue = data[data.length - 1]?.value || 0
  const maxValue = Math.max(...data.map(d => d.value), 100)

  return (
    <div className={`bg-neutral-900 border border-neutral-700 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-neutral-100">{title}</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-neutral-100">
            {currentValue.toFixed(1)}{unit}
          </div>
          <div className="text-xs text-neutral-500">LIVE</div>
        </div>
      </div>
      
      {/* Simple SVG Chart */}
      <div className="h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Data line */}
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 300
                const y = 100 - (point.value / maxValue) * 90
                return `${x},${y}`
              }).join(' ')}
            />
          )}
          
          {/* Current value dot */}
          {data.length > 0 && (
            <circle
              cx="300"
              cy={100 - (currentValue / maxValue) * 90}
              r="3"
              fill={color}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>
    </div>
  )
}

// ✅ Real System Overview Dashboard
export function RealSystemDashboard() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const fetchMetrics = async () => {
      try {
        const [cpuRes, memRes, netRes] = await Promise.all([
          fetch('/api/system/cpu', { cache: 'no-store' }),
          fetch('/api/system/memory', { cache: 'no-store' }),
          fetch('/api/system/network', { cache: 'no-store' })
        ])
        
        if (!mounted) return
        
        const [cpu, memory, network] = await Promise.all([
          cpuRes.ok ? cpuRes.json() : { usage: 0 },
          memRes.ok ? memRes.json() : { usage: 0 },
          netRes.ok ? netRes.json() : { usage: 0 }
        ])
        
        const newMetric: SystemMetric = {
          cpu: cpu.usage || 0,
          memory: memory.usage || 0, 
          network: network.usage || 0,
          timestamp: new Date().toISOString()
        }
        
        setMetrics(prev => [...prev, newMetric].slice(-50)) // Keep last 50 points
        setLoading(false)
      } catch (error) {
        console.error('System metrics fetch failed:', error)
        if (mounted) setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 3000) // Every 3 seconds
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 w-20 bg-neutral-800 rounded mb-2" />
              <div className="h-8 w-16 bg-neutral-800 rounded mb-4" />
              <div className="h-24 bg-neutral-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const currentMetrics = metrics[metrics.length - 1] || { cpu: 0, memory: 0, network: 0 }

  return (
    <div className="space-y-6">
      {/* Current Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500 uppercase">CPU Usage</p>
              <p className="text-2xl font-bold text-blue-400">{currentMetrics.cpu.toFixed(1)}%</p>
            </div>
            <div className={`h-3 w-3 rounded-full ${currentMetrics.cpu < 80 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500 uppercase">Memory Usage</p>
              <p className="text-2xl font-bold text-green-400">{currentMetrics.memory.toFixed(1)}%</p>
            </div>
            <div className={`h-3 w-3 rounded-full ${currentMetrics.memory < 85 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500 uppercase">Network I/O</p>
              <p className="text-2xl font-bold text-purple-400">{currentMetrics.network.toFixed(1)} MB/s</p>
            </div>
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RealMetricsChart
          title="CPU Load"
          apiEndpoint="/api/system/cpu"
          dataKey="usage"
          unit="%"
          color="#3b82f6"
        />
        
        <RealMetricsChart
          title="Memory Usage"
          apiEndpoint="/api/system/memory"
          dataKey="usage"
          unit="%"
          color="#22c55e"
        />
        
        <RealMetricsChart
          title="Network I/O"
          apiEndpoint="/api/system/network"
          dataKey="usage"
          unit=" MB/s"
          color="#a855f7"
        />
      </div>
    </div>
  )
}

// ✅ Real Aviation Weather Chart
export function RealAviationChart({ icao = 'LYTV' }: { icao?: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/aviation/${icao}`, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Weather data unavailable`)
        
        const result = await response.json()
        if (mounted) {
          setData(result)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Fetch failed')
          setLoading(false)
        }
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 300000) // Every 5 minutes
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [icao])

  if (loading) {
    return (
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 w-32 bg-neutral-800 rounded" />
          <div className="h-16 bg-neutral-800 rounded" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-neutral-900 border border-red-500/30 rounded-lg p-4">
        <h3 className="text-sm font-bold text-neutral-100 mb-2">Aviation Weather</h3>
        <div className="text-red-400 text-sm">⚠ {error || 'No data'}</div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-neutral-100">Aviation Weather - {icao}</h3>
        <div className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
      </div>
      
      {data.metar && (
        <div className="space-y-2">
          <div className="text-xs text-neutral-500">METAR</div>
          <div className="font-mono text-sm text-neutral-300 bg-neutral-800 p-2 rounded">
            {data.metar.raw_text || 'N/A'}
          </div>
        </div>
      )}
      
      {data.taf && (
        <div className="space-y-2 mt-4">
          <div className="text-xs text-neutral-500">TAF</div>
          <div className="font-mono text-sm text-neutral-300 bg-neutral-800 p-2 rounded">
            {data.taf.raw_text || 'N/A'}
          </div>
        </div>
      )}
    </div>
  )
}
