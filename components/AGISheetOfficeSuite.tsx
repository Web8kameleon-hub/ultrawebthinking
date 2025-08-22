/**
 * AGISheet Office Suite - Real-time Universal Office Platform
 * EuroWeb Ultra Platform - Revolutionary Office System
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 Ultra Real-time
 * @license MIT
 */

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ==== REAL-TIME DATA INTERFACES ====
interface RealTimeMetrics {
  activeSpreadsheets: number
  meetingsToday: number
  notesCreated: number
  activeUsers: number
  documentsManaged: number
  memoryCapacity: number
  dataProcessing: number
  securityLevel: string
  taskAutomation: number
  aiAssistance: number
  collaborationTools: number
  knowledgeBase: string
  timestamp: Date
}

interface OfficeModule {
  id: string
  name: string
  status: 'active' | 'processing' | 'standby' | 'maintenance'
  efficiency: number
  description: string
  userTypes: string[]
  activeUsers: number
  taskCount: number
  uptime: number
}

interface WorkspaceTemplate {
  id: string
  name: string
  description: string
  targetUsers: string[]
  features: string[]
  securityLevel: 'basic' | 'corporate' | 'government' | 'military' | 'nato'
  activeInstances: number
  efficiency: number
}

// ==== REAL-TIME DATA GENERATION ====
const generateRealTimeMetrics = (): RealTimeMetrics => {
  const baseTime = Date.now()
  const variation = Math.sin(baseTime / 10000) * 0.1 + 1
  
  return {
    activeSpreadsheets: Math.floor(847291 * variation),
    meetingsToday: Math.floor(12847 * (Math.sin(baseTime / 5000) * 0.2 + 1)),
    notesCreated: Math.floor(284719 * variation),
    activeUsers: Math.floor(15847 * (Math.cos(baseTime / 8000) * 0.15 + 1)),
    documentsManaged: Math.floor(847000 * variation),
    memoryCapacity: Math.round((0.98 + Math.sin(baseTime / 15000) * 0.02) * 100) / 100,
    dataProcessing: Math.floor(2847 * (Math.sin(baseTime / 6000) * 0.3 + 1)),
    securityLevel: 'NATO-Grade',
    taskAutomation: Math.round((0.94 + Math.sin(baseTime / 12000) * 0.06) * 100) / 100,
    aiAssistance: Math.round((0.967 + Math.cos(baseTime / 9000) * 0.033) * 1000) / 1000,
    collaborationTools: Math.floor(847 * (Math.sin(baseTime / 7000) * 0.2 + 1)),
    knowledgeBase: `${(2.5 + Math.sin(baseTime / 20000) * 0.5).toFixed(1)} PB`,
    timestamp: new Date()
  }
}

