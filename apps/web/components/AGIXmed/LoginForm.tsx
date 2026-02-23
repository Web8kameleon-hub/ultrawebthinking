/**
 * AGIXmed Login Component
 * Real user authentication form
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 9.0.0 PRODUCTION
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useUser } from './UserContext'

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useUser()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    emri: '',
    mbiemri: '',
    datelindja: '',
    gjinia: 'M' as 'M' | 'F'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      
      if (success) {
        toast.success(mode === 'login' ? 'Mirëseerdhët!' : 'Llogaria u krijua!')
        onSuccess?.()
      } else {
        toast.error('Email ose password i gabuar')
      }
    } catch (error) {
      toast.error('Pati një problem. Provoni përsëri.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        maxWidth: '440px',
        margin: '0 auto',
        padding: '32px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(34, 197, 94, 0.3)'
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏥</div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#22c55e',
          margin: '0 0 8px'
        }}>
          AGIXmed
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Sistemi inteligjent mjekësor me AI
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'flex',
        background: 'rgba(45, 52, 70, 0.6)',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '24px'
      }}>
        <button
          type="button"
          onClick={() => setMode('login')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            background: mode === 'login' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Hyr
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            background: mode === 'register' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'transparent',
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Regjistrohu
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Name fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                  Emri
                </label>
                <input
                  type="text"
                  value={formData.emri}
                  onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
                  placeholder="Emri juaj"
                  required={mode === 'register'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 20, 25, 0.6)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                  Mbiemri
                </label>
                <input
                  type="text"
                  value={formData.mbiemri}
                  onChange={(e) => setFormData({ ...formData, mbiemri: e.target.value })}
                  placeholder="Mbiemri juaj"
                  required={mode === 'register'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 20, 25, 0.6)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Date of birth and gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                  Datëlindja
                </label>
                <input
                  type="date"
                  value={formData.datelindja}
                  onChange={(e) => setFormData({ ...formData, datelindja: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 20, 25, 0.6)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                  Gjinia
                </label>
                <select
                  value={formData.gjinia}
                  onChange={(e) => setFormData({ ...formData, gjinia: e.target.value as 'M' | 'F' })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(15, 20, 25, 0.6)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '14px'
                  }}
                >
                  <option value="M">Mashkull</option>
                  <option value="F">Femër</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@shembull.com"
            required
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(15, 20, 25, 0.6)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            required
            minLength={6}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(15, 20, 25, 0.6)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading 
              ? 'rgba(34, 197, 94, 0.5)' 
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Duke procesuar...
            </>
          ) : (
            mode === 'login' ? '🔐 Hyr në llogari' : '✨ Krijo llogari'
          )}
        </button>
      </form>

      {/* Footer */}
      <p style={{
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        Duke {mode === 'login' ? 'hyrë' : 'u regjistruar'}, pranoni{' '}
        <a href="#" style={{ color: '#22c55e' }}>Kushtet e Përdorimit</a> dhe{' '}
        <a href="#" style={{ color: '#22c55e' }}>Politikën e Privatësisë</a>
      </p>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}

export default LoginForm
