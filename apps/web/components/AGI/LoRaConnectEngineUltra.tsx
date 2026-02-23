/**
 * LoRa Connect Engine Ultra - Long Range Communication Intelligence
 * EuroWeb Platform - Advanced LoRaWAN Network Management & IoT Communication AI
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 Ultra Pro
 * @license MIT
 * @modernized August 24, 2025
 */

'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

// Enhanced interfaces with more functionality
interface LoRaTopology {
  gateways: Array<{
    id: string
    position: { x: number; y: number }
    connections: string[]
  }>
  nodes: Array<{
    id: string
    position: { x: number; y: number }
    connections: string[]
  }>
}

interface LoRaDevice {
  id: string
  name: string
  type: 'sensor' | 'actuator' | 'gateway' | 'repeater' | 'beacon' | 'tracker'
  status: 'online' | 'offline' | 'sleep' | 'transmitting' | 'receiving' | 'error'
  location: { lat: number; lng: number; name: string }
  battery: number
  rssi: number
  snr: number
  frequency: number
  spreadingFactor: number
  lastSeen: Date
  dataRate: number
  txPower: number
  uptime: number
  firmware: string
  temperature?: number
  humidity?: number
  pressure?: number
  voltage?: number
  current?: number
  memoryUsage?: number
  cpuLoad?: number
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor'
  securityLevel: 'high' | 'medium' | 'low'
  encryptionType: 'AES256' | 'AES128' | 'none'
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
  networkLoad: number
  interferenceLevel: number
  gatewayCount: number
  sensorCount: number
  actuatorCount: number
  repeaterCount: number
  beaconCount: number
  trackerCount: number
  totalUptime: number
  avgTemperature: number
  avgHumidity: number
  securityScore: number
  energyEfficiency: number
}

interface LoRaAlert {
  id: string
  type: 'battery' | 'signal' | 'connectivity' | 'data' | 'security' | 'hardware' | 'environmental'
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
  deviceId?: string
  message: string
  timestamp: Date
  acknowledged: boolean
  autoResolve: boolean
}

interface LoRaCommand {
  id: string
  deviceId: string
  command: string
  parameters: Record<string, any>
  status: 'pending' | 'sent' | 'acknowledged' | 'executed' | 'failed'
  timestamp: Date
  response?: any
}

