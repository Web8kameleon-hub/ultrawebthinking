// components/AGIXmed/AGIXForm.tsx
/**
 * AGIXmed Form Component
 * Medical AI Analysis Input Form
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 PRODUCTION
 * @license Commercial
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'

// Types industrial
export type PatientData = {
  emri?: string
  mosha: number
  gjinia: 'M' | 'F'
  simptomat: string
  historikuMjekesor?: string[]
  alergji?: string[]
  medikamente?: string[]
  temperatura?: number
  presioniGjakut?: string
  pesha?: number
  gjatesia?: number
}

export type AGIXFormProps = {
  onSubmit: (data: PatientData) => Promise<void>
  isLoading?: boolean
  apiKey?: string
}

export const AGIXForm: React.FC<AGIXFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  apiKey 
}) => {
  // State management industrial
  const [currentStep, setCurrentStep] = useState(1)
  const [patientData, setPatientData] = useState<PatientData>({
    mosha: 0,
    gjinia: 'M',
    simptomat: '',
    historikuMjekesor: [],
    alergji: [],
    medikamente: []
  })
  
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [isSaving, setIsSaving] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const maxChars = 1000

  // Autosave çdo 30 sekonda
  useEffect(() => {
    const autosave = setInterval(() => {
      if (Object.keys(patientData).length > 0) {
        localStorage.setItem('agixmed_draft', JSON.stringify(patientData))
        toast.success('Draft u ruajt automatikisht', { icon: '💾' })
      }
    }, 30000)

    return () => clearInterval(autosave)
  }, [patientData])

  // Load draft
  useEffect(() => {
    const draft = localStorage.getItem('agixmed_draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        setPatientData(parsed)
        toast('Keni një draft të paruajtur', { icon: '📝' })
      } catch (e) {
        console.error('Draft error:', e)
      }
    }
  }, [])

  const validateStep = (step: number): boolean => {
    const errors: {[key: string]: string} = {}
    
    if (step === 1) {
      if (!patientData.mosha || patientData.mosha < 0 || patientData.mosha > 130) {
        errors.mosha = 'Ju lutem vendosni një moshë të vlefshme (0-130 vjeç)'
      }
    }
    
    if (step === 2) {
      if (!patientData.simptomat || patientData.simptomat.length < 10) {
        errors.simptomat = 'Përshkruani simptomat në detaje (minimum 10 karaktere)'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    } else {
      toast.error('Ju lutem plotësoni të dhënat e kërkuara')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(2)) {
      toast.error('Ju lutem plotësoni të gjitha të dhënat')
      return
    }

    setIsSaving(true)
    
    try {
      // Validimi i API key
      if (!apiKey && process.env.NODE_ENV === 'production') {
        throw new Error('API key mungon')
      }

      // Dërgo të dhënat
      await onSubmit(patientData)
      
      // Fshij draft-in pas suksesit
      localStorage.removeItem('agixmed_draft')
      
      toast.success('Të dhënat u dërguan me sukses!', {
        duration: 5000,
        icon: '🏥'
      })
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Pati një problem. Ju lutem provoni përsëri.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #22c55e'
          }
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={styles.container}
      >
        {/* Header me Progress Bar */}
        <div style={styles.header}>
          <div style={styles.logoSection}>
            <span style={styles.logo}>🏥 AGIXmed</span>
            <span style={styles.version}>v9.0.0 PRODUCTION</span>
          </div>
          
          <div style={styles.progressContainer}>
            <div style={styles.progressSteps}>
              <div style={{
                ...styles.step,
                background: currentStep >= 1 ? '#22c55e' : 'rgba(255,255,255,0.1)'
              }}>1</div>
              <div style={styles.stepLine} />
              <div style={{
                ...styles.step,
                background: currentStep >= 2 ? '#22c55e' : 'rgba(255,255,255,0.1)'
              }}>2</div>
            </div>
            <div style={styles.stepText}>
              Hapi {currentStep} nga 2: {currentStep === 1 ? 'Të dhënat personale' : 'Simptomat'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                style={styles.stepContent}
              >
                <h3 style={styles.sectionTitle}>📋 Të dhënat personale</h3>
                
                {/* Mosha */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    Mosha <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    value={patientData.mosha || ''}
                    onChange={(e) => setPatientData({
                      ...patientData, 
                      mosha: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    max="130"
                    style={styles.input}
                    placeholder="P.sh. 35"
                  />
                  {validationErrors.mosha && (
                    <span style={styles.error}>{validationErrors.mosha}</span>
                  )}
                </div>

                {/* Gjinia */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Gjinia</label>
                  <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={patientData.gjinia === 'M'}
                        onChange={() => setPatientData({...patientData, gjinia: 'M'})}
                        style={styles.radio}
                      />
                      Mashkull
                    </label>
                    <label style={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={patientData.gjinia === 'F'}
                        onChange={() => setPatientData({...patientData, gjinia: 'F'})}
                        style={styles.radio}
                      />
                      Femër
                    </label>
                  </div>
                </div>

                {/* Historiku mjekësor */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Historiku mjekësor</label>
                  <input
                    type="text"
                    value={patientData.historikuMjekesor?.join(', ') || ''}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      historikuMjekesor: e.target.value.split(',').map(s => s.trim())
                    })}
                    style={styles.input}
                    placeholder="Diabet, tension, astmë..."
                  />
                </div>

                {/* Alergji */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Alergji</label>
                  <input
                    type="text"
                    value={patientData.alergji?.join(', ') || ''}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      alergji: e.target.value.split(',').map(s => s.trim())
                    })}
                    style={styles.input}
                    placeholder="Penisilinë, ushqime, polen..."
                  />
                </div>

                {/* Butoni Next */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  style={styles.nextButton}
                >
                  Vazhdo →
                </button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                style={styles.stepContent}
              >
                <h3 style={styles.sectionTitle}>🩺 Përshkruani simptomat</h3>
                
                <div style={styles.textareaWrapper}>
                  <textarea
                    value={patientData.simptomat}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= maxChars) {
                        setPatientData({...patientData, simptomat: value})
                        setCharCount(value.length)
                      }
                    }}
                    placeholder="Përshkruani në detaje simptomat tuaja. P.sh.: 
- Kur filluan?
- Sa intensitet kanë?
- Çfarë i përkeqëson?
- Çfarë i përmirëson?
- A keni temperaturë?
- A keni marrë ndonjë medikament?"
                    style={styles.textarea}
                    rows={8}
                  />
                  <div style={styles.charCounter}>
                    {charCount}/{maxChars}
                  </div>
                </div>

                {validationErrors.simptomat && (
                  <span style={styles.error}>{validationErrors.simptomat}</span>
                )}

                {/* Vital Signs */}
                <div style={styles.vitalSigns}>
                  <h4 style={styles.subtitle}>🩺 Shenjat vitale (opsionale)</h4>
                  
                  <div style={styles.vitalGrid}>
                    <input
                      type="number"
                      placeholder="Temperatura °C"
                      onChange={(e) => setPatientData({
                        ...patientData,
                        temperatura: parseFloat(e.target.value)
                      })}
                      style={styles.vitalInput}
                      step="0.1"
                    />
                    <input
                      type="text"
                      placeholder="Presioni i gjakut"
                      onChange={(e) => setPatientData({
                        ...patientData,
                        presioniGjakut: e.target.value
                      })}
                      style={styles.vitalInput}
                    />
                  </div>
                </div>

                {/* Butonat e navigimit */}
                <div style={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={styles.backButton}
                  >
                    ← Kthehu
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading || isSaving}
                    style={{
                      ...styles.submitButton,
                      opacity: (isLoading || isSaving) ? 0.6 : 1,
                      cursor: (isLoading || isSaving) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {(isLoading || isSaving) ? (
                      <>
                        <div style={styles.spinner} />
                        Duke analizuar...
                      </>
                    ) : (
                      '🔬 Analizo me AGIXmed'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Footer me informacion ligjor */}
        <div style={styles.footer}>
          <p style={styles.disclaimer}>
            ⚕️ AGIXmed përdor të dhëna reale mjekësore dhe AI të avancuar. 
            Gjithmonë konsultohuni me mjekun tuaj për diagnozë definitive.
          </p>
          <p style={styles.copyright}>
            © 2024 AGIXmed nga Ledjan Ahmati. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </motion.div>
    </>
  )
}

// Styles industrial
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    borderRadius: '24px',
    padding: '32px',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  header: {
    marginBottom: '32px'
  },
  logoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#22c55e',
    letterSpacing: '-0.5px'
  },
  version: {
    fontSize: '12px',
    color: '#64748b',
    background: 'rgba(255,255,255,0.1)',
    padding: '4px 8px',
    borderRadius: '20px'
  },
  progressContainer: {
    marginBottom: '16px'
  },
  progressSteps: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  step: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  stepLine: {
    width: '60px',
    height: '2px',
    background: 'rgba(255,255,255,0.1)'
  },
  stepText: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    fontSize: '14px'
  },
  form: {
    marginBottom: '24px'
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#f1f5f9',
    marginBottom: '16px',
    fontWeight: 600
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px'
  },
  label: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: 500
  },
  required: {
    color: '#ef4444'
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  radioGroup: {
    display: 'flex',
    gap: '24px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#cbd5e1',
    cursor: 'pointer'
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#22c55e'
  },
  textareaWrapper: {
    position: 'relative' as const
  },
  textarea: {
    width: '100%',
    padding: '16px',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '15px',
    lineHeight: '1.6',
    resize: 'vertical' as const,
    outline: 'none'
  },
  charCounter: {
    position: 'absolute' as const,
    bottom: '8px',
    right: '12px',
    fontSize: '12px',
    color: '#64748b'
  },
  vitalSigns: {
    background: 'rgba(0,0,0,0.2)',
    padding: '16px',
    borderRadius: '12px'
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: '16px',
    marginBottom: '12px'
  },
  vitalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  vitalInput: {
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  nextButton: {
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '16px'
  },
  backButton: {
    flex: 1,
    background: 'transparent',
    border: '1px solid #475569',
    color: '#cbd5e1',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  submitButton: {
    flex: 2,
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '4px'
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center' as const
  },
  disclaimer: {
    color: '#94a3b8',
    fontSize: '13px',
    lineHeight: '1.5',
    marginBottom: '8px'
  },
  copyright: {
    color: '#64748b',
    fontSize: '12px'
  }
}

export default AGIXForm