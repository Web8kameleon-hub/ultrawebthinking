'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { dashboardVariants, metricCardVariants, statusIndicatorVariants } from './dashboardPanelVariants'
import styles from './DashboardPanel.module.css'

interface MetricsData {
  cpu: number
  memory: number
  agi: number
  latency: number
}

export default function DashboardPanel() {
  const [data, setData] = useState<MetricsData>({
    cpu: 0,
    memory: 0,
    agi: 0,
    latency: 0,
  })

  const fetchData = async () => {
    try {
      const [sysRes, agiRes] = await Promise.all([
        fetch('/api/system/metrics'),
        fetch('/api/agi/core'),
      ])

      const sysJson = await sysRes.json()
      const agiJson = await agiRes.json()

      const cpu = sysJson.data.cpu.usage || 0
      const memoryUsed = sysJson.data.memory.used || 0
      const memoryTotal = sysJson.data.memory.total || 1
      const memory = Math.round((memoryUsed / memoryTotal) * 100)

      const agi = agiJson.data?.systemLoad?.cpu || 0
      const latency = sysJson.data.network.latency || 0

      setData({
        cpu: parseFloat(cpu.toFixed(1)),
        memory: parseFloat(memory.toFixed(1)),
        agi: parseFloat(agi.toFixed(1)),
        latency: parseFloat(latency.toFixed(1)),
      })
    } catch (error) {
      console.error('❌ Error loading dashboard metrics', error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={clsx(styles.dashboardContainer, dashboardVariants())}
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.dashboardTitle}
      >
        ⚜️ Dashboard Mbretëror
      </motion.h2>

      <div className={styles.metricsGrid}>
        <MetricCard 
          label="🧠 AGI Processing" 
          value={data.agi} 
          unit="%" 
          color="#667eea"
          delay={0.1}
        />
        <MetricCard 
          label="💾 Memory Usage" 
          value={data.memory} 
          unit="%" 
          color="#f093fb"
          delay={0.2}
        />
        <MetricCard 
          label="⚙️ CPU Usage" 
          value={data.cpu} 
          unit="%" 
          color="#4facfe"
          delay={0.3}
        />
        <MetricCard 
          label="🌐 Network Latency" 
          value={data.latency} 
          unit="ms" 
          color="#43e97b"
          delay={0.4}
        />
      </div>
    </motion.div>
  )
}

interface MetricCardProps {
  label: string
  value: number
  unit: string
  color: string
  delay: number
}

function MetricCard({ label, value, unit, color, delay }: MetricCardProps) {
  const getCardType = (label: string) => {
    if (label.includes('AGI')) return 'agi'
    if (label.includes('Memory')) return 'memory' 
    if (label.includes('CPU')) return 'cpu'
    return 'network'
  }

  const getStatusClass = (value: number) => {
    if (value > 80) return 'critical'
    if (value > 60) return 'warning'
    return 'good'
  }

  const cardType = getCardType(label)
  const statusType = getStatusClass(value)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={clsx(styles.metricCard, metricCardVariants({ type: cardType }))}
    >
      {/* Gradient accent */}
      <div className={clsx(styles.cardAccent, styles[`cardAccent${cardType.charAt(0).toUpperCase() + cardType.slice(1)}`])} />

      <div className={styles.cardLabel}>
        {label}
      </div>
      
      <div className={clsx(styles.cardValue, styles[`cardValue${cardType.charAt(0).toUpperCase() + cardType.slice(1)}`])}>
        {value}
        <span className={styles.cardUnit}>{unit}</span>
      </div>

      {/* Status indicator */}
      <div className={clsx(styles.statusIndicator, styles[`status${statusType.charAt(0).toUpperCase() + statusType.slice(1)}`], statusIndicatorVariants({ status: statusType }))} />
    </motion.div>
  )
}
