/**
 * Dashboard Component - Advanced Dashboard System
 * Comprehensive dashboard with widgets and analytics
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'list' | 'progress' | 'custom'
  data: any
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
}

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  revenue: number
  growth: number
  systemHealth: number
  alerts: number
}

interface DashboardProps {
  widgets?: DashboardWidget[]
  metrics?: DashboardMetrics
  customizable?: boolean
  realTime?: boolean
  className?: string
}

export function Dashboard({
  widgets = [],
  metrics,
  customizable = true,
  realTime = true,
  className = ''
}: DashboardProps) {
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>(
    metrics ?? {
      totalUsers: 12847,
      activeUsers: 3924,
      revenue: 284750,
      growth: 12.5,
      systemHealth: 98.7,
      alerts: 3
    }
  )

  const [isRealTimeActive, setIsRealTimeActive] = useState(realTime)

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeActive) {return}

    const interval = setInterval(() => {
      setDashboardMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
        alerts: Math.max(0, prev.alerts + Math.floor(Math.random() * 3 - 1))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isRealTimeActive])

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    color = 'blue' 
  }: {
    title: string
    value: string | number
    change?: number
    icon: React.ReactNode
    color?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={change >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-600/20 rounded-lg text-${color}-400`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  const SystemStatus = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
    >
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Overall Health</span>
          <div className="flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <motion.div
                className="h-2 bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dashboardMetrics.systemHealth}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-green-400 font-medium">{dashboardMetrics.systemHealth.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Database</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">API</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Cache</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Storage</span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const RecentActivity = () => {
    const activities = [
      { id: 1, action: 'New user registration', time: '2 minutes ago', type: 'user' },
      { id: 2, action: 'System backup completed', time: '15 minutes ago', type: 'system' },
      { id: 3, action: 'Revenue milestone reached', time: '1 hour ago', type: 'business' },
      { id: 4, action: 'Security scan completed', time: '2 hours ago', type: 'security' },
      { id: 5, action: 'Performance optimization applied', time: '3 hours ago', type: 'performance' }
    ]

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'user':
          return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        case 'system':
          return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        default:
          return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
      }
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            View All
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
            >
              <div className="text-blue-400">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-sm">{activity.action}</p>
                <p className="text-gray-500 text-xs">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isRealTimeActive 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isRealTimeActive ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></div>
              <span>Real-time</span>
            </motion.button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={dashboardMetrics.totalUsers}
            change={8.2}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>}
            color="blue"
          />
          
          <MetricCard
            title="Active Users"
            value={dashboardMetrics.activeUsers}
            change={dashboardMetrics.growth}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>}
            color="green"
          />
          
          <MetricCard
            title="Revenue"
            value={`$${dashboardMetrics.revenue.toLocaleString()}`}
            change={15.3}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>}
            color="green"
          />
          
          <MetricCard
            title="Alerts"
            value={dashboardMetrics.alerts}
            change={-25}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 17.5a2.5 2.5 0 00-2.5-2.5H7a2 2 0 01-2-2V9a2 2 0 012-2h1.5a2.5 2.5 0 004.5-2.5V4a2 2 0 012-2h2a2 2 0 012 2v.5a2.5 2.5 0 002.5 2.5H20a2 2 0 012 2v4a2 2 0 01-2 2h-1.5a2.5 2.5 0 00-2.5 2.5z" />
            </svg>}
            color="red"
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemStatus />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
