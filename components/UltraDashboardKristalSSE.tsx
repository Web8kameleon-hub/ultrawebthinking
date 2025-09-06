/**
 * Ultra Dashboard Kristal - DIAMANT Edition
 * Real-Time SSE Dashboard with Swiss Precision
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 ULTRA-DIAMANT
 */

'use client';

import { clsx } from 'clsx';
import React, { useRef, useState } from 'react';
import { useSystemStream } from '../hooks/useSystemStream';
import NavBreadcrumb from './NavBreadcrumb';
import styles from './UltraDashboardKristal.module.css';

interface ChartData {
  timestamp: number
  value: number
}

interface AlertMessage {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
  timestamp: number
}

const LiveChart: React.FC<{
  data: ChartData[]
  color: string
  label: string
  unit: string
  threshold?: number
}> = ({ data, color, label, unit, threshold }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Setup
    const width = canvas.width
    const height = canvas.height
    const padding = 20

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = padding + (height - 2 * padding) * (i / 10)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    if (data.length < 2) return

    // Find min/max for scaling
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue || 1

    // Draw threshold line if provided
    if (threshold !== undefined) {
      const thresholdY = padding + (height - 2 * padding) * (1 - (threshold - minValue) / range)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(padding, thresholdY)
      ctx.lineTo(width - padding, thresholdY)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw main line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (width - 2 * padding) * (index / (data.length - 1))
      const y = padding + (height - 2 * padding) * (1 - (point.value - minValue) / range)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw glow effect
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw current value
    const lastPoint = data[data.length - 1]
    const lastX = width - padding
    const lastY = padding + (height - 2 * padding) * (1 - (lastPoint.value - minValue) / range)
    
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI)
    ctx.fill()
    
    // Value label
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${lastPoint.value.toFixed(1)}${unit}`, lastX - 10, lastY - 10)
  }, [data, color, unit, threshold])

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>{label}</span>
        <span className={styles.chartValue}>
          {data.length > 0 ? `${data[data.length - 1].value.toFixed(1)}${unit}` : `0${unit}`}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={120}
        className={styles.chartCanvas}
      />
    </div>
  )
}

const UltraDashboardKristal: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [alerts, setAlerts] = useState<AlertMessage[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warn' | 'agi' | 'network'>('all')
  const [logsPaused, setLogsPaused] = useState(false)
  const chartDataRef = useRef<{
    cpu: ChartData[]
    memory: ChartData[]
    agi: ChartData[]
    network: ChartData[]
  }>({
    cpu: [],
    memory: [],
    agi: [],
    network: []
  })

  // Helper functions for dynamic CSS classes
  const getStatusColorClass = (value: number, warningThreshold: number, errorThreshold: number) => {
    if (value > errorThreshold) return styles.statusError
    if (value > warningThreshold) return styles.statusWarning
    return styles.statusSuccess
  }

  const getHealthBadgeClass = (color: string) => {
    switch (color) {
      case '#10b981': return styles.healthBadgeSuccess
      case '#3b82f6': return styles.healthBadgeInfo
      case '#f59e0b': return styles.healthBadgeWarning
      case '#ef4444': return styles.healthBadgeError
      default: return styles.healthBadgeNeutral
    }
  }

  // Client-side mounting check
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Safe time formatting to prevent hydration errors
  const formatTime = (timestamp: string | number) => {
    if (!isClient) return '--:--:--'
    return new Date(timestamp).toLocaleTimeString()
  }

  // Real-time system stream
  const {
    connected,
    loading,
    error,
    data,
    isHealthy,
    isCritical,
    agiProcessing,
    cpuUsage,
    memoryUsage,
    networkLatency,
    throttle,
    boost,
    resetJobs,
    retry
  } = useSystemStream({
    onAlert: (alert) => {
      const newAlert: AlertMessage = {
        id: alert.id,
        type: alert.level === 'critical' ? 'error' : 'warning',
        message: alert.message,
        timestamp: alert.timestamp
      }
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]) // Keep last 10 alerts
      
      if (!logsPaused) {
        const logEntry = `[${formatTime(alert.timestamp)}] ${alert.level.toUpperCase()}: ${alert.message}`
        setLogs(prev => [logEntry, ...prev.slice(0, 99)]) // Keep last 100 logs
      }
    },
    onCritical: (systemData) => {
      if (!logsPaused) {
        const logEntry = `[${formatTime(Date.now())}] CRITICAL: System critical state detected - AGI: ${systemData.metrics.agi.processing}%`
        setLogs(prev => [logEntry, ...prev.slice(0, 99)])
      }
    }
  })

  // Update chart data when new system data arrives
  React.useEffect(() => {
    if (!data) return

    const now = Date.now()
    const maxDataPoints = 60 // Keep last 60 data points (2 min at 2s intervals)

    chartDataRef.current = {
      cpu: [...chartDataRef.current.cpu, { timestamp: now, value: data.metrics.cpu.usage }].slice(-maxDataPoints),
      memory: [...chartDataRef.current.memory, { timestamp: now, value: data.metrics.memory.used }].slice(-maxDataPoints),
      agi: [...chartDataRef.current.agi, { timestamp: now, value: data.metrics.agi.processing }].slice(-maxDataPoints),
      network: [...chartDataRef.current.network, { timestamp: now, value: data.metrics.network.latency }].slice(-maxDataPoints)
    }
  }, [data])

  const handleQuickAction = async (action: string) => {
    let success = false
    let message = ''

    switch (action) {
      case 'agi-throttle':
        success = await throttle(10)
        message = success ? 'AGI throttled by 10%' : 'AGI throttle failed'
        break
      case 'agi-boost':
        success = await boost()
        message = success ? 'AGI boost activated' : 'AGI boost failed'
        break
      case 'reset-jobs':
        success = await resetJobs()
        message = success ? 'Non-critical jobs cleared' : 'Job reset failed'
        break
    }

    const alert: AlertMessage = {
      id: `action-${Date.now()}`,
      type: success ? 'success' : 'error',
      message,
      timestamp: Date.now()
    }
    setAlerts(prev => [alert, ...prev.slice(0, 9)])

    if (!logsPaused) {
      const logEntry = `[${formatTime(Date.now())}] ACTION: ${message}`
      setLogs(prev => [logEntry, ...prev.slice(0, 99)])
    }
  }

  const getStatusBadge = () => {
    if (loading) return { text: 'LOADING', color: '#6b7280' }
    if (error) return { text: 'ERROR', color: '#ef4444' }
    if (!connected) return { text: 'DISCONNECTED', color: '#f59e0b' }
    if (isCritical) return { text: 'CRITICAL', color: '#ef4444' }
    if (isHealthy) return { text: 'EXCELLENT', color: '#10b981' }
    return { text: 'UNKNOWN', color: '#6b7280' }
  }

  const statusBadge = getStatusBadge()

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'all') return true
    return log.toLowerCase().includes(logFilter.toLowerCase())
  })

  if (loading && !data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.navigation}>
          <NavBreadcrumb />
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <div className="text-gray-400">Connecting to system stream...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      {/* Navigation */}
      <div className={styles.navigation}>
        <NavBreadcrumb />
      </div>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brandSection}>
          <h1 className={styles.brandTitle}>💎 EuroWeb Ultra</h1>
          <span className={styles.brandSubtitle}>Kristal & Diamant Edition</span>
        </div>
        
        <div className={styles.statusSection}>
          <div className={styles.connectionStatus}>
            <div className={`${styles.connectionDot} ${connected ? styles.connected : styles.disconnected}`}></div>
            <span className={styles.connectionText}>
              {connected ? 'LIVE STREAM' : 'DISCONNECTED'}
            </span>
          </div>
          
          <div className={clsx(styles.healthBadge, getHealthBadgeClass(statusBadge.color))}>
            {statusBadge.text}
          </div>
          
          {error && (
            <button onClick={retry} className={styles.retryButton}>
              🔄 Retry
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        
        {/* Live Charts Grid */}
        <section className={styles.chartsSection}>
          <h2 className={styles.sectionTitle}>📊 Live Performance Charts</h2>
          
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <LiveChart
                data={chartDataRef.current.cpu}
                color="#3b82f6"
                label="CPU Usage"
                unit="%"
                threshold={70}
              />
            </div>
            
            <div className={styles.chartCard}>
              <LiveChart
                data={chartDataRef.current.memory}
                color="#10b981"
                label="Memory Usage"
                unit="%"
                threshold={80}
              />
            </div>
            
            <div className={styles.chartCard}>
              <LiveChart
                data={chartDataRef.current.agi}
                color="#f59e0b"
                label="AGI Processing"
                unit="%"
                threshold={85}
              />
            </div>
            
            <div className={styles.chartCard}>
              <LiveChart
                data={chartDataRef.current.network}
                color="#8b5cf6"
                label="Network Latency"
                unit="ms"
                threshold={100}
              />
            </div>
          </div>
        </section>

        {/* System Metrics */}
        <section className={styles.metricsSection}>
          <h2 className={styles.sectionTitle}>🔥 Real-Time Metrics</h2>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>AGI Processing</div>
              <div className={clsx(styles.metricValue, getStatusColorClass(agiProcessing, 70, 85))}>
                {agiProcessing.toFixed(1)}%
              </div>
              <div className={styles.metricTrend}>
                {data?.diff?.agi_processing_delta && (
                  <span className={data.diff.agi_processing_delta > 0 ? styles.trendUp : styles.trendDown}>
                    {data.diff.agi_processing_delta > 0 ? '↗' : '↘'} {Math.abs(data.diff.agi_processing_delta).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>CPU Cores</div>
              <div className={clsx(styles.metricValue, getStatusColorClass(cpuUsage, 60, 70))}>
                {cpuUsage.toFixed(1)}%
              </div>
              <div className={styles.metricSubtext}>32 cores active</div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Memory</div>
              <div className={clsx(styles.metricValue, getStatusColorClass(memoryUsage, 70, 80))}>
                {memoryUsage.toFixed(1)}%
              </div>
              <div className={styles.metricSubtext}>
                {data ? `${(128 * (1 - memoryUsage / 100)).toFixed(1)} GB free` : 'Loading...'}
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Network</div>
              <div className={clsx(styles.metricValue, getStatusColorClass(networkLatency, 80, 100))}>
                {networkLatency.toFixed(0)}ms
              </div>
              <div className={styles.metricSubtext}>Latency</div>
            </div>
          </div>
        </section>

        {/* Quick Actions & Alerts Grid */}
        <div className={styles.bottomGrid}>
          
          {/* Quick Actions */}
          <section className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
            
            <div className={styles.actionsGrid}>
              <button
                onClick={() => handleQuickAction('agi-throttle')}
                className={`${styles.actionButton} ${styles.throttleButton}`}
                disabled={!connected}
              >
                <span className={styles.actionIcon}>🔽</span>
                <span className={styles.actionLabel}>AGI Throttle</span>
                <span className={styles.actionSubtext}>↘️ 10%</span>
              </button>

              <button
                onClick={() => handleQuickAction('agi-boost')}
                className={`${styles.actionButton} ${styles.boostButton}`}
                disabled={!connected}
              >
                <span className={styles.actionIcon}>🚀</span>
                <span className={styles.actionLabel}>AGI Boost</span>
                <span className={styles.actionSubtext}>GPU Accel</span>
              </button>

              <button
                onClick={() => handleQuickAction('reset-jobs')}
                className={`${styles.actionButton} ${styles.resetButton}`}
                disabled={!connected}
              >
                <span className={styles.actionIcon}>🔄</span>
                <span className={styles.actionLabel}>Reset Jobs</span>
                <span className={styles.actionSubtext}>Clear Queue</span>
              </button>
            </div>
          </section>

          {/* Alert System */}
          <section className={styles.alertsSection}>
            <h2 className={styles.sectionTitle}>🚨 Alert System</h2>
            
            <div className={styles.alertsList}>
              {alerts.length === 0 ? (
                <div className={styles.noAlerts}>
                  <span className={styles.noAlertsIcon}>✅</span>
                  <span className={styles.noAlertsText}>All systems nominal</span>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`${styles.alertItem} ${styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]}`}
                  >
                    <div className={styles.alertContent}>
                      <span className={styles.alertMessage}>{alert.message}</span>
                      <span className={styles.alertTime}>
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Log Streaming */}
        <section className={styles.logsSection}>
          <div className={styles.logsHeader}>
            <h2 className={styles.sectionTitle}>📜 Live Log Stream</h2>
            
            <div className={styles.logsControls}>
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value as any)}
                className={styles.logFilter}
                aria-label="Filter log entries by type"
              >
                <option value="all">All Logs</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="agi">AGI</option>
                <option value="network">Network</option>
              </select>
              
              <button
                onClick={() => setLogsPaused(!logsPaused)}
                className={`${styles.logToggle} ${logsPaused ? styles.paused : styles.active}`}
              >
                {logsPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              
              <button
                onClick={() => setLogs([])}
                className={styles.logClear}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <div className={styles.logsContainer}>
            {filteredLogs.length === 0 ? (
              <div className={styles.noLogs}>
                {logFilter === 'all' ? 'No logs yet...' : `No ${logFilter} logs found`}
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  {log}
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default UltraDashboardKristal;
