/**
 * Web8 Mesh Network Control Panel
 * Aktivizon dhe menaxhon rrjetin mesh nga Gjermania deri në Shqipëri
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0 Mesh Network
 * @contact dealsjona@gmail.com
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

// Types
interface NetworkNode {
  id: string
  host: string
  port: number
  region: 'germany' | 'austria' | 'slovenia' | 'croatia' | 'montenegro' | 'albania' | 'kosova'
  type: 'supernode' | 'relay' | 'client' | 'edge'
  status: 'online' | 'offline' | 'connecting' | 'error'
  lastSeen: number
  flag?: string
  statusIcon?: string
  uptime?: number
  latency?: number
  bandwidth?: number
}

interface MeshStatus {
  isActive: boolean
  totalNodes: number
  activeNodes: number
  regions: Array<{
    region: string
    nodes: number
    flag: string
  }>
  bandwidth: number
  latency: number
  health: number
  routes: number
}

export const Web8MeshControl: React.FC = () => {
  // State
  const [meshStatus, setMeshStatus] = useState<MeshStatus | null>(null)
  const [nodes, setNodes] = useState<NetworkNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActivating, setIsActivating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [newNodeHost, setNewNodeHost] = useState('')
  const [newNodePort, setNewNodePort] = useState('4000')
  const [selectedRegion, setSelectedRegion] = useState<string>('albania')

  // Fetch mesh status
  const fetchMeshStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/mesh/status')
      const data = await response.json()
      
      if (data.success) {
        setMeshStatus(data.data)
        setLastUpdate(data.data.lastUpdate || new Date().toISOString())
      }
    } catch (error) {
      console.error('Failed to fetch mesh status:', error)
    }
  }, [])

  // Fetch nodes list
  const fetchNodes = useCallback(async () => {
    try {
      const response = await fetch('/api/mesh/nodes')
      const data = await response.json()
      
      if (data.success) {
        setNodes(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error)
    }
  }, [])

  // Activate mesh network
  const activateMeshNetwork = async () => {
    setIsActivating(true)
    try {
      const response = await fetch('/api/mesh/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      console.log('🌐 Mesh activation result:', data)
      
      if (data.success) {
        await fetchMeshStatus()
        await fetchNodes()
      }
    } catch (error) {
      console.error('Failed to activate mesh:', error)
    } finally {
      setIsActivating(false)
    }
  }

  // Add new node
  const addNewNode = async () => {
    if (!newNodeHost || !newNodePort) return

    try {
      const response = await fetch('/api/mesh/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: newNodeHost,
          port: parseInt(newNodePort),
          region: selectedRegion,
          type: 'client'
        })
      })

      const data = await response.json()
      if (data.success) {
        setNewNodeHost('')
        setNewNodePort('4000')
        await fetchNodes()
        await fetchMeshStatus()
      }
    } catch (error) {
      console.error('Failed to add node:', error)
    }
  }

  // Discover new nodes
  const discoverNodes = async () => {
    try {
      const response = await fetch('/api/mesh/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      if (data.success) {
        await fetchNodes()
        await fetchMeshStatus()
      }
    } catch (error) {
      console.error('Failed to discover nodes:', error)
    }
  }

  // Initial load and periodic updates
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchMeshStatus(), fetchNodes()])
      setIsLoading(false)
    }

    loadData()

    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchMeshStatus()
      fetchNodes()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchMeshStatus, fetchNodes])

  if (isLoading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } as any}>
        <div style={{
          fontSize: '24px',
          color: '#6366f1',
          fontWeight: 600
        } as any}>
          🌐 Connecting to Web8 Mesh Network...
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '30px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      minHeight: '100vh'
    } as any}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          marginBottom: '30px',
          textAlign: 'center'
        } as any}
      >
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        } as any}>
          🌐 Web8 Mesh Network Control
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#64748b',
          marginBottom: '20px'
        } as any}>
          Aktivizo dhe menaxho rrjetin mesh nga Gjermania deri në Shqipëri
        </p>
        
        {/* Network Status Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: meshStatus?.isActive 
            ? 'linear-gradient(135deg, #10b981, #059669)' 
            : 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: '25px',
          color: '#ffffff',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        } as any}>
          <div style={{
            width: '12px',
            height: '12px',
            background: '#ffffff',
            borderRadius: '50%',
            animation: meshStatus?.isActive ? 'pulse 2s infinite' : 'none'
          } as any} />
          {meshStatus?.isActive ? '🟢 Network Active' : '🔴 Network Inactive'}
        </div>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        } as any}
      >
        <button
          onClick={activateMeshNetwork}
          disabled={isActivating}
          style={{
            padding: '12px 24px',
            background: isActivating 
              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isActivating ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          } as any}
        >
          {isActivating ? '⏳ Activating...' : '🚀 Activate Network'}
        </button>
        
        <button
          onClick={discoverNodes}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          } as any}
        >
          🔍 Discover Nodes
        </button>
      </motion.div>

      {/* Network Statistics */}
      {meshStatus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          } as any}
        >
          <div style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          } as any}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#6366f1', marginBottom: '8px' } as any}>
              {meshStatus.activeNodes}/{meshStatus.totalNodes}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 } as any}>
              Active Nodes
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          } as any}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginBottom: '8px' } as any}>
              {meshStatus.health}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 } as any}>
              Network Health
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          } as any}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' } as any}>
              {meshStatus.latency.toFixed(1)}ms
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 } as any}>
              Avg Latency
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          } as any}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#8b5cf6', marginBottom: '8px' } as any}>
              {meshStatus.bandwidth} MB/s
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 } as any}>
              Total Bandwidth
            </div>
          </div>
        </motion.div>
      )}

      {/* Regional Distribution */}
      {meshStatus?.regions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          } as any}
        >
          <h3 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '20px',
            textAlign: 'center'
          } as any}>
            🗺️ Regional Node Distribution
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          } as any}>
            {meshStatus.regions.map((region) => (
              <div
                key={region.region}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.2)'
                } as any}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' } as any}>
                  <span style={{ fontSize: '20px' } as any}>{region.flag}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: '#1e293b',
                    textTransform: 'capitalize'
                  } as any}>
                    {region.region}
                  </span>
                </div>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '8px'
                } as any}>
                  {region.nodes}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add New Node */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        } as any}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '20px'
        } as any}>
          ➕ Add New Node to Network
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        } as any}>
          <input
            type="text"
            value={newNodeHost}
            onChange={(e) => setNewNodeHost(e.target.value)}
            placeholder="Node IP or hostname"
            style={{
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#ffffff'
            } as any}
          />
          
          <input
            type="number"
            value={newNodePort}
            onChange={(e) => setNewNodePort(e.target.value)}
            placeholder="Port"
            style={{
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#ffffff'
            } as any}
          />
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#ffffff'
            } as any}
          >
            <option value="germany">🇩🇪 Germany</option>
            <option value="austria">🇦🇹 Austria</option>
            <option value="slovenia">🇸🇮 Slovenia</option>
            <option value="croatia">🇭🇷 Croatia</option>
            <option value="montenegro">🇲🇪 Montenegro</option>
            <option value="albania">🇦🇱 Albania</option>
            <option value="kosova">🇽🇰 Kosova</option>
          </select>
        </div>
        
        <button
          onClick={addNewNode}
          disabled={!newNodeHost || !newNodePort}
          style={{
            padding: '12px 24px',
            background: !newNodeHost || !newNodePort 
              ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: !newNodeHost || !newNodePort ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          } as any}
        >
          🔗 Connect Node
        </button>
      </motion.div>

      {/* Nodes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
          border: '2px solid #e2e8f0',
          borderRadius: '16px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        } as any}
      >
        <h3 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '20px'
        } as any}>
          📡 Active Network Nodes ({nodes.length})
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '15px'
        } as any}>
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                padding: '16px',
                background: node.status === 'online' 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: `2px solid ${node.status === 'online' 
                  ? 'rgba(16, 185, 129, 0.3)' 
                  : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '12px'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              } as any}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                } as any}>
                  <span style={{ fontSize: '16px' } as any}>{node.flag}</span>
                  <span style={{ fontSize: '16px' } as any}>{node.statusIcon}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: '#1e293b'
                  } as any}>
                    {node.host}:{node.port}
                  </span>
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  background: 'rgba(100, 116, 139, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                } as any}>
                  {node.type}
                </span>
              </div>
              
              <div style={{ fontSize: '12px', color: '#64748b' } as any}>
                Region: {node.region} • Status: {node.status}
                {node.latency && ` • Latency: ${node.latency}ms`}
              </div>
            </div>
          ))}
        </div>
        
        {nodes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#64748b',
            fontSize: '16px'
          } as any}>
            No nodes discovered yet. Click "Activate Network" to start discovery.
          </div>
        )}
      </motion.div>
      
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      } as any}>
        Last updated: {new Date(lastUpdate).toLocaleString()}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default Web8MeshControl
