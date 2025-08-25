/**
 * AlbaMed - Advanced Medical AI Platform
 * Neural-Powered Healthcare Management System
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 * @contact dealsjona@gmail.com
 * @license MIT
 */

import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

// Medical Data Interfaces
interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  bloodType: string
  allergies: string[]
  conditions: string[]
  medications: string[]
  lastVisit: Date
  priority: 'low' | 'normal' | 'high' | 'critical'
  status: 'active' | 'inactive' | 'emergency'
}

interface MedicalRecord {
  id: string
  patientId: string
  date: Date
  type: 'checkup' | 'emergency' | 'surgery' | 'consultation' | 'lab'
  diagnosis: string
  treatment: string
  notes: string
  doctor: string
  vitals?: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygen: number
  }
}

interface AIAnalysis {
  confidence: number
  risk: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  alerts: string[]
  predictedConditions: string[]
}

// Medical Card Variants
const medicalCardVariants = cva(
  "rounded-xl border backdrop-blur-md transition-all duration-300 hover:shadow-lg",
  {
    variants: {
      priority: {
        low: "border-green-500/30 bg-green-500/10",
        normal: "border-blue-500/30 bg-blue-500/10",
        high: "border-yellow-500/30 bg-yellow-500/10",
        critical: "border-red-500/30 bg-red-500/10"
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      priority: "normal",
      size: "md"
    }
  }
)

// Sample Medical Data
const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'female',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Nuts'],
    conditions: ['Hypertension', 'Diabetes Type 2'],
    medications: ['Metformin', 'Lisinopril'],
    lastVisit: new Date('2024-07-25'),
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 67,
    gender: 'male',
    bloodType: 'O-',
    allergies: ['Latex'],
    conditions: ['Atrial Fibrillation', 'Arthritis'],
    medications: ['Warfarin', 'Ibuprofen'],
    lastVisit: new Date('2024-07-28'),
    priority: 'critical',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 28,
    gender: 'female',
    bloodType: 'B+',
    allergies: [],
    conditions: ['Asthma'],
    medications: ['Albuterol'],
    lastVisit: new Date('2024-07-30'),
    priority: 'normal',
    status: 'active'
  }
]

