/**
 * AGI Eco Engine Ultra - Environmental Intelligence Dashboard
 * EuroWeb Platform - Green AI & Sustainability Intelligence
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.5.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface EcoMetrics {
  carbonFootprint: number
  energyEfficiency: number
  renewablePercentage: number
  wasteReduction: number
  biodiversityIndex: number
  waterUsage: number
  airQuality: number
  treesCounted: number
}

interface EcoAlert {
  id: string
  type: 'carbon' | 'energy' | 'waste' | 'water' | 'air'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  location?: string
}

const AGIEcoEngineUltra: React.FC = () => {
  const [metrics, setMetrics] = useState<EcoMetrics>({
    carbonFootprint: 847.2,
    energyEfficiency: 94.8,
    renewablePercentage: 78.3,
    wasteReduction: 65.7,
    biodiversityIndex: 0.847,
    waterUsage: 1247.8,
    airQuality: 92.4,
    treesCounted: 15847
  })

  const [alerts, setAlerts] = useState<EcoAlert[]>([
    {
      id: '1',
      type: 'carbon',
      severity: 'medium',
      message: 'Carbon emissions slightly elevated in Zone A',
      timestamp: new Date(),
      location: 'Manufacturing Zone A'
    },
    {
      id: '2',
      type: 'energy',
      severity: 'low',
      message: 'Solar panel efficiency optimal',
      timestamp: new Date(),
      location: 'Solar Farm 1'
    }
  ])

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        carbonFootprint: Math.max(800, prev.carbonFootprint + (Math.random() - 0.5) * 20),
        energyEfficiency: Math.max(90, Math.min(100, prev.energyEfficiency + (Math.random() - 0.5) * 2)),
        renewablePercentage: Math.max(70, Math.min(100, prev.renewablePercentage + (Math.random() - 0.5) * 3)),
        wasteReduction: Math.max(60, Math.min(100, prev.wasteReduction + (Math.random() - 0.5) * 2)),
        airQuality: Math.max(85, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 3)),
        waterUsage: Math.max(1200, prev.waterUsage + (Math.random() - 0.5) * 50)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getMetricColor = (key: string) => {
    switch (key) {
      case 'carbonFootprint': return '#ef4444'
      case 'energyEfficiency': return '#22c55e'
      case 'renewablePercentage': return '#10b981'
      case 'wasteReduction': return '#f59e0b'
      case 'biodiversityIndex': return '#8b5cf6'
      case 'waterUsage': return '#3b82f6'
      case 'airQuality': return '#06b6d4'
      case 'treesCounted': return '#16a34a'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #10b981 100%)',
      color: '#f0fdf4',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #10b981, #34d399, #6ee7b7)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          marginBottom: '8px'
        }}>
          🌱 AGI Eco Engine Ultra
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: '#bbf7d0',
          fontWeight: 500
        }}>
          Environmental Intelligence & Sustainability AI System
        </p>
      </motion.div>

      {/* Real-time Environmental Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#f0fdf4',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          📊 Environmental Metrics
          <span style={{
            fontSize: '14px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            padding: '4px 8px',
            borderRadius: '6px',
            fontWeight: 600
          }}>
            Real-time
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(metrics).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
              style={{
                background: selectedMetric === key ? 
                  'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${getMetricColor(key)}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#f0fdf4',
                  textTransform: 'capitalize'
                }}>
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: getMetricColor(key),
                  fontWeight: 600
                }}>
                  {key.includes('Percentage') || key.includes('Efficiency') || key.includes('Quality') ? 
                    `${value.toFixed(1)}%` :
                    key === 'biodiversityIndex' ? value.toFixed(3) :
                    key === 'treesCounted' ? value.toLocaleString() :
                    `${value.toFixed(1)} ${key.includes('carbon') ? 'kg CO2' : 
                                          key.includes('water') ? 'L' : 'units'}`
                  }
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '6px',
                height: '8px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${key.includes('Percentage') || key.includes('Efficiency') || key.includes('Quality') ? 
                           value : 
                           key === 'biodiversityIndex' ? value * 100 :
                           key === 'carbonFootprint' ? Math.min(100, (value / 1000) * 100) :
                           key === 'waterUsage' ? Math.min(100, (value / 2000) * 100) :
                           Math.min(100, (value / 20000) * 100)}%`
                  }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${getMetricColor(key)}, rgba(255,255,255,0.3))`,
                    borderRadius: '6px'
                  }}
                />
              </div>

              {/* Metric Icon and Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span style={{ color: '#bbf7d0' }}>
                  {key === 'carbonFootprint' ? '🏭' :
                   key === 'energyEfficiency' ? '⚡' :
                   key === 'renewablePercentage' ? '☀️' :
                   key === 'wasteReduction' ? '♻️' :
                   key === 'biodiversityIndex' ? '🦋' :
                   key === 'waterUsage' ? '💧' :
                   key === 'airQuality' ? '🌬️' :
                   '🌳'} 
                  {key.includes('Efficiency') || key.includes('Quality') || key.includes('renewable') ? 
                    (value > 90 ? ' Excellent' : value > 80 ? ' Good' : value > 70 ? ' Fair' : ' Needs Improvement') :
                    key === 'carbonFootprint' ? 
                    (value < 850 ? ' Low Impact' : value < 900 ? ' Moderate' : ' High Impact') :
                    ' Monitoring'}
                </span>
                <span style={{ color: '#64748b' }}>
                  Updated: {new Date().toLocaleTimeString()}
                </span>
              </div>

              {/* Expanded Details */}
              {selectedMetric === key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#bbf7d0', lineHeight: '1.5' }}>
                    <strong>Details:</strong><br />
                    {key === 'carbonFootprint' && 'Total CO2 emissions across all monitored facilities'}
                    {key === 'energyEfficiency' && 'Overall energy utilization efficiency rating'}
                    {key === 'renewablePercentage' && 'Percentage of energy from renewable sources'}
                    {key === 'wasteReduction' && 'Waste reduction compared to baseline measurements'}
                    {key === 'biodiversityIndex' && 'Local ecosystem biodiversity health indicator'}
                    {key === 'waterUsage' && 'Daily water consumption across facilities'}
                    {key === 'airQuality' && 'Ambient air quality index measurement'}
                    {key === 'treesCounted' && 'Trees monitored through satellite imagery and IoT sensors'}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Environmental Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#f0fdf4',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚨 Environmental Alerts
          {alerts.length > 0 && (
            <span style={{
              fontSize: '12px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#f59e0b',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              {alerts.length}
            </span>
          )}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {alerts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#bbf7d0',
              padding: '20px',
              fontSize: '14px'
            }}>
              ✅ No environmental alerts - All systems operating within optimal parameters
            </div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                style={{
                  background: `rgba(${getSeverityColor(alert.severity).slice(1, 3)}, ${getSeverityColor(alert.severity).slice(3, 5)}, ${getSeverityColor(alert.severity).slice(5, 7)}, 0.1)`,
                  border: `1px solid ${getSeverityColor(alert.severity)}`,
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>
                      {alert.type === 'carbon' ? '🏭' :
                       alert.type === 'energy' ? '⚡' :
                       alert.type === 'waste' ? '♻️' :
                       alert.type === 'water' ? '💧' : '🌬️'}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: getSeverityColor(alert.severity),
                      textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#f0fdf4',
                  marginBottom: '4px'
                }}>
                  {alert.message}
                </div>
                {alert.location && (
                  <div style={{
                    fontSize: '12px',
                    color: '#bbf7d0'
                  }}>
                    📍 {alert.location}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}
      >
        <div style={{ color: '#10b981' }}>
          🌱 AGI Eco Engine - Environmental Intelligence Active
        </div>
        <div style={{ color: '#bbf7d0' }}>
          🌍 EuroWeb Platform v8.5.0 | Monitoring: {metrics.treesCounted.toLocaleString()} Trees
        </div>
        <div style={{ color: '#10b981' }}>
          ⚡ {new Date().toLocaleTimeString()} | Green AI Mode
        </div>
      </motion.div>
    </div>
  )
}

export default AGIEcoEngineUltra
