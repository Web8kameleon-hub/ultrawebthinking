/**
 * LoRa Connect Engine Ultra - Long Range Communication Intelligence
 * EuroWeb Platform - Advanced LoRaWAN Network Management & IoT Communication AI
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LoRaDevice {
  id: string
  name: string
  type: 'sensor' | 'actuator' | 'gateway' | 'repeater'
  status: 'online' | 'offline' | 'sleep' | 'transmitting'
  location: string
  battery: number
  rssi: number
  snr: number
  frequency: number
  spreadingFactor: number
  lastSeen: Date
  dataRate: number
  txPower: number
}

interface LoRaMetrics {
  totalDevices: number
  activeDevices: number
  networkCoverage: number
  avgRSSI: number
  avgSNR: number
  dataTransmitted: number
  batteryHealth: number
  packetSuccess: number
}

interface LoRaAlert {
  id: string
  type: 'battery' | 'signal' | 'connectivity' | 'data'
  severity: 'low' | 'medium' | 'high' | 'critical'
  deviceId?: string
  message: string
  timestamp: Date
}

const LoRaConnectEngineUltra: React.FC = () => {
  const [metrics, setMetrics] = useState<LoRaMetrics>({
    totalDevices: 18,
    activeDevices: 16,
    networkCoverage: 94.7,
    avgRSSI: -87.3,
    avgSNR: 8.4,
    dataTransmitted: 2.47,
    batteryHealth: 87.2,
    packetSuccess: 98.9
  })

  const [devices, setDevices] = useState<LoRaDevice[]>([
    {
      id: 'LR-GW-001',
      name: 'Main Gateway',
      type: 'gateway',
      status: 'online',
      location: 'Central Tower',
      battery: 100,
      rssi: -45,
      snr: 12.5,
      frequency: 868.1,
      spreadingFactor: 7,
      lastSeen: new Date(),
      dataRate: 5.47,
      txPower: 14
    },
    {
      id: 'LR-RP-001',
      name: 'Mountain Repeater',
      type: 'repeater',
      status: 'online',
      location: 'Mount Vista',
      battery: 95,
      rssi: -78,
      snr: 9.2,
      frequency: 868.3,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 3.13,
      txPower: 20
    },
    {
      id: 'LR-SN-001',
      name: 'Weather Station',
      type: 'sensor',
      status: 'transmitting',
      location: 'Field Alpha',
      battery: 78,
      rssi: -92,
      snr: 6.8,
      frequency: 868.5,
      spreadingFactor: 9,
      lastSeen: new Date(),
      dataRate: 1.76,
      txPower: 14
    },
    {
      id: 'LR-SN-002',
      name: 'Soil Monitor',
      type: 'sensor',
      status: 'sleep',
      location: 'Farm Beta',
      battery: 65,
      rssi: -95,
      snr: 5.2,
      frequency: 868.7,
      spreadingFactor: 10,
      lastSeen: new Date(Date.now() - 300000),
      dataRate: 0.98,
      txPower: 14
    },
    {
      id: 'LR-AC-001',
      name: 'Irrigation Controller',
      type: 'actuator',
      status: 'online',
      location: 'Greenhouse',
      battery: 88,
      rssi: -84,
      snr: 7.6,
      frequency: 868.9,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 2.34,
      txPower: 14
    },
    {
      id: 'LR-SN-003',
      name: 'Tank Level Sensor',
      type: 'sensor',
      status: 'online',
      location: 'Water Tank 1',
      battery: 92,
      rssi: -89,
      snr: 8.1,
      frequency: 867.1,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 1.24,
      txPower: 14
    },
    {
      id: 'LR-SN-004',
      name: 'Air Quality Monitor',
      type: 'sensor',
      status: 'online',
      location: 'City Center',
      battery: 73,
      rssi: -91,
      snr: 6.4,
      frequency: 867.3,
      spreadingFactor: 9,
      lastSeen: new Date(),
      dataRate: 1.87,
      txPower: 14
    },
    {
      id: 'LR-SN-005',
      name: 'Parking Sensor',
      type: 'sensor',
      status: 'offline',
      location: 'Parking Lot A',
      battery: 12,
      rssi: 0,
      snr: 0,
      frequency: 0,
      spreadingFactor: 0,
      lastSeen: new Date(Date.now() - 3600000),
      dataRate: 0,
      txPower: 0
    }
  ])

  const [alerts, setAlerts] = useState<LoRaAlert[]>([
    {
      id: '1',
      type: 'battery',
      severity: 'critical',
      deviceId: 'LR-SN-005',
      message: 'Critical battery level - device requires maintenance',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'signal',
      severity: 'medium',
      deviceId: 'LR-SN-002',
      message: 'Low SNR detected - signal quality degraded',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'connectivity',
      severity: 'high',
      deviceId: 'LR-SN-005',
      message: 'Device offline for extended period',
      timestamp: new Date()
    }
  ])

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'devices' | 'coverage'>('overview')

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeDevices: devices.filter(d => d.status === 'online' || d.status === 'transmitting').length,
        networkCoverage: Math.max(90, Math.min(100, prev.networkCoverage + (Math.random() - 0.5) * 1)),
        avgRSSI: Math.max(-100, Math.min(-70, prev.avgRSSI + (Math.random() - 0.5) * 2)),
        avgSNR: Math.max(5, Math.min(15, prev.avgSNR + (Math.random() - 0.5) * 1)),
        dataTransmitted: Math.max(2, prev.dataTransmitted + (Math.random() - 0.5) * 0.2),
        batteryHealth: Math.max(80, Math.min(95, prev.batteryHealth + (Math.random() - 0.5) * 1)),
        packetSuccess: Math.max(95, Math.min(100, prev.packetSuccess + (Math.random() - 0.5) * 0.5))
      }))

      // Update device metrics
      setDevices(prev => prev.map(device => {
        if (device.status === 'online' || device.status === 'transmitting') {
          return {
            ...device,
            rssi: Math.max(-120, Math.min(-40, device.rssi + (Math.random() - 0.5) * 3)),
            snr: Math.max(0, Math.min(20, device.snr + (Math.random() - 0.5) * 1)),
            battery: device.type !== 'gateway' ? 
              Math.max(0, Math.min(100, device.battery - (Math.random() * 0.1))) : 100,
            lastSeen: new Date(),
            dataRate: Math.max(0.5, device.dataRate + (Math.random() - 0.5) * 0.3)
          }
        }
        return device
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [devices])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#22c55e'
      case 'transmitting': return '#3b82f6'
      case 'sleep': return '#f59e0b'
      case 'offline': return '#6b7280'
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

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'gateway': return '🌐'
      case 'repeater': return '📡'
      case 'sensor': return '📊'
      case 'actuator': return '⚙️'
      default: return '📱'
    }
  }

  const getSignalQuality = (rssi: number, snr: number) => {
    if (rssi > -80 && snr > 8) return { level: 'Excellent', color: '#22c55e' }
    if (rssi > -90 && snr > 6) return { level: 'Good', color: '#3b82f6' }
    if (rssi > -100 && snr > 4) return { level: 'Fair', color: '#f59e0b' }
    return { level: 'Poor', color: '#ef4444' }
  }

  const getBatteryIcon = (level: number) => {
    if (level > 80) return '🔋'
    if (level > 60) return '🔋'
    if (level > 40) return '🪫'
    if (level > 20) return '🪫'
    return '🪫'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
      color: '#f1f5f9',
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
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #64748b, #94a3b8, #cbd5e1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          marginBottom: '8px'
        }}>
          📡 LoRa Connect Engine Ultra
        </h1>
        <p style={{
          margin: 0,
          fontSize: '18px',
          color: '#cbd5e1',
          fontWeight: 500
        }}>
          Long Range Communication Intelligence & LoRaWAN Management
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
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {(['overview', 'devices', 'coverage'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              background: viewMode === mode ? '#64748b' : 'rgba(0, 0, 0, 0.3)',
              color: viewMode === mode ? '#fff' : '#cbd5e1',
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
          {/* Network Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📊 LoRaWAN Network Metrics
              <span style={{
                fontSize: '14px',
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                {metrics.activeDevices}/{metrics.totalDevices} Active
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
                    border: '1px solid rgba(148, 163, 184, 0.5)',
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
                      color: '#f1f5f9',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <span style={{
                      fontSize: '20px',
                      color: '#64748b',
                      fontWeight: 700
                    }}>
                      {key.includes('Devices') ? value :
                       key.includes('Coverage') || key.includes('Health') || key.includes('Success') ? `${value.toFixed(1)}%` :
                       key.includes('RSSI') ? `${value.toFixed(1)} dBm` :
                       key.includes('SNR') ? `${value.toFixed(1)} dB` :
                       key.includes('Transmitted') ? `${value.toFixed(2)} GB` :
                       value}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>
                      {key === 'totalDevices' || key === 'activeDevices' ? '📱' :
                       key === 'networkCoverage' ? '📡' :
                       key === 'avgRSSI' ? '📶' :
                       key === 'avgSNR' ? '📊' :
                       key === 'dataTransmitted' ? '📤' :
                       key === 'batteryHealth' ? '🔋' : '✅'}
                    </span>
                    <span>
                      {key.includes('Coverage') ?
                       (value > 95 ? 'Excellent' : value > 90 ? 'Good' : value > 80 ? 'Fair' : 'Poor') :
                       key.includes('RSSI') ?
                       (value > -80 ? 'Strong' : value > -95 ? 'Moderate' : 'Weak') :
                       key.includes('SNR') ?
                       (value > 8 ? 'Excellent' : value > 5 ? 'Good' : 'Fair') :
                       key.includes('Health') || key.includes('Success') ?
                       (value > 90 ? 'Excellent' : value > 80 ? 'Good' : 'Needs Attention') :
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
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: '16px'
            }}>
              📈 Network Statistics
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
                  {devices.filter(d => d.type === 'gateway').length}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>Gateways</div>
              </div>
              
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 700 }}>
                  {devices.filter(d => d.type === 'sensor').length}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>Sensors</div>
              </div>
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#f59e0b', fontWeight: 700 }}>
                  {(devices.reduce((sum, d) => sum + d.battery, 0) / devices.length).toFixed(1)}%
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>Avg Battery</div>
              </div>
              
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid #a855f7',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', color: '#a855f7', fontWeight: 700 }}>
                  {devices.filter(d => d.status === 'sleep').length}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>Sleep Mode</div>
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
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📱 LoRaWAN Device Network
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {devices.map((device, index) => {
              const signalQuality = getSignalQuality(device.rssi, device.snr)
              
              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDevice(selectedDevice === device.id ? null : device.id)}
                  style={{
                    background: selectedDevice === device.id ? 
                      'rgba(148, 163, 184, 0.2)' : 'rgba(0, 0, 0, 0.3)',
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
                      <span style={{ fontSize: '20px' }}>{getDeviceTypeIcon(device.type)}</span>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#f1f5f9'
                      }}>
                        {device.name}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '14px' }}>{getBatteryIcon(device.battery)}</span>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        background: getStatusColor(device.status),
                        borderRadius: '50%',
                        animation: device.status === 'transmitting' ? 'pulse 1s infinite' : 'none'
                      }} />
                    </div>
                  </div>

                  <div style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    marginBottom: '12px'
                  }}>
                    📍 {device.location} | {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Battery</div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: device.battery > 20 ? '#22c55e' : '#ef4444', 
                        fontWeight: 600 
                      }}>
                        {device.battery}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>RSSI</div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: signalQuality.color, 
                        fontWeight: 600 
                      }}>
                        {device.rssi} dBm
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>SNR</div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: signalQuality.color, 
                        fontWeight: 600 
                      }}>
                        {device.snr} dB
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <span>SF: {device.spreadingFactor}</span>
                    <span style={{
                      background: `rgba(${getStatusColor(device.status).slice(1)}, 0.2)`,
                      color: getStatusColor(device.status),
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {device.status}
                    </span>
                    <span>Last: {Math.floor((Date.now() - device.lastSeen.getTime()) / 60000)}m ago</span>
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
                        borderTop: '1px solid rgba(148, 163, 184, 0.3)'
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                        <strong>Device Details:</strong><br />
                        ID: {device.id}<br />
                        Frequency: {device.frequency} MHz<br />
                        Data Rate: {device.dataRate} kbps<br />
                        TX Power: {device.txPower} dBm<br />
                        Signal Quality: <span style={{ color: signalQuality.color }}>{signalQuality.level}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Coverage Mode */}
      {viewMode === 'coverage' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '20px'
          }}>
            🗺️ Network Coverage & Analytics
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(148, 163, 184, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#f1f5f9', marginBottom: '16px' }}>Coverage Map</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(148, 163, 184, 0.1), rgba(203, 213, 225, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8'
              }}>
                🗺️ LoRaWAN Coverage Visualization
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(148, 163, 184, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#f1f5f9', marginBottom: '16px' }}>Signal Strength</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8'
              }}>
                📶 RSSI & SNR Analysis
              </div>
            </div>
            
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(148, 163, 184, 0.5)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#f1f5f9', marginBottom: '16px' }}>Battery Analytics</h4>
              <div style={{
                height: '200px',
                background: 'linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8'
              }}>
                🔋 Power Management Dashboard
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
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#f1f5f9',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🚨 LoRaWAN Alerts
          {alerts.length > 0 && (
            <span style={{
              fontSize: '12px',
              background: 'rgba(148, 163, 184, 0.2)',
              color: '#64748b',
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
              color: '#94a3b8',
              padding: '20px',
              fontSize: '14px'
            }}>
              ✅ All LoRaWAN devices operating normally
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
                      {alert.type === 'battery' ? '🔋' :
                       alert.type === 'signal' ? '📶' :
                       alert.type === 'connectivity' ? '🔗' : '📊'}
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
                      color: '#94a3b8',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {alert.type}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#f1f5f9',
                  marginBottom: '4px'
                }}>
                  {alert.message}
                </div>
                {alert.deviceId && (
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    📱 Device: {alert.deviceId}
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
        transition={{ delay: 0.5 }}
        style={{
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px'
        }}
      >
        <div style={{ color: '#64748b' }}>
          📡 LoRa Connect Active - Long Range Communication Online
        </div>
        <div style={{ color: '#94a3b8' }}>
          📱 EuroWeb Platform v8.1.0 | Devices: {metrics.activeDevices}/{metrics.totalDevices} | Coverage: {metrics.networkCoverage.toFixed(1)}%
        </div>
        <div style={{ color: '#64748b' }}>
          🌐 {new Date().toLocaleTimeString()} | LoRaWAN AI Mode
        </div>
      </motion.div>
    </div>
  )
}

export default LoRaConnectEngineUltra
