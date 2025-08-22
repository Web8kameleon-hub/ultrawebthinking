/**
 * AGI Electrical Engine Ultra - Electrical Engineering & IoT Intelligence
 * EuroWeb Platform - Smart Grid & Electrical Systems AI
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ElectricalMetrics {
  powerGeneration: number
  energyConsumption: number
  gridStability: number
  voltageRegulation: number
  powerFactor: number
  frequency: number
  loadBalance: number
  faultDetection: number
}

interface IoTDevice {
  id: string
  name: string
  type: 'sensor' | 'actuator' | 'controller' | 'meter'
  status: 'online' | 'offline' | 'error' | 'maintenance'
  location: string
  value: number
  unit: string
  lastUpdate: Date
}

interface ElectricalAlert {
  id: string
  type: 'grid' | 'device' | 'safety' | 'maintenance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  message: string
  deviceId?: string
  timestamp: Date
}

const AGIElectricalEngineUltra: React.FC = () => {
  const [metrics, setMetrics] = useState<ElectricalMetrics>({
    powerGeneration: 1247.8,
    energyConsumption: 1156.3,
    gridStability: 98.7,
    voltageRegulation: 99.2,
    powerFactor: 0.95,
    frequency: 50.02,
    loadBalance: 94.8,
    faultDetection: 99.5
  })

  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'TMP-001',
      name: 'Temperature Sensor',
      type: 'sensor',
      status: 'online',
      location: 'Transformer Station A',
      value: 65.4,
      unit: '°C',
      lastUpdate: new Date()
    },
    {
      id: 'VLT-002',
      name: 'Voltage Monitor',
      type: 'meter',
      status: 'online',
      location: 'Main Grid',
      value: 230.5,
      unit: 'V',
      lastUpdate: new Date()
    },
    {
      id: 'CUR-003',
      name: 'Current Sensor',
      type: 'sensor',
      status: 'online',
      location: 'Distribution Panel',
      value: 87.2,
      unit: 'A',
      lastUpdate: new Date()
    },
    {
      id: 'PWR-004',
      name: 'Power Meter',
      type: 'meter',
      status: 'online',
      location: 'Industrial Zone',
      value: 1247.8,
      unit: 'kW',
      lastUpdate: new Date()
    },
    {
      id: 'REL-005',
      name: 'Protection Relay',
      type: 'controller',
      status: 'online',
      location: 'Substation B',
      value: 1,
      unit: 'Status',
      lastUpdate: new Date()
    },
    {
      id: 'MOT-006',
      name: 'Motor Controller',
      type: 'actuator',
      status: 'maintenance',
      location: 'Pump Station',
      value: 0,
      unit: 'RPM',
      lastUpdate: new Date()
    }
  ])

  const [alerts, setAlerts] = useState<ElectricalAlert[]>([
    {
      id: '1',
      type: 'maintenance',
      severity: 'medium',
      location: 'Pump Station',
      message: 'Motor controller scheduled for maintenance',
      deviceId: 'MOT-006',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'grid',
      severity: 'low',
      location: 'Main Grid',
      message: 'Grid frequency within normal range',
      timestamp: new Date()
    }
  ])

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'devices' | 'analytics'>('overview')

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        powerGeneration: Math.max(1200, prev.powerGeneration + (Math.random() - 0.5) * 50),
        energyConsumption: Math.max(1100, prev.energyConsumption + (Math.random() - 0.5) * 30),
        gridStability: Math.max(95, Math.min(100, prev.gridStability + (Math.random() - 0.5) * 1)),
        voltageRegulation: Math.max(98, Math.min(100, prev.voltageRegulation + (Math.random() - 0.5) * 0.5)),
        frequency: Math.max(49.8, Math.min(50.2, prev.frequency + (Math.random() - 0.5) * 0.1)),
        loadBalance: Math.max(90, Math.min(100, prev.loadBalance + (Math.random() - 0.5) * 2)),
        faultDetection: Math.max(98, Math.min(100, prev.faultDetection + (Math.random() - 0.5) * 0.2))
      }))

      // Update device values
      setDevices(prev => prev.map(device => ({
        ...device,
        value: device.type === 'sensor' || device.type === 'meter' ?
          Math.max(0, device.value + (Math.random() - 0.5) * 10) : device.value,
        lastUpdate: new Date()
      })))
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e'
      case 'offline': return '#6b7280'
      case 'error': return '#ef4444'
      case 'maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor': return '📡'
      case 'actuator': return '⚙️'
      case 'controller': return '🎛️'
      case 'meter': return '📊'
      default: return '🔌'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #92400e 0%, #b45309 25%, #d97706 50%, #f59e0b 75%, #fbbf24 100%)',
      color: '#fffbeb',
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
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #f59e0b, #fbbf24, #fde047)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          marginBottom: '8px'
        }}>
          ⚡ AGI Electrical Engine Ultra
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: '#fef3c7',
          fontWeight: 500
        }}>
          Smart Grid Intelligence & Electrical Systems Management
        </p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {(['overview', 'devices', 'analytics'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              background: viewMode === mode ? '#f59e0b' : 'rgba(0, 0, 0, 0.3)',
              color: viewMode === mode ? '#000' : '#fef3c7',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {mode}
          </button>
        ))}
      </motion.div>

      {/* Overview Mode */}
      {viewMode === 'overview' && (
        <>
          {/* Grid Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#fffbeb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ⚡ Electrical Grid Metrics
              <span style={{
                fontSize: '14px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                Live Data
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
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    borderRadius: '12px',
                    padding: '20px'
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
                      color: '#fffbeb',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      color: '#f59e0b',
                      fontWeight: 700
                    }}>
                      {key.includes('Generation') || key.includes('Consumption') ? 
                        `${value.toFixed(1)} kW` :
                       key.includes('Factor') ? value.toFixed(2) :
                       key.includes('Frequency') ? `${value.toFixed(2)} Hz` :
                       `${value.toFixed(1)}%`}
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div style={{
                    fontSize: '14px',
                    color: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>
                      {key === 'powerGeneration' ? '🏭' :
                       key === 'energyConsumption' ? '🏠' :
                       key === 'gridStability' ? '📊' :
                       key === 'voltageRegulation' ? '📈' :
                       key === 'powerFactor' ? '⚡' :
                       key === 'frequency' ? '〰️' :
                       key === 'loadBalance' ? '⚖️' : '🔍'}
                    </span>
                    <span>
                      {key.includes('Stability') || key.includes('Regulation') || key.includes('Balance') || key.includes('Detection') ?
                       (value > 98 ? 'Excellent' : value > 95 ? 'Good' : value > 90 ? 'Fair' : 'Needs Attention') :
                       key.includes('Factor') ?
                       (value > 0.95 ? 'Optimal' : value > 0.90 ? 'Good' : 'Needs Improvement') :
                       key.includes('Frequency') ?
                       (Math.abs(value - 50) < 0.1 ? 'Stable' : 'Fluctuating') :
                       'Monitored'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#fffbeb',
              marginBottom: '16px'
            }}>
              📈 Quick Statistics
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#22c55e', fontWeight: 700 }}>
                  {devices.filter(d => d.status === 'online').length}
                </div>
                <div style={{ fontSize: '14px', color: '#fef3c7' }}>Devices Online</div>
              </div>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#f59e0b', fontWeight: 700 }}>
                  {(metrics.powerGeneration - metrics.energyConsumption).toFixed(1)}
                </div>
                <div style={{ fontSize: '14px', color: '#fef3c7' }}>Surplus kW</div>
              </div>
              
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid #6366f1',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#6366f1', fontWeight: 700 }}>
                  {((metrics.energyConsumption / metrics.powerGeneration) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#fef3c7' }}>Grid Efficiency</div>
              </div>
              
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#ef4444', fontWeight: 700 }}>
                  {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                </div>
                <div style={{ fontSize: '14px', color: '#fef3c7' }}>Active Alerts</div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Devices Mode */}
      {viewMode === 'devices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#fffbeb',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🔌 IoT Device Network
            <span style={{
              fontSize: '14px',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: 600
            }}>
              {devices.filter(d => d.status === 'online').length}/{devices.length} Online
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {devices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                style={{
                  background: selectedDevice === device.id ? 
                    'rgba(245, 158, 11, 0.2)' : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${getStatusColor(device.status)}`,
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
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{getDeviceIcon(device.type)}</span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#fffbeb'
                    }}>
                      {device.name}
                    </span>
                  </div>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    background: getStatusColor(device.status),
                    borderRadius: '50%',
                    animation: device.status === 'online' ? 'pulse 2s infinite' : 'none'
                  }} />
                </div>

                <div style={{
                  fontSize: '14px',
                  color: '#fef3c7',
                  marginBottom: '8px'
                }}>
                  📍 {device.location}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#f59e0b'
                  }}>
                    {device.unit === 'Status' ? 
                      (device.value ? 'Active' : 'Inactive') :
                      `${device.value.toFixed(1)} ${device.unit}`}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    background: `rgba(${getStatusColor(device.status).slice(1)}, 0.2)`,
                    color: getStatusColor(device.status),
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {device.status}
                  </span>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#d97706',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Type: {device.type}</span>
                  <span>Updated: {device.lastUpdate.toLocaleTimeString()}</span>
                </div>

                {/* Expanded Details */}
                {selectedDevice === device.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#fef3c7', lineHeight: '1.5' }}>
                      <strong>Device Details:</strong><br />
                      ID: {device.id}<br />
                      Type: {device.type.charAt(0).toUpperCase() + device.type.slice(1)}<br />
                      Location: {device.location}<br />
                      Last Communication: {device.lastUpdate.toLocaleString()}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analytics Mode */}
      {viewMode === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#fffbeb',
            marginBottom: '20px'
          }}>
            📊 Advanced Analytics Dashboard
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#fffbeb', marginBottom: '16px' }}>Power Flow Analysis</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef3c7'
              }}>
                ⚡ Real-time Power Flow Chart
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#fffbeb', marginBottom: '16px' }}>Load Distribution</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef3c7'
              }}>
                📊 Load Balance Visualization
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#fffbeb', marginBottom: '16px' }}>Network Topology</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef3c7'
              }}>
                🕸️ Grid Network Map
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Alerts Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#fffbeb',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚨 System Alerts
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
          gap: '12px'
        }}>
          {alerts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#fef3c7',
              padding: '20px',
              fontSize: '14px'
            }}>
              ✅ All electrical systems operating normally
            </div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                style={{
                  background: `rgba(${getSeverityColor(alert.severity).slice(1)}, 0.1)`,
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
                      {alert.type === 'grid' ? '⚡' :
                       alert.type === 'device' ? '🔌' :
                       alert.type === 'safety' ? '⚠️' : '🔧'}
                    </span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: getSeverityColor(alert.severity),
                      textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fef3c7',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {alert.type}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#d97706'
                  }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#fffbeb',
                  marginBottom: '4px'
                }}>
                  {alert.message}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#fef3c7'
                }}>
                  📍 {alert.location}
                  {alert.deviceId && ` | Device: ${alert.deviceId}`}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}
      >
        <div style={{ color: '#f59e0b' }}>
          ⚡ AGI Electrical Engine - Smart Grid Intelligence Active
        </div>
        <div style={{ color: '#fef3c7' }}>
          🔌 EuroWeb Platform v8.1.0 | Devices: {devices.length} | Grid: {metrics.gridStability.toFixed(1)}%
        </div>
        <div style={{ color: '#f59e0b' }}>
          ⚙️ {new Date().toLocaleTimeString()} | Electrical AI Mode
        </div>
      </motion.div>
    </div>
  )
}

export default AGIElectricalEngineUltra
