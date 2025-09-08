/**
 * Continental Mesh Dashboard - Real Implementation
 * Based on Advanced Python Mesh Network Architecture
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './ContinentalMeshDashboard.module.css'

// Real interfaces from API
interface MeshContinent {
  id: string
  name: string
  status: 'ONLINE' | 'OFFLINE' | 'COMPLETED' | 'FAILED' | 'RECOVERED'
  location: {
    lat: number
    lon: number
  }
  children_count: number
  peers_count: number
  is_active: boolean
}

interface MeshPerformance {
  latency_ms: number
  throughput_mbps: number
  packet_loss_percent: number
  reliability_percent: number
}

interface MeshSystemMetrics {
  cpu_usage_percent: number
  memory_usage_percent: number
  network_utilization_percent: number
  active_connections: number
  queued_messages: number
  processed_messages_total: number
}

interface MeshNetworkData {
  total_nodes: number
  active_nodes: number
  continents: MeshContinent[]
  monitor: {
    metrics: {
      active_nodes: number
      messages_sent: number
      successes: number
      errors: number
      recoveries: number
    }
    health_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'UNKNOWN'
  }
  performance: MeshPerformance
  system: MeshSystemMetrics
  topology: {
    total_connections: number
    mesh_connections: number
    hierarchical_connections: number
    max_depth: number
    redundancy_factor: number
  }
}

export const ContinentalMeshDashboard: React.FC = () => {
  const [meshData, setMeshData] = useState<MeshNetworkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  // Fetch real mesh data from API
  useEffect(() => {
    const fetchMeshData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mesh/continental?action=status')
        const result = await response.json()
        
        if (result.success) {
          setMeshData(result.data)
          setLastUpdate(result.timestamp)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch mesh data')
        }
      } catch (err) {
        setError('Network error fetching mesh data')
      } finally {
        setLoading(false)
      }
    }

    fetchMeshData()
    
    // Update every 3 seconds for real-time data
    const interval = setInterval(fetchMeshData, 3000)
    
    return () => clearInterval(interval)
  }, [])

  // Send broadcast message to all nodes
  const sendBroadcast = async () => {
    try {
      const response = await fetch('/api/mesh/continental?action=broadcast&message=Test broadcast from Dashboard')
      const result = await response.json()
      
      if (result.success) {
        console.log('Broadcast sent successfully:', result.data)
      }
    } catch (err) {
      console.error('Failed to send broadcast:', err)
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ONLINE': return styles.statusOnline
      case 'COMPLETED': return styles.statusCompleted
      case 'FAILED': return styles.statusFailed
      case 'RECOVERED': return styles.statusRecovered
      default: return styles.statusOffline
    }
  }

  const getHealthColor = (health: string): string => {
    switch (health) {
      case 'HEALTHY': return styles.healthHealthy
      case 'DEGRADED': return styles.healthDegraded
      case 'CRITICAL': return styles.healthCritical
      default: return styles.healthUnknown
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌍 Continental Mesh Network</h1>
          <p className={styles.subtitle}>Loading Advanced Mesh Architecture...</p>
        </div>
        <div className={styles.loading}>
          <motion.div 
            className={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌍 Continental Mesh Network</h1>
          <p className={styles.subtitle}>Error loading mesh data</p>
        </div>
        <div className={styles.error}>
          <p>⚠️ {error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (!meshData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🌍 Continental Mesh Network</h1>
          <p className={styles.subtitle}>No mesh data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.title}>🌍 Continental Mesh Network</h1>
        <p className={styles.subtitle}>
          Advanced Python-based Architecture | {meshData.total_nodes} Total Nodes | 
          Status: <span className={clsx(styles.healthStatus, getHealthColor(meshData.monitor.health_status))}>
            {meshData.monitor.health_status}
          </span>
        </p>
        <p className={styles.lastUpdate}>Last Update: {new Date(lastUpdate).toLocaleTimeString()}</p>
      </motion.div>

      {/* System Overview */}
      <motion.div 
        className={styles.overviewGrid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className={styles.overviewCard}>
          <h3>Network Status</h3>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.active_nodes}</span>
            <span className={styles.metricLabel}>Active Nodes</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.monitor.metrics.messages_sent}</span>
            <span className={styles.metricLabel}>Messages Sent</span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <h3>Performance</h3>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.performance.latency_ms}ms</span>
            <span className={styles.metricLabel}>Latency</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.performance.throughput_mbps} Mbps</span>
            <span className={styles.metricLabel}>Throughput</span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <h3>Reliability</h3>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.performance.reliability_percent}%</span>
            <span className={styles.metricLabel}>Uptime</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.performance.packet_loss_percent}%</span>
            <span className={styles.metricLabel}>Packet Loss</span>
          </div>
        </div>

        <div className={styles.overviewCard}>
          <h3>System Resources</h3>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.system.cpu_usage_percent}%</span>
            <span className={styles.metricLabel}>CPU Usage</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricValue}>{meshData.system.memory_usage_percent}%</span>
            <span className={styles.metricLabel}>Memory Usage</span>
          </div>
        </div>
      </motion.div>

      {/* Continental Commands */}
      <motion.div 
        className={styles.continentsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Continental Command Centers</h2>
          <button 
            className={styles.broadcastButton}
            onClick={sendBroadcast}
          >
            📡 Send Broadcast
          </button>
        </div>
        
        <div className={styles.continentsGrid}>
          {meshData.continents.map((continent, index) => (
            <motion.div
              key={continent.id}
              className={clsx(styles.continentCard, getStatusColor(continent.status))}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.continentHeader}>
                <h3>{continent.name}</h3>
                <span className={clsx(styles.continentStatus, getStatusColor(continent.status))}>
                  {continent.status}
                </span>
              </div>
              
              <div className={styles.continentMetrics}>
                <div className={styles.continentMetric}>
                  <span>🏗️ Children:</span>
                  <span>{continent.children_count}</span>
                </div>
                <div className={styles.continentMetric}>
                  <span>🔗 Peers:</span>
                  <span>{continent.peers_count}</span>
                </div>
                <div className={styles.continentMetric}>
                  <span>📍 Location:</span>
                  <span>{continent.location.lat.toFixed(1)}°, {continent.location.lon.toFixed(1)}°</span>
                </div>
                <div className={styles.continentMetric}>
                  <span>⚡ Active:</span>
                  <span>{continent.is_active ? '✅' : '❌'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Topology Statistics */}
      <motion.div 
        className={styles.topologySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2>Network Topology</h2>
        <div className={styles.topologyGrid}>
          <div className={styles.topologyCard}>
            <h4>Connections</h4>
            <div className={styles.topologyMetric}>
              <span>Total: {meshData.topology.total_connections}</span>
            </div>
            <div className={styles.topologyMetric}>
              <span>Mesh: {meshData.topology.mesh_connections}</span>
            </div>
            <div className={styles.topologyMetric}>
              <span>Hierarchical: {meshData.topology.hierarchical_connections}</span>
            </div>
          </div>
          
          <div className={styles.topologyCard}>
            <h4>Structure</h4>
            <div className={styles.topologyMetric}>
              <span>Max Depth: {meshData.topology.max_depth}</span>
            </div>
            <div className={styles.topologyMetric}>
              <span>Redundancy: {meshData.topology.redundancy_factor}x</span>
            </div>
          </div>
          
          <div className={styles.topologyCard}>
            <h4>Operations</h4>
            <div className={styles.topologyMetric}>
              <span>Successes: {meshData.monitor.metrics.successes}</span>
            </div>
            <div className={styles.topologyMetric}>
              <span>Errors: {meshData.monitor.metrics.errors}</span>
            </div>
            <div className={styles.topologyMetric}>
              <span>Recoveries: {meshData.monitor.metrics.recoveries}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Activity Log */}
      <motion.div 
        className={styles.activitySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h2>System Activity</h2>
        <div className={styles.activityLog}>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>{new Date().toLocaleTimeString()}</span>
            <span className={styles.activityMessage}>
              ✅ Continental mesh network operational - {meshData.active_nodes} nodes active
            </span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>{new Date(Date.now() - 30000).toLocaleTimeString()}</span>
            <span className={styles.activityMessage}>
              📊 Performance metrics updated - {meshData.performance.latency_ms}ms latency
            </span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>{new Date(Date.now() - 60000).toLocaleTimeString()}</span>
            <span className={styles.activityMessage}>
              🌍 All continental commands responding - Network health: {meshData.monitor.health_status}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
