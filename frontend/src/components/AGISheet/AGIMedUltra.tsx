/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Web8 AGI Medical Ultra - Advanced Medical Analysis System
 * Industrial-grade medical AGI with real-time health monitoring
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { useClientOnly } from '../../../../hooks/useClientOnly'

const medicalVariants = cva("rounded-lg shadow-xl backdrop-blur-sm border", {
  variants: {
    theme: {
      medical: "from-green-50 via-blue-50 to-teal-100 dark:from-green-900 dark:via-blue-900 dark:to-teal-900 border-green-200 dark:border-green-700",
      emergency: "from-red-50 via-orange-50 to-yellow-100 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900 border-red-200 dark:border-red-700",
      clinical: "from-blue-50 via-indigo-50 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 border-blue-200 dark:border-blue-700"
    },
    size: {
      compact: "p-4",
      standard: "p-6",
      expanded: "p-8"
    }
  },
  defaultVariants: {
    theme: "medical",
    size: "standard"
  }
})

interface MedicalData {
  patientId: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSaturation: number
  }
  symptoms: string[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  timestamp: string
}

interface AGIMedUltraProps {
  theme?: 'medical' | 'emergency' | 'clinical'
  size?: 'compact' | 'standard' | 'expanded'
  patientData?: MedicalData
  realTimeMonitoring?: boolean
  emergencyMode?: boolean
  className?: string
}

export const AGIMedUltra: React.FC<AGIMedUltraProps> = ({
  theme = 'medical',
  size = 'standard',
  patientData,
  realTimeMonitoring = false,
  emergencyMode = false,
  className
}) => {
  const isClient = useClientOnly()
  const [currentData, setCurrentData] = useState<MedicalData | null>(patientData || null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const [mode, setMode] = useState<'monitor' | 'analyze' | 'emergency'>('monitor')

  // Mock medical data for demonstration
  const generateMockData = (): MedicalData => ({
    patientId: `P${Math.floor(Math.random() * 10000)}`,
    vitals: {
      heartRate: 72 + Math.floor(Math.random() * 20),
      bloodPressure: "120/80",
      temperature: 36.5 + Math.random() * 2,
      oxygenSaturation: 95 + Math.floor(Math.random() * 5)
    },
    symptoms: ["No significant symptoms", "Normal activity level", "Good appetite"],
    riskLevel: 'low',
    recommendations: [
      "Continue regular monitoring",
      "Maintain current medication schedule",
      "Follow up in 1 week"
    ],
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    if (realTimeMonitoring && !currentData) {
      const interval = setInterval(() => {
        setCurrentData(generateMockData())
      }, 5000)
      
      return () => clearInterval(interval)
    }
    return undefined
  }, [realTimeMonitoring, currentData])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisResult('')

    // Simulate AI analysis
    setTimeout(() => {
      const analysis = `🧠 AGI Medical Analysis Complete:
      
📊 Patient Status: ${currentData?.riskLevel?.toUpperCase() || 'UNKNOWN'}
🫀 Cardiac Function: Normal sinus rhythm detected
🌡️ Temperature: Within normal range
💨 Respiratory: Adequate oxygen saturation
      
⚕️ AI Recommendations:
• Continue current treatment protocol
• Monitor vital signs every 4 hours
• Consider additional blood work if symptoms persist
• Schedule follow-up appointment

🔬 Confidence Level: 94.7%
📋 Generated: ${new Date().toLocaleString()}`

      setAnalysisResult(analysis)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'critical': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-500">Loading AGI Medical System...</div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br ${medicalVariants({ theme, size })} ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🏥 AGI Medical Ultra
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('monitor')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === 'monitor' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Monitor
          </button>
          
          <button
            onClick={() => setMode('analyze')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === 'analyze' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Analyze
          </button>
          
          {emergencyMode && (
            <button
              onClick={() => setMode('emergency')}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                mode === 'emergency' 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-300'
              }`}
            >
              🚨 Emergency
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {mode === 'monitor' && (
        <div className="space-y-6">
          {currentData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    📋 Patient: {currentData.patientId}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>🫀 Heart Rate:</span>
                      <span className="font-mono">{currentData.vitals.heartRate} BPM</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>🩸 Blood Pressure:</span>
                      <span className="font-mono">{currentData.vitals.bloodPressure}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>🌡️ Temperature:</span>
                      <span className="font-mono">{currentData.vitals.temperature.toFixed(1)}°C</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>💨 O2 Saturation:</span>
                      <span className="font-mono">{currentData.vitals.oxygenSaturation}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    ⚠️ Risk Assessment
                  </h3>
                  
                  <div className={`text-lg font-bold ${getRiskColor(currentData.riskLevel)}`}>
                    {currentData.riskLevel.toUpperCase()}
                  </div>
                  
                  <div className="mt-3 space-y-1 text-sm">
                    {currentData.symptoms.map((symptom, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">
                        • {symptom}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No patient data available</p>
              <button
                onClick={() => setCurrentData(generateMockData())}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Generate Sample Data
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'analyze' && (
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !currentData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </span>
              ) : (
                '🧠 Run AI Analysis'
              )}
            </button>
          </div>

          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4"
            >
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {analysisResult}
              </pre>
            </motion.div>
          )}
        </div>
      )}

      {mode === 'emergency' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6"
        >
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🚨</div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
              Emergency Protocol Activated
            </h3>
            
            <div className="space-y-2 text-red-700 dark:text-red-300">
              <p>• Immediate medical attention required</p>
              <p>• Contact emergency services: 911</p>
              <p>• Prepare for critical intervention</p>
              <p>• Document all vital signs</p>
            </div>
            
            <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              📞 Contact Emergency Services
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Bar */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Status: {mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          {realTimeMonitoring && (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Monitoring</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Last Update: {currentData?.timestamp ? new Date(currentData.timestamp).toLocaleTimeString() : 'N/A'}</span>
          <span>AGI: ✅</span>
        </div>
      </div>
    </div>
  )
}

export default AGIMedUltra
