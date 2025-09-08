'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import styles from './ModuleNavigation.module.css'

interface Module {
  id: string
  name: string
  icon: string
  description: string
  route: string
  status: 'active' | 'development' | 'planning'
}

const modules: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    description: 'Royal Dashboard me metrics dhe control panel',
    route: '/dashboard',
    status: 'active'
  },
  {
    id: 'openmind',
    name: 'Open Mind',
    icon: '🧠',
    description: 'AGI Consciousness Engine - AI-powered thought interface',
    route: '/openmind',
    status: 'active'
  },
  {
    id: 'search',
    name: 'Ultra Search',
    icon: '🔍',
    description: 'Ultra-Fast Search with AGI - Quantum Enhanced Results',
    route: '/search',
    status: 'active'
  },
  {
    id: 'aviation',
    name: 'Aviation Ultra',
    icon: '✈️',
    description: 'EuroWeb Ultra Aviation Platform - Radio Propagation & Weather',
    route: '/aviation',
    status: 'active'
  },
  {
    id: 'uut',
    name: 'UUT',
    icon: '🛰️',
    description: 'Ultra Universal Terminal - Satellite Communication',
    route: '/uut',
    status: 'development'
  },
  {
    id: 'loragateway',
    name: 'LoRa Gateway',
    icon: '📡',
    description: 'Long Range Radio Gateway - IoT Communication',
    route: '/lora',
    status: 'active'
  },
  {
    id: 'mesh',
    name: 'Mesh Network',
    icon: '🕸️',
    description: 'Decentralized Mesh Networking System',
    route: '/mesh',
    status: 'active'
  },
  {
    id: 'agisheet',
    name: 'AGI Sheet',
    icon: '📋',
    description: 'AI-powered Spreadsheet Intelligence',
    route: '/agisheet',
    status: 'active'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '🏭',
    description: 'Industrial IoT & Automation Platform',
    route: '/industrial',
    status: 'development'
  }
]

export default function ModuleNavigation() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'development': return '#f59e0b'
      case 'planning': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: Module['status']) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'development': return 'Në zhvillim'
      case 'planning': return 'Planifikuar'
      default: return 'Panjohur'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={styles.moduleNavigation}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.title}
      >
        ⚜️ EuroWeb Ultra - Module Navigation
      </motion.h2>

      <div className={styles.moduleGrid}>
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              styles.moduleCard,
              activeModule === module.id && styles.active,
              styles[`status-${module.status}`]
            )}
            onClick={() => setActiveModule(module.id)}
          >
            {/* Status indicator */}
            <div className={styles.statusIndicator} />

            {/* Module icon */}
            <div className={styles.moduleIcon}>
              {module.icon}
            </div>

            {/* Module info */}
            <div className={styles.moduleInfo}>
              <h3 className={styles.moduleName}>
                {module.name}
              </h3>
              <p className={styles.moduleDescription}>
                {module.description}
              </p>
              <div className={styles.moduleStatus}>
                Status: {getStatusText(module.status)}
              </div>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation()
                window.location.href = module.route
              }}
            >
              Hap Modulin
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Active module details */}
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.activeModuleDetails}
      >
        {(() => {
          const module = modules.find(m => m.id === activeModule)
          if (!module) return null

          return (
            <>
              <h3>
                {module.icon} {module.name}
              </h3>
              <p>{module.description}</p>
              <div className={styles.quickActions}>
                <button onClick={() => window.location.href = module.route}>
                  🚀 Hap Modulin
                </button>
                <button onClick={() => window.location.href = `${module.route}/docs`}>
                  📚 Dokumentimi
                </button>
                <button onClick={() => window.location.href = `${module.route}/api`}>
                  🔌 API
                </button>
              </div>
            </>
          )
        })()}
      </motion.div>
    </motion.div>
  )
}
