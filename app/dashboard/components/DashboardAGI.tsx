'use client'

import React, { useEffect, useState } from 'react'
import styles from './DashboardAGI.module.css'

interface AGIMetrics {
  consciousness: {
    level: number
    state: string
    thoughts: number
    neural_activity: number
  }
  intelligence: {
    iq_level: number
    learning_rate: number
    knowledge_base: number
    problem_solving: number
  }
  memory: {
    short_term: number
    long_term: number
    working: number
    total_capacity: number
  }
  processing: {
    threads: number
    queue_size: number
    response_time: number
    accuracy: number
  }
  capabilities: Record<string, boolean>
  health: {
    overall: string
    neural_integrity: number
    processing_efficiency: number
    error_rate: number
  }
}

function DashboardAGI() {
  const [data, setData] = useState<AGIMetrics | null>(null)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/agi/core')
      const json = await res.json()
      setData(json.data)
    } catch (err) {
      console.error('Failed to fetch AGI metrics:', err)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!data) return <div className={styles.container}>⏳ Loading AGI Dashboard...</div>

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧠 AGI Intelligence Status</h2>

      <div className={styles.grid}>
        <Metric label="Consciousness Level" value={data.consciousness.level.toFixed(2)} />
        <Metric label="Consciousness State" value={data.consciousness.state} />
        <Metric label="Thoughts" value={data.consciousness.thoughts} />
        <Metric label="Neural Activity" value={data.consciousness.neural_activity.toFixed(2)} />

        <Metric label="IQ Level" value={data.intelligence.iq_level} />
        <Metric label="Learning Rate" value={(data.intelligence.learning_rate * 100).toFixed(1) + '%'} />
        <Metric label="Problem Solving" value={(data.intelligence.problem_solving * 100).toFixed(1) + '%'} />
        <Metric label="Knowledge Base" value={data.intelligence.knowledge_base + '%'} />

        <Metric label="Short-Term Memory" value={data.memory.short_term} />
        <Metric label="Long-Term Memory" value={data.memory.long_term} />
        <Metric label="Working Memory" value={data.memory.working} />
        <Metric label="Memory Capacity" value={data.memory.total_capacity} />

        <Metric label="Threads" value={data.processing.threads} />
        <Metric label="Queue Size" value={data.processing.queue_size} />
        <Metric label="Response Time" value={data.processing.response_time + 'ms'} />
        <Metric label="Accuracy" value={(data.processing.accuracy * 100).toFixed(2) + '%'} />

        <Metric label="Neural Integrity" value={(data.health.neural_integrity * 100).toFixed(2) + '%'} />
        <Metric label="Efficiency" value={(data.health.processing_efficiency * 100).toFixed(2) + '%'} />
        <Metric label="Error Rate" value={(data.health.error_rate * 100).toFixed(4) + '%'} />
        <Metric label="Health Status" value={data.health.overall} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.metricBox}>
      <div className={styles.labelStyle}>{label}</div>
      <div className={styles.valueStyle}>{value}</div>
    </div>
  )
}

export default DashboardAGI
