/**
 * Global Data Dashboard
 * Professional Real-Time System Monitoring
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Quantum Industrial
 * @license MIT
 * @created September 3, 2025
 */

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import NavBreadcrumb from './NavBreadcrumb'

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    model: string
    temperature: number
  }
  memory: {
    used: number
    total: number
    free: number
    cached: number
  }
  agi: {
    status: string
    neuralNetworks: number
    activeConnections: number
    processingPower: number
  }
  network: {
    latency: number
    throughput: number
    activeConnections: number
    dataTransfer: number
  }
}

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical'
  uptime: number
  lastUpdate: Date
  errors: number
  warnings: number
}

export default function GlobalDataDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000)

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const [metricsRes, healthRes] = await Promise.all([
          fetch('/api/system/metrics'),
          fetch('/api/system/health')
        ])

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json()
          setMetrics(metricsData.data)
        }

        if (healthRes.ok) {
          const healthData = await healthRes.json()
          setHealth(healthData.data)
        }
      } catch (error) {
        console.error('Failed to load system data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSystemData()
    const interval = setInterval(loadSystemData, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  const getHealthColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-gray-400">Loading system data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <NavBreadcrumb />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              🌐 EuroWeb Ultra Dashboard
            </h1>
            <p className="text-gray-400 text-lg mt-2">
              Real-Time System Monitoring • Swiss Precision Engineering
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/kristal" 
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:via-blue-700 hover:to-green-700 transition-colors text-center"
            >
              💎 Kristal Dashboard
            </Link>
            
            <Link 
              href="/light" 
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-colors"
            >
              ⚡ Light Mode
            </Link>
            
            <Link 
              href="/testing" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              🧪 Heavy Testing
            </Link>
            
            <Link 
              href="/admin" 
              className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-colors"
            >
              ⚡ Admin Panel
            </Link>
            
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              title="Refresh interval"
            >
              <option value={1000}>1s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
            </select>
          </div>
        </div>

        {/* System Health Overview */}
        {health && (
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">🏥 System Health</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getHealthColor(health.overall)}`}>
                  {health.overall.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400">Overall Status</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {formatUptime(health.uptime)}
                </div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {health.warnings}
                </div>
                <div className="text-sm text-gray-400">Warnings</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {health.errors}
                </div>
                <div className="text-sm text-gray-400">Errors</div>
              </div>
            </div>
          </div>
        )}

        {/* System Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CPU Metrics */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">💻 CPU Performance</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Usage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2 relative">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-300 absolute top-0 left-0"
                        data-width={`${metrics.cpu.usage}%`}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{metrics.cpu.usage.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cores</span>
                  <span className="text-white font-medium">{metrics.cpu.cores}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Model</span>
                  <span className="text-white font-medium text-sm">{metrics.cpu.model}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Temperature</span>
                  <span className={`font-medium ${metrics.cpu.temperature > 70 ? 'text-red-400' : 'text-green-400'}`}>
                    {metrics.cpu.temperature}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Memory Metrics */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">🧠 Memory Usage</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Used</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2 relative">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300 absolute top-0 left-0"
                        data-width={`${(metrics.memory.used / metrics.memory.total) * 100}%`}
                      ></div>
                    </div>
                    <span className="text-white font-medium">
                      {((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total</span>
                  <span className="text-white font-medium">{formatBytes(metrics.memory.total)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Free</span>
                  <span className="text-green-400 font-medium">{formatBytes(metrics.memory.free)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cached</span>
                  <span className="text-blue-400 font-medium">{formatBytes(metrics.memory.cached)}</span>
                </div>
              </div>
            </div>

            {/* AGI Metrics */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">🤖 AGI Core</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-medium px-2 py-1 rounded text-xs ${
                    metrics.agi.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {metrics.agi.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Neural Networks</span>
                  <span className="text-purple-400 font-medium">{metrics.agi.neuralNetworks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Connections</span>
                  <span className="text-blue-400 font-medium">{metrics.agi.activeConnections}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Processing Power</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2 relative">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300 absolute top-0 left-0"
                        data-width={`${metrics.agi.processingPower}%`}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{metrics.agi.processingPower}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Metrics */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">🌐 Network Performance</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Latency</span>
                  <span className={`font-medium ${metrics.network.latency > 100 ? 'text-red-400' : 'text-green-400'}`}>
                    {metrics.network.latency}ms
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Throughput</span>
                  <span className="text-blue-400 font-medium">{formatBytes(metrics.network.throughput)}/s</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Connections</span>
                  <span className="text-yellow-400 font-medium">{metrics.network.activeConnections}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Data Transfer</span>
                  <span className="text-green-400 font-medium">{formatBytes(metrics.network.dataTransfer)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/testing" 
              className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 text-center hover:bg-purple-900/50 transition-colors"
            >
              <div className="text-2xl mb-2">🧪</div>
              <div className="text-sm font-medium text-purple-300">Heavy Testing</div>
            </Link>
            
            <button className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-center hover:bg-blue-900/50 transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-blue-300">Analytics</div>
            </button>
            
            <button className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-center hover:bg-green-900/50 transition-colors">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium text-green-300">Settings</div>
            </button>
            
            <button className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-center hover:bg-yellow-900/50 transition-colors">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-yellow-300">Logs</div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          🌐 EuroWeb Ultra Platform • Real-Time Monitoring • Swiss Precision Engineering
        </div>

      </div>
    </div>
  )
}
