'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { quickActionsVariants, actionButtonVariants } from './quickActionsVariants'
import styles from './QuickActions.module.css'

interface QuickAction {
  id: string
  label: string
  icon: string
  action: () => void
  variant: 'primary' | 'warning' | 'danger' | 'success'
}

export default function QuickActions() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const executeAction = async (actionId: string, actionFn: () => void) => {
    setIsProcessing(actionId)
    try {
      await actionFn()
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('❌ Action failed:', error)
    } finally {
      setIsProcessing(null)
    }
  }

  const actions: QuickAction[] = [
    {
      id: 'agi-throttle',
      label: 'AGI Throttle',
      icon: '🔽',
      variant: 'warning',
      action: async () => {
        await fetch('/api/agi/throttle', { method: 'POST' })
      }
    },
    {
      id: 'agi-boost',
      label: 'AGI Boost',
      icon: '🚀',
      variant: 'success',
      action: async () => {
        await fetch('/api/agi/boost', { method: 'POST' })
      }
    },
    {
      id: 'gpu-accel',
      label: 'GPU Accel',
      icon: '⚡',
      variant: 'primary',
      action: async () => {
        await fetch('/api/system/gpu/accelerate', { method: 'POST' })
      }
    },
    {
      id: 'reset-jobs',
      label: 'Reset Jobs',
      icon: '🔄',
      variant: 'warning',
      action: async () => {
        await fetch('/api/agi/jobs/reset', { method: 'POST' })
      }
    },
    {
      id: 'clear-queue',
      label: 'Clear Queue',
      icon: '🗑️',
      variant: 'danger',
      action: async () => {
        await fetch('/api/agi/queue/clear', { method: 'POST' })
      }
    },
    {
      id: 'emergency-stop',
      label: 'Emergency Stop',
      icon: '🛑',
      variant: 'danger',
      action: async () => {
        await fetch('/api/system/emergency-stop', { method: 'POST' })
      }
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
      className={clsx(styles.quickActionsContainer, quickActionsVariants())}
    >
      {/* Ornament mbretëror */}
      <div className={styles.royalOrnament}>
        ⚔️
      </div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={styles.actionsTitle}
      >
        ⚜️ Komandat Mbretërore
      </motion.h3>

      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            disabled={isProcessing === action.id}
            onClick={() => executeAction(action.id, action.action)}
            className={clsx(
              styles.actionButton,
              styles[`actionButton${action.variant.charAt(0).toUpperCase() + action.variant.slice(1)}`],
              actionButtonVariants({ 
                variant: action.variant, 
                processing: isProcessing === action.id 
              })
            )}
          >
            {/* Loading overlay */}
            {isProcessing === action.id && (
              <div className={styles.loadingOverlay}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className={styles.loadingSpinner}
                >
                  ⚙️
                </motion.div>
              </div>
            )}

            <div className={styles.actionIcon}>
              {action.icon}
            </div>
            <div className={styles.actionLabel}>
              {action.label}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
