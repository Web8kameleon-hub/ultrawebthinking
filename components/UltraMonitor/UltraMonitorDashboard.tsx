/**
 * EuroWeb Ultra Monitor Dashboard - Industrial Production Grade
 * Real-time system metrics, AGI monitoring, and comprehensive analytics
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial Production
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

// Interfaces for real-time data
interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature: number
  }
  memory: {
    total: number
    used: number
    available: number
    percentage: number
  }
  gpu: {
    usage: number
    memory: number
    temperature: number
  }
  network: {
    rxBytes: number
    txBytes: number
    latency: number
  }
  timestamp: string
}

interface AGIMetrics {
  core: {
    status: 'active' | 'idle' | 'error'
    connections: number
    throughput: number
    responseTime: number
  }
  semantic: {
    operations: number
    accuracy: number
    processingSpeed: number
  }
  memory: {
    blocks: number
    efficiency: number
    retrieval: number
  }
  learning: {
    rate: number
    adaptation: number
    improvement: number
  }
  ethical: {
    compliance: number
    monitoring: boolean
    flags: number
  }
  timestamp: string
}

interface SecurityMetrics {
  threats: number
  blocked: number
  alerts: Array<{
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    timestamp: string
  }>
  firewall: {
    status: 'active' | 'inactive'
    rules: number
    blocked: number
  }
  encryption: {
    level: string
    protocols: string[]
  }
}

interface NetworkStatus {
  interfaces: Array<{
    name: string
    status: 'up' | 'down'
    speed: string
    rxBytes: number
    txBytes: number
    errors: number
  }>
  wireless: {
    connected: boolean
    ssid: string
    signal: number
    frequency: string
  }
  lora: {
    status: 'connected' | 'disconnected'
    nodes: number
    signal: number
    frequency: string
  }
}

export default function UltraMonitorDashboard() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [agiMetrics, setAGIMetrics] = useState<AGIMetrics | null>(null)
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null)
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Real-time data fetching
  const fetchSystemMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/system/metrics', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setSystemMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error)
      setIsConnected(false)
    }
  }, [])

  const fetchAGIMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/agi/metrics', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setAGIMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch AGI metrics:', error)
    }
  }, [])

  const fetchSecurityMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/security/metrics', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setSecurityMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch security metrics:', error)
    }
  }, [])

  const fetchNetworkStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/network/status', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setNetworkStatus(data)
      }
    } catch (error) {
      console.error('Failed to fetch network status:', error)
    }
  }, [])

  // Initialize and set up real-time updates
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchSystemMetrics(),
        fetchAGIMetrics(),
        fetchSecurityMetrics(),
        fetchNetworkStatus()
      ])
      setLastUpdate(new Date().toLocaleString())
      setIsConnected(true)
    }

    fetchAllData()

    // Real-time updates every 2 seconds
    const interval = setInterval(fetchAllData, 2000)

    return () => clearInterval(interval)
  }, [fetchSystemMetrics, fetchAGIMetrics, fetchSecurityMetrics, fetchNetworkStatus])

  // Status indicator component
  const StatusIndicator = ({ status, label }: { status: boolean | string, label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        status === true || status === 'active' || status === 'connected' || status === 'up' 
          ? 'bg-green-500 animate-pulse' 
          : 'bg-red-500'
      }`} />
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  )

  // Metric card component
  const MetricCard = ({ title, value, unit, status, icon }: {
    title: string
    value: string | number
    unit?: string
    status?: 'good' | 'warning' | 'critical'
    icon: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`w-2 h-2 rounded-full ${
          status === 'good' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
        }`} />
      </div>
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400">{unit}</span>}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">📊 Ultra Monitor Dashboard</h1>
          <div className="flex items-center gap-4">
            <StatusIndicator status={isConnected} label="System Connection" />
            <span className="text-sm text-gray-400">Last Update: {lastUpdate}</span>
          </div>
        </div>
        <p className="text-gray-400">Real-time monitoring of AGI systems, infrastructure, and security</p>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemMetrics && (
          <>
            <MetricCard
              title="CPU Usage"
              value={systemMetrics.cpu.usage.toFixed(1)}
              unit="%"
              status={systemMetrics.cpu.usage > 80 ? 'critical' : systemMetrics.cpu.usage > 60 ? 'warning' : 'good'}
              icon="🖥️"
            />
            <MetricCard
              title="Memory Usage"
              value={systemMetrics.memory.percentage.toFixed(1)}
              unit="%"
              status={systemMetrics.memory.percentage > 85 ? 'critical' : systemMetrics.memory.percentage > 70 ? 'warning' : 'good'}
              icon="🧠"
            />
            <MetricCard
              title="GPU Usage"
              value={systemMetrics.gpu.usage.toFixed(1)}
              unit="%"
              status={systemMetrics.gpu.usage > 90 ? 'critical' : systemMetrics.gpu.usage > 75 ? 'warning' : 'good'}
              icon="🎮"
            />
            <MetricCard
              title="Network Latency"
              value={systemMetrics.network.latency.toFixed(0)}
              unit="ms"
              status={systemMetrics.network.latency > 100 ? 'critical' : systemMetrics.network.latency > 50 ? 'warning' : 'good'}
              icon="📡"
            />
          </>
        )}
      </div>

      {/* AGI Metrics Section */}
      {agiMetrics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🧠 AGI Core Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Core Status"
              value={agiMetrics.core.status.toUpperCase()}
              status={agiMetrics.core.status === 'active' ? 'good' : 'critical'}
              icon="⚡"
            />
            <MetricCard
              title="Neural Connections"
              value={agiMetrics.core.connections}
              status="good"
              icon="🔗"
            />
            <MetricCard
              title="Learning Rate"
              value={agiMetrics.learning.rate.toFixed(3)}
              status="good"
              icon="📈"
            />
            <MetricCard
              title="Memory Efficiency"
              value={agiMetrics.memory.efficiency.toFixed(1)}
              unit="%"
              status={agiMetrics.memory.efficiency > 90 ? 'good' : 'warning'}
              icon="💾"
            />
            <MetricCard
              title="Ethical Compliance"
              value={agiMetrics.ethical.compliance}
              unit="%"
              status={agiMetrics.ethical.compliance === 100 ? 'good' : 'critical'}
              icon="🛡️"
            />
          </div>
        </div>
      )}

      {/* Security Section */}
      {securityMetrics && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔒 Security Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Threat Detection</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Threats Detected:</span>
                  <span className="font-bold text-red-400">{securityMetrics.threats}</span>
                </div>
                <div className="flex justify-between">
                  <span>Threats Blocked:</span>
                  <span className="font-bold text-green-400">{securityMetrics.blocked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Firewall Status:</span>
                  <StatusIndicator status={securityMetrics.firewall.status === 'active'} label="Active" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {securityMetrics.alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="text-sm">
                    <div className={`flex items-center gap-2 ${
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'high' ? 'text-orange-400' :
                      alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      <span className="font-medium">{alert.type}</span>
                      <span className="text-xs">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Encryption</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-bold text-green-400">{securityMetrics.encryption.level}</span>
                </div>
                <div>
                  <span className="block mb-2">Protocols:</span>
                  <div className="flex flex-wrap gap-1">
                    {securityMetrics.encryption.protocols.map((protocol, index) => (
                      <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Status Section */}
      {networkStatus && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🌐 Network Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Network Interfaces */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Network Interfaces</h3>
              <div className="space-y-3">
                {networkStatus.interfaces.map((iface, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{iface.name}</span>
                    <StatusIndicator status={iface.status === 'up'} label={iface.speed} />
                  </div>
                ))}
              </div>
            </div>

            {/* Wireless Status */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Wireless Connection</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <StatusIndicator status={networkStatus.wireless.connected} label="Connected" />
                </div>
                <div className="flex justify-between">
                  <span>SSID:</span>
                  <span className="font-mono text-sm">{networkStatus.wireless.ssid}</span>
                </div>
                <div className="flex justify-between">
                  <span>Signal:</span>
                  <span className="font-bold">{networkStatus.wireless.signal} dBm</span>
                </div>
              </div>
            </div>

            {/* LoRa Network */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">LoRa Network</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <StatusIndicator status={networkStatus.lora.status === 'connected'} label="Gateway" />
                </div>
                <div className="flex justify-between">
                  <span>Active Nodes:</span>
                  <span className="font-bold">{networkStatus.lora.nodes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-mono text-sm">{networkStatus.lora.frequency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>EuroWeb Ultra Platform - Industrial Grade Monitoring • Version 8.0.0</p>
        <p>© 2024 Ledjan Ahmati - Real-time data updates every 2 seconds</p>
      </div>
    </div>
  )
}
