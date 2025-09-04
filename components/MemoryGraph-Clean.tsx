/**
 * AGI Memory Graph - Real-Time Memory Visualization
 * Industrial React Component with Live Memory Monitoring
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial - No Inline Styles
 * @license MIT
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './MemoryGraph.module.css'

interface MemoryBlock {
  id: string
  label: string
  value: number
  timestamp: string
  type: 'core' | 'neural' | 'quantum' | 'cache' | 'buffer'
  status: 'active' | 'idle' | 'critical' | 'optimizing'
}

interface MemoryMetrics {
  totalMemory: number
  usedMemory: number
  freeMemory: number
  cacheMemory: number
  bufferMemory: number
  uptime: string
  allocations: number
  deallocations: number
}

const MemoryGraph: React.FC = () => {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([])
  const [metrics, setMetrics] = useState<MemoryMetrics>({
    totalMemory: 0,
    usedMemory: 0,
    freeMemory: 0,
    cacheMemory: 0,
    bufferMemory: 0,
    uptime: '0s',
    allocations: 0,
    deallocations: 0
  })
  const [isConnected, setIsConnected] = useState(false)

  // Fetch real memory data from AGI Core
  const fetchMemoryData = useCallback(async () => {
    try {
      const response = await fetch('/api/agi/memory')
      if (response.ok) {
        const data = await response.json()
        setMemoryBlocks(data.blocks || [])
        setMetrics(data.metrics || metrics)
        setIsConnected(true)
        console.log(`[MemoryGraph] Connected to real AGI memory system`)
      } else {
        console.warn('[MemoryGraph] AGI Memory API not responding')
        setIsConnected(false)
      }
    } catch (error) {
      console.error('[MemoryGraph] Failed to fetch AGI memory:', error)
      setIsConnected(false)
    }
  }, [])

  // Real-time updates every 2 seconds
  useEffect(() => {
    fetchMemoryData()
    const interval = setInterval(fetchMemoryData, 2000)
    return () => clearInterval(interval)
  }, [fetchMemoryData])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'core': return '🧠'
      case 'neural': return '🕸️'
      case 'quantum': return '⚛️'
      case 'cache': return '💾'
      case 'buffer': return '📊'
      default: return '💾'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h2 className={styles.title}>
          🧠 Memory Graph
          <span className={`${styles.status} ${isConnected ? styles.connected : styles.disconnected}`}>
            {isConnected ? '🟢 AGI Connected' : '🟡 System Fallback'}
          </span>
        </h2>
      </motion.div>

      {/* Memory Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={styles.metricsGrid}
      >
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Memory</div>
          <div className={styles.metricValue}>{formatBytes(metrics.totalMemory)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Used Memory</div>
          <div className={styles.metricValue}>{formatBytes(metrics.usedMemory)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Free Memory</div>
          <div className={styles.metricValue}>{formatBytes(metrics.freeMemory)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Uptime</div>
          <div className={styles.metricValue}>{metrics.uptime}</div>
        </div>
      </motion.div>

      {/* Memory Blocks Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={styles.blocksContainer}
      >
        <h3 className={styles.blocksTitle}>Memory Allocation Blocks</h3>
        <div className={styles.blocksGrid}>
          <AnimatePresence>
            {memoryBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`${styles.blockCard} ${styles[`block${block.status.charAt(0).toUpperCase() + block.status.slice(1)}`]}`}
              >
                <div className={styles.blockHeader}>
                  <span className={styles.blockIcon}>
                    {getTypeIcon(block.type)}
                  </span>
                  <span className={styles.blockLabel}>{block.label}</span>
                  <span className={`${styles.blockStatus} ${styles[`status${block.status.charAt(0).toUpperCase() + block.status.slice(1)}`]}`}>
                    {block.status}
                  </span>
                </div>
                
                <div className={styles.blockGraph}>
                  <div className={styles.blockBarContainer}>
                    <motion.div
                      className={`${styles.blockBar} ${styles[`bar${block.status.charAt(0).toUpperCase() + block.status.slice(1)}`]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, block.value))}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className={styles.blockPercentage}>
                    {block.value.toFixed(1)}%
                  </div>
                </div>
                
                <div className={styles.blockTimestamp}>
                  {new Date(block.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default MemoryGraph

