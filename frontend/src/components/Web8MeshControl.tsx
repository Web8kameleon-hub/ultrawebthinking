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
      <div className="p-10 text-center min-h-[400px] flex items-center justify-center">
        <div className="text-2xl text-indigo-500 font-semibold">
          🌐 Connecting to Web8 Mesh Network...
        </div>
      </div>
    )
  }

  return (
    <div className="p-[30px] bg-gradient-to-br from-slate-50 to-white min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-[30px] text-center"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent mb-[10px]">
          🌐 Web8 Mesh Network Control
        </h1>
        <p className="text-lg text-slate-500 mb-5">
          Aktivizo dhe menaxho rrjetin mesh nga Gjermania deri në Shqipëri
        </p>
        
        {/* Network Status Badge */}
        <div className={`inline-flex items-center gap-3 py-3 px-6 rounded-[25px] text-white font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.1)] ${meshStatus?.isActive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
          <div className={`w-3 h-3 bg-white rounded-full ${meshStatus?.isActive ? 'animate-pulse' : ''}`} />
          {meshStatus?.isActive ? '🟢 Network Active' : '🔴 Network Inactive'}
        </div>
      </motion.div>

      {/* Control Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex justify-center gap-[15px] mb-[30px] flex-wrap"
      >
        <button
          onClick={activateMeshNetwork}
          disabled={isActivating}
          className="py-3 px-6 border-none rounded-xl text-white text-base font-semibold flex items-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.3)] disabled:bg-gradient-to-br disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed bg-gradient-to-br from-indigo-500 to-purple-500"
        >
          {isActivating ? '⏳ Activating...' : '🚀 Activate Network'}
        </button>
        
        <button
          onClick={discoverNodes}
          className="py-3 px-6 bg-gradient-to-br from-green-500 to-green-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
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
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 mb-[30px]"
        >
          <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="text-3xl font-bold text-indigo-500 mb-2">
              {meshStatus.activeNodes}/{meshStatus.totalNodes}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Active Nodes
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {meshStatus.health}%
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Network Health
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="text-3xl font-bold text-amber-500 mb-2">
              {meshStatus.latency.toFixed(1)}ms
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Avg Latency
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {meshStatus.bandwidth} MB/s
            </div>
            <div className="text-sm text-slate-500 font-medium">
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
          className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-5 text-center">
            🗺️ Regional Node Distribution
          </h3>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[15px]">
            {meshStatus.regions.map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between py-3 px-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{region.flag}</span>
                  <span className="text-sm font-semibold text-slate-800 capitalize">
                    {region.region}
                  </span>
                </div>
                <span className="text-base font-bold text-indigo-500 bg-indigo-500/10 py-1 px-2 rounded-lg">
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
        className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-[30px] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-5">
          ➕ Add New Node to Network
        </h3>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-5">
          <input
            type="text"
            value={newNodeHost}
            onChange={(e) => setNewNodeHost(e.target.value)}
            placeholder="Node IP or hostname"
            className="p-3 border-2 border-slate-200 rounded-lg text-sm bg-white"
          />
          
          <input
            type="number"
            value={newNodePort}
            onChange={(e) => setNewNodePort(e.target.value)}
            placeholder="Port"
            className="p-3 border-2 border-slate-200 rounded-lg text-sm bg-white"
          />
          
          <div>
            <label htmlFor="node-region" className="sr-only">Node Region</label>
            <select
              id="node-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm bg-white"
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
        </div>
        
        <button
          onClick={addNewNode}
          disabled={!newNodeHost || !newNodePort}
          className="py-3 px-6 border-none rounded-lg text-white text-base font-semibold shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:bg-gradient-to-br disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed bg-gradient-to-br from-green-500 to-green-600"
        >
          🔗 Connect Node
        </button>
      </motion.div>

      {/* Nodes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        <h3 className="text-xl font-bold text-slate-800 mb-5">
          📡 Active Network Nodes ({nodes.length})
        </h3>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[15px]">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`p-4 rounded-xl ${node.status === 'online' ? 'bg-green-500/10 border-2 border-green-500/30' : 'bg-red-500/10 border-2 border-red-500/30'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{node.flag}</span>
                  <span className="text-base">{node.statusIcon}</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {node.host}:{node.port}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase bg-slate-400/10 px-1.5 py-0.5 rounded">
                  {node.type}
                </span>
              </div>
              
              <div className="text-xs text-slate-500">
                Region: {node.region} • Status: {node.status}
                {node.latency && ` • Latency: ${node.latency}ms`}
              </div>
            </div>
          ))}
        </div>
        
        {nodes.length === 0 && (
          <div className="text-center p-10 text-slate-500 text-base">
            No nodes discovered yet. Click "Activate Network" to start discovery.
          </div>
        )}
      </motion.div>
      
      <div className="mt-5 text-center text-xs text-slate-500">
        Last updated: {new Date(lastUpdate).toLocaleString()}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default Web8MeshControl
