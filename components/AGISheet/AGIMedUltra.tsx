/**
 * EuroWeb AGI×Med Ultra - Medical AI Tab System
 * Ultra-Industrial Quantum-Enhanced Architecture
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { AGIForm } from '../AGIMed/AGIForm'
import { AGIMedResult, AGIResults } from '../AGIMed/AGIResults'

// Interface definitions for Medical AI
interface QuantumMedMetrics {
  patientAnalysis: string
  diagnosticAccuracy: string
  treatmentSuccess: number
  quantumProcessing: number
  medicalDatabase: string
  neuralNetworks: number
  researchProjects: string
  aiConfidence: number
  biomarkers: number
  drugDiscovery: string
}

interface MedicalModule {
  id: string
  title: string
  icon: string
  status: 'active' | 'processing' | 'standby'
  accuracy: number
  description: string
}

// Static medical data
const quantumMedMetrics: QuantumMedMetrics = {
  patientAnalysis: '2.847 TPS',
  diagnosticAccuracy: '99.7%',
  treatmentSuccess: 0.94,
  quantumProcessing: 847,
  medicalDatabase: '47.2 TB',
  neuralNetworks: 12,
  researchProjects: '2,847',
  aiConfidence: 0.987,
  biomarkers: 15847,
  drugDiscovery: 'Active'
}

const medicalModules: MedicalModule[] = [
  {
    id: 'diagnostics',
    title: 'AI Diagnostics',
    icon: '🔬',
    status: 'active',
    accuracy: 99.7,
    description: 'Advanced medical imaging analysis and pattern recognition'
  },
  {
    id: 'treatment',
    title: 'Treatment Planning',
    icon: '💊',
    status: 'processing',
    accuracy: 97.3,
    description: 'Personalized treatment protocols and drug recommendations'
  },
  {
    id: 'research',
    title: 'Medical Research',
    icon: '🧬',
    status: 'active',
    accuracy: 95.8,
    description: 'Clinical trial analysis and research acceleration'
  },
  {
    id: 'surgery',
    title: 'Surgical AI',
    icon: '🏥',
    status: 'standby',
    accuracy: 98.9,
    description: 'Surgical planning and robotic assistance'
  },
  {
    id: 'genetics',
    title: 'Genetic Analysis',
    icon: '🧬',
    status: 'active',
    accuracy: 96.4,
    description: 'Genomic sequencing and hereditary risk assessment'
  },
  {
    id: 'pharmacy',
    title: 'Drug Discovery',
    icon: '⚗️',
    status: 'processing',
    accuracy: 94.2,
    description: 'Molecular design and pharmaceutical research'
  }
]

/**
 * AGI Med Ultra Component
 * Quantum-enhanced medical artificial intelligence with AGI Medical integration
 */
const AGIMedUltra: React.FC = () => {
  const [agiResult, setAgiResult] = useState<AGIMedResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const currentTime = new Date().toLocaleTimeString()

  // Handle AGI Medical form submission
  const handleAGISubmitAction = async (symptoms: string) => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/agimed/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAgiResult(result)
    } catch (error) {
      console.error('AGI Medical analysis error:', error)
      // Show error message to user
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle new analysis request
  const handleNewAnalysisAction = () => {
    setAgiResult(null)
  }

  return (
    <div className="p-6 min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🏥 AGI Med Ultra
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Quantum-Enhanced Medical Artificial Intelligence
        </p>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-green-100 bg-opacity-70 rounded-md border border-green-500">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-800 font-semibold">
            Quantum Medical AI Online - {currentTime}
          </span>
        </div>
      </motion.div>

      {/* Quantum Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {Object.entries(quantumMedMetrics).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white bg-opacity-80 border border-blue-300 rounded-xl p-5 text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="text-2xl font-bold text-blue-500 mb-2">
              {value}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AGI Medical Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <AGIForm onSubmitAction={handleAGISubmitAction} isLoading={isAnalyzing} />
        <AGIResults result={agiResult} onNewAnalysisAction={handleNewAnalysisAction} />
      </motion.div>

      {/* Medical Modules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8"
      >
        {medicalModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className={`bg-white bg-opacity-90 border-2 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${
              module.status === 'active' ? 'border-green-500' :
              module.status === 'processing' ? 'border-blue-500' : 'border-gray-400'
            }`}
          >
            {/* Module Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{module.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800 m-0">
                  {module.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  module.status === 'active' ? 'bg-green-500' :
                  module.status === 'processing' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <span className={`text-xs font-semibold uppercase ${
                  module.status === 'active' ? 'text-green-800' :
                  module.status === 'processing' ? 'text-blue-800' : 'text-gray-600'
                }`}>
                  {module.status}
                </span>
              </div>
            </div>

            {/* Accuracy Meter */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Accuracy</span>
                <span className="text-sm font-semibold text-blue-500">
                  {module.accuracy}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${module.accuracy}%` }}
                  transition={{ delay: 0.2 * index, duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 m-0 leading-relaxed">
              {module.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Real-time Activity Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white bg-opacity-95 border border-blue-200 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-blue-500 mb-5 flex items-center gap-3">
          📊 Real-time Medical AI Activity
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-500 rounded-md p-4">
            <div className="text-green-800 text-sm font-semibold mb-2">
              🔍 Active Diagnoses
            </div>
            <div className="text-gray-800 text-2xl font-bold">
              1,247
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-500 rounded-md p-4">
            <div className="text-blue-800 text-sm font-semibold mb-2">
              💊 Treatment Plans
            </div>
            <div className="text-gray-800 text-2xl font-bold">
              892
            </div>
          </div>
          
          <div className="bg-cyan-50 border border-cyan-500 rounded-md p-4">
            <div className="text-cyan-800 text-sm font-semibold mb-2">
              🧬 Research Active
            </div>
            <div className="text-gray-800 text-2xl font-bold">
              156
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-500 rounded-md p-4">
            <div className="text-emerald-800 text-sm font-semibold mb-2">
              ⚗️ Drug Discovery
            </div>
            <div className="text-gray-800 text-2xl font-bold">
              47
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export { AGIMedUltra };
export default AGIMedUltra;

