/**
 * Header Component - Advanced Header System
 * Responsive header with branding and actions
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HeaderAction {
  id: string
  label: string
  icon?: React.ReactNode
  action: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: HeaderAction[]
  breadcrumbs?: Array<{ label: string; href?: string }>
  showBackButton?: boolean
  onBack?: () => void
  className?: string
}

export function Header({
  title,
  subtitle,
  actions = [],
  breadcrumbs = [],
  showBackButton = false,
  onBack,
  className = ''
}: HeaderProps) {
  const getActionStyles = (variant: HeaderAction['variant'] = 'secondary') => {
    const base = 'px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2'
    
    switch (variant) {
      case 'primary':
        return `${base} bg-blue-600 hover:bg-blue-700 text-white`
      case 'danger':
        return `${base} bg-red-600 hover:bg-red-700 text-white`
      default:
        return `${base} bg-gray-700 hover:bg-gray-600 text-gray-300`
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/95 backdrop-blur-xl border-b border-gray-700 px-6 py-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          <div>
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span>/</span>}
                    <motion.span
                      whileHover={{ color: '#ffffff' }}
                      className={`transition-colors ${item.href ? 'cursor-pointer hover:text-white' : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  </React.Fragment>
                ))}
              </nav>
            )}

            {title && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {title}
              </motion.h1>
            )}

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 mt-1"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>

        {actions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            {actions.map((action) => (
              <motion.button
                key={action.id}
                onClick={action.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={getActionStyles(action.variant)}
              >
                {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header
