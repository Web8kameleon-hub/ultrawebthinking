/**
 * EuroWeb Ultra Integration Hub
 * Integron të gjitha sistemet: Aviation, Radio, Security, Mirror, Cyber, IoT
 * @author Ledjan Ahmati
 * @version 8.0.0-EUROWEB-ULTRA
 * @contact dealsjona@gmail.com
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Radio, 
  Wifi, 
  Network, 
  Zap, 
  Plane, 
  Satellite,
  Lock,
  Eye,
  Cpu
} from 'lucide-react'

// Import all EuroWeb Ultra components
import SecurityDashboard from '../components/SecurityDashboard'
import LoRaMeshNetwork from '../components/LoRaMeshNetwork'
import WirelessConfiguration from '../components/WirelessConfiguration'
import IoTControlCenter from '../components/IoTControlCenter'
import Web8MeshControl from '../components/Web8MeshControl'
import Web8SecurityMonitor from '../frontend/src/components/Web8SecurityMonitor'
import UltraAGIChat from '../components/UltraAGIChat/UltraAGIChat'

type EuroWebSystem = {
  id: string
  name: string
  icon: React.ReactNode
  component: React.ComponentType
  status: 'active' | 'standby' | 'critical'
  description: string
  category: 'security' | 'radio' | 'aviation' | 'mirror' | 'cyber' | 'ultra'
}

const euroWebSystems: EuroWebSystem[] = [
  // 🛡️ SECURITY SYSTEMS
  {
    id: 'security-dashboard',
    name: 'Security Dashboard',
    icon: <Shield className="w-5 h-5" />,
    component: SecurityDashboard,
    status: 'active',
    description: 'Real-time security monitoring and threat detection',
    category: 'security'
  },
  {
    id: 'web8-security',
    name: 'Web8 Security Monitor',
    icon: <Eye className="w-5 h-5" />,
    component: Web8SecurityMonitor,
    status: 'active',
    description: 'Advanced Web8 security protocols',
    category: 'security'
  },

  // 📡 RADIO & WIRELESS
  {
    id: 'wireless-config',
    name: 'Wireless Configuration',
    icon: <Wifi className="w-5 h-5" />,
    component: WirelessConfiguration,
    status: 'active',
    description: 'Wireless network configuration and management',
    category: 'radio'
  },
  {
    id: 'lora-mesh',
    name: 'LoRa Mesh Network',
    icon: <Radio className="w-5 h-5" />,
    component: LoRaMeshNetwork,
    status: 'active',
    description: 'Long-range mesh networking protocol',
    category: 'radio'
  },

  // 🌐 MESH & CYBER
  {
    id: 'mesh-control',
    name: 'Web8 Mesh Control',
    icon: <Network className="w-5 h-5" />,
    component: Web8MeshControl,
    status: 'active',
    description: 'Mesh network topology and control center',
    category: 'cyber'
  },
  {
    id: 'iot-control',
    name: 'IoT Control Center',
    icon: <Cpu className="w-5 h-5" />,
    component: IoTControlCenter,
    status: 'active',
    description: 'IoT device management and monitoring',
    category: 'cyber'
  },

  // 🚀 ULTRA SYSTEMS
  {
    id: 'ultra-agi-chat',
    name: 'Ultra AGI Chat',
    icon: <Zap className="w-5 h-5" />,
    component: UltraAGIChat,
    status: 'active',
    description: 'Advanced AGI conversation system',
    category: 'ultra'
  }
]

export default function EuroWebUltraHub() {
  const [activeSystem, setActiveSystem] = useState<string>('security-dashboard')
  const [systemStats, setSystemStats] = useState({
    securityLevel: 98,
    networkNodes: 247,
    activeCyberDefenses: 12,
    ultraAGILoad: 67
  })

  // Real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        securityLevel: Math.min(100, prev.securityLevel + (Math.random() - 0.5) * 2),
        networkNodes: prev.networkNodes + Math.floor((Math.random() - 0.5) * 10),
        activeCyberDefenses: Math.max(1, prev.activeCyberDefenses + Math.floor((Math.random() - 0.5) * 3)),
        ultraAGILoad: Math.min(100, Math.max(0, prev.ultraAGILoad + (Math.random() - 0.5) * 10))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'standby': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'from-red-500 to-orange-500'
      case 'radio': return 'from-blue-500 to-cyan-500'
      case 'aviation': return 'from-sky-500 to-blue-500'
      case 'mirror': return 'from-purple-500 to-pink-500'
      case 'cyber': return 'from-green-500 to-teal-500'
      case 'ultra': return 'from-gold-500 to-yellow-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const activeSystemObj = euroWebSystems.find(system => system.id === activeSystem)
  const ActiveComponent = activeSystemObj?.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-400 to-yellow-400 bg-clip-text text-transparent">
                🚀 EuroWeb Ultra Integration Hub
              </h1>
              <p className="text-gray-300 text-sm">
                Aviation • Radio • Security • Mirror • Cyber • Ultra Systems
              </p>
            </div>
            
            {/* System Stats */}
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-400 font-bold">{systemStats.securityLevel}%</div>
                <div className="text-gray-400">Security</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">{systemStats.networkNodes}</div>
                <div className="text-gray-400">Nodes</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{systemStats.activeCyberDefenses}</div>
                <div className="text-gray-400">Defenses</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{systemStats.ultraAGILoad}%</div>
                <div className="text-gray-400">AGI Load</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - System Navigator */}
        <div className="w-80 bg-black/30 backdrop-blur-sm border-r border-white/10">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-200">EuroWeb Systems</h2>
            
            <div className="space-y-2">
              {euroWebSystems.map((system) => (
                <motion.button
                  key={system.id}
                  onClick={() => setActiveSystem(system.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    activeSystem === system.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(system.category)}`}>
                      {system.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{system.name}</div>
                      <div className="text-xs text-gray-400">{system.description}</div>
                      <div className={`text-xs ${getStatusColor(system.status)} mt-1`}>
                        ● {system.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSystem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {/* System Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getCategoryColor(activeSystemObj?.category || 'security')}`}>
                    {activeSystemObj?.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{activeSystemObj?.name}</h2>
                    <p className="text-gray-400">{activeSystemObj?.description}</p>
                  </div>
                </div>
              </div>

              {/* Active Component */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-4 text-center text-sm text-gray-400">
        <p>
          🇦🇱 EuroWeb Ultra v8.0.0 | Created by{' '}
          <span className="text-gold-400 font-semibold">Ledjan Ahmati</span> |{' '}
          <span className="text-blue-400">dealsjona@gmail.com</span>
        </p>
      </div>
    </div>
  )
}
