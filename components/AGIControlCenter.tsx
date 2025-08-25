/**
 * AGI Control Center - Quick Menu Component
 * Right-side panel with organized functions and tools
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickFunction {
  id: string
  title: string
  icon: string
  description: string
  category: string
  action: () => void
  color: string
  status?: 'active' | 'inactive' | 'processing'
}

const AGIControlCenter: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('control')
  const [systemStatus, setSystemStatus] = useState({
    toolsActive: true,
    liveMode: true,
    lastUpdate: new Date().toLocaleTimeString()
  })

  // Quick Functions Database
  const quickFunctions: QuickFunction[] = [
    // AGI Control Center
    {
      id: 'openmind-chat',
      title: 'OpenMind AI Chat',
      icon: '🧠',
      description: 'AI Chat i Avancuar - PUNON!',
      category: 'control',
      color: '#8b5cf6',
      status: 'active',
      action: () => window.open('/openmind-chat', '_blank')
    },
    {
      id: 'ultra-ai-chat',
      title: 'Ultra AI Chat (Test)',
      icon: '⚡',
      description: 'Versioni Experimental',
      category: 'control',
      color: '#ec4899',
      status: 'inactive',
      action: () => window.open('/ultra-ai-chat', '_blank')
    },
    {
      id: 'deep-scan',
      title: 'Deep Scan',
      icon: '🔍',
      description: 'Comprehensive system analysis',
      category: 'control',
      color: '#3b82f6',
      action: () => console.log('🔍 Deep Scan initiated')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      icon: '📊',
      description: 'Export analytics and metrics',
      category: 'control',
      color: '#22c55e',
      action: () => console.log('📊 Data export started')
    },
    {
      id: 'optimize',
      title: 'Optimize',
      icon: '⚡',
      description: 'System performance optimization',
      category: 'control',
      color: '#f59e0b',
      action: () => console.log('⚡ Optimization running')
    },
    {
      id: 'report',
      title: 'Report',
      icon: '📋',
      description: 'Generate comprehensive report',
      category: 'control',
      color: '#8b5cf6',
      action: () => console.log('📋 Report generation')
    },
    {
      id: 'reset',
      title: 'Reset',
      icon: '🔄',
      description: 'Reset system to defaults',
      category: 'control',
      color: '#ef4444',
      action: () => console.log('🔄 System reset')
    },
    {
      id: 'theme',
      title: 'Theme',
      icon: '🎨',
      description: 'Change interface theme',
      category: 'control',
      color: '#ec4899',
      action: () => console.log('🎨 Theme changed')
    },
    {
      id: 'fullscreen',
      title: 'Full Screen',
      icon: '🖥️',
      description: 'Toggle fullscreen mode',
      category: 'control',
      color: '#06b6d4',
      action: () => console.log('🖥️ Fullscreen toggled')
    },
    {
      id: 'save',
      title: 'Save',
      icon: '💾',
      description: 'Save current configuration',
      category: 'control',
      color: '#10b981',
      action: () => console.log('💾 Configuration saved')
    },
    {
      id: 'api',
      title: 'API',
      icon: '🔗',
      description: 'API management interface',
      category: 'control',
      color: '#f97316',
      action: () => console.log('🔗 API interface opened')
    },
    {
      id: 'help',
      title: 'Help',
      icon: '❓',
      description: 'Help and documentation',
      category: 'control',
      color: '#6366f1',
      action: () => console.log('❓ Help opened')
    },

    // System Controls
    {
      id: 'performance-test',
      title: 'Performance Test',
      icon: '🚀',
      description: 'Run comprehensive benchmark',
      category: 'system',
      color: '#22c55e',
      action: () => console.log('🚀 Performance test started')
    },
    {
      id: 'network-test',
      title: 'Network Test',
      icon: '📡',
      description: 'Check network latency and speed',
      category: 'system',
      color: '#3b82f6',
      action: () => console.log('📡 Network test initiated')
    },
    {
      id: 'resource-monitor',
      title: 'Resource Monitor',
      icon: '📈',
      description: 'View detailed system resources',
      category: 'system',
      color: '#f59e0b',
      action: () => console.log('📈 Resource monitor opened')
    },
    {
      id: 'refresh-dashboard',
      title: 'Refresh Dashboard',
      icon: '🔄',
      description: 'Refresh all dashboard data',
      category: 'system',
      color: '#06b6d4',
      action: () => console.log('🔄 Dashboard refreshed')
    },
    {
      id: 'log-status',
      title: 'Log Status',
      icon: '📝',
      description: 'View system logs and status',
      category: 'system',
      color: '#8b5cf6',
      action: () => console.log('📝 System logs opened')
    },

    // Neural Tools
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      icon: '🔬',
      description: 'Deep learning model analysis',
      category: 'neural',
      color: '#8b5cf6',
      action: () => console.log('🔬 AI Analysis started')
    },
    {
      id: 'predictions',
      title: 'Predictions',
      icon: '🔮',
      description: 'ML forecasting and predictions',
      category: 'neural',
      color: '#a855f7',
      action: () => console.log('🔮 Predictions generated')
    },
    {
      id: 'neural-backup',
      title: 'Neural Backup',
      icon: '💾',
      description: 'Save neural network state',
      category: 'neural',
      color: '#3b82f6',
      action: () => console.log('💾 Neural backup created')
    },

    // Quick Status & Tools
    {
      id: 'quick-status',
      title: 'Quick Status',
      icon: '📊',
      description: 'System status overview',
      category: 'status',
      color: '#22c55e',
      action: () => console.log('📊 Quick status displayed')
    },
    {
      id: 'alerts',
      title: 'Alerts',
      icon: '⚠️',
      description: 'System alerts and warnings',
      category: 'status',
      color: '#f59e0b',
      action: () => console.log('⚠️ Alerts checked')
    },
    {
      id: 'tips',
      title: 'Tips',
      icon: '💡',
      description: 'Helpful tips and suggestions',
      category: 'status',
      color: '#eab308',
      action: () => console.log('💡 Tips displayed')
    },
    {
      id: 'docs',
      title: 'Documentation',
      icon: '📚',
      description: 'Complete documentation',
      category: 'status',
      color: '#6366f1',
      action: () => console.log('📚 Documentation opened')
    }
  ]

  // Categories for organization
  const categories = [
    { id: 'control', title: 'AGI Control', icon: '🔧', color: '#3b82f6' },
    { id: 'system', title: 'System Controls', icon: '⚙️', color: '#22c55e' },
    { id: 'neural', title: 'Neural Tools', icon: '🧠', color: '#8b5cf6' },
    { id: 'status', title: 'Quick Status', icon: '📊', color: '#f59e0b' }
  ]

  // Update system status
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString()
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Get functions by category
  const getFunctionsByCategory = (categoryId: string) => {
    return quickFunctions.filter(func => func.category === categoryId)
  }

  return (
    <>
      {/* Quick Menu Toggle Button */}
      <motion.button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed right-4 top-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: isMenuOpen 
            ? 'linear-gradient(45deg, #ef4444, #dc2626)' 
            : 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
        }}
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMenuOpen ? '✕' : '⚡'}
        </motion.div>
      </motion.button>

      {/* Quick Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 via-blue-900 to-purple-900 border-l border-blue-400/30 shadow-2xl z-50 overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 64, 175, 0.95) 50%, rgba(107, 33, 168, 0.95) 100%)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-blue-400/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    🔧 AGI Control Center
                  </h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/60 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Status Bar */}
                <div className="bg-black/20 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-center text-green-400 mb-1">
                    <span>Tools active • Live mode</span>
                    <span className="text-xs text-blue-300">{systemStatus.lastUpdate}</span>
                  </div>
                  <div className="text-xs text-blue-300">
                    Status: {systemStatus.toolsActive ? '🟢 Active' : '🔴 Inactive'} | 
                    Mode: {systemStatus.liveMode ? 'Live' : 'Offline'}
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="p-4 border-b border-blue-400/20">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-600/50 text-white border border-blue-400/50'
                          : 'bg-black/20 text-blue-200 hover:bg-blue-700/30'
                      }`}
                    >
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-xs">{category.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Functions List */}
              <div className="p-4">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    {categories.find(c => c.id === activeCategory)?.icon}
                    <span className="ml-2">{categories.find(c => c.id === activeCategory)?.title}</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {getFunctionsByCategory(activeCategory).map((func, index) => (
                      <motion.button
                        key={func.id}
                        onClick={func.action}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-full bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 rounded-lg p-4 text-left transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div 
                            className="text-2xl p-2 rounded-lg flex-shrink-0"
                            style={{ 
                              backgroundColor: `${func.color}20`,
                              color: func.color 
                            }}
                          >
                            {func.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white group-hover:text-blue-200 transition-colors">
                                {func.title}
                              </h4>
                              <div className="text-xs text-blue-300">
                                ▶
                              </div>
                            </div>
                            <p className="text-sm text-blue-300 group-hover:text-blue-200 transition-colors">
                              {func.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-blue-400/20 mt-auto">
                <div className="text-center text-xs text-blue-300">
                  AGI Control Center v8.0.0
                  <br />
                  <span className="text-blue-400">EuroWeb Royal Platform</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom Styles */}
      <style jsx>{`
        .fixed {
          position: fixed;
        }
        .right-4 {
          right: 1rem;
        }
        .top-4 {
          top: 1rem;
        }
        .z-50 {
          z-index: 50;
        }
        .z-40 {
          z-index: 40;
        }
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .right-0 {
          right: 0;
        }
        .top-0 {
          top: 0;
        }
        .h-full {
          height: 100%;
        }
        .w-96 {
          width: 24rem;
        }
        .overflow-y-auto {
          overflow-y: auto;
        }
        .p-3 {
          padding: 0.75rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .rounded-full {
          border-radius: 9999px;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .shadow-lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .text-white {
          color: white;
        }
        .text-blue-200 {
          color: rgb(191, 219, 254);
        }
        .text-blue-300 {
          color: rgb(147, 197, 253);
        }
        .text-blue-400 {
          color: rgb(96, 165, 250);
        }
        .text-green-400 {
          color: rgb(74, 222, 128);
        }
        .bg-black {
          background-color: black;
        }
        .border {
          border-width: 1px;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        .flex {
          display: flex;
        }
        .items-center {
          align-items: center;
        }
        .items-start {
          align-items: flex-start;
        }
        .justify-between {
          justify-content: space-between;
        }
        .space-x-3 > * + * {
          margin-left: 0.75rem;
        }
        .mb-1 {
          margin-bottom: 0.25rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .ml-2 {
          margin-left: 0.5rem;
        }
        .mt-auto {
          margin-top: auto;
        }
        .text-xs {
          font-size: 0.75rem;
        }
        .text-sm {
          font-size: 0.875rem;
        }
        .text-lg {
          font-size: 1.125rem;
        }
        .text-xl {
          font-size: 1.25rem;
        }
        .text-2xl {
          font-size: 1.5rem;
        }
        .font-medium {
          font-weight: 500;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-bold {
          font-weight: 700;
        }
        .text-left {
          text-align: left;
        }
        .text-center {
          text-align: center;
        }
        .w-full {
          width: 100%;
        }
        .flex-1 {
          flex: 1 1 0%;
        }
        .flex-shrink-0 {
          flex-shrink: 0;
        }
        .min-w-0 {
          min-width: 0;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .transition-all {
          transition-property: all;
        }
        .transition-colors {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        }
        .duration-200 {
          transition-duration: 200ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .hover\\:shadow-xl:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .hover\\:text-white:hover {
          color: white;
        }
        .hover\\:text-blue-200:hover {
          color: rgb(191, 219, 254);
        }
        .group:hover .group-hover\\:text-blue-200 {
          color: rgb(191, 219, 254);
        }
      `}</style>
    </>
  )
}

export default AGIControlCenter
