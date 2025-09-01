/**
 * EuroWeb Ultra Central Command - Lazy System Integration
 * @author Ledjan Ahmati (100% Creator & Owner)
 * @version 8.0.0-WEB8-ULTRA
 * @contact dealsjona@gmail.com
 */

'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { LazyLoader, UltraComponents } from './LazyLoader'
import { cva } from 'class-variance-authority'

// Command Center Variants
const commandCenterVariants = cva('min-h-screen transition-all duration-500', {
  variants: {
    mode: {
      ultra: 'bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-950',
      industrial: 'bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900',
      neural: 'bg-gradient-to-br from-purple-950 via-pink-900 to-violet-950',
      secure: 'bg-gradient-to-br from-red-950 via-orange-900 to-yellow-950'
    }
  },
  defaultVariants: {
    mode: 'ultra'
  }
})

// Component Configuration Types
type ComponentName = 'AGIMainController' | 'AGISheet' | 'NeuralDashboard' | 'Web8TabSystem' | 'NetworkMonitor' | 'SecurityDashboard' | 'AttackSimulationDashboard' | 'LoRaMeshNetwork' | 'IndustrialWorkingSystem' | 'OpenMindChat' | 'SpaceCommunicationDashboard'

type TabConfig = {
  id: string
  name: string
  component: ComponentName
  icon: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  category: 'control' | 'monitoring' | 'security' | 'communication'
}

const TAB_ROWS: { [key: string]: TabConfig[] } = {
  // Row 1: Command & Control
  control: [
    { id: 'agi-main', name: 'AGI Command', component: 'AGIMainController', icon: '🧠', priority: 'critical', category: 'control' },
    { id: 'agi-sheet', name: 'AGI Engine', component: 'AGISheet', icon: '⚡', priority: 'critical', category: 'control' },
    { id: 'neural-dash', name: 'Neural Core', component: 'NeuralDashboard', icon: '🔮', priority: 'high', category: 'control' },
    { id: 'web8-tabs', name: 'Web8 Tabs', component: 'Web8TabSystem', icon: '🌐', priority: 'high', category: 'control' }
  ],
  
  // Row 2: Monitoring & Security
  monitoring: [
    { id: 'network-mon', name: 'Network Monitor', component: 'NetworkMonitor', icon: '📡', priority: 'high', category: 'monitoring' },
    { id: 'security-dash', name: 'Security Center', component: 'SecurityDashboard', icon: '🛡️', priority: 'critical', category: 'security' },
    { id: 'attack-sim', name: 'Attack Simulation', component: 'AttackSimulationDashboard', icon: '⚔️', priority: 'normal', category: 'security' },
    { id: 'lora-mesh', name: 'LoRa Mesh', component: 'LoRaMeshNetwork', icon: '🔗', priority: 'normal', category: 'communication' }
  ]
}

// Performance Metrics Interface
interface SystemMetrics {
  loadTime: number
  componentsLoaded: number
  memoryUsage: number
  networkLatency: number
}

export const EuroWebUltraCentral: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('agi-main')
  const [mode, setMode] = useState<'ultra' | 'industrial' | 'neural' | 'secure'>('ultra')
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    loadTime: 0,
    componentsLoaded: 0,
    memoryUsage: 0,
    networkLatency: 0
  })
  const [isPreloading, setIsPreloading] = useState(true)

  // Initialize Ultra Components and Preload Critical Systems
  useEffect(() => {
    const initializeSystem = async () => {
      const startTime = performance.now()
      
      // Register all components
      UltraComponents.registerWeb8Components()
      
      // Preload critical components for instant access
      await UltraComponents.preloadCriticalComponents()
      
      // Preload first row components
      for (const tab of TAB_ROWS.control) {
        if (tab.priority === 'critical' || tab.priority === 'high') {
          await UltraComponents.preloadComponent(tab.component)
        }
      }
      
      const loadTime = performance.now() - startTime
      setSystemMetrics(prev => ({
        ...prev,
        loadTime,
        componentsLoaded: UltraComponents.getAvailableComponents().length
      }))
      
      setIsPreloading(false)
    }

    initializeSystem()
  }, [])

  // Auto-rotate through modes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const modes: Array<'ultra' | 'industrial' | 'neural' | 'secure'> = ['ultra', 'industrial', 'neural', 'secure']
      setMode(prev => {
        const currentIndex = modes.indexOf(prev)
        return modes[(currentIndex + 1) % modes.length]
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Get active tab configuration
  const activeTabConfig = useMemo(() => {
    for (const rowTabs of Object.values(TAB_ROWS)) {
      const tab = rowTabs.find(t => t.id === activeTab)
      if (tab) return tab
    }
    return TAB_ROWS.control[0] // fallback
  }, [activeTab])

  // Render Tab Row
  const renderTabRow = (rowKey: string, tabs: TabConfig[], isTopRow: boolean) => (
    <div key={rowKey} className={`flex flex-wrap gap-2 mb-${isTopRow ? '4' : '6'}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
            ${activeTab === tab.id 
              ? 'bg-white/20 text-white shadow-lg border-2 border-white/30' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }
            ${tab.priority === 'critical' ? 'ring-2 ring-red-400/50' : ''}
            ${tab.priority === 'high' ? 'ring-1 ring-yellow-400/50' : ''}
          `}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="font-medium">{tab.name}</span>
          
          {/* Priority Indicator */}
          {tab.priority === 'critical' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          {tab.priority === 'high' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )

  if (isPreloading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <h1 className="text-3xl font-bold mb-2">🌐 EuroWeb Ultra Initializing</h1>
          <p className="text-white/70">Loading Industrial Command Center...</p>
          <div className="mt-4 text-sm text-white/50">
            Components: {systemMetrics.componentsLoaded} | Load Time: {systemMetrics.loadTime.toFixed(0)}ms
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={commandCenterVariants({ mode })}>
      {/* Header with System Status */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">🌐 EuroWeb Ultra Central</h1>
          <div className="text-sm text-white/70">
            Mode: <span className="text-white font-medium capitalize">{mode}</span> | 
            Components: {systemMetrics.componentsLoaded} | 
            Load: {systemMetrics.loadTime.toFixed(0)}ms
          </div>
        </div>
        
        {/* Mode Selector */}
        <div className="flex gap-2">
          {(['ultra', 'industrial', 'neural', 'secure'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                mode === m ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Row Tab System */}
      <div className="p-6">
        {/* Row 1: Command & Control */}
        <div className="mb-6">
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wider">
            🎯 Command & Control Center
          </h2>
          {renderTabRow('control', TAB_ROWS.control, true)}
        </div>

        {/* Row 2: Monitoring & Security */}
        <div className="mb-8">
          <h2 className="text-white/80 text-sm font-medium mb-3 uppercase tracking-wider">
            📊 Monitoring & Security Operations
          </h2>
          {renderTabRow('monitoring', TAB_ROWS.monitoring, false)}
        </div>

        {/* Active Component Display */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{activeTabConfig.icon}</span>
            <h3 className="text-2xl font-bold text-white">{activeTabConfig.name}</h3>
            <div className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded">
              {activeTabConfig.category} • {activeTabConfig.priority}
            </div>
          </div>
          
          {/* Lazy-loaded Component */}
          <LazyLoader
            component={activeTabConfig.component}
            variant="industrial"
            priority={activeTabConfig.priority}
            preload={activeTabConfig.priority === 'critical'}
          />
        </div>
      </div>
    </div>
  )
}

export default EuroWebUltraCentral
