/**
 * UTT Dashboard - Universal Token Tracker Management Hub
 * EuroWeb Platform v9.0.1 - Solana Blockchain Integration
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

interface TokenMetrics {
  totalSupply: string
  circulatingSupply: string
  marketCap: string
  price: string
  priceChange24h: number
  volume24h: string
  holders: number
  transactions24h: number
}

interface PhysicalToken {
  id: string
  serialNumber: string
  nfcId: string
  qrCode: string
  status: 'active' | 'pending' | 'deactivated' | 'lost'
  location: string
  owner: string
  value: string
  lastScanned: Date
  batteryLevel?: number
}

interface Transaction {
  id: string
  type: 'mint' | 'burn' | 'transfer' | 'bridge' | 'physical'
  from: string
  to: string
  amount: string
  timestamp: Date
  signature: string
  status: 'confirmed' | 'pending' | 'failed'
}

const UTTDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'bridge' | 'audit'>('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const [metrics, setMetrics] = useState<TokenMetrics>({
    totalSupply: '1,000,000,000',
    circulatingSupply: '247,832,156',
    marketCap: '$12,847,293',
    price: '$0.0518',
    priceChange24h: 8.73,
    volume24h: '$894,521',
    holders: 15847,
    transactions24h: 2341
  })

  const [physicalTokens] = useState<PhysicalToken[]>([
    {
      id: 'ptoken-001',
      serialNumber: 'UTT-PHY-2025-001',
      nfcId: 'NFC-8F4A2B1C',
      qrCode: 'QR-UTT-001-VERIFY',
      status: 'active',
      location: 'Tirana, Albania',
      owner: '7xKj...9mPq',
      value: '1,000 UTT',
      lastScanned: new Date(Date.now() - 3600000),
      batteryLevel: 87
    },
    {
      id: 'ptoken-002',
      serialNumber: 'UTT-PHY-2025-002',
      nfcId: 'NFC-3D8E9F2A',
      qrCode: 'QR-UTT-002-VERIFY',
      status: 'active',
      location: 'Belgrade, Serbia',
      owner: '9kLm...7nRt',
      value: '2,500 UTT',
      lastScanned: new Date(Date.now() - 7200000),
      batteryLevel: 94
    },
    {
      id: 'ptoken-003',
      serialNumber: 'UTT-PHY-2025-003',
      nfcId: 'NFC-6B2C4D9E',
      qrCode: 'QR-UTT-003-VERIFY',
      status: 'pending',
      location: 'Skopje, North Macedonia',
      owner: 'Pending...',
      value: '750 UTT',
      lastScanned: new Date(Date.now() - 86400000),
      batteryLevel: 62
    }
  ])

  const [recentTransactions] = useState<Transaction[]>([
    {
      id: 'tx-001',
      type: 'bridge',
      from: 'Ethereum',
      to: 'Solana',
      amount: '50,000 UTT',
      timestamp: new Date(Date.now() - 1800000),
      signature: '5x7Kj9mPq...8nR4tL2a',
      status: 'confirmed'
    },
    {
      id: 'tx-002',
      type: 'physical',
      from: 'Physical Token',
      to: '9kLm...7nRt',
      amount: '2,500 UTT',
      timestamp: new Date(Date.now() - 3600000),
      signature: 'NFC-3D8E9F2A',
      status: 'confirmed'
    },
    {
      id: 'tx-003',
      type: 'transfer',
      from: '7xKj...9mPq',
      to: '2mLk...5nWz',
      amount: '10,000 UTT',
      timestamp: new Date(Date.now() - 5400000),
      signature: '3d8E9f2A...6bC4d9E',
      status: 'confirmed'
    },
    {
      id: 'tx-004',
      type: 'mint',
      from: 'Treasury',
      to: 'Liquidity Pool',
      amount: '100,000 UTT',
      timestamp: new Date(Date.now() - 7200000),
      signature: '8nR4tL2a...5x7Kj9m',
      status: 'pending'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'confirmed': return 'text-green-400 bg-green-400/20 border-green-400'
      case 'pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400'
      case 'failed': case 'deactivated': return 'text-red-400 bg-red-400/20 border-red-400'
      case 'lost': return 'text-orange-400 bg-orange-400/20 border-orange-400'
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mint': return '🪙'
      case 'burn': return '🔥'
      case 'transfer': return '↔️'
      case 'bridge': return '🌉'
      case 'physical': return '📱'
      default: return '💫'
    }
  }

  const timeframes = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' }
  ]

  useEffect(() => {
    if (!autoRefresh) {return}

    const interval = setInterval(() => {
      // Simulate real-time price updates
      setMetrics(prev => ({
        ...prev,
        price: (parseFloat(prev.price.replace('$', '')) * (1 + (Math.random() - 0.5) * 0.02)).toFixed(4),
        priceChange24h: prev.priceChange24h + (Math.random() - 0.5) * 2
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6"
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
            🪙 UTT Dashboard
            <span className="text-purple-400 text-3xl">v9.0.1</span>
          </h1>
          <p className="text-purple-200 text-xl">
            🚀 Universal Token Tracker - Bridging Physical & Digital Assets on Solana
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-green-400">● Solana Network</span>
            <span className="text-blue-400">● Physical Integration</span>
            <span className="text-yellow-400">● Cross-Chain Bridge</span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'tokens', label: 'Physical Tokens', icon: '📱' },
                { id: 'bridge', label: 'Bridge', icon: '🌉' },
                { id: 'audit', label: 'Audit', icon: '🔍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Timeframe */}
              <div className="flex gap-1">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setSelectedTimeframe(tf.value)}
                    className={`px-3 py-1 rounded ${
                      selectedTimeframe === tf.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Auto Refresh */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  autoRefresh
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {autoRefresh ? '🔄 Live' : '⏸️ Paused'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Token Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {[
            { label: 'Price', value: `$${metrics.price}`, change: metrics.priceChange24h, icon: '💰', color: 'green' },
            { label: 'Market Cap', value: metrics.marketCap, icon: '📈', color: 'blue' },
            { label: 'Volume 24h', value: metrics.volume24h, icon: '📊', color: 'purple' },
            { label: 'Holders', value: metrics.holders.toLocaleString(), icon: '👥', color: 'cyan' },
            { label: 'Total Supply', value: metrics.totalSupply, icon: '🏦', color: 'indigo' },
            { label: 'Circulating', value: metrics.circulatingSupply, icon: '🔄', color: 'pink' },
            { label: 'Transactions', value: metrics.transactions24h.toLocaleString(), icon: '⚡', color: 'yellow' },
            { label: 'Physical Tokens', value: physicalTokens.length.toString(), icon: '📱', color: 'orange' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center"
            >
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className={`text-xl font-bold text-${metric.color}-400 mb-1`}>
                {metric.value}
              </div>
              {'change' in metric && metric.change !== undefined && (
                <div className={`text-sm ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                </div>
              )}
              <div className="text-sm text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Recent Transactions */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  ⚡ Recent Transactions
                  <span className="text-sm text-slate-400">({recentTransactions.length})</span>
                </h3>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getTypeIcon(tx.type)}</span>
                          <div>
                            <h4 className="font-semibold text-white capitalize">{tx.type}</h4>
                            <p className="text-sm text-slate-400">{tx.amount}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded border text-xs ${getStatusColor(tx.status)}`}>
                          {tx.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-sm text-slate-400">
                        <div>From: <span className="text-white">{tx.from}</span></div>
                        <div>To: <span className="text-white">{tx.to}</span></div>
                        <div>Time: <span className="text-white">{tx.timestamp.toLocaleTimeString()}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Chart Placeholder */}
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">📈 Price Chart</h3>
                <div className="bg-slate-700 h-64 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent">
                    <svg className="w-full h-full">
                      {/* Simulated price chart */}
                      <polyline
                        fill="none"
                        stroke="rgb(168, 85, 247)"
                        strokeWidth="3"
                        points="0,200 50,180 100,160 150,140 200,120 250,110 300,105 350,95 400,85"
                      />
                      <polyline
                        fill="none"
                        stroke="rgba(168, 85, 247, 0.3)"
                        strokeWidth="1"
                        points="0,200 50,180 100,160 150,140 200,120 250,110 300,105 350,95 400,85 400,250 0,250"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm text-slate-400">
                    <span>24h ago</span>
                    <span>Now: {metrics.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tokens' && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                📱 Physical Token Management
                <span className="text-sm text-slate-400">({physicalTokens.length} tokens)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {physicalTokens.map((token) => (
                  <div key={token.id} className="bg-slate-700 p-6 rounded-lg border-2 border-slate-600">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white">{token.serialNumber}</h4>
                      <div className={`px-2 py-1 rounded border text-xs ${getStatusColor(token.status)}`}>
                        {token.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-slate-400">NFC ID:</span>
                        <p className="text-white font-mono">{token.nfcId}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">QR Code:</span>
                        <p className="text-white font-mono">{token.qrCode}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <p className="text-white">{token.location}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Owner:</span>
                        <p className="text-white font-mono">{token.owner}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Value:</span>
                        <p className="text-green-400 font-semibold">{token.value}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Last Scanned:</span>
                        <p className="text-white">{token.lastScanned.toLocaleString()}</p>
                      </div>
                      {token.batteryLevel && (
                        <div>
                          <span className="text-slate-400">Battery:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  token.batteryLevel > 50 ? 'bg-green-400' :
                                  token.batteryLevel > 20 ? 'bg-yellow-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${token.batteryLevel}%` }}
                              />
                            </div>
                            <span className="text-white text-xs">{token.batteryLevel}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-all">
                        📱 Scan
                      </button>
                      <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-all">
                        ⚙️ Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'bridge' && (
            <motion.div
              key="bridge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">🌉 Cross-Chain Bridge</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h4 className="text-2xl font-semibold text-white mb-2">Bridge Interface</h4>
                <p className="text-slate-400 mb-6">Cross-chain token bridging functionality coming soon</p>
                <div className="flex justify-center gap-4">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ethereum ↔ Solana</div>
                  <div className="px-4 py-2 bg-purple-600 text-white rounded-lg">BSC ↔ Solana</div>
                  <div className="px-4 py-2 bg-green-600 text-white rounded-lg">Polygon ↔ Solana</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 p-6 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">🔍 Audit & Compliance</h3>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚖️</div>
                <h4 className="text-2xl font-semibold text-white mb-2">Audit Dashboard</h4>
                <p className="text-slate-400 mb-6">Comprehensive audit and compliance monitoring</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Security Score', value: '99.8%', color: 'green' },
                    { label: 'Compliance', value: '100%', color: 'blue' },
                    { label: 'Transparency', value: '95.2%', color: 'purple' },
                    { label: 'Decentralization', value: '87.5%', color: 'yellow' }
                  ].map((metric) => (
                    <div key={metric.label} className="bg-slate-700 p-4 rounded-lg text-center">
                      <div className={`text-2xl font-bold text-${metric.color}-400`}>{metric.value}</div>
                      <div className="text-sm text-slate-400">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-purple-400"
        >
          <p className="text-lg">🪙 Revolutionizing tokenization with physical-digital asset bridging</p>
          <p className="text-sm mt-2 text-purple-500">EuroWeb Platform v9.0.1 • © 2025 Ledjan Ahmati • Blockchain Innovation Division</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UTTDashboard
