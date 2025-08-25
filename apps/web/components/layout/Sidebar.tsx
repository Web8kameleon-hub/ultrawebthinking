/**
 * Sidebar Component - Advanced Sidebar Navigation
 * Collapsible sidebar with navigation and quick actions
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  badge?: string | number
  children?: SidebarItem[]
  action?: () => void
}

interface SidebarProps {
  items: SidebarItem[]
  isCollapsed?: boolean
  onToggle?: () => void
  currentPath?: string
  onItemClick?: (item: SidebarItem) => void
  className?: string
}

export function Sidebar({
  items,
  isCollapsed = false,
  onToggle,
  currentPath,
  onItemClick,
  className = ''
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleItemClick = (item: SidebarItem) => {
    if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      )
    }

    if (item.action) {
      item.action()
    }

    if (onItemClick) {
      onItemClick(item)
    }
  }

  const isActive = (item: SidebarItem): boolean => {
    return currentPath === item.href
  }

  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item)

    return (
      <div key={item.id}>
        <motion.button
          onClick={() => handleItemClick(item)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg transition-all
            ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700/50 text-gray-300'}
            ${depth > 0 ? 'ml-4' : ''}
          `}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`}>
                {item.icon}
              </span>
            )}
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-2">
            {item.badge && !isCollapsed && (
              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {item.badge}
              </span>
            )}
            
            {hasChildren && !isCollapsed && (
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isExpanded ? 90 : 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            )}
          </div>
        </motion.button>

        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-4 mt-2 space-y-1"
            >
              {item.children?.map(child => renderItem(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      className={`
        fixed left-0 top-16 bottom-0 z-40 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700
        transition-all duration-300 ${className}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-lg font-semibold text-white"
                >
                  EuroWeb Platform
                </motion.h2>
              )}
            </AnimatePresence>
            
            {onToggle && (
              <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.map(item => renderItem(item))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-400 text-center"
              >
                EuroWeb Platform v8.0.0
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
