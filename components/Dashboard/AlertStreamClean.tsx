'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import styles from './AlertStream.module.css'
import { buttonVariants, alertEntryVariants, alertLevelVariants } from './alertStreamVariants'

interface Alert {
  id: string
  level: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
  source: string
}

export default function AlertStream() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isPaused, setIsPaused] = useState(false)

  const fetchAlerts = async () => {
    if (isPaused) return
    
    try {
      const response = await fetch('/api/system/alerts')
      const data = await response.json()
      
      if (data.alerts && Array.isArray(data.alerts)) {
        setAlerts(prev => {
          const newAlerts = [...data.alerts, ...prev]
          return newAlerts.slice(0, 50) // Keep only last 50 alerts
        })
      }
    } catch (error) {
      console.error('❌ Error fetching alerts:', error)
    }
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const getAlertIcon = (level: Alert['level']) => {
    switch (level) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
      className={styles.container}
    >
      {/* Header */}
      <div className={styles.header}>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={styles.title}
        >
          🚨 Sistem Alarmash
        </motion.h3>

        <div className={styles.controls}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPaused(!isPaused)}
            className={buttonVariants({ variant: isPaused ? 'play' : 'pause' })}
          >
            {isPaused ? '▶️ Vazhdo' : '⏸️ Ndalo'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAlerts}
            className={buttonVariants({ variant: 'clear' })}
          >
            🗑️ Pastro
          </motion.button>
        </div>
      </div>

      {/* Alert Stream */}
      <div className={styles.stream}>
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
            >
              Asnjë alarm aktiv
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={alertEntryVariants({ level: alert.level })}
              >
                <div className={styles.alertIcon}>
                  {getAlertIcon(alert.level)}
                </div>
                
                <div className={styles.alertContent}>
                  <div className={alertLevelVariants({ level: alert.level })}>
                    {alert.level.toUpperCase()}
                  </div>
                  
                  <div className={styles.alertMessage}>
                    {alert.message}
                  </div>
                  
                  <div className={styles.alertMeta}>
                    <span>{alert.timestamp}</span>
                    <span>{alert.source}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
