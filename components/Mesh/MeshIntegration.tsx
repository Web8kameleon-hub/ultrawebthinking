'use client'

/**
 * EuroWeb Mesh Network Integration - Real Implementation
 * P2P Communication with LoRa and WiFi Mesh
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { meshNetwork, MeshNode, MeshNetworkStats } from '../../lib/mesh'
import styles from './MeshIntegration.module.css'

export const MeshIntegration: React.FC = () => {
  const [meshStats, setMeshStats] = useState<MeshNetworkStats | null>(null)
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([])
  const [networkStatus, setNetworkStatus] = useState({
    online: false,
    nodeId: '',
    connectedNodes: 0,
    networkHealth: 0
  })
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    // Initialize mesh network
    const initializeMesh = async () => {
      try {
        // Get initial status
        const status = meshNetwork.getStatus()
        setNetworkStatus(status)
        
        // Update stats and nodes
        updateMeshData()
        
        // Set up real-time updates
        const interval = setInterval(updateMeshData, 5000)
        
        return () => clearInterval(interval)
      } catch (error) {
        console.error('Mesh initialization error:', error)
      }
    }

    initializeMesh()
  }, [])

  const updateMeshData = () => {
    const stats = meshNetwork.getStats()
    const nodes = meshNetwork.getNodes()
    const status = meshNetwork.getStatus()
    
    setMeshStats(stats)
    setMeshNodes(nodes)
    setNetworkStatus(status)
  }

  const sendTestMessage = async () => {
    if (meshNodes.length === 0) return
    
    const targetNode = meshNodes[0].id
    const testPayload = {
      type: 'test',
      message: 'EuroWeb Mesh Test Message',
      timestamp: new Date().toISOString(),
      origin: 'Web8TabSystem'
    }
    
    const success = await meshNetwork.sendMessage(targetNode, testPayload, 'normal')
    
    if (success) {
      console.log('✅ Test message sent successfully')
    } else {
      console.error('❌ Test message failed')
    }
  }

  const getNodeStatusColor = (node: MeshNode): string => {
    const timeSinceLastSeen = Date.now() - node.lastSeen.getTime()
    if (timeSinceLastSeen < 60000) return styles.statusOnline // < 1 minute
    if (timeSinceLastSeen < 300000) return styles.statusWarning // < 5 minutes
    return styles.statusOffline
  }

  const getSignalStrengthIcon = (strength: number): string => {
    if (strength > -60) return '📶'
    if (strength > -70) return '📳'
    if (strength > -80) return '📱'
    return '📵'
  }

  const getProtocolIcon = (protocol: string): string => {
    switch (protocol) {
      case 'lora': return '📡'
      case 'wifi': return '📶'
      case 'cellular': return '📱'
      default: return '🌐'
    }
  }

  if (!meshStats) {
    return (
      <div className={styles.meshContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Initializing Mesh Network...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.meshContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.meshHeader}
      >
        <h1 className={styles.meshTitle}>
          🕸️ EuroWeb Mesh Network
        </h1>
        <div className={styles.meshSubtitle}>
          Real P2P Communication • LoRa • WiFi • Decentralized Architecture
        </div>
      </motion.div>

      {/* Network Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={styles.statusCard}
      >
        <div className={styles.statusHeader}>
          <div className={clsx(styles.statusIndicator, networkStatus.online ? styles.online : styles.offline)} />
          <h2>Network Status</h2>
        </div>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <div className={styles.statusValue}>{networkStatus.nodeId}</div>
            <div className={styles.statusLabel}>Node ID</div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.statusValue}>{networkStatus.connectedNodes}</div>
            <div className={styles.statusLabel}>Connected Nodes</div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.statusValue}>{(networkStatus.networkHealth * 100).toFixed(1)}%</div>
            <div className={styles.statusLabel}>Network Health</div>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.statusValue}>{meshStats.networkUptime.toFixed(1)}%</div>
            <div className={styles.statusLabel}>Network Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* Network Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className={styles.statsGrid}
      >
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{meshStats.totalNodes}</div>
          <div className={styles.statLabel}>Total Nodes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📡</div>
          <div className={styles.statValue}>{meshStats.avgSignalStrength.toFixed(0)} dBm</div>
          <div className={styles.statLabel}>Avg Signal</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚡</div>
          <div className={styles.statValue}>{meshStats.networkLatency.toFixed(0)} ms</div>
          <div className={styles.statLabel}>Network Latency</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📤</div>
          <div className={styles.statValue}>{meshStats.messagesSent}</div>
          <div className={styles.statLabel}>Messages Sent</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📥</div>
          <div className={styles.statValue}>{meshStats.messagesReceived}</div>
          <div className={styles.statLabel}>Messages Received</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌍</div>
          <div className={styles.statValue}>{meshStats.coverage.range.toFixed(1)} km</div>
          <div className={styles.statLabel}>Coverage Range</div>
        </div>
      </motion.div>

      {/* Connected Nodes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className={styles.nodesSection}
      >
        <div className={styles.sectionHeader}>
          <h2>Connected Mesh Nodes</h2>
          <button
            onClick={sendTestMessage}
            className={styles.testButton}
            disabled={meshNodes.length === 0}
          >
            📤 Send Test Message
          </button>
        </div>
        
        {meshNodes.length === 0 ? (
          <div className={styles.noNodes}>
            <div className={styles.noNodesIcon}>🔍</div>
            <p>No mesh nodes discovered yet...</p>
            <p className={styles.noNodesHint}>
              Mesh nodes will appear here when they join the network
            </p>
          </div>
        ) : (
          <div className={styles.nodesGrid}>
            {meshNodes.map((node) => (
              <motion.div
                key={node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(styles.nodeCard, selectedNode === node.id && styles.nodeSelected)}
              >
                <div className={styles.nodeHeader}>
                  <div className={styles.nodeProtocol}>
                    {getProtocolIcon(node.protocol)}
                    <span>{node.protocol.toUpperCase()}</span>
                  </div>
                  <div className={clsx(styles.nodeStatus, getNodeStatusColor(node))} />
                </div>
                
                <div className={styles.nodeId}>{node.id}</div>
                <div className={styles.nodeAddress}>{node.address}</div>
                
                <div className={styles.nodeMetrics}>
                  <div className={styles.nodeMetric}>
                    <span className={styles.metricIcon}>{getSignalStrengthIcon(node.signalStrength)}</span>
                    <span>{node.signalStrength} dBm</span>
                  </div>
                  <div className={styles.nodeMetric}>
                    <span className={styles.metricIcon}>🔗</span>
                    <span>{node.hopCount} hops</span>
                  </div>
                  {node.batteryLevel && (
                    <div className={styles.nodeMetric}>
                      <span className={styles.metricIcon}>🔋</span>
                      <span>{node.batteryLevel}%</span>
                    </div>
                  )}
                </div>

                {selectedNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={styles.nodeDetails}
                  >
                    <div className={styles.detailRow}>
                      <span>Capabilities:</span>
                      <span>{node.capabilities.join(', ')}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Last Seen:</span>
                      <span>{node.lastSeen.toLocaleTimeString()}</span>
                    </div>
                    {node.location && (
                      <div className={styles.detailRow}>
                        <span>Location:</span>
                        <span>{node.location.lat.toFixed(4)}, {node.location.lng.toFixed(4)}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Network Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={styles.coverageSection}
      >
        <h2>Network Coverage</h2>
        <div className={styles.coverageStats}>
          <div className={styles.coverageStat}>
            <div className={styles.coverageIcon}>🌍</div>
            <div className={styles.coverageValue}>{meshStats.coverage.area.toFixed(0)} km²</div>
            <div className={styles.coverageLabel}>Coverage Area</div>
          </div>
          <div className={styles.coverageStat}>
            <div className={styles.coverageIcon}>📡</div>
            <div className={styles.coverageValue}>{meshStats.coverage.range.toFixed(1)} km</div>
            <div className={styles.coverageLabel}>Max Range</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
