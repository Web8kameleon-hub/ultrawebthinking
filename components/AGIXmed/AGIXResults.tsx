/**
 * AGIXmed Results Component
 * Medical AI Analysis Results Display
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface AGIXmedResult {
  symptoms: string
  confidence: number
  recommendations: string[]
  possibleConditions: Array<{
    name: string
    probability: number
  }>
  timestamp: string
  agixmedVersion: string
}

interface AGIXResultsProps {
  result: AGIXmedResult | null
  onNewAnalysisAction: () => void
}

export const AGIXResults: React.FC<AGIXResultsProps> = ({ result, onNewAnalysisAction }) => {
  if (!result) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#cbd5e1'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏥</div>
        <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px', color: '#22c55e' }}>
          AGIXmed e gatshme për analizë
        </h3>
        <p style={{ fontSize: '16px' }}>
          Përdorni formularin më lart për të filluar analizën mjekësore
        </p>
      </div>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#22c55e'
    if (confidence >= 0.6) return '#f59e0b'
    return '#ef4444'
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.6) return '#ef4444'
    if (probability >= 0.3) return '#f59e0b'
    return '#22c55e'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(45, 52, 70, 0.9)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        marginTop: '32px'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(34, 197, 94, 0.2)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🧠 Rezultatet e Analizës AGIXmed
        </h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: `rgba(${getConfidenceColor(result.confidence) === '#22c55e' ? '34, 197, 94' : getConfidenceColor(result.confidence) === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`,
          border: `1px solid ${getConfidenceColor(result.confidence)}`,
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: getConfidenceColor(result.confidence),
            borderRadius: '50%'
          }} />
          Besueshmëria: {Math.round(result.confidence * 100)}%
        </div>
      </div>

      {/* Symptoms Recap */}
      <div style={{
        background: 'rgba(15, 20, 25, 0.6)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#22c55e',
          marginBottom: '12px'
        }}>
          📋 Simptomat e analizuara:
        </h3>
        <p style={{
          fontSize: '15px',
          color: '#f8fafc',
          lineHeight: '1.6',
          margin: 0
        }}>
          {result.symptoms}
        </p>
      </div>

      {/* Possible Conditions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#22c55e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🔍 Kushtet e mundshme:
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {result.possibleConditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              style={{
                background: 'rgba(15, 20, 25, 0.6)',
                border: `1px solid ${getProbabilityColor(condition.probability)}`,
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#f8fafc'
              }}>
                {condition.name}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '100px',
                  height: '6px',
                  background: 'rgba(100, 116, 139, 0.3)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${condition.probability * 100}%`,
                    height: '100%',
                    background: getProbabilityColor(condition.probability),
                    borderRadius: '3px'
                  }} />
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: getProbabilityColor(condition.probability),
                  minWidth: '40px'
                }}>
                  {Math.round(condition.probability * 100)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#22c55e',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💡 Rekomandimet:
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {result.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <div style={{
                background: '#22c55e',
                color: '#000',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {index + 1}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#f8fafc',
                lineHeight: '1.5'
              }}>
                {recommendation}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '24px',
        borderTop: '1px solid rgba(34, 197, 94, 0.2)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>
            Ky është një këshillim fillestar. Konsultohuni gjithmonë me një mjek të licencuar për diagnozë të saktë.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onNewAnalysisAction}
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid #22c55e',
              borderRadius: '8px',
              color: '#22c55e',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔄 Analizë e re
          </button>

          <button
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              color: '#3b82f6',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            📄 Ruaj rezultatet
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: 'rgba(15, 20, 25, 0.4)',
        borderRadius: '8px',
        fontSize: '11px',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>AGIXmed v{result.agixmedVersion}</span>
        <span>{new Date(result.timestamp).toLocaleString('sq-AL')}</span>
      </div>
    </motion.div>
  )
}

export default AGIXResults
