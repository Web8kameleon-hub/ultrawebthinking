/**
 * AGI Memory Graph - Real-Time Memory Visualization
 * Industrial React Component with Live Memory Monitoring
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'

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
      } else {
        console.warn('AGI Memory API not responding')
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Failed to fetch AGI memory:', error)
      setIsConnected(false)
      // Fallback to system memory
      await fetchSystemMemory()
    }
  }, [metrics])

  // Fallback to real system memory if AGI Core is unavailable
  const fetchSystemMemory = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memInfo = (performance as any).memory
        const systemBlocks: MemoryBlock[] = [
          {
            id: 'heap-used',
            label: 'Heap Used',
            value: (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100,
            timestamp: new Date().toISOString(),
            type: 'core',
            status: 'active'
          },
          {
            id: 'heap-total',
            label: 'Heap Total',
            value: (memInfo.totalJSHeapSize / memInfo.jsHeapSizeLimit) * 100,
            timestamp: new Date().toISOString(),
            type: 'buffer',
            status: 'active'
          }
        ]
        setMemoryBlocks(systemBlocks)
        
        const systemMetrics: MemoryMetrics = {
          totalMemory: memInfo.jsHeapSizeLimit,
          usedMemory: memInfo.usedJSHeapSize,
          freeMemory: memInfo.jsHeapSizeLimit - memInfo.usedJSHeapSize,
          cacheMemory: memInfo.totalJSHeapSize - memInfo.usedJSHeapSize,
          bufferMemory: 0,
          uptime: `${Math.floor(performance.now() / 1000)}s`,
          allocations: 0,
          deallocations: 0
        }
        setMetrics(systemMetrics)
      }
    } catch (error) {
      console.error('System memory not available:', error)
    }
  }, [])

  // Real-time updates
  useEffect(() => {
    fetchMemoryData()
    const interval = setInterval(fetchMemoryData, 2000)
    return () => clearInterval(interval)
  }, [fetchMemoryData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e'
      case 'idle': return '#6b7280'
      case 'critical': return '#ef4444'
      case 'optimizing': return '#f59e0b'
      default: return '#6b7280'
    }
  }

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
    <div className="memory-graph-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="memory-graph-header"
      >
        <h2 className="memory-graph-title">
          🧠 Memory Graph
          <span className={`memory-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 AGI Connected' : '🟡 System Fallback'}
          </span>
        </h2>
      </motion.div>

      {/* Memory Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="memory-metrics-grid"
      >
        <div className="memory-metric-card">
          <div className="metric-label">Total Memory</div>
          <div className="metric-value">{formatBytes(metrics.totalMemory)}</div>
        </div>
        <div className="memory-metric-card">
          <div className="metric-label">Used Memory</div>
          <div className="metric-value">{formatBytes(metrics.usedMemory)}</div>
        </div>
        <div className="memory-metric-card">
          <div className="metric-label">Free Memory</div>
          <div className="metric-value">{formatBytes(metrics.freeMemory)}</div>
        </div>
        <div className="memory-metric-card">
          <div className="metric-label">Uptime</div>
          <div className="metric-value">{metrics.uptime}</div>
        </div>
      </motion.div>

      {/* Memory Blocks Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="memory-blocks-container"
      >
        <h3 className="memory-blocks-title">Memory Allocation Blocks</h3>
        <div className="memory-blocks-grid">
          <AnimatePresence>
            {memoryBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`memory-block-card ${block.status}`}
                style={{
                  background: `linear-gradient(135deg, rgba(${block.status === 'active' ? '34, 197, 94' : 
                                block.status === 'idle' ? '107, 114, 128' :
                                block.status === 'critical' ? '239, 68, 68' : '245, 158, 11'}, 0.15), transparent)`
                }}
              >
                <div className="memory-block-header">
                  <span className="memory-block-icon">
                    {getTypeIcon(block.type)}
                  </span>
                  <span className="memory-block-label">{block.label}</span>
                  <span className={`memory-block-status ${block.status}`}>
                    {block.status}
                  </span>
                </div>
                
                <div className="memory-block-graph">
                  <div className="memory-block-bar-container">
                    <motion.div
                      className={`memory-block-bar ${block.status}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, Math.max(0, block.value))}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="memory-block-percentage">
                    {block.value > 100 
                      ? `${(block.value / 100).toFixed(1)}x` 
                      : `${block.value.toFixed(1)}%`
                    }
                  </div>
                </div>
                
                <div className="memory-block-timestamp">
                  {new Date(block.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Memory Graph Styles */}
      <style jsx>{`
        .memory-graph-container {
          padding: 20px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .memory-graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .memory-graph-title {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .memory-status {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.3);
        }

        .memory-status.connected {
          color: #22c55e;
        }

        .memory-status.disconnected {
          color: #f59e0b;
        }

        .memory-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .memory-metric-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .metric-label {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .metric-value {
          font-size: 20px;
          font-weight: 700;
          color: #3b82f6;
        }

        .memory-blocks-container {
          margin-top: 24px;
        }

        .memory-blocks-title {
          font-size: 18px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 16px;
        }

        .memory-blocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .memory-block-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .memory-block-card.active {
          border-color: #22c55e;
        }

        .memory-block-card.idle {
          border-color: #6b7280;
        }

        .memory-block-card.critical {
          border-color: #ef4444;
        }

        .memory-block-card.optimizing {
          border-color: #f59e0b;
        }

        .memory-block-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .memory-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .memory-block-icon {
          font-size: 18px;
        }

        .memory-block-label {
          font-size: 16px;
          font-weight: 600;
          color: #f8fafc;
          flex-grow: 1;
          margin-left: 8px;
        }

        .memory-block-status {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .memory-block-status.active {
          color: #22c55e;
        }

        .memory-block-status.idle {
          color: #6b7280;
        }

        .memory-block-status.critical {
          color: #ef4444;
        }

        .memory-block-status.optimizing {
          color: #f59e0b;
        }

        .memory-block-graph {
          margin-bottom: 12px;
        }

        .memory-block-bar-container {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 6px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .memory-block-bar {
          height: 100%;
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        .memory-block-bar.active {
          background: linear-gradient(90deg, #22c55e, rgba(34, 197, 94, 0.5));
        }

        .memory-block-bar.idle {
          background: linear-gradient(90deg, #6b7280, rgba(107, 114, 128, 0.5));
        }

        .memory-block-bar.critical {
          background: linear-gradient(90deg, #ef4444, rgba(239, 68, 68, 0.5));
        }

        .memory-block-bar.optimizing {
          background: linear-gradient(90deg, #f59e0b, rgba(245, 158, 11, 0.5));
        }

        .memory-block-percentage {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          text-align: right;
        }

        .memory-block-timestamp {
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default MemoryGraph