interface NetworkTopology {
  nodes: Array<{
    id: string
    name: string
    type: string
    position: { x: number; y: number }
    connections: string[]
    status: string
  }>
  edges: Array<{
    from: string
    to: string
    strength: number
    latency: number
  }>
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
    packetSuccess: 98.9,
    networkLoad: 73.5,
    interferenceLevel: 12.3,
    gatewayCount: 3,
    sensorCount: 8,
    actuatorCount: 2,
    repeaterCount: 3,
    beaconCount: 1,
    trackerCount: 1,
    totalUptime: 99.2,
    avgTemperature: 22.4,
    avgHumidity: 65.8,
    securityScore: 95.7,
    energyEfficiency: 89.3
  })

  const [devices, setDevices] = useState<LoRaDevice[]>([
    {
      id: 'LR-GW-001',
      name: 'Main Gateway',
      type: 'gateway',
      status: 'online',
      location: { lat: 41.3275, lng: 19.8187, name: 'Central Tower' },
      battery: 100,
      rssi: -45,
      snr: 12.5,
      frequency: 868.1,
      spreadingFactor: 7,
      lastSeen: new Date(),
      dataRate: 5.47,
      txPower: 14,
      uptime: 99.8,
      firmware: 'v2.1.3',
      temperature: 24.5,
      voltage: 12.4,
      current: 0.85,
      memoryUsage: 45.2,
      cpuLoad: 23.1,
      networkQuality: 'excellent',
      securityLevel: 'high',
      encryptionType: 'AES256'
    },
    {
      id: 'LR-RP-001',
      name: 'Mountain Repeater',
      type: 'repeater',
      status: 'online',
      location: { lat: 41.4567, lng: 19.9234, name: 'Mount Vista' },
      battery: 95,
      rssi: -78,
      snr: 9.2,
      frequency: 868.3,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 3.13,
      txPower: 20,
      uptime: 98.5,
      firmware: 'v2.0.8',
      temperature: 18.3,
      voltage: 11.9,
      current: 1.25,
      memoryUsage: 38.7,
      cpuLoad: 15.6,
      networkQuality: 'good',
      securityLevel: 'high',
      encryptionType: 'AES256'
    },
    {
      id: 'LR-SN-001',
      name: 'Weather Station',
      type: 'sensor',
      status: 'transmitting',
      location: { lat: 41.2123, lng: 19.7456, name: 'Field Alpha' },
      battery: 78,
      rssi: -92,
      snr: 6.8,
      frequency: 868.5,
      spreadingFactor: 9,
      lastSeen: new Date(),
      dataRate: 1.76,
      txPower: 14,
      uptime: 97.3,
      firmware: 'v1.9.2',
      temperature: 21.7,
      humidity: 68.4,
      pressure: 1013.2,
      voltage: 3.6,
      current: 0.045,
      memoryUsage: 62.1,
      cpuLoad: 8.9,
      networkQuality: 'fair',
      securityLevel: 'medium',
      encryptionType: 'AES128'
    },
    {
      id: 'LR-SN-002',
      name: 'Soil Monitor',
      type: 'sensor',
      status: 'sleep',
      location: { lat: 41.1897, lng: 19.8765, name: 'Farm Beta' },
      battery: 65,
      rssi: -95,
      snr: 5.2,
      frequency: 868.7,
      spreadingFactor: 10,
      lastSeen: new Date(Date.now() - 300000),
      dataRate: 0.98,
      txPower: 14,
      uptime: 94.8,
      firmware: 'v1.8.7',
      temperature: 19.2,
      humidity: 72.6,
      voltage: 3.4,
      current: 0.032,
      memoryUsage: 58.3,
      cpuLoad: 4.2,
      networkQuality: 'fair',
      securityLevel: 'medium',
      encryptionType: 'AES128'
    },
    {
      id: 'LR-AC-001',
      name: 'Irrigation Controller',
      type: 'actuator',
      status: 'online',
      location: { lat: 41.3456, lng: 19.8234, name: 'Greenhouse' },
      battery: 88,
      rssi: -84,
      snr: 7.6,
      frequency: 868.9,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 2.34,
      txPower: 14,
      uptime: 96.7,
      firmware: 'v2.0.1',
      temperature: 26.8,
      humidity: 85.3,
      voltage: 12.1,
      current: 2.15,
      memoryUsage: 42.6,
      cpuLoad: 18.7,
      networkQuality: 'good',
      securityLevel: 'high',
      encryptionType: 'AES256'
    },
    {
      id: 'LR-SN-003',
      name: 'Tank Level Sensor',
      type: 'sensor',
      status: 'online',
      location: { lat: 41.3789, lng: 19.7123, name: 'Water Tank 1' },
      battery: 92,
      rssi: -89,
      snr: 8.1,
      frequency: 867.1,
      spreadingFactor: 8,
      lastSeen: new Date(),
      dataRate: 1.24,
      txPower: 14,
      uptime: 98.9,
      firmware: 'v1.9.5',
      temperature: 23.1,
      voltage: 3.7,
      current: 0.038,
      memoryUsage: 51.2,
      cpuLoad: 6.4,
      networkQuality: 'good',
      securityLevel: 'medium',
      encryptionType: 'AES128'
    },
    {
      id: 'LR-SN-004',
      name: 'Air Quality Monitor',
      type: 'sensor',
      status: 'online',
      location: { lat: 41.3275, lng: 19.8187, name: 'City Center' },
      battery: 73,
      rssi: -91,
      snr: 6.4,
      frequency: 867.3,
      spreadingFactor: 9,
      lastSeen: new Date(),
      dataRate: 1.87,
      txPower: 14,
      uptime: 95.3,
      firmware: 'v2.1.0',
      temperature: 25.6,
      humidity: 58.9,
      pressure: 1012.8,
      voltage: 3.5,
      current: 0.052,
      memoryUsage: 67.8,
      cpuLoad: 12.3,
      networkQuality: 'fair',
      securityLevel: 'high',
      encryptionType: 'AES256'
    },
    {
      id: 'LR-SN-005',
      name: 'Parking Sensor',
      type: 'sensor',
      status: 'offline',
      location: { lat: 41.3123, lng: 19.8456, name: 'Parking Lot A' },
      battery: 12,
      rssi: 0,
      snr: 0,
      frequency: 0,
      spreadingFactor: 0,
      lastSeen: new Date(Date.now() - 3600000),
      dataRate: 0,
      txPower: 0,
      uptime: 0,
      firmware: 'v1.7.4',
      temperature: 0,
      voltage: 2.8,
      current: 0,
      memoryUsage: 0,
      cpuLoad: 0,
      networkQuality: 'poor',
      securityLevel: 'low',
      encryptionType: 'none'
    }
  ])

  const [alerts, _setAlerts] = useState<LoRaAlert[]>([
    {
      id: '1',
      type: 'battery',
      severity: 'critical',
      deviceId: 'LR-SN-005',
      message: 'Critical battery level - device requires maintenance',
      timestamp: new Date(),
      acknowledged: false,
      autoResolve: false
    },
    {
      id: '2',
      type: 'signal',
      severity: 'medium',
      deviceId: 'LR-SN-002',
      message: 'Low SNR detected - signal quality degraded',
      timestamp: new Date(),
      acknowledged: false,
      autoResolve: true
    },
    {
      id: '3',
      type: 'connectivity',
      severity: 'high',
      deviceId: 'LR-SN-005',
      message: 'Device offline for extended period',
      timestamp: new Date(),
      acknowledged: false,
      autoResolve: false
    }
  ])

  const [_commands, _setCommands] = useState<LoRaCommand[]>([
    {
      id: 'CMD-001',
      deviceId: 'LR-AC-001',
      command: 'SET_IRRIGATION_SCHEDULE',
      parameters: { schedule: '06:00,18:00', duration: 30 },
      status: 'executed',
      timestamp: new Date(),
      response: 'Schedule updated successfully'
    },
    {
      id: 'CMD-002',
      deviceId: 'LR-SN-001',
      command: 'GET_WEATHER_DATA',
      parameters: {},
      status: 'pending',
      timestamp: new Date()
    }
  ])

  const [_topology, _setTopology] = useState<LoRaTopology>({
    gateways: [
      {
        id: 'LR-GW-001',
        position: { x: 400, y: 300 },
        connections: ['LR-RP-001', 'LR-SN-001', 'LR-AC-001', 'LR-SN-003', 'LR-SN-004']
      }
    ],
    nodes: [
      { id: 'LR-RP-001', position: { x: 200, y: 150 }, connections: ['LR-SN-002'] },
      { id: 'LR-SN-001', position: { x: 150, y: 400 }, connections: [] },
      { id: 'LR-SN-002', position: { x: 100, y: 200 }, connections: [] },
      { id: 'LR-AC-001', position: { x: 600, y: 350 }, connections: [] },
      { id: 'LR-SN-003', position: { x: 500, y: 150 }, connections: [] },
      { id: 'LR-SN-004', position: { x: 350, y: 500 }, connections: [] },
      { id: 'LR-SN-005', position: { x: 250, y: 450 }, connections: [] }
    ]
  })

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
        if (device.status === 'online' ?? device.status === 'transmitting') {
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
    if (rssi > -80 && snr > 8) {return { level: 'Excellent', color: '#22c55e' }}
    if (rssi > -90 && snr > 6) {return { level: 'Good', color: '#3b82f6' }}
    if (rssi > -100 && snr > 4) {return { level: 'Fair', color: '#f59e0b' }}
    return { level: 'Poor', color: '#ef4444' }
  }

  const getBatteryIcon = (level: number) => {
    if (level > 80) {return '🔋'}
    if (level > 60) {return '🔋'}
    if (level > 40) {return '🪫'}
    if (level > 20) {return '🪫'}
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
                        key.includes('Coverage') ?? key.includes('Health') ?? key.includes('Success') ? `${value.toFixed(1)}%` :
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
                      {key === 'totalDevices' ?? key === 'activeDevices' ? '📱' :
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
                            key.includes('Health') ?? key.includes('Success') ?
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
                    📍 {typeof device.location === 'string' ? device.location : device.location.name} | {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
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