// Main AlbaMed Component
const AlbaMed: React.FC = () => {
  // State Management
  const [patients, setPatients] = useState<Patient[]>(samplePatients)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'records' | 'ai-analysis' | 'emergency'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null)

  // Real-time Medical Metrics
  const [medicalMetrics, setMedicalMetrics] = useState({
    totalPatients: 156,
    emergencyAlerts: 3,
    todayAppointments: 24,
    criticalCases: 8,
    aiAccuracy: 97.4,
    systemLoad: 23.6
  })

  // Update metrics in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setMedicalMetrics(prev => ({
        ...prev,
        emergencyAlerts: Math.max(0, prev.emergencyAlerts + (Math.random() > 0.7 ? 1 : -1)),
        aiAccuracy: Math.max(95, Math.min(99.9, prev.aiAccuracy + (Math.random() - 0.5) * 0.5)),
        systemLoad: Math.max(10, Math.min(80, prev.systemLoad + (Math.random() - 0.5) * 5))
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // AI Analysis Simulation
  const runAIAnalysis = useCallback(async (patient: Patient) => {
    setIsAIAnalyzing(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analysis: AIAnalysis = {
      confidence: 85 + Math.random() * 10,
      risk: patient.priority === 'critical' ? 'critical' : 
            patient.priority === 'high' ? 'high' : 'medium',
      recommendations: [
        'Continue current medication regimen',
        'Schedule follow-up in 2 weeks',
        'Monitor blood pressure daily',
        'Consider lifestyle modifications'
      ],
      alerts: patient.priority === 'critical' ? ['Irregular heartbeat detected', 'Blood pressure elevated'] : [],
      predictedConditions: ['Cardiovascular risk', 'Metabolic syndrome']
    }
    
    setAIAnalysis(analysis)
    setIsAIAnalyzing(false)
  }, [])

  // Filtered patients based on search
  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.conditions.some(condition => 
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [patients, searchTerm])

  // Dashboard Content
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Metrics Cards */}
      <motion.div
        className={medicalCardVariants({ priority: 'normal', size: 'md' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Total Patients</h3>
            <p className="text-3xl font-bold text-cyan-400">{medicalMetrics.totalPatients}</p>
          </div>
          <div className="text-4xl">👥</div>
        </div>
      </motion.div>

      <motion.div
        className={medicalCardVariants({ priority: 'critical', size: 'md' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Emergency Alerts</h3>
            <p className="text-3xl font-bold text-red-400">{medicalMetrics.emergencyAlerts}</p>
          </div>
          <div className="text-4xl">🚨</div>
        </div>
      </motion.div>

      <motion.div
        className={medicalCardVariants({ priority: 'high', size: 'md' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">AI Accuracy</h3>
            <p className="text-3xl font-bold text-green-400">{medicalMetrics.aiAccuracy.toFixed(1)}%</p>
          </div>
          <div className="text-4xl">🧠</div>
        </div>
      </motion.div>

      {/* Recent Patients */}
      <motion.div
        className={medicalCardVariants({ priority: 'normal', size: 'lg' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ gridColumn: 'span 2' }}
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Patients</h3>
        <div className="space-y-3">
          {patients.slice(0, 3).map(patient => (
            <div key={patient.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-semibold text-white">{patient.name}</p>
                <p className="text-sm text-gray-300">{patient.conditions.join(', ')}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                patient.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                patient.priority === 'high' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {patient.priority.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Analysis Panel */}
      <motion.div
        className={medicalCardVariants({ priority: 'normal', size: 'lg' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">AI Neural Analysis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">System Status</span>
            <span className="text-green-400 font-semibold">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Load</span>
            <span className="text-cyan-400">{medicalMetrics.systemLoad.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${medicalMetrics.systemLoad}%` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )

  // Patients List Content
  const renderPatients = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          🔍 Search
        </button>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <motion.div
            key={patient.id}
            className={medicalCardVariants({ priority: patient.priority, size: 'md' })}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPatient(patient)}
            style={{ cursor: 'pointer' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{patient.name}</h3>
                <span className="text-2xl">
                  {patient.gender === 'male' ? '👨' : patient.gender === 'female' ? '👩' : '👤'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Age:</span>
                  <span className="text-white">{patient.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Blood Type:</span>
                  <span className="text-white">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Visit:</span>
                  <span className="text-white">{patient.lastVisit.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-600">
                <p className="text-xs text-gray-400">Conditions:</p>
                <p className="text-sm text-white">{patient.conditions.join(', ')}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  runAIAnalysis(patient)
                }}
                className="w-full mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
              >
                🧠 Run AI Analysis
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  // AI Analysis Content
  const renderAIAnalysis = () => (
    <div className="space-y-6">
      {isAIAnalyzing ? (
        <motion.div
          className="flex flex-col items-center justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Neural Analysis in Progress</h2>
          <p className="text-gray-400">Analyzing patient data with advanced AI algorithms...</p>
        </motion.div>
      ) : aiAnalysis ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={medicalCardVariants({ priority: 'normal', size: 'lg' })}>
            <h2 className="text-2xl font-bold text-white mb-4">AI Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">Confidence Score</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-3 rounded-full"
                      style={{ width: `${aiAnalysis.confidence}%` }}
                    />
                  </div>
                  <span className="text-white font-bold">{aiAnalysis.confidence.toFixed(1)}%</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-3">Risk Level</h3>
                <span className={`px-4 py-2 rounded-lg font-bold ${
                  aiAnalysis.risk === 'critical' ? 'bg-red-500/20 text-red-300' :
                  aiAnalysis.risk === 'high' ? 'bg-yellow-500/20 text-yellow-300' :
                  aiAnalysis.risk === 'medium' ? 'bg-orange-500/20 text-orange-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {aiAnalysis.risk.toUpperCase()}
                </span>
              </div>
            </div>

            {aiAnalysis.alerts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-red-400 mb-3">🚨 Critical Alerts</h3>
                <div className="space-y-2">
                  {aiAnalysis.alerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                      {alert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">💡 Recommendations</h3>
              <div className="space-y-2">
                {aiAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <span className="text-green-400">•</span>
                    <span className="text-green-300">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Analysis Ready</h2>
          <p className="text-gray-400">Select a patient to run AI-powered medical analysis</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🏥</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AlbaMed AI Platform
                </h1>
                <p className="text-sm text-gray-400">Advanced Neural Healthcare Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">System Status</p>
                <p className="text-green-400 font-semibold">🟢 ONLINE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'patients', label: 'Patients', icon: '👥' },
              { id: 'ai-analysis', label: 'AI Analysis', icon: '🧠' },
              { id: 'emergency', label: 'Emergency', icon: '🚨' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'patients' && renderPatients()}
            {activeTab === 'ai-analysis' && renderAIAnalysis()}
            {activeTab === 'emergency' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚨</div>
                <h2 className="text-2xl font-bold text-white mb-2">Emergency Protocol</h2>
                <p className="text-gray-400">Emergency management system coming soon</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={medicalCardVariants({ priority: selectedPatient.priority, size: 'lg' })}
              style={{ maxWidth: '600px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedPatient.name}</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white">{selectedPatient.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gender:</span>
                      <span className="text-white capitalize">{selectedPatient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Blood Type:</span>
                      <span className="text-white">{selectedPatient.bloodType}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`capitalize ${
                        selectedPatient.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Priority:</span>
                      <span className={`capitalize ${
                        selectedPatient.priority === 'critical' ? 'text-red-400' :
                        selectedPatient.priority === 'high' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {selectedPatient.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Visit:</span>
                      <span className="text-white">{selectedPatient.lastVisit.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">Medical Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.conditions.map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">Current Medications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medications.map((medication, index) => (
                        <span key={index} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedPatient.allergies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-2">⚠️ Allergies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-600 flex gap-3">
                  <button
                    onClick={() => runAIAnalysis(selectedPatient)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    🧠 Run AI Analysis
                  </button>
                  <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                    📝 Edit Record
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AlbaMed