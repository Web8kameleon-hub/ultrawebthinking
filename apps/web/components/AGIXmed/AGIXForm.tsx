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
import styles from './AGIXForm.module.css'

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
        className={styles.container}
      >
        {/* Header me Progress Bar */}
        <div className={styles.header}>
          <div className={styles.logoSection}>
            <span className={styles.logo}>🏥 AGIXmed</span>
            <span className={styles.version}>v9.0.0 PRODUCTION</span>
          </div>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressSteps}>
              <div className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : styles.stepInactive}`}>1</div>
              <div className={styles.stepLine} />
              <div className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : styles.stepInactive}`}>2</div>
            </div>
            <div className={styles.stepText}>
              Hapi {currentStep} nga 2: {currentStep === 1 ? 'Të dhënat personale' : 'Simptomat'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className={styles.stepContent}
              >
                <h3 className={styles.sectionTitle}>📋 Të dhënat personale</h3>
                
                {/* Mosha */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Mosha <span className={styles.required}>*</span>
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
                    className={styles.input}
                    placeholder="P.sh. 35"
                  />
                  {validationErrors.mosha && (
                    <span className={styles.error}>{validationErrors.mosha}</span>
                  )}
                </div>

                {/* Gjinia */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Gjinia</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={patientData.gjinia === 'M'}
                        onChange={() => setPatientData({...patientData, gjinia: 'M'})}
                        className={styles.radio}
                      />
                      Mashkull
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        checked={patientData.gjinia === 'F'}
                        onChange={() => setPatientData({...patientData, gjinia: 'F'})}
                        className={styles.radio}
                      />
                      Femër
                    </label>
                  </div>
                </div>

                {/* Historiku mjekësor */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Historiku mjekësor</label>
                  <input
                    type="text"
                    value={patientData.historikuMjekesor?.join(', ') || ''}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      historikuMjekesor: e.target.value.split(',').map(s => s.trim())
                    })}
                    className={styles.input}
                    placeholder="Diabet, tension, astmë..."
                  />
                </div>

                {/* Alergji */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Alergji</label>
                  <input
                    type="text"
                    value={patientData.alergji?.join(', ') || ''}
                    onChange={(e) => setPatientData({
                      ...patientData,
                      alergji: e.target.value.split(',').map(s => s.trim())
                    })}
                    className={styles.input}
                    placeholder="Penisilinë, ushqime, polen..."
                  />
                </div>

                {/* Butoni Next */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={styles.nextButton}
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
                className={styles.stepContent}
              >
                <h3 className={styles.sectionTitle}>🩺 Përshkruani simptomat</h3>
                
                <div className={styles.textareaWrapper}>
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
                    className={styles.textarea}
                    rows={8}
                  />
                  <div className={styles.charCounter}>
                    {charCount}/{maxChars}
                  </div>
                </div>

                {validationErrors.simptomat && (
                  <span className={styles.error}>{validationErrors.simptomat}</span>
                )}

                {/* Vital Signs */}
                <div className={styles.vitalSigns}>
                  <h4 className={styles.subtitle}>🩺 Shenjat vitale (opsionale)</h4>
                  
                  <div className={styles.vitalGrid}>
                    <input
                      type="number"
                      placeholder="Temperatura °C"
                      onChange={(e) => setPatientData({
                        ...patientData,
                        temperatura: parseFloat(e.target.value)
                      })}
                      className={styles.vitalInput}
                      step="0.1"
                    />
                    <input
                      type="text"
                      placeholder="Presioni i gjakut"
                      onChange={(e) => setPatientData({
                        ...patientData,
                        presioniGjakut: e.target.value
                      })}
                      className={styles.vitalInput}
                    />
                  </div>
                </div>

                {/* Butonat e navigimit */}
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={styles.backButton}
                  >
                    ← Kthehu
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading || isSaving}
                    className={`${styles.submitButton} ${(isLoading || isSaving) ? styles.submitDisabled : ''}`}
                  >
                    {(isLoading || isSaving) ? (
                      <>
                        <div className={styles.spinner} />
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
        <div className={styles.footer}>
          <p className={styles.disclaimer}>
            ⚕️ AGIXmed përdor të dhëna reale mjekësore dhe AI të avancuar. 
            Gjithmonë konsultohuni me mjekun tuaj për diagnozë definitive.
          </p>
          <p className={styles.copyright}>
            © 2024 AGIXmed nga Ledjan Ahmati. Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </motion.div>
    </>
  )
}

export default AGIXForm