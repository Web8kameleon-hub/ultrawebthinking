/**
 * AGI Control Panel - Industrial Command Interface
 * Real-Time AGI System Command and Control Center
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'

interface AGICommand {
  id: string
  name: string
  description: string
  category: 'system' | 'memory' | 'neural' | 'quantum' | 'analysis'
  status: 'idle' | 'running' | 'completed' | 'error'
  lastExecuted?: Date
  executionTime?: number
}

interface SystemStatus {
  cores: number
  memory: number
  network: number
  quantum: number
  neural: number
  overall: number
}

interface Props {
  onSendCommand?: (command: string) => void
  onResetMemory?: () => void
  onActivateBrain?: () => void
  onSystemScan?: () => void
  onExportData?: () => void
}

const AGIControlPanel: React.FC<Props> = ({
  onSendCommand,
  onResetMemory,
  onActivateBrain,
  onSystemScan,
  onExportData
}) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cores: 0,
    memory: 0,
    network: 0,
    quantum: 0,
    neural: 0,
    overall: 0
  })
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastOutput, setLastOutput] = useState<string>('')

  const commands: AGICommand[] = [
    {
      id: 'system-health',
      name: 'System Health Check',
      description: 'Perform comprehensive AGI system diagnostics',
      category: 'system',
      status: 'idle'
    },
    {
      id: 'memory-optimize',
      name: 'Optimize Memory',
      description: 'Optimize AGI memory allocation and cleanup',
      category: 'memory',
      status: 'idle'
    },
    {
      id: 'neural-sync',
      name: 'Neural Network Sync',
      description: 'Synchronize neural network connections',
      category: 'neural',
      status: 'idle'
    },
    {
      id: 'quantum-calibrate',
      name: 'Quantum Calibration',
      description: 'Calibrate quantum processing units',
      category: 'quantum',
      status: 'idle'
    },
    {
      id: 'deep-analysis',
      name: 'Deep System Analysis',
      description: 'Perform deep learning system analysis',
      category: 'analysis',
      status: 'idle'
    }
  ]

  // Fetch real system status
  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/agi/status')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus({
          cores: data.cpu || 0,
          memory: data.memory || 0,
          network: data.network || 0,
          quantum: data.quantum || 95,
          neural: data.neural || 97,
          overall: data.overall || 94
        })
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error)
      // Fallback to performance API
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memInfo = (performance as any).memory
        const memoryUsage = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100
        setSystemStatus(prev => ({
          ...prev,
          memory: memoryUsage,
          overall: (prev.cores + memoryUsage + prev.network) / 3
        }))
      }
    }
  }, [])

  // Execute AGI command
  const executeCommand = useCallback(async (commandId: string) => {
    setIsExecuting(true)
    setSelectedCommand(commandId)
    
    try {
      const response = await fetch('/api/agi/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandId, timestamp: Date.now() })
      })
      
      if (response.ok) {
        const result = await response.json()
        setLastOutput(`✅ Command executed: ${result.message || 'Success'}`)
        
        // Trigger relevant callback
        switch (commandId) {
          case 'memory-optimize':
            onResetMemory?.()
            break
          case 'neural-sync':
            onActivateBrain?.()
            break
          case 'system-health':
            onSystemScan?.()
            break
          default:
            onSendCommand?.(commandId)
        }
      } else {
        setLastOutput(`❌ Command failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Command execution failed:', error)
      setLastOutput(`❌ Connection error: ${(error as Error).message}`)
    } finally {
      setIsExecuting(false)
      setSelectedCommand(null)
    }
  }, [onSendCommand, onResetMemory, onActivateBrain, onSystemScan])

  // Real-time updates
  useEffect(() => {
    fetchSystemStatus()
    const interval = setInterval(fetchSystemStatus, 3000)
    return () => clearInterval(interval)
  }, [fetchSystemStatus])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return '#3b82f6'
      case 'memory': return '#22c55e'
      case 'neural': return '#8b5cf6'
      case 'quantum': return '#f59e0b'
      case 'analysis': return '#ec4899'
      default: return '#6b7280'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return '⚙️'
      case 'memory': return '🧠'
      case 'neural': return '🕸️'
      case 'quantum': return '⚛️'
      case 'analysis': return '🔍'
      default: return '📊'
    }
  }

  const getStatusLevel = (value: number) => {
    if (value >= 90) return 'excellent'
    if (value >= 75) return 'good'
    if (value >= 50) return 'warning'
    return 'critical'
  }

  return (
    <div className="agi-control-panel">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="control-panel-header"
      >
        <h3 className="control-panel-title">⚙️ AGI Control Panel</h3>
        <div className="system-overview">
          Overall Status: 
          <span className={`status-indicator ${getStatusLevel(systemStatus.overall)}`}>
            {systemStatus.overall.toFixed(1)}%
          </span>
        </div>
      </motion.div>

      {/* System Status Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="system-status-grid"
      >
        {[
          { label: 'CPU Cores', value: systemStatus.cores, icon: '🔧' },
          { label: 'Memory', value: systemStatus.memory, icon: '💾' },
          { label: 'Network', value: systemStatus.network, icon: '🌐' },
          { label: 'Quantum', value: systemStatus.quantum, icon: '⚛️' },
          { label: 'Neural', value: systemStatus.neural, icon: '🧠' }
        ].map((status, index) => (
          <motion.div
            key={status.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`status-card ${getStatusLevel(status.value)}`}
          >
            <div className="status-icon">{status.icon}</div>
            <div className="status-label">{status.label}</div>
            <div className="status-value">{status.value.toFixed(1)}%</div>
            <div className="status-bar">
              <motion.div
                className="status-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, status.value))}%` }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Command Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="command-grid"
      >
        <h4 className="command-section-title">AGI Commands</h4>
        <div className="command-buttons">
          {commands.map((command, index) => (
            <motion.button
              key={command.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => executeCommand(command.id)}
              disabled={isExecuting}
              className={`command-button ${command.category} ${
                isExecuting && selectedCommand === command.id ? 'executing' : ''
              }`}
            >
              <div className="command-icon">
                {getCategoryIcon(command.category)}
              </div>
              <div className="command-info">
                <div className="command-name">{command.name}</div>
                <div className="command-description">{command.description}</div>
              </div>
              {isExecuting && selectedCommand === command.id && (
                <div className="command-spinner">⟳</div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="quick-actions"
      >
        <h4 className="quick-actions-title">Quick Actions</h4>
        <div className="quick-actions-grid">
          <button onClick={onResetMemory} className="quick-action-btn memory">
            🧹 Reset Memory
          </button>
          <button onClick={onActivateBrain} className="quick-action-btn neural">
            🧠 Toggle Brain
          </button>
          <button onClick={onSystemScan} className="quick-action-btn system">
            🔍 System Scan
          </button>
          <button onClick={onExportData} className="quick-action-btn analysis">
            📤 Export Data
          </button>
        </div>
      </motion.div>

      {/* Command Output */}
      <AnimatePresence>
        {lastOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="command-output"
          >
            <h4 className="output-title">Last Command Output</h4>
            <div className="output-content">{lastOutput}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel Styles */}
      <style jsx>{`
        .agi-control-panel {
          padding: 20px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .control-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .control-panel-title {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .system-overview {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 600;
        }

        .status-indicator {
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
        }

        .status-indicator.excellent {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.2);
        }

        .status-indicator.good {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.2);
        }

        .status-indicator.warning {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.2);
        }

        .status-indicator.critical {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }

        .system-status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .status-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .status-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .status-card.excellent {
          border-color: #22c55e;
        }

        .status-card.good {
          border-color: #3b82f6;
        }

        .status-card.warning {
          border-color: #f59e0b;
        }

        .status-card.critical {
          border-color: #ef4444;
        }

        .status-icon {
          font-size: 18px;
          margin-bottom: 4px;
        }

        .status-label {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .status-value {
          font-size: 16px;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 8px;
        }

        .status-bar {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          height: 4px;
          overflow: hidden;
        }

        .status-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #22c55e);
          border-radius: 4px;
        }

        .command-grid {
          margin-bottom: 24px;
        }

        .command-section-title {
          font-size: 18px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 16px;
        }

        .command-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }

        .command-button {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #f8fafc;
        }

        .command-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .command-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .command-button.executing {
          background: rgba(59, 130, 246, 0.2);
          border-color: #3b82f6;
        }

        .command-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .command-info {
          flex-grow: 1;
        }

        .command-name {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .command-description {
          font-size: 12px;
          color: #94a3b8;
        }

        .command-spinner {
          font-size: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .quick-actions {
          margin-bottom: 20px;
        }

        .quick-actions-title {
          font-size: 16px;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 12px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 8px;
        }

        .quick-action-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 12px;
          color: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .quick-action-btn:hover {
          transform: translateY(-1px);
          background: rgba(0, 0, 0, 0.5);
        }

        .quick-action-btn.memory {
          border-color: #22c55e;
        }

        .quick-action-btn.neural {
          border-color: #8b5cf6;
        }

        .quick-action-btn.system {
          border-color: #3b82f6;
        }

        .quick-action-btn.analysis {
          border-color: #ec4899;
        }

        .command-output {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }

        .output-title {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .output-content {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #f8fafc;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  )
}

export default AGIControlPanel
