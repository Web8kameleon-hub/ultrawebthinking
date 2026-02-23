/**
 * AGIResults - Medical Analysis Results Display
 * Part of AGIMed Component
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AGIMedResult {
  symptoms: string
  confidence: number
  recommendations: string[]
  possibleConditions: Array<{
    name: string
    probability: number
  }>
  timestamp: string
  agiVersion: string
}

interface AGIResultsProps {
  result: AGIMedResult
}

export const AGIResults: React.FC<AGIResultsProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#22c55e'
    if (confidence >= 60) return '#3b82f6'
    if (confidence >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <motion.div
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
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        📊 Analysis Results
        <span style={{
          fontSize: '14px',
          background: `${getConfidenceColor(result.confidence)}20`,
          color: getConfidenceColor(result.confidence),
          padding: '4px 12px',
          borderRadius: '999px',
          fontWeight: 600
        }}>
          {result.confidence}% Confidence
        </span>
      </h3>

      {/* Symptoms Summary */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          color: '#94a3b8',
          marginBottom: '8px' 
        }}>
          Analyzed Symptoms
        </h4>
        <p style={{ color: '#f1f5f9', fontSize: '14px', lineHeight: 1.6 }}>
          {result.symptoms}
        </p>
      </div>

      {/* Possible Conditions */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          color: '#94a3b8',
          marginBottom: '12px' 
        }}>
          Possible Conditions
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {result.possibleConditions.map((condition, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}
            >
              <span style={{ color: '#f1f5f9', fontWeight: 500 }}>
                {condition.name}
              </span>
              <span style={{ 
                color: getConfidenceColor(condition.probability),
                fontWeight: 600
              }}>
                {condition.probability}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          color: '#94a3b8',
          marginBottom: '12px' 
        }}>
          Recommendations
        </h4>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {result.recommendations.map((rec, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: '#f1f5f9',
                fontSize: '14px'
              }}
            >
              <span style={{ color: '#22c55e' }}>✓</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Meta Info */}
      <div style={{
        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <span>AGI Version: {result.agiVersion}</span>
        <span>{new Date(result.timestamp).toLocaleString()}</span>
      </div>
    </motion.div>
  )
}

export default AGIResults
