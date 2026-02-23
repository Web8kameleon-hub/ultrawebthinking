/**
 * AGIXmed Form Component
 * Medical AI Analysis Input Form
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export type AGIXFormProps = {
  onSubmit: (input: string) => void
  isLoading?: boolean
}

export const AGIXForm: React.FC<AGIXFormProps> = ({ onSubmit, isLoading = false }) => {
  const [input, setInput] = useState('')
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) {return}
    onSubmit(input.trim())
    setInput('')
    setCharCount(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setInput(value)
      setCharCount(value.length)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(45, 52, 70, 0.9)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#22c55e',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          🏥 AGIXmed Analyzer
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#cbd5e1',
          lineHeight: '1.5'
        }}>
          Përshkruaj simptomat për një analizë të menjëhershme nga inteligjenca artificiale mjekësore
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label
            htmlFor="symptoms"
            style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 600,
              color: '#22c55e',
              marginBottom: '12px'
            }}
          >
            Përshkruaj simptomat ose shqetësimet shëndetësore:
          </label>
          
          <div style={{ position: 'relative' }}>
            <textarea
              id="symptoms"
              value={input}
              onChange={handleInputChange}
              placeholder="Shembull: kam dhimbje koke, temperaturë 38°C, lodhje të madhe që zgjat prej 2 ditësh, dhimbje muskujsh..."
              disabled={isLoading}
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '16px',
                fontSize: '15px',
                lineHeight: '1.5',
                background: 'rgba(15, 20, 25, 0.8)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                color: '#f8fafc',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #22c55e'
                e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(34, 197, 94, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
              required
            />
            
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '12px',
              fontSize: '12px',
              color: charCount > maxChars * 0.8 ? '#f59e0b' : '#64748b'
            }}>
              {charCount}/{maxChars}
            </div>
          </div>
          
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>💡</span>
            <span>
              Sa më shumë detaje të jepni, aq më të sakta do të jenë rekomandimet e AGIXmed
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{
            flex: 1,
            fontSize: '13px',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🔒</span>
            <span>Të dhënat tuaja janë të sigurta dhe të enkriptuara</span>
          </div>
          
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            style={{
              background: isLoading 
                ? 'rgba(34, 197, 94, 0.3)' 
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '140px',
              justifyContent: 'center',
              boxShadow: isLoading 
                ? 'none' 
                : '0 4px 12px rgba(34, 197, 94, 0.3)',
              opacity: !input.trim() ?? isLoading ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Analizon...
              </>
            ) : (
              <>
                🧠 Dërgo në AGIXmed
              </>
            )}
          </motion.button>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}

// Removed default export: AGIXForm

