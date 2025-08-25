/**
 * EuroMesh Dashboard - Network Intelligence & Coordination Hub
 * EuroWeb Platform v9.0.1 - Regional Mesh Network Management
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.1 Ultra
 * @license MIT
 * @created August 25, 2025
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MeshNode {
  id: string
  name: string
  location: string
  country: string
  status: 'online' | 'offline' | 'maintenance' | 'unstable'
  connections: number
  latency: number
  bandwidth: string
  coordinates: [number, number]
  type: 'hub' | 'relay' | 'edge' | 'gateway'
  lastSeen: Date
}

interface NetworkMetrics {
  totalNodes: number
  activeNodes: number
  totalConnections: number
  avgLatency: number
  totalBandwidth: string
  uptime: number
  dataTransferred: string
}

const EuroMeshDashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('balkans')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'graph'>('map')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const mockNodes: MeshNode[] = [
    {
      id: 'node-tirana',
      name: 'Tirana Hub',
      location: 'Tirana',
      country: 'Albania',
      status: 'online',
      connections: 12,
      latency: 15,
      bandwidth: '1.2 Gbps',
      coordinates: [41.3275, 19.8187],
      type: 'hub',
      lastSeen: new Date()
    },
    {
      id: 'node-pristina',
      name: 'Pristina Gateway',
      location: 'Pristina',
      country: 'Kosovo',
      status: 'online',
      connections: 8,
      latency: 22,
      bandwidth: '850 Mbps',
      coordinates: [42.6629, 21.1655],
      type: 'gateway',
      lastSeen: new Date()
    },
    {
      id: 'node-skopje',
      name: 'Skopje Relay',
      location: 'Skopje',
      country: 'North Macedonia',
      status: 'online',
      connections: 6,
      latency: 18,
      bandwidth: '650 Mbps',
      coordinates: [41.9973, 21.4280],
      type: 'relay',
      lastSeen: new Date()
    },
    {
      id: 'node-podgorica',
      name: 'Podgorica Edge',
      location: 'Podgorica',
      country: 'Montenegro',
      status: 'unstable',
      connections: 4,
      latency: 45,
      bandwidth: '320 Mbps',
      coordinates: [42.4304, 19.2594],
      type: 'edge',
      lastSeen: new Date(Date.now() - 300000)
    },
    {
      id: 'node-belgrade',
      name: 'Belgrade Hub',
      location: 'Belgrade',
      country: 'Serbia',
      status: 'online',
      connections: 15,
      latency: 12,
      bandwidth: '1.8 Gbps',
      coordinates: [44.7866, 20.4489],
      type: 'hub',
      lastSeen: new Date()
    },
    {
      id: 'node-zagreb',
      name: 'Zagreb Gateway',
      location: 'Zagreb',
      country: 'Croatia',
      status: 'maintenance',
      connections: 0,
      latency: 0,
      bandwidth: '0 Mbps',
      coordinates: [45.8150, 15.9819],
      type: 'gateway',
      lastSeen: new Date(Date.now() - 1800000)
    }
  ]

  const [nodes, setNodes] = useState<MeshNode[]>(mockNodes)
  const [metrics, _setMetrics] = useState<NetworkMetrics>({
    totalNodes: mockNodes.length,
    activeNodes: mockNodes.filter(n => n.status === 'online').length,
    totalConnections: mockNodes.reduce((sum, n) => sum + n.connections, 0),
    avgLatency: Math.round(mockNodes.filter(n => n.status === 'online').reduce((sum, n) => sum + n.latency, 0) / mockNodes.filter(n => n.status === 'online').length),
    totalBandwidth: '4.8 Gbps',
    uptime: 98.7,
    dataTransferred: '247.3 TB'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/20 border-green-400'
      case 'offline': return 'text-red-400 bg-red-400/20 border-red-400'
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400'
      case 'unstable': return 'text-orange-400 bg-orange-400/20 border-orange-400'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hub': return '🏢'
      case 'gateway': return '🌐'
      case 'relay': return '📡'
      case 'edge': return '🔗'
      default: return '⚙️'
    }
  }

  const regions = [
    { code: 'balkans', name: 'Balkans', flag: '🏔️' },
    { code: 'europe', name: 'Europe', flag: '🇪🇺' },
    { code: 'mediterranean', name: 'Mediterranean', flag: '🌊' },
    { code: 'adriatic', name: 'Adriatic', flag: '🏖️' }
  ]

  useEffect(() => {
    if (!autoRefresh) {return}

    const interval = setInterval(() => {
      // Simulate real-time updates
      setNodes(prev => prev.map(node => ({
        ...node,
        latency: node.status === 'online' ? 
          Math.max(5, node.latency + (Math.random() - 0.5) * 10) : node.latency,
        connections: node.status === 'online' ? 
          Math.max(0, node.connections + Math.floor((Math.random() - 0.5) * 3)) : node.connections
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const _selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-4">
            🌐 EuroMesh Dashboard
            <span className="text-blue-400 text-3xl">v9.0.1</span>
          </h1>
          <p className="text-blue-200 text-xl">
            🔗 Regional mesh network coordination and intelligence hub
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-green-400">● Network Active</span>
            <span className="text-purple-400">● AI Monitoring</span>
            <span className="text-yellow-400">● Auto-Healing</span>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Region Selector */}
            <div>
              <label className="block text-blue-300 font-semibold mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                {regions.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-purple-300 font-semibold mb-2">View</label>
              <div className="flex gap-2">
                {(['map', 'grid', 'graph'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      viewMode === mode
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {mode === 'map' ? '🗺️' : mode === 'grid' ? '⚏' : '📊'}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Refresh */}
            <div>
              <label className="block text-green-300 font-semibold mb-2">Monitoring</label>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-full px-4 py-3 rounded-lg transition-all ${
                  autoRefresh
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {autoRefresh ? '🟢 Live' : '⚪ Paused'}
              </button>
            </div>

            {/* Emergency Button */}
            <div>
              <label className="block text-red-300 font-semibold mb-2">Emergency</label>
              <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all">
                🚨 Alert
              </button>
            </div>
          </div>
        </motion.div>

        {/* Network Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4"
        >
          {[
            { label: 'Total Nodes', value: metrics.totalNodes, icon: '🔵', color: 'blue' },
            { label: 'Active', value: metrics.activeNodes, icon: '🟢', color: 'green' },
            { label: 'Connections', value: metrics.totalConnections, icon: '🔗', color: 'purple' },
            { label: 'Avg Latency', value: `${metrics.avgLatency}ms`, icon: '⚡', color: 'yellow' },
            { label: 'Bandwidth', value: metrics.totalBandwidth, icon: '🌊', color: 'cyan' },
            { label: 'Uptime', value: `${metrics.uptime}%`, icon: '⏱️', color: 'green' },
            { label: 'Data', value: metrics.dataTransferred, icon: '📊', color: 'indigo' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center"
            >
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className={`text-2xl font-bold text-${metric.color}-400 mb-1`}>
                {metric.value}
              </div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Node List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              📡 Network Nodes
              <span className="text-sm text-slate-400">({nodes.length} total)</span>
            </h3>
            
            <div className="space-y-3">
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  layout
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedNode === node.id
                      ? 'bg-slate-700 border-blue-400'
                      : 'bg-slate-700/50 border-transparent hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(node.type)}</div>
                      <div>
                        <h4 className="font-semibold text-white">{node.name}</h4>
                        <p className="text-sm text-slate-400">{node.location}, {node.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(node.status)}`}>
                        {node.status.toUpperCase()}
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{node.connections} conn</div>
                        <div className="text-slate-400 text-sm">{node.latency}ms</div>
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {selectedNode === node.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-600"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Type:</span>
                            <p className="text-white capitalize">{node.type}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Bandwidth:</span>
                            <p className="text-white">{node.bandwidth}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Coordinates:</span>
                            <p className="text-white">{node.coordinates[0].toFixed(4)}, {node.coordinates[1].toFixed(4)}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">Last Seen:</span>
                            <p className="text-white">{node.lastSeen.toLocaleTimeString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Network Map & Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Mini Map */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">🗺️ Network Map</h3>
              <div className="bg-slate-700 h-48 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                  {/* Simulated network visualization */}
                  {nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`absolute w-3 h-3 rounded-full ${
                        node.status === 'online' ? 'bg-green-400' :
                        node.status === 'unstable' ? 'bg-orange-400' :
                        node.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{
                        left: `${20 + (index % 3) * 30}%`,
                        top: `${20 + Math.floor(index / 3) * 25}%`
                      }}
                      title={node.name}
                    />
                  ))}
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {nodes.slice(0, -1).map((_, index) => (
                      <line
                        key={index}
                        x1={`${20 + (index % 3) * 30}%`}
                        y1={`${20 + Math.floor(index / 3) * 25}%`}
                        x2={`${20 + ((index + 1) % 3) * 30}%`}
                        y2={`${20 + Math.floor((index + 1) / 3) * 25}%`}
                        stroke="rgba(59, 130, 246, 0.5)"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">📈 Performance</h3>
              <div className="space-y-4">
                {[
                  { label: 'Network Health', value: 95, color: 'green' },
                  { label: 'Load Balance', value: 78, color: 'blue' },
                  { label: 'Redundancy', value: 87, color: 'purple' },
                  { label: 'Security', value: 99, color: 'red' }
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className={`text-${stat.color}-400 font-semibold`}>{stat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-2 bg-${stat.color}-400 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Optimize Routes', icon: '🚀', color: 'blue' },
                  { label: 'Run Diagnostics', icon: '🔧', color: 'green' },
                  { label: 'Update Firmware', icon: '📱', color: 'purple' },
                  { label: 'Generate Report', icon: '📊', color: 'yellow' }
                ].map((action) => (
                  <button
                    key={action.label}
                    className={`w-full p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all flex items-center gap-3`}
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-blue-400"
        >
          <p className="text-lg">🌐 Connecting the future through intelligent mesh networks</p>
          <p className="text-sm mt-2 text-blue-500">EuroWeb Platform v9.0.1 • © 2025 Ledjan Ahmati • Network Intelligence Division</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EuroMeshDashboard