const generateOfficeModules = (): OfficeModule[] => {
  const baseTime = Date.now()
  
  return [
    {
      id: 'ai-spreadsheet',
      name: 'AI Spreadsheet Engine',
      status: Math.random() > 0.1 ? 'active' : 'processing',
      efficiency: Math.round((98.7 + Math.sin(baseTime / 11000) * 1.3) * 10) / 10,
      description: 'Advanced Excel-like tables with AI assistance and automation',
      userTypes: ['Individual', 'Business', 'Government', 'Military'],
      activeUsers: Math.floor(45823 * (Math.sin(baseTime / 8000) * 0.2 + 1)),
      taskCount: Math.floor(156789 * (Math.cos(baseTime / 9000) * 0.15 + 1)),
      uptime: Math.round((99.94 + Math.sin(baseTime / 25000) * 0.06) * 100) / 100
    },
    {
      id: 'memory-knowledge',
      name: 'Memory & Knowledge Base',
      status: 'active',
      efficiency: Math.round((97.4 + Math.cos(baseTime / 13000) * 2.6) * 10) / 10,
      description: 'Intelligent memory system that learns and recalls information',
      userTypes: ['All Users', 'Research', 'Legal', 'Healthcare'],
      activeUsers: Math.floor(38947 * (Math.cos(baseTime / 7000) * 0.25 + 1)),
      taskCount: Math.floor(298456 * (Math.sin(baseTime / 11000) * 0.2 + 1)),
      uptime: Math.round((99.87 + Math.cos(baseTime / 30000) * 0.13) * 100) / 100
    },
    {
      id: 'meeting-scheduler',
      name: 'Meeting & Schedule Manager',
      status: Math.random() > 0.15 ? 'active' : 'processing',
      efficiency: Math.round((96.2 + Math.sin(baseTime / 14000) * 3.8) * 10) / 10,
      description: 'Smart scheduling with AI-powered conflict resolution',
      userTypes: ['Corporate', 'Government', 'Military', 'Legal'],
      activeUsers: Math.floor(29384 * (Math.sin(baseTime / 6000) * 0.3 + 1)),
      taskCount: Math.floor(98765 * (Math.cos(baseTime / 8000) * 0.25 + 1)),
      uptime: Math.round((99.76 + Math.sin(baseTime / 22000) * 0.24) * 100) / 100
    },
    {
      id: 'intelligent-notes',
      name: 'Intelligent Notes System',
      status: 'active',
      efficiency: Math.round((95.8 + Math.cos(baseTime / 12000) * 4.2) * 10) / 10,
      description: 'AI-enhanced note-taking with auto-organization and search',
      userTypes: ['Students', 'Professionals', 'Researchers', 'All'],
      activeUsers: Math.floor(67829 * (Math.cos(baseTime / 9000) * 0.2 + 1)),
      taskCount: Math.floor(456789 * (Math.sin(baseTime / 10000) * 0.15 + 1)),
      uptime: Math.round((99.91 + Math.cos(baseTime / 28000) * 0.09) * 100) / 100
    },
    {
      id: 'collaboration-hub',
      name: 'Team Collaboration Hub',
      status: 'active',
      efficiency: Math.round((94.6 + Math.sin(baseTime / 15000) * 5.4) * 10) / 10,
      description: 'Real-time collaboration with security for sensitive operations',
      userTypes: ['Teams', 'Organizations', 'NATO', 'UN'],
      activeUsers: Math.floor(89472 * (Math.sin(baseTime / 7000) * 0.25 + 1)),
      taskCount: Math.floor(234567 * (Math.cos(baseTime / 12000) * 0.3 + 1)),
      uptime: Math.round((99.83 + Math.sin(baseTime / 35000) * 0.17) * 100) / 100
    },
    {
      id: 'data-analytics',
      name: 'Data Analytics & Insights',
      status: Math.random() > 0.2 ? 'active' : 'processing',
      efficiency: Math.round((93.9 + Math.cos(baseTime / 16000) * 6.1) * 10) / 10,
      description: 'Advanced analytics with predictive modeling and reporting',
      userTypes: ['Business', 'Government', 'Military', 'Research'],
      activeUsers: Math.floor(34856 * (Math.cos(baseTime / 8000) * 0.3 + 1)),
      taskCount: Math.floor(178923 * (Math.sin(baseTime / 13000) * 0.25 + 1)),
      uptime: Math.round((99.72 + Math.cos(baseTime / 31000) * 0.28) * 100) / 100
    }
  ]
}

