/**
 * AGI Core Component - Web8 Platform - SAFE CSS VERSION
 * @author Ledjan Ahmati  
 * @version 8.0.0-WEB8-REAL-ONLY-SAFE
 * NO FAKE DATA - ALL METRICS MUST HAVE PROVENANCE
 * SAFE CSS CONVERSION - NO INLINE STYLES
 */

'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './AGICore.module.css'

// REAL-ONLY Types (unchanged from working version)
type Provenance = {
  source: string
  fetchedAt: string
  ttlSeconds: number
  responseTimeMs?: number
}

type RealData<T> = {
  data: T
  provenance: Provenance
}

type RealResult<T> = 
  | { ok: true; data: T & { provenance: Provenance } }
  | { ok: false; kind: "NO_DATA" | "MISSING_TOOL" | "ERROR"; message: string; fix?: string[] }

type AGIMetrics = {
  neuralConnections: RealData<number> | null
  processingSpeed: RealData<string> | null
  learningRate: RealData<number> | null
  responseTime: RealData<number> | null
  latency: RealData<number> | null
  throughput: RealData<string> | null
  securityLevel: RealData<string> | null
}

// AGI Client for real calls (unchanged)
async function agiCall<T>(kind: string, args: any = {}): Promise<RealResult<T>> {
  try {
    const response = await fetch('/api/agi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, args })
    })
    return await response.json()
  } catch (error) {
    return {
      ok: false,
      kind: "ERROR",
      message: String(error),
      fix: ["Check API connection", "Verify AGI service"]
    }
  }
}

// Real Guard Component (unchanged logic, CSS classes)
function RealGuard({ data, children, fallback }: { 
  data?: RealData<any> | null; 
  children: React.ReactNode; 
  fallback?: React.ReactNode 
}) {
  if (data === undefined) {
    return <div className={styles.loading}>Loading real data...</div>
  }
  
  if (data === null) {
    return fallback || <div className={styles.noData}>No real data available</div>
  }
  
  // Check if data has valid provenance
  if (!data?.provenance?.source || !data?.provenance?.fetchedAt) {
    return <div className={styles.invalidData}>Invalid data: Missing provenance</div>
  }
  
  // Check if data is stale
  const age = (Date.now() - new Date(data.provenance.fetchedAt).getTime()) / 1000
  if (age > data.provenance.ttlSeconds) {
    return <div className={styles.staleData}>Data stale (TTL expired)</div>
  }
  
  return <>{children}</>
}

