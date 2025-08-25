/**
 * Navigation Test Page
 * EuroWeb Platform v9.0.1
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function NavigationTest() {
  const [currentRoute, setCurrentRoute] = useState('home')

  const routes = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-8 flex items-center gap-3"
        >
          🧭 Navigation System Test
          <span className="text-teal-400 text-2xl">v9.0.1</span>
        </motion.h1>

        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700"
        >
          <div className="flex space-x-2">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setCurrentRoute(route.id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  currentRoute === route.id
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{route.icon}</span>
                {route.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800 p-8 rounded-xl border border-slate-700"
        >
          {currentRoute === 'home' && (
            <div>
              <h2 className="text-2xl font-bold text-teal-400 mb-4">🏠 Welcome Home</h2>
              <p className="text-slate-300 mb-4">
                This is the home page of the navigation test. Here you can see the main dashboard
                and quick access to all features.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <h3 className="text-white font-semibold">Analytics</h3>
                  <p className="text-slate-400 text-sm">View your stats</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="text-white font-semibold">Goals</h3>
                  <p className="text-slate-400 text-sm">Track progress</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="text-white font-semibold">Tasks</h3>
                  <p className="text-slate-400 text-sm">Manage workflow</p>
                </div>
              </div>
            </div>
          )}

          {currentRoute === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-4">📊 Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">CPU Usage</span>
                      <span className="text-green-400">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Memory</span>
                      <span className="text-yellow-400">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Storage</span>
                      <span className="text-green-400">32%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-300">✓ Navigation test completed</div>
                    <div className="text-slate-300">📊 Dashboard loaded</div>
                    <div className="text-slate-300">🔄 Routes updated</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentRoute === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">⚙️ Settings</h2>
              <div className="space-y-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Theme Settings</h3>
                  <div className="flex space-x-3">
                    <button className="px-3 py-1 bg-slate-900 text-white rounded">Dark</button>
                    <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded">Light</button>
                    <button className="px-3 py-1 bg-slate-600 text-slate-300 rounded">Auto</button>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Navigation Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-slate-300">Show navigation animations</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-slate-300">Enable breadcrumbs</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentRoute === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-4">👤 Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">User Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-400 text-sm">Name</label>
                      <p className="text-white">Ledjan Ahmati</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Email</label>
                      <p className="text-white">dealsjona@gmail.com</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Role</label>
                      <p className="text-white">Administrator</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Activity Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Pages Visited</span>
                      <span className="text-blue-400">127</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Time Online</span>
                      <span className="text-green-400">4h 23m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Last Login</span>
                      <span className="text-yellow-400">Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Route Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-slate-800 p-4 rounded-xl border border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-400">Current Route:</span>
              <span className="text-teal-400 font-semibold ml-2">/{currentRoute}</span>
            </div>
            <div className="text-slate-400 text-sm">
              Navigation System v9.0.1 • EuroWeb Platform
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export { NavigationTest }
