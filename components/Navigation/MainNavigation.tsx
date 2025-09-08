'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import styles from './MainNavigation.module.css'

interface Module {
  id: string
  name: string
  icon: string
  path: string
  status: 'active' | 'development' | 'planning'
}

const modules: Module[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    path: '/dashboard',
    status: 'active'
  },
  {
    id: 'agi-dashboard',
    name: 'AGI Intelligence',
    icon: '🧠',
    path: '/dashboard',
    status: 'active'
  },
  {
    id: 'aviation',
    name: 'Aviation',
    icon: '✈️',
    path: '/aviation',
    status: 'active'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: '🏭',
    path: '/industrial',
    status: 'active'
  },
  {
    id: 'uut',
    name: 'UUT',
    icon: '🛰️',
    path: '/uut',
    status: 'development'
  },
  {
    id: 'lora',
    name: 'LoRa',
    icon: '📡',
    path: '/lora',
    status: 'development'
  },
  {
    id: 'mesh',
    name: 'Mesh',
    icon: '🕸️',
    path: '/mesh',
    status: 'development'
  },
  {
    id: 'agisheet',
    name: 'AGI Sheet',
    icon: '🧠',
    path: '/agisheet',
    status: 'development'
  }
]

export default function MainNavigation() {
  const pathname = usePathname()
  const [currentTime, setCurrentTime] = React.useState('')
  const [isMounted, setIsMounted] = React.useState(false)

  // Prevent hydration mismatch by only showing time on client
  React.useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date().toLocaleTimeString('sq-AL'))
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('sq-AL'))
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const getStatusColor = (status: Module['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'development': return '#f59e0b'
      case 'planning': return '#6b7280'
      default: return '#6b7280'
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={styles.mainNavigation}
      role="navigation"
      aria-label="Navigimi kryesor - EuroWeb Ultra Modules"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={styles.logo}
      >
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoIcon}>⚜️</span>
          <span className={styles.logoText}>EuroWeb Ultra</span>
        </Link>
      </motion.div>

      {/* Module Links */}
      <div className={styles.moduleLinks}>
        {modules.map((module, index) => {
          const isActive = pathname === module.path
          const isAvailable = module.status === 'active'

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className={styles.moduleItem}
            >
              {isAvailable ? (
                <Link
                  href={module.path}
                  className={clsx(
                    styles.moduleLink,
                    isActive && styles.active,
                    styles[`status-${module.status}`]
                  )}
                  aria-label={`${module.name} - ${module.status === 'active' ? 'Aktiv' : 'Në zhvillim'}`}
                >
                  <span className={styles.moduleIcon}>{module.icon}</span>
                  <span className={styles.moduleName}>{module.name}</span>
                  <div
                    className={clsx(
                      styles.statusIndicator,
                      styles[`status${module.status.charAt(0).toUpperCase() + module.status.slice(1)}`]
                    )}
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div
                  className={clsx(
                    styles.moduleLink,
                    styles.disabled,
                    styles[`status-${module.status}`]
                  )}
                  aria-label={`${module.name} - Në zhvillim`}
                >
                  <span className={styles.moduleIcon}>{module.icon}</span>
                  <span className={styles.moduleName}>{module.name}</span>
                  <div
                    className={clsx(
                      styles.statusIndicator,
                      styles[`status${module.status.charAt(0).toUpperCase() + module.status.slice(1)}`]
                    )}
                    aria-hidden="true"
                  />
                  <span className={styles.comingSoon}>Coming Soon</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* User Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={styles.userActions}
      >
        <button
          className={styles.actionButton}
          aria-label="Kërkimi i shpejtë"
          title="Ctrl+K për kërkim"
        >
          🔍
        </button>
        <button
          className={styles.actionButton}
          aria-label="Njoftime"
          title="Alt+N për njoftime"
        >
          🔔
          <span className={styles.notificationBadge}>3</span>
        </button>
        <button
          className={styles.actionButton}
          aria-label="Profili i përdoruesit"
          title="Alt+P për profil"
        >
          👤
        </button>
        <button
          className={styles.actionButton}
          aria-label="Konfigurimi"
          title="Alt+S për konfigurime"
        >
          ⚙️
        </button>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className={styles.systemStatus}
      >
        <div className={styles.statusItem}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Sistema Aktive</span>
        </div>
        <div className={styles.timeDisplay}>
          {isMounted ? currentTime : '--:--:--'}
        </div>
      </motion.div>
    </motion.nav>
  )
}
