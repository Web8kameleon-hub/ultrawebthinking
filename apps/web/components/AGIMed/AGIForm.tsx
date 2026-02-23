/**
 * AGIForm - Medical Symptom Input Form with Real Medical Data Integration
 * Part of AGIMed Component
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AGIFormProps {
  onSubmit: (symptoms: string) => void
  isLoading?: boolean
  serviceType?: 'apollo' | 'infermedica' | 'visually' | 'custom'
}

interface MedicalService {
  name: string
  endpoint: string
  apiKeyRequired: boolean
  description: string
}

export const AGIForm: React.FC<AGIFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  serviceType = 'custom' 
}) => {
  const [symptoms, setSymptoms] = useState('')
  const [patientAge, setPatientAge] = useState<number>(30)
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null)

  // Real medical APIs configuration
  const medicalServices: Record<string, MedicalService> = {
    apollo: {
      name: 'Apollo Hospitals API',
      endpoint: 'https://api.apollohospitals.com/medical/v1/symptom-checker',
      apiKeyRequired: true,
      description: 'Real-time symptom analysis from Apollo Hospitals database'
    },
    infermedica: {
      name: 'Infermedica API',
      endpoint: 'https://api.infermedica.com/v3/',
      apiKeyRequired: true,
      description: 'AI-powered symptom checker with medical knowledge base'
    },
    visually: {
      name: 'Visually API',
      endpoint: 'https://api.visually.com/health/v1/analyze',
      apiKeyRequired: true,
      description: 'Computer vision and symptom analysis integration'
    },
    custom: {
      name: 'Custom Medical Database',
      endpoint: '/api/medical/analyze',
      apiKeyRequired: false,
      description: 'Local medical analysis with verified medical data'
    }
  }

  useEffect(() => {
    setSelectedService(medicalServices[serviceType])
  }, [serviceType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setIsConnecting(true)
    
    try {
      // Prepare medical data for API
      const medicalData = {
        symptoms: symptoms,
        patientInfo: {
          age: patientAge,
          gender: patientGender,
          medicalHistory: medicalHistory.split(',').map(item => item.trim())
        },
        timestamp: new Date().toISOString(),
        serviceType: serviceType
      }

      // Call your backend API which will then connect to real medical services
      const response = await fetch('/api/medical/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Medical-Service': serviceType
        },
        body: JSON.stringify(medicalData)
      })

      const data = await response.json()
      setApiResponse(data)
      
      // Pass symptoms to parent component
      onSubmit(symptoms)
      
    } catch (error) {
      console.error('Error connecting to medical service:', error)
      // Handle error appropriately
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Service Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Medical Data Service:
        </label>
        <select
          value={serviceType}
          onChange={(e) => setSelectedService(medicalServices[e.target.value])}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9'
          }}
        >
          {Object.entries(medicalServices).map(([key, service]) => (
            <option key={key} value={key} style={{ background: '#1e293b' }}>
              {service.name}
            </option>
          ))}
        </select>
        {selectedService && (
          <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
            {selectedService.description}
          </p>
        )}
      </div>

      {/* Patient Information */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px', 
        marginBottom: '16px' 
      }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'block' }}>
            Age:
          </label>
          <input
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(parseInt(e.target.value))}
            min={0}
            max={120}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'block' }}>
            Gender:
          </label>
          <select
            value={patientGender}
            onChange={(e) => setPatientGender(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Medical History */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px', display: 'block' }}>
          Medical History (comma-separated):
        </label>
        <input
          type="text"
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          placeholder="e.g., diabetes, hypertension, allergies"
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9'
          }}
        />
      </div>

      <h3 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#f1f5f9',
        marginBottom: '16px'
      }}>
        🩺 Describe Your Symptoms
      </h3>

      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter your symptoms in detail..."
        disabled={isLoading || isConnecting}
        style={{
          width: '100%',
          minHeight: '120px',
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          color: '#f1f5f9',
          fontSize: '16px',
          resize: 'vertical',
          outline: 'none'
        }}
      />

      <button
        type="submit"
        disabled={isLoading || isConnecting || !symptoms.trim()}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '14px 24px',
          background: isLoading || isConnecting ? '#475569' : 'linear-gradient(45deg, #3b82f6, #2563eb)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isLoading || isConnecting ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isConnecting ? '🔄 Connecting to Medical Service...' : 
         isLoading ? '🔄 Analyzing with Real Medical Data...' : 
         '🔬 Analyze Symptoms with Real Medical Data'}
      </button>

      {/* API Response Display */}
      {apiResponse && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}
        >
          <h4 style={{ color: '#4ade80', marginBottom: '8px' }}>
            ✅ Real Medical Data Analysis
          </h4>
          <pre style={{ color: '#e2e8f0', fontSize: '14px', overflowX: 'auto' }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </motion.div>
      )}
    </motion.form>
  )
}

export default AGIForm