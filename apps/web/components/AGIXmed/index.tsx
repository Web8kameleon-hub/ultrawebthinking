/**
 * AGIXmed Main Application
 * Complete Medical AI Platform with User Authentication
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.0 PRODUCTION
 * @license Commercial
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { UserProvider, useUser } from './UserContext'
import { LoginForm } from './LoginForm'
import { UserDashboard } from './UserDashboard'
import { AGIXForm, PatientData } from './AGIXForm'
import { AGIXResults } from './AGIXResults'

// Main AGIXmed Application Component
const AGIXmedApp: React.FC = () => {
  const { isAuthenticated, isLoading, addConsultation } = useUser()
  const [view, setView] = useState<'dashboard' | 'consultation' | 'results'>('dashboard')
  const [analysisResult, setAnalysisResult] = useState<{
    symptoms: string
    confidence: number
    recommendations: string[]
    possibleConditions: Array<{ name: string; probability: number }>
    timestamp: string
    agixmedVersion: string
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Show loading spinner during auth check
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#22c55e'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(34, 197, 94, 0.3)',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setView('dashboard')} />
  }

  // Handle form submission
  const handleAnalysis = async (data: PatientData) => {
    setIsAnalyzing(true)

    try {
      // Simulate AI analysis (replace with real API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate AI-based analysis result
      const result = {
        symptoms: data.simptomat,
        confidence: 0.85 + Math.random() * 0.12,
        recommendations: generateRecommendations(data),
        possibleConditions: generateConditions(data),
        timestamp: new Date().toISOString(),
        agixmedVersion: '9.0.0'
      }

      setAnalysisResult(result)

      // Save consultation to user history
      await addConsultation({
        simptomat: data.simptomat,
        diagnozePropozuar: result.possibleConditions.map(c => c.name),
        rekomandime: result.recommendations,
        besueshmeria: result.confidence,
        vitals: {
          temperatura: data.temperatura,
          presioniGjakut: data.presioniGjakut
        },
        statusi: 'pending'
      })

      setView('results')
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Generate recommendations based on symptoms
  function generateRecommendations(data: PatientData): string[] {
    const recommendations: string[] = []
    const symptoms = data.simptomat.toLowerCase()

    if (symptoms.includes('dhimbje') || symptoms.includes('pain')) {
      recommendations.push('Pushoni dhe shmangni aktivitete të rënda fizike')
      recommendations.push('Merrni ilaçe kundër dhimbjes nëse është e nevojshme (pa recetë)')
    }

    if (symptoms.includes('temperatur') || symptoms.includes('ethe')) {
      recommendations.push('Pini shumë lëngje për të shmangur dehidratimin')
      recommendations.push('Monitoroni temperaturën çdo 4 orë')
      recommendations.push('Konsultohuni me mjekun nëse temperatura kalon 39°C')
    }

    if (symptoms.includes('kollë') || symptoms.includes('koll')) {
      recommendations.push('Pini çaj të ngrohtë me mjaltë')
      recommendations.push('Shmangni ajrin e ftohtë')
    }

    if (symptoms.includes('bark') || symptoms.includes('stomak')) {
      recommendations.push('Hani ushqime të lehta dhe të shëndetshme')
      recommendations.push('Shmangni ushqimet e yndyrshme dhe pikante')
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('Pushoni dhe merrni kohë për të rikuperuar')
      recommendations.push('Pini të paktën 2 litra ujë në ditë')
      recommendations.push('Monitoroni simptomat dhe njoftoni mjekun nëse përkeqësohen')
    }

    recommendations.push('Konsultohuni me mjekun tuaj për diagnozë të saktë')
    
    return recommendations
  }

  // Generate possible conditions based on symptoms
  function generateConditions(data: PatientData): Array<{ name: string; probability: number }> {
    const conditions: Array<{ name: string; probability: number }> = []
    const symptoms = data.simptomat.toLowerCase()

    if (symptoms.includes('dhimbje koke') || symptoms.includes('kokë')) {
      conditions.push({ name: 'Migrenë', probability: 0.65 })
      conditions.push({ name: 'Tension kokë', probability: 0.55 })
    }

    if (symptoms.includes('temperatur') || symptoms.includes('ethe')) {
      conditions.push({ name: 'Infeksion viral', probability: 0.70 })
      conditions.push({ name: 'Grip sezonal', probability: 0.60 })
    }

    if (symptoms.includes('kollë')) {
      conditions.push({ name: 'Bronkit akut', probability: 0.55 })
      conditions.push({ name: 'Infeksion i rrugëve të frymëmarrjes', probability: 0.65 })
    }

    if (symptoms.includes('bark') || symptoms.includes('stomak')) {
      conditions.push({ name: 'Gastrit', probability: 0.50 })
      conditions.push({ name: 'Indigjestion', probability: 0.60 })
    }

    if (symptoms.includes('lodhje') || symptoms.includes('dobësi')) {
      conditions.push({ name: 'Anemi', probability: 0.40 })
      conditions.push({ name: 'Mungesë vitaminash', probability: 0.55 })
    }

    // If no specific conditions matched
    if (conditions.length === 0) {
      conditions.push({ name: 'Gjendje e përgjithshme jo-specifike', probability: 0.45 })
      conditions.push({ name: 'Stres ose lodhje', probability: 0.50 })
    }

    // Sort by probability
    return conditions.sort((a, b) => b.probability - a.probability).slice(0, 4)
  }

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UserDashboard onStartNewConsultation={() => setView('consultation')} />
          </motion.div>
        )}

        {view === 'consultation' && (
          <motion.div
            key="consultation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Back button */}
            <button
              onClick={() => setView('dashboard')}
              style={{
                marginBottom: '16px',
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Kthehu te paneli
            </button>

            <AGIXForm 
              onSubmit={handleAnalysis} 
              isLoading={isAnalyzing}
            />
          </motion.div>
        )}

        {view === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AGIXResults 
              result={analysisResult} 
              onNewAnalysis={() => {
                setAnalysisResult(null)
                setView('dashboard')
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Wrapper with UserProvider
export const AGIXmedComplete: React.FC = () => {
  return (
    <UserProvider>
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
      <AGIXmedApp />
    </UserProvider>
  )
}

export default AGIXmedComplete
