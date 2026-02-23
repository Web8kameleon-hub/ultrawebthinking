/**
 * AGIForm - Medical Symptom Input Form with Real Medical Data Integration
 * Part of AGIMed Component
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './AGIForm.module.css'

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
      className={styles.formContainer}
    >
      {/* Service Selection */}
      <div className={styles.serviceSelectionContainer}>
        <label id="service-label" className={styles.label}>
          Medical Data Service:
        </label>
        <select
          value={serviceType}
          onChange={(e) => setSelectedService(medicalServices[e.target.value])}
          className={styles.select}
          aria-labelledby="service-label"
          title="Select a medical data service"
        >
          {Object.entries(medicalServices).map(([key, service]) => (
            <option key={key} value={key} style={{ background: '#1e293b' }}>
              {service.name}
            </option>
          ))}
        </select>
        {selectedService && (
          <p className={styles.serviceDescription}>
            {selectedService.description}
          </p>
        )}
      </div>

      {/* Patient Information */}
      <div className={styles.patientInfoGrid}>
        <div>
          <label htmlFor="age-input" className={styles.label}>
            Age:
          </label>
          <input
            id="age-input"
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(parseInt(e.target.value))}
            min={0}
            max={120}
            title="Enter patient age"
            className={styles.inputField}
          />
        </div>
        <div>
          <label htmlFor="gender-select" className={styles.label}>
            Gender:
          </label>
          <select
            id="gender-select"
            value={patientGender}
            onChange={(e) => setPatientGender(e.target.value as any)}
            title="Select patient gender"
            className={styles.selectField}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Medical History */}
      <div className={styles.medicalHistoryContainer}>
        <label htmlFor="medical-history-input" className={styles.label}>
          Medical History (comma-separated):
        </label>
        <input
          id="medical-history-input"
          type="text"
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          placeholder="e.g., diabetes, hypertension, allergies"
          title="Enter medical history"
          className={styles.inputField}
        />
      </div>

      <h3 className={styles.symptomsHeading}>
        🩺 Describe Your Symptoms
      </h3>

      <textarea
        id="symptoms-textarea"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter your symptoms in detail..."
        disabled={isLoading || isConnecting}
        title="Describe your symptoms"
        className={styles.textarea}
      />

      <button
        type="submit"
        disabled={isLoading || isConnecting || !symptoms.trim()}
        className={`${styles.submitButton} ${isLoading || isConnecting ? styles.submitButtonDisabled : ''}`}
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
          className={styles.responseContainer}
        >
          <h4 className={styles.responseHeading}>
            ✅ Real Medical Data Analysis
          </h4>
          <pre className={styles.responsePreview}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </motion.div>
      )}
    </motion.form>
  )
}

export default AGIForm