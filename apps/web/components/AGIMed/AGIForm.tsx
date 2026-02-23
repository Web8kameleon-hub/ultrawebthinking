/**
 * AGIForm - Medical Symptom Input Form
 * Part of AGIMed Component
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface AGIFormProps {
  onSubmitAction: (symptoms: string) => void
  isLoading?: boolean
}

export const AGIForm: React.FC<AGIFormProps> = ({ onSubmitAction, isLoading = false }) => {
  const [symptoms, setSymptoms] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (symptoms.trim()) {
      onSubmitAction(symptoms)
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
        border: '1px solid rgba(148, 163, 184, 0.3)'
      }}
    >
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
        placeholder="Enter your symptoms here..."
        disabled={isLoading}
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
        disabled={isLoading || !symptoms.trim()}
        style={{
          marginTop: '16px',
          width: '100%',
          padding: '14px 24px',
          background: isLoading ? '#475569' : 'linear-gradient(45deg, #3b82f6, #2563eb)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {isLoading ? '🔄 Analyzing...' : '🔬 Analyze Symptoms'}
      </button>
    </motion.form>
  )
}

export default AGIForm
