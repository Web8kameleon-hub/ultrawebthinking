/**
 * Navigation Component - Advanced Navigation System
 * Responsive navigation with animations and accessibility
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: string | number
  children?: NavigationItem[]
  action?: () => void
}

interface NavigationProps {
  logo?: React.ReactNode
  items: NavigationItem[]
  currentPath?: string
  onItemClick?: (item: NavigationItem) => void
  className?: string
}

export function Navigation({
  logo,
  items,
  currentPath,
  onItemClick,
  className = ''
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleItemClick = (item: NavigationItem, e: React.MouseEvent) => {
    e.preventDefault()
    
    if (item.action) {
      item.action()
    }
    
    if (onItemClick) {
      onItemClick(item)
    }
    
    if (item.children) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id)
    } else {
      setActiveDropdown(null)
      setIsMobileMenuOpen(false)
    }
  }

  const isActive = (item: NavigationItem): boolean => {
    return currentPath === item.href
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700 h-16 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {logo && (
            <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
              {logo}
            </motion.div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {items.map((item) => (
              <motion.button
                key={item.id}
                onClick={(e) => handleItemClick(item, e)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item) 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                }`}
              >
                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800/95 backdrop-blur-xl border-t border-gray-700"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={(e) => handleItemClick(item, e)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item) ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                >
                  {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
