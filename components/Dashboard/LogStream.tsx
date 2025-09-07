'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import styles from './LogStream.module.css'
import { buttonVariants, logEntryVariants, levelVariants } from './logStreamVariants'

interface LogEntry {
  id: string
  timestamp: string
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
  message: string
  source: string
}

export default function LogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState<string>('ALL')
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchLogs = async () => {
    if (isPaused) return
    
    try {
      const response = await fetch('/api/system/logs')
      const data = await response.json()
      
      if (data.logs && Array.isArray(data.logs)) {
        setLogs(prev => {
          const newLogs = [...data.logs, ...prev]
          return newLogs.slice(0, 100) // Keep only last 100 logs
        })
      }
    } catch (error) {
      console.error('❌ Error fetching logs:', error)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'CRITICAL': return '💀'
      case 'ERROR': return '❌'
      case 'WARN': return '⚠️'
      case 'INFO': return 'ℹ️'
      case 'DEBUG': return '🔍'
      default: return '📝'
    }
  }

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.level === filter)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, isPaused])

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.9 }}
      className={styles.container}
    >
      {/* Header */}
      <div className={styles.header}>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className={styles.title}
        >
          📜 Log Stream Live
        </motion.h3>

        <div className={styles.controls}>
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.select}
            aria-label="Filter logs by level"
          >
            <option value="ALL">Të gjitha</option>
            <option value="CRITICAL">Critical</option>
            <option value="ERROR">Error</option>
            <option value="WARN">Warning</option>
            <option value="INFO">Info</option>
            <option value="DEBUG">Debug</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(!isPaused)}
            className={buttonVariants({ variant: isPaused ? 'play' : 'pause' })}
          >
            {isPaused ? '▶️ Play' : '⏸️ Pause'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearLogs}
            className={buttonVariants({ variant: 'clear' })}
          >
            🗑️ Clear
          </motion.button>
        </div>
      </div>

      {/* Log Console */}
      <div ref={scrollRef} className={styles.console}>
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              Asnjë log për filtrin e zgjedhur...
            </motion.div>
          ) : (
            filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={logEntryVariants({ type: index % 2 === 0 ? 'even' : 'odd' })}
              >
                <span className={styles.timestamp}>
                  {log.timestamp}
                </span>
                
                <span className={levelVariants({ level: log.level })}>
                  {getLogIcon(log.level)} {log.level}
                </span>
                
                <span className={styles.message}>
                  {log.message}
                </span>
                
                <span className={styles.source}>
                  [{log.source}]
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>Total: {logs.length} | Filtered: {filteredLogs.length}</span>
        <span>Status: {isPaused ? '⏸️ Paused' : '▶️ Live'}</span>
      </div>
    </motion.div>
  )
}