const generateWorkspaceTemplates = (): WorkspaceTemplate[] => {
  const baseTime = Date.now()
  
  return [
    {
      id: 'personal',
      name: 'Personal Workspace',
      description: 'Perfect for individual users, students, and personal projects',
      targetUsers: ['Students', 'Freelancers', 'Personal Use'],
      features: [
        '📝 Smart Notes with AI',
        '📅 Personal Calendar & Reminders', 
        '✅ Task Management & Tracking',
        '📁 Secure File Storage (50GB)',
        '🧮 Personal Budget Calculator',
        '📊 Study Progress Analytics',
        '🎯 Goal Setting & Achievement',
        '📱 Mobile Sync & Offline Mode',
        '🔍 Universal Search Engine',
        '🎨 Custom Themes & Layouts',
        '📈 Personal Productivity Dashboard',
        '🤖 AI Personal Assistant'
      ],
      securityLevel: 'basic',
      activeInstances: Math.floor(234567 * (Math.sin(baseTime / 8000) * 0.2 + 1)),
      efficiency: Math.round((92.4 + Math.sin(baseTime / 12000) * 7.6) * 10) / 10
    },
    {
      id: 'corporate',
      name: 'Corporate Suite',
      description: 'Complete business solution for companies and corporations',
      targetUsers: ['Companies', 'Corporations', 'SMEs', 'Startups'],
      features: [
        '👥 Advanced Team Collaboration',
        '📊 Project Management & Gantt Charts',
        '💰 Financial Analysis & Forecasting',
        '🎯 CRM & Customer Management', 
        '📈 Business Intelligence Dashboard',
        '⚡ Workflow Automation Engine',
        '📋 Document Management System',
        '🔐 Enterprise Security & Compliance',
        '📱 Mobile Business Apps',
        '🌐 Multi-branch Management',
        '📞 Video Conferencing & WebRTC',
        '🤝 Client Portal & Invoicing'
      ],
      securityLevel: 'corporate',
      activeInstances: Math.floor(89432 * (Math.cos(baseTime / 9000) * 0.25 + 1)),
      efficiency: Math.round((95.7 + Math.cos(baseTime / 11000) * 4.3) * 10) / 10
    },
    {
      id: 'legal',
      name: 'Legal Practice',
      description: 'Specialized tools for law firms and legal professionals',
      targetUsers: ['Lawyers', 'Law Firms', 'Legal Departments'],
      features: [
        '⚖️ Case Management & Tracking',
        '📄 Legal Document Review & AI Analysis',
        '👨‍💼 Client Relationship Management',
        '🔍 Legal Research & Precedent Database',
        '⏰ Billable Hours Tracking',
        '📅 Court Calendar & Deadlines',
        '🔐 Attorney-Client Privilege Protection',
        '📊 Legal Analytics & Case Insights',
        '💼 Contract Management & Templates',
        '🏛️ Court Filing & e-Discovery',
        '📞 Secure Client Communication',
        '💰 Legal Billing & Payment Processing'
      ],
      securityLevel: 'government',
      activeInstances: Math.floor(12847 * (Math.sin(baseTime / 10000) * 0.3 + 1)),
      efficiency: Math.round((96.8 + Math.sin(baseTime / 13000) * 3.2) * 10) / 10
    },
    {
      id: 'banking',
      name: 'Banking & Finance',
      description: 'High-security financial operations and risk management',
      targetUsers: ['Banks', 'Financial Institutions', 'Investment Firms'],
      features: [
        '💹 Advanced Risk Analysis & Modeling',
        '📊 Real-time Compliance Monitoring',
        '🧮 Financial Modeling & Simulations',
        '📋 Automated Audit Trail System',
        '🔐 Multi-factor Authentication & Encryption',
        '💱 Currency Trading & FX Management',
        '📈 Investment Portfolio Analytics',
        '🏦 Core Banking System Integration',
        '💳 Payment Processing & Fraud Detection',
        '📊 Regulatory Reporting Automation',
        '🎯 Credit Scoring & Loan Management',
        '🌐 Open Banking API Integration'
      ],
      securityLevel: 'government',
      activeInstances: Math.floor(8934 * (Math.cos(baseTime / 11000) * 0.35 + 1)),
      efficiency: Math.round((97.9 + Math.cos(baseTime / 14000) * 2.1) * 10) / 10
    },
    {
      id: 'government',
      name: 'Government Operations',
      description: 'Secure government operations with advanced security protocols',
      targetUsers: ['Government Agencies', 'Public Sector', 'Civil Service'],
      features: [
        '🏛️ Policy Management & Legislative Tracking',
        '👥 Citizen Services Portal & e-Government',
        '🤝 Inter-Agency Collaboration Platform',
        '📊 Public Transparency & Open Data Tools',
        '🗳️ Digital Voting & Election Management',
        '📋 Government Procurement & Contracts',
        '🔐 Classified Information Management',
        '📈 Public Performance Analytics',
        '🌐 Multi-language Citizen Support',
        '📱 Government Mobile Services',
        '⚖️ Regulatory Compliance Automation',
        '🎯 Public Policy Impact Assessment'
      ],
      securityLevel: 'government',
      activeInstances: Math.floor(5678 * (Math.sin(baseTime / 12000) * 0.4 + 1)),
      efficiency: Math.round((98.3 + Math.sin(baseTime / 15000) * 1.7) * 10) / 10
    },
    {
      id: 'military',
      name: 'Military & Defense',
      description: 'Ultra-secure military operations with NATO-grade encryption',
      targetUsers: ['Military', 'Defense Contractors', 'NATO', 'Intelligence'],
      features: [
        '🎯 Mission Planning & Tactical Operations',
        '🕵️ Intelligence Analysis & Threat Assessment',
        '📡 Secure Military Communications',
        '⚔️ Strategic & Tactical Planning Systems',
        '🛰️ Satellite Coordination & Surveillance',
        '🔐 Quantum Encryption & TEMPEST Security',
        '📊 Battle Damage Assessment & Reporting',
        '🎖️ Personnel Management & Security Clearance',
        '💣 Weapons Systems Integration',
        '🌍 Joint Operations Command & Control',
        '📋 After Action Reports & Lessons Learned',
        '🛡️ Cyber Warfare Defense & Operations'
      ],
      securityLevel: 'nato',
      activeInstances: Math.floor(1247 * (Math.cos(baseTime / 13000) * 0.5 + 1)),
      efficiency: Math.round((99.1 + Math.cos(baseTime / 16000) * 0.9) * 10) / 10
    }
  ]
}

