/**
 * 🧠 Neural Performance Dashboard - Real-time AGI Analytics
 * Revolutionary AI performance monitoring with Albanian language support
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-NEURAL-DASHBOARD
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface NeuralMetric {
  label: string
  value: number
  trend: 'up' | 'down' | 'stable'
  color: string
  description: string
}

interface AIModelPerformance {
  id: string
  name: string
  accuracy: number
  speed: number
  satisfaction: number
  usage: number
  neuralActivity: number
}

export default function NeuralDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'neural' | 'language'>('overview')
  const [realTimeData, setRealTimeData] = useState<number[]>([])
  const [isLive, setIsLive] = useState(true)

  const neuralMetrics: NeuralMetric[] = [
    {
      label: 'Neural Activity',
      value: 96.8,
      trend: 'up',
      color: 'from-purple-500 to-pink-500',
      description: 'Aktiviteti neural real-time'
    },
    {
      label: 'Response Quality',
      value: 94.2,
      trend: 'up', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Cilësia e përgjigjeve AGI'
    },
    {
      label: 'Learning Rate',
      value: 89.7,
      trend: 'up',
      color: 'from-green-500 to-emerald-500',
      description: 'Shpejtësia e të mësuarit'
    },
    {
      label: 'Albanian Support',
      value: 98.1,
      trend: 'stable',
      color: 'from-red-500 to-yellow-500',
      description: 'Mbështetja për gjuhën shqipe'
    }
  ]

  const aiModels: AIModelPerformance[] = [
    {
      id: 'openmind',
      name: 'OpenMind 🇦🇱',
      accuracy: 96.8,
      speed: 1.2,
      satisfaction: 98.5,
      usage: 45,
      neuralActivity: 97.2
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot 👨‍💻',
      accuracy: 95.2,
      speed: 0.8,
      satisfaction: 96.1,
      usage: 32,
      neuralActivity: 94.8
    },
    {
      id: 'gemini',
      name: 'Gemini 💎',
      accuracy: 94.7,
      speed: 1.1,
      satisfaction: 95.3,
      usage: 28,
      neuralActivity: 93.5
    },
    {
      id: 'claude',
      name: 'Claude 🧠',
      accuracy: 93.9,
      speed: 1.4,
      satisfaction: 94.8,
      usage: 25,
      neuralActivity: 92.1
    }
  ]

  // Real-time data simulation
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev, Math.random() * 100 + 85]
        return newData.slice(-20) // Keep last 20 points
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  // Initialize with some data
  useEffect(() => {
    setRealTimeData(Array.from({ length: 20 }, () => Math.random() * 15 + 85))
  }, [])

  const performanceChartData = {
    labels: Array.from({ length: realTimeData.length }, (_, i) => `${i * 2}s`),
    datasets: [
      {
        label: 'Neural Performance',
        data: realTimeData,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const languageUsageData = {
    labels: ['Shqip 🇦🇱', 'English 🇺🇸', 'Mixed 🌍'],
    datasets: [
      {
        data: [65, 30, 5],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)', 
          'rgb(34, 197, 94)'
        ],
        borderWidth: 2
      }
    ]
  }

  const modelComparisonData = {
    labels: aiModels.map(m => m.name),
    datasets: [
      {
        label: 'Accuracy %',
        data: aiModels.map(m => m.accuracy),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1
      },
      {
        label: 'Satisfaction %',
        data: aiModels.map(m => m.satisfaction),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }
    ]
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Real-time Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Neural Performance - Live</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-300">{isLive ? 'LIVE' : 'PAUSED'}</span>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>
        <div className="h-64">
          <Line
            data={performanceChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                x: { display: false },
                y: {
                  min: 80,
                  max: 100,
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: 'rgba(255,255,255,0.7)' }
                }
              },
              elements: {
                point: { radius: 0 }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Neural Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {neuralMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
              {metric.value}%
            </div>
            <div className="text-white font-medium mb-1">{metric.label}</div>
            <div className="text-xs text-gray-400 mb-3">{metric.description}</div>
            <div className="flex items-center gap-1">
              <span className={`text-xs ${
                metric.trend === 'up' ? 'text-green-400' : 
                metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {metric.trend === 'up' ? '↗️' : metric.trend === 'down' ? '↘️' : '➡️'}
              </span>
              <span className="text-xs text-gray-400">
                {metric.trend === 'up' ? '+2.3%' : metric.trend === 'down' ? '-1.1%' : '0.0%'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderModels = () => (
    <div className="space-y-6">
      {/* Model Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Model Comparison</h3>
        <div className="h-64">
          <Bar
            data={modelComparisonData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: 'rgba(255,255,255,0.8)' }
                }
              },
              scales: {
                x: {
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: 'rgba(255,255,255,0.7)' }
                },
                y: {
                  min: 90,
                  max: 100,
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  ticks: { color: 'rgba(255,255,255,0.7)' }
                }
              }
            }}
          />
        </div>
      </motion.div>

      {/* Individual Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{model.name}</h4>
              <div className="text-2xl font-bold text-purple-400">{model.usage}%</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Accuracy</span>
                <span className="text-green-400 font-medium">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Speed</span>
                <span className="text-blue-400 font-medium">{model.speed}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Satisfaction</span>
                <span className="text-pink-400 font-medium">{model.satisfaction}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Neural Activity</span>
                <span className="text-purple-400 font-medium">{model.neuralActivity}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderLanguage = () => (
    <div className="space-y-6">
      {/* Language Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Language Usage Distribution</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="w-64 h-64">
            <Doughnut
              data={languageUsageData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: 'rgba(255,255,255,0.8)' }
                  }
                }
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Albanian Language Excellence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-red-500/20 border border-red-500/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🇦🇱</span>
          <div>
            <h3 className="text-xl font-semibold text-white">Albanian Language Excellence</h3>
            <p className="text-gray-300">Specialized neural processing for Albanian language</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">98.1%</div>
            <div className="text-sm text-gray-300">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">1.1s</div>
            <div className="text-sm text-gray-300">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">95.7%</div>
            <div className="text-sm text-gray-300">Cultural Context</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">99.3%</div>
            <div className="text-sm text-gray-300">User Satisfaction</div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🧠 Neural Performance Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Real-time AGI analytics and performance monitoring
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
            {['overview', 'models', 'neural', 'language'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab === 'overview' ? '📊 Overview' :
                 tab === 'models' ? '🤖 AI Models' :
                 tab === 'neural' ? '🧠 Neural' :
                 '🇦🇱 Language'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'models' && renderModels()}
          {activeTab === 'neural' && renderOverview()} {/* Same as overview for now */}
          {activeTab === 'language' && renderLanguage()}
        </div>

        {/* Footer Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-400 text-sm"
        >
          <div className="flex items-center justify-center gap-4">
            <span>🚀 EuroWeb AGI Platform</span>
            <span>•</span>
            <span>Neural Engine: Active</span>
            <span>•</span>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
