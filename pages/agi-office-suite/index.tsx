/**
 * AGI Office Suite - Main Page
 * EuroWeb Platform v9.0.1
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function AGIOfficeSuite() {
  const [activeApp, setActiveApp] = useState('documents')

  const apps = {
    documents: { name: 'Documents', icon: '📄', color: 'blue' },
    spreadsheets: { name: 'Spreadsheets', icon: '📊', color: 'green' },
    presentations: { name: 'Presentations', icon: '📈', color: 'purple' },
    collaboration: { name: 'Collaboration', icon: '👥', color: 'orange' }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-8 flex items-center gap-3"
        >
          🤖 AGI Office Suite
          <span className="text-indigo-400 text-2xl">v9.0.1</span>
        </motion.h1>

        {/* App Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex space-x-2 bg-slate-800 p-2 rounded-lg">
            {Object.entries(apps).map(([key, app]) => (
              <button
                key={key}
                onClick={() => setActiveApp(key)}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  activeApp === key
                    ? `bg-${app.color}-600 text-white shadow-lg`
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{app.icon}</span>
                {app.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* App Content */}
        <motion.div
          key={activeApp}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800 p-8 rounded-xl border border-slate-700"
        >
          {activeApp === 'documents' && (
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                📄 Document Editor
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Documents</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-600 rounded flex justify-between">
                      <span className="text-white">Project Proposal.docx</span>
                      <span className="text-slate-400 text-sm">2 hours ago</span>
                    </div>
                    <div className="p-2 bg-slate-600 rounded flex justify-between">
                      <span className="text-white">Meeting Notes.docx</span>
                      <span className="text-slate-400 text-sm">1 day ago</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Templates</h3>
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-all">
                      Business Report
                    </button>
                    <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-all">
                      Meeting Minutes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeApp === 'spreadsheets' && (
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                📊 Spreadsheet Engine
              </h2>
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="grid grid-cols-6 gap-1 mb-4">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
                    <div key={col} className="p-2 bg-slate-600 text-center text-white font-bold">
                      {col}
                    </div>
                  ))}
                  {Array.from({length: 18}, (_, i) => (
                    <div key={i} className="p-2 bg-slate-800 border border-slate-600 text-slate-300 text-sm">
                      {i % 6 === 0 ? `Data ${Math.floor(i/6) + 1}` : ''}
                    </div>
                  ))}
                </div>
                <p className="text-slate-400">Advanced formulas, charts, and real-time collaboration</p>
              </div>
            </div>
          )}

          {activeApp === 'presentations' && (
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                📈 Presentation Studio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((slide) => (
                  <div key={slide} className="bg-slate-700 p-4 rounded-lg aspect-video">
                    <div className="bg-slate-600 h-full rounded flex items-center justify-center">
                      <span className="text-white">Slide {slide}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-slate-400">
                Drag & drop interface, animations, and smart layouts
              </div>
            </div>
          )}

          {activeApp === 'collaboration' && (
            <div>
              <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-2">
                👥 Collaboration Hub
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Active Users</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                        LA
                      </div>
                      <span className="text-white">Ledjan Ahmati</span>
                      <span className="text-green-400 text-sm">● Online</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                        JD
                      </div>
                      <span className="text-white">John Doe</span>
                      <span className="text-yellow-400 text-sm">● Away</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-slate-300">
                      📝 Ledjan edited "Project Plan"
                    </div>
                    <div className="text-slate-300">
                      💬 John added a comment
                    </div>
                    <div className="text-slate-300">
                      📊 New spreadsheet created
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Smart assistance' },
            { icon: '☁️', title: 'Cloud-Based', desc: 'Access anywhere' },
            { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade' },
            { icon: '⚡', title: 'Fast', desc: 'Lightning performance' }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-white font-semibold">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export { AGIOfficeSuite }