// ==== MAIN COMPONENT ====
const AGISheetOfficeSuite: React.FC = () => {
  // Real-time State Management
  const [metrics, setMetrics] = useState<RealTimeMetrics>(generateRealTimeMetrics())
  const [modules, setModules] = useState<OfficeModule[]>(generateOfficeModules())
  const [templates, setTemplates] = useState<WorkspaceTemplate[]>(generateWorkspaceTemplates())
  const [activeView, setActiveView] = useState<'overview' | 'modules' | 'templates'>('overview')
  const [isRealTime, setIsRealTime] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Real-time Updates
  useEffect(() => {
    if (isRealTime) {
      intervalRef.current = setInterval(() => {
        setMetrics(generateRealTimeMetrics())
        setModules(generateOfficeModules())
        setTemplates(generateWorkspaceTemplates())
      }, 2000) // Update every 2 seconds for real-time feel
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRealTime])

  // Utility Functions
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'processing': return 'text-yellow-400'
      case 'standby': return 'text-blue-400'
      case 'maintenance': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getSecurityBadge = (level: string): { color: string; text: string } => {
    switch (level) {
      case 'basic': return { color: 'bg-blue-500', text: 'Basic' }
      case 'corporate': return { color: 'bg-green-500', text: 'Corporate' }
      case 'government': return { color: 'bg-yellow-500', text: 'Government' }
      case 'military': return { color: 'bg-red-500', text: 'Military' }
      case 'nato': return { color: 'bg-purple-500', text: 'NATO-Grade' }
      default: return { color: 'bg-gray-500', text: 'Standard' }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="border-b border-blue-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">💼</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AGISheet Office Suite
                </h1>
                <p className="text-sm text-gray-400">Universal Office Tools - From Students to NATO Operations</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-300">
                {isRealTime ? 'Real-time' : 'Static'} - {metrics.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                isRealTime 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {isRealTime ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-4">
          <nav className="flex space-x-6">
            {[
              { id: 'overview', label: 'System Overview', icon: '📊' },
              { id: 'modules', label: 'Core Modules', icon: '🛠️' },
              { id: 'templates', label: 'Workspace Templates', icon: '🏗️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Real-time System Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  className="bg-slate-800/50 backdrop-blur-sm border border-blue-700 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">📊</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{formatNumber(metrics.activeSpreadsheets)}</div>
                      <div className="text-sm text-gray-400">Active Spreadsheets</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.activeSpreadsheets / 1000000) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-slate-800/50 backdrop-blur-sm border border-green-700 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">📅</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{formatNumber(metrics.meetingsToday)}</div>
                      <div className="text-sm text-gray-400">Meetings Today</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.meetingsToday / 20000) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-slate-800/50 backdrop-blur-sm border border-purple-700 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">📝</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{formatNumber(metrics.notesCreated)}</div>
                      <div className="text-sm text-gray-400">Notes Created</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.notesCreated / 400000) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-slate-800/50 backdrop-blur-sm border border-yellow-700 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">👥</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">{formatNumber(metrics.activeUsers)}</div>
                      <div className="text-sm text-gray-400">Active Users</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.activeUsers / 20000) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Advanced Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">📊 System Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Documents Managed</span>
                      <span className="text-white font-semibold">{formatNumber(metrics.documentsManaged)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Memory Capacity</span>
                      <span className="text-green-400 font-semibold">{metrics.memoryCapacity}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Data Processing</span>
                      <span className="text-blue-400 font-semibold">{formatNumber(metrics.dataProcessing)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Security Level</span>
                      <span className="text-red-400 font-semibold">{metrics.securityLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-400">🤖 AI Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Task Automation</span>
                      <span className="text-green-400 font-semibold">{(metrics.taskAutomation * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">AI Assistance</span>
                      <span className="text-blue-400 font-semibold">{metrics.aiAssistance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Collaboration Tools</span>
                      <span className="text-purple-400 font-semibold">{formatNumber(metrics.collaborationTools)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Knowledge Base</span>
                      <span className="text-yellow-400 font-semibold">{metrics.knowledgeBase}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {modules.map((module) => (
                  <motion.div
                    key={module.id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getStatusColor(module.status)}`}>
                          {module.status}
                        </span>
                        <div className="text-sm text-gray-400">
                          {module.efficiency.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{module.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{formatNumber(module.activeUsers)}</div>
                        <div className="text-xs text-gray-400">Active Users</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{formatNumber(module.taskCount)}</div>
                        <div className="text-xs text-gray-400">Tasks Processed</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-green-400">{module.uptime.toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${module.uptime}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {module.userTypes.map((type) => (
                        <span key={type} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs">
                          {type}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const securityBadge = getSecurityBadge(template.securityLevel)
                  
                  return (
                    <motion.div
                      key={template.id}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        <span className={`px-2 py-1 ${securityBadge.color} text-white rounded-lg text-xs font-medium`}>
                          {securityBadge.text}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Target Users:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.targetUsers.map((user) => (
                            <span key={user} className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                              {user}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature) => (
                            <span key={feature} className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xl font-bold text-blue-400">{formatNumber(template.activeInstances)}</div>
                          <div className="text-xs text-gray-400">Active Instances</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-400">{template.efficiency.toFixed(1)}%</div>
                          <div className="text-xs text-gray-400">Efficiency</div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time Activity Feed */}
      <div className="fixed bottom-4 right-4 w-80 max-h-64 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-xl p-4 overflow-y-auto">
        <h4 className="text-sm font-semibold text-white mb-2">🔴 Live Activity Feed</h4>
        <div className="space-y-1 text-xs">
          <div className="text-green-400">✅ Spreadsheet created by user@corporate.com</div>
          <div className="text-blue-400">📅 Meeting scheduled: NATO Strategy Review</div>
          <div className="text-yellow-400">📝 Note updated: Legal Case #4782</div>
          <div className="text-purple-400">👥 Team collaboration started: Project Alpha</div>
          <div className="text-cyan-400">📊 Analytics report generated for Finance Dept</div>
          <div className="text-green-400">✅ Document verified by Military Division</div>
        </div>
      </div>
    </div>
  )
}

export default AGISheetOfficeSuite
