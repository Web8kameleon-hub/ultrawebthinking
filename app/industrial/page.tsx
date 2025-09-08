'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { industrialAPI, type SensorData, type MachineData, type ProductionMetrics } from '@/services/api'
import styles from './industrial.module.css'

export default function IndustrialPage() {
  const [sensors, setSensors] = useState<SensorData[]>([])
  const [machines, setMachines] = useState<MachineData[]>([])
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadIndustrialData = async () => {
      try {
        setLoading(true)
        const [sensorsData, machinesData, metricsData] = await Promise.all([
          industrialAPI.getSensorData(),
          industrialAPI.getMachineData(),
          industrialAPI.getProductionMetrics()
        ])
        
        setSensors(sensorsData)
        setMachines(machinesData)
        setMetrics(metricsData)
      } catch (err) {
        setError('Failed to load industrial data')
        console.error('Industrial data error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadIndustrialData()
  }, [])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading industrial data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.header}
      >
        <h1>Industrial IoT Dashboard</h1>
        <p>Real-time monitoring of industrial sensors and machinery</p>
      </motion.div>

      {/* Production Metrics */}
      {metrics && (
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h3>Production</h3>
            <div className={styles.metricValue}>{metrics.totalProduction}</div>
          </div>
          <div className={styles.metricCard}>
            <h3>Efficiency</h3>
            <div className={styles.metricValue}>{metrics.efficiency}%</div>
          </div>
          <div className={styles.metricCard}>
            <h3>Energy</h3>
            <div className={styles.metricValue}>{metrics.energyConsumption} kWh</div>
          </div>
        </div>
      )}

      {/* Sensors */}
      <div className={styles.section}>
        <h2>Sensors</h2>
        <div className={styles.sensorGrid}>
          {sensors.map((sensor) => (
            <div key={sensor.id} className={styles.sensorCard}>
              <h3>{sensor.name}</h3>
              <div className={styles.sensorValue}>
                {sensor.value} {sensor.unit}
              </div>
              <div>Status: {sensor.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Machines */}
      <div className={styles.section}>
        <h2>Machines</h2>
        <div className={styles.machineGrid}>
          {machines.map((machine) => (
            <div key={machine.id} className={styles.machineCard}>
              <h3>{machine.name}</h3>
              <div>Status: {machine.status}</div>
              <div>Efficiency: {machine.efficiency}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