export const AGICoreSafe: React.FC = () => {
  // REAL-ONLY state - no fake metrics (unchanged)
  const [realMetrics, setRealMetrics] = useState<AGIMetrics>({
    neuralConnections: null,
    processingSpeed: null,
    learningRate: null,
    responseTime: null,
    latency: null,
    throughput: null,
    securityLevel: null
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // REAL-ONLY data fetching - no fake calculations (unchanged)
  useEffect(() => {
    let mounted = true
    
    const fetchRealMetrics = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Call REAL AGI service for system metrics
        const [
          neuralResult,
          speedResult, 
          learningResult,
          responseResult,
          latencyResult,
          throughputResult,
          securityResult
        ] = await Promise.all([
          agiCall<number>('SYSTEM.NEURAL_CONNECTIONS', {}),
          agiCall<string>('SYSTEM.PROCESSING_SPEED', {}),
          agiCall<number>('SYSTEM.LEARNING_RATE', {}),
          agiCall<number>('SYSTEM.RESPONSE_TIME', {}),
          agiCall<number>('SYSTEM.LATENCY', {}),
          agiCall<string>('SYSTEM.THROUGHPUT', {}),
          agiCall<string>('SYSTEM.SECURITY_LEVEL', {})
        ])
        
        if (!mounted) return
        
        // Only update with REAL data that has provenance
        setRealMetrics({
          neuralConnections: neuralResult.ok ? {
            data: neuralResult.data as number,
            provenance: neuralResult.data.provenance
          } : null,
          processingSpeed: speedResult.ok ? {
            data: speedResult.data as string,
            provenance: speedResult.data.provenance
          } : null,
          learningRate: learningResult.ok ? {
            data: learningResult.data as number,
            provenance: learningResult.data.provenance
          } : null,
          responseTime: responseResult.ok ? {
            data: responseResult.data as number,
            provenance: responseResult.data.provenance
          } : null,
          latency: latencyResult.ok ? {
            data: latencyResult.data as number,
            provenance: latencyResult.data.provenance
          } : null,
          throughput: throughputResult.ok ? {
            data: throughputResult.data as string,
            provenance: throughputResult.data.provenance
          } : null,
          securityLevel: securityResult.ok ? {
            data: securityResult.data as string,
            provenance: securityResult.data.provenance
          } : null
        })
        
      } catch (err) {
        if (mounted) {
          setError(`Failed to fetch real AGI metrics: ${err}`)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchRealMetrics()
    
    // Refresh real data every 5 seconds (not fake updates)
    const interval = setInterval(fetchRealMetrics, 5000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Show loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${styles.container} ${styles.loadingScreen}`}
      >
        <div className={styles.loadingContent}>
          <div className={styles.loadingIcon}>🤖</div>
          <div>Loading real AGI metrics...</div>
          <div className={styles.loadingSubtext}>
            No fake data - waiting for real sources
          </div>
        </div>
      </motion.div>
    )
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${styles.container} ${styles.errorScreen}`}
      >
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <div>AGI Metrics Unavailable</div>
          <div className={styles.errorMessage}>{error}</div>
          <div className={styles.errorFix}>
            Fix: Configure AGI backend services
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <div className={styles.innerContainer}>
        <h1 className={styles.title}>
          🤖 AGI Core Engine
        </h1>
        
        <p className={styles.subtitle}>
          Advanced General Intelligence Processing Unit
        </p>

        <div className={styles.cardsGrid}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={styles.neuralCard}
          >
            <h3 className={styles.neuralCardTitle}>
              🧠 Neural Processing
            </h3>
            <div className={styles.neuralCardDescription}>
              Advanced neural network processing with real-time learning capabilities.
              Processes complex patterns and generates intelligent responses.
            </div>
            <div className={styles.neuralCardStatus}>
              <RealGuard data={realMetrics.processingSpeed} fallback={<span>No processing speed data</span>}>
                Status: Active • Processing Speed: {realMetrics.processingSpeed?.data}
              </RealGuard>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={styles.realtimeCard}
          >
            <h3 className={styles.realtimeCardTitle}>
              ⚡ Real-Time Analysis
            </h3>
            <div className={styles.realtimeCardDescription}>
              Instant data processing and pattern recognition with sub-millisecond
              response times for critical decision making.
            </div>
            <div className={styles.realtimeCardStatus}>
              <RealGuard 
                data={realMetrics.latency} 
                fallback={<span>No latency data</span>}
              >
                Latency: {realMetrics.latency?.data}ms
              </RealGuard>
              {' • '}
              <RealGuard 
                data={realMetrics.throughput}
                fallback={<span>No throughput data</span>}
              >
                Throughput: {realMetrics.throughput?.data}
              </RealGuard>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={styles.securityCard}
          >
            <h3 className={styles.securityCardTitle}>
              🛡️ Security Core
            </h3>
            <div className={styles.securityCardDescription}>
              Military-grade security protocols with quantum encryption and
              ethical AI compliance monitoring.
            </div>
            <div className={styles.securityCardStatus}>
              <RealGuard 
                data={realMetrics.securityLevel}
                fallback={<span>Security Level: Unknown</span>}
              >
                Security Level: {realMetrics.securityLevel?.data}
              </RealGuard>
            </div>
          </motion.div>
        </div>

        {/* AGI Core Control Panel */}
        <div className={styles.controlPanel}>
          <h3 className={styles.controlPanelTitle}>
            AGI Core Control Panel
          </h3>
          
          <div className={styles.metricsGrid}>
            <div className={`${styles.metricCard} ${styles.neuralMetric}`}>
              <RealGuard 
                data={realMetrics.neuralConnections}
                fallback={
                  <div>
                    <div className={styles.noDataValue}>No Data</div>
                    <div className={styles.noDataHelp}>
                      Missing tool: Neural Monitor<br/>
                      Fix: Set NEURAL_SERVICE_URL
                    </div>
                  </div>
                }
              >
                <div className={`${styles.metricValue} ${styles.neuralValue}`}>
                  {realMetrics.neuralConnections?.data.toLocaleString()}
                </div>
                <div className={styles.metricLabel}>
                  Neural Connections
                </div>
                <div className={styles.metricSource}>
                  Source: {realMetrics.neuralConnections?.provenance.source}
                </div>
              </RealGuard>
            </div>
            
            <div className={`${styles.metricCard} ${styles.speedMetric}`}>
              <RealGuard 
                data={realMetrics.processingSpeed}
                fallback={
                  <div>
                    <div className={styles.noDataValue}>No Data</div>
                    <div className={styles.noDataHelp}>
                      Missing tool: CPU Monitor<br/>
                      Fix: Set SYSTEM_METRICS_URL
                    </div>
                  </div>
                }
              >
                <div className={`${styles.metricValue} ${styles.speedValue}`}>
                  {realMetrics.processingSpeed?.data}
                </div>
                <div className={styles.metricLabel}>
                  Processing Speed
                </div>
                <div className={styles.metricSource}>
                  Source: {realMetrics.processingSpeed?.provenance.source}
                </div>
              </RealGuard>
            </div>
            
            <div className={`${styles.metricCard} ${styles.learningMetric}`}>
              <RealGuard 
                data={realMetrics.learningRate}
                fallback={
                  <div>
                    <div className={styles.noDataValue}>No Data</div>
                    <div className={styles.noDataHelp}>
                      Missing tool: AI Learning Monitor<br/>
                      Fix: Set LEARNING_SERVICE_URL
                    </div>
                  </div>
                }
              >
                <div className={`${styles.metricValue} ${styles.learningValue}`}>
                  {realMetrics.learningRate?.data}%
                </div>
                <div className={styles.metricLabel}>
                  Learning Rate
                </div>
                <div className={styles.metricSource}>
                  Source: {realMetrics.learningRate?.provenance.source}
                </div>
              </RealGuard>
            </div>
            
            <div className={`${styles.metricCard} ${styles.responseMetric}`}>
              <RealGuard 
                data={realMetrics.responseTime}
                fallback={
                  <div>
                    <div className={styles.noDataValue}>No Data</div>
                    <div className={styles.noDataHelp}>
                      Missing tool: Latency Monitor<br/>
                      Fix: Set NETWORK_MONITOR_URL
                    </div>
                  </div>
                }
              >
                <div className={`${styles.metricValue} ${styles.responseValue}`}>
                  {realMetrics.responseTime?.data}ms
                </div>
                <div className={styles.metricLabel}>
                  Response Time
                </div>
                <div className={styles.metricSource}>
                  Source: {realMetrics.responseTime?.provenance.source}
                </div>
              </RealGuard>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
