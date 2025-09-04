/**
 * AGI Status Monitor - New Architecture
 * Vanilla + Motion + CVA + Panda Tokens
 * © Web8 UltraThinking – Ledjan Ahmati
 */

'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import {
    MotionButton,
    MotionCard,
    MotionContainer,
    MotionGrid,
    MotionStatus,
    MotionText,
    animationPresets
} from './ui/motion'
import { cn } from './ui/variants'

interface AGIModule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'loading' | 'error'
  health: number
  lastUpdate: string
}

const AGIStatusMonitor: React.FC = () => {
  const [modules, setModules] = useState<AGIModule[]>([
    {
      id: 'core',
      name: 'AGI Core',
      description: 'Central processing unit',
      status: 'loading',
      health: 0,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'memory',
      name: 'Memory System',
      description: 'Real-time memory analysis',
      status: 'loading',
      health: 0,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'planner',
      name: 'Task Planner',
      description: 'Strategic task planning',
      status: 'loading',
      health: 0,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'semantic',
      name: 'Semantic Engine',
      description: 'Natural language processing',
      status: 'loading',
      health: 0,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'monitor',
      name: 'System Monitor',
      description: 'Real-time health monitoring',
      status: 'loading',
      health: 0,
      lastUpdate: new Date().toISOString()
    }
  ])

  const [isInitialized, setIsInitialized] = useState(false)
  const [systemHealth, setSystemHealth] = useState(0)

  useEffect(() => {
    // Simulate AGI module initialization
    const initializeModules = async () => {
      for (let i = 0; i < modules.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setModules(prev => prev.map((module, index) => {
          if (index === i) {
            const health = Math.floor(Math.random() * 30) + 70 // 70-100%
            return {
              ...module,
              status: 'active' as const,
              health,
              lastUpdate: new Date().toISOString()
            }
          }
          return module
        }))
      }
      
      setIsInitialized(true)
    }

    initializeModules()
  }, [])

  useEffect(() => {
    // Calculate overall system health
    const activeModules = modules.filter(m => m.status === 'active')
    if (activeModules.length > 0) {
      const avgHealth = activeModules.reduce((sum, m) => sum + m.health, 0) / activeModules.length
      setSystemHealth(Math.round(avgHealth))
    }
  }, [modules])

  const getStatusColor = (status: AGIModule['status']) => {
    switch (status) {
      case 'active': return 'active'
      case 'loading': return 'loading'
      case 'error': return 'error'
      default: return 'inactive'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-600'
    if (health >= 75) return 'text-yellow-600'
    if (health >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const runSystemTest = async () => {
    console.log('🚀 AGI System Test Started')
    
    // Simulate test
    setModules(prev => prev.map(module => ({
      ...module,
      status: 'loading' as const
    })))

    await new Promise(resolve => setTimeout(resolve, 2000))

    setModules(prev => prev.map(module => ({
      ...module,
      status: 'active' as const,
      health: Math.floor(Math.random() * 20) + 80,
      lastUpdate: new Date().toISOString()
    })))
  }

  const resetSystem = async () => {
    console.log('🔄 AGI System Reset')
    setIsInitialized(false)
    setSystemHealth(0)
    
    setModules(prev => prev.map(module => ({
      ...module,
      status: 'loading' as const,
      health: 0
    })))

    // Re-initialize
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <MotionContainer className="py-8" animation="slideUp">
      {/* Header */}
      <div className="text-center mb-8">
        <MotionText 
          as="h1" 
          variant="h1" 
          color="primary" 
          align="center"
          animation="slideUp"
        >
          🧠 Royal Secure AI Laboratory
        </MotionText>
        
        <MotionText 
          variant="body" 
          color="muted" 
          align="center"
          className="mt-2"
          animation="fadeIn"
        >
          Real-time AGI System Monitoring & Control
        </MotionText>

        {/* System Health Indicator */}
        <motion.div 
          className="flex items-center justify-center gap-4 mt-6"
          {...animationPresets.scaleIn}
        >
          <span className="text-lg font-semibold">System Health:</span>
          <div className={cn(
            "text-2xl font-bold",
            getHealthColor(systemHealth)
          )}>
            {systemHealth}%
          </div>
          <MotionStatus 
            status={systemHealth >= 80 ? 'active' : systemHealth >= 50 ? 'loading' : 'error'}
            size="lg"
            pulse={!isInitialized}
          />
        </motion.div>
      </div>

      {/* Module Grid */}
      <MotionGrid cols={5} className="mb-8" stagger={true}>
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            {...animationPresets.slideUp}
            transition={{ delay: index * 0.1 }}
          >
            <MotionCard 
              variant="elevated" 
              className="text-center h-full"
              hover={true}
            >
              <MotionStatus 
                status={getStatusColor(module.status)}
                size="lg"
                className="mx-auto mb-4"
                pulse={module.status === 'loading'}
              />
              
              <MotionText 
                as="h3" 
                variant="h4" 
                className="mb-2"
              >
                {module.name}
              </MotionText>
              
              <MotionText 
                variant="small" 
                color="muted" 
                className="mb-3"
              >
                {module.description}
              </MotionText>
              
              {module.status === 'active' && (
                <div className={cn("text-sm font-semibold", getHealthColor(module.health))}>
                  Health: {module.health}%
                </div>
              )}
              
              <div className="text-xs text-gray-400 mt-2">
                {module.status === 'active' ? '✅ Online' : 
                 module.status === 'loading' ? '⏳ Loading...' : 
                 module.status === 'error' ? '❌ Error' : '⚪ Offline'}
              </div>
            </MotionCard>
          </motion.div>
        ))}
      </MotionGrid>

      {/* Control Panel */}
      <MotionCard variant="bordered" className="text-center">
        <MotionText as="h3" variant="h3" className="mb-6">
          🎛️ Control Panel
        </MotionText>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <MotionButton
            variant="primary"
            size="lg"
            onClick={runSystemTest}
            disabled={!isInitialized}
          >
            🚀 Run System Test
          </MotionButton>
          
          <MotionButton
            variant="secondary"
            size="lg"
            onClick={resetSystem}
          >
            🔄 Reset System
          </MotionButton>
          
          <MotionButton
            variant="success"
            size="lg"
            onClick={() => console.log('🧠 Deep Analysis started')}
            disabled={!isInitialized}
          >
            🧠 Deep Analysis
          </MotionButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t">
          <div>
            <MotionText variant="small" color="muted">Active Modules</MotionText>
            <MotionText variant="h3" color="primary">
              {modules.filter(m => m.status === 'active').length}/{modules.length}
            </MotionText>
          </div>
          
          <div>
            <MotionText variant="small" color="muted">Architecture</MotionText>
            <MotionText variant="h4">Vanilla + Motion + CVA</MotionText>
          </div>
          
          <div>
            <MotionText variant="small" color="muted">Status</MotionText>
            <MotionText 
              variant="h4" 
              color={isInitialized ? "success" : "muted"}
            >
              {isInitialized ? "🟢 Operational" : "🟡 Initializing"}
            </MotionText>
          </div>
        </div>
      </MotionCard>
    </MotionContainer>
  )
}

export default AGIStatusMonitor
