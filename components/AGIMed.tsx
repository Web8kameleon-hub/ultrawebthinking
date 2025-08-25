/**
 * AGIMed - Complete Medical AI Analysis System
 * EuroWeb Ultra Platform
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.1.0 Ultra Medical System
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { AGIForm } from './AGIMed/AGIForm'
import { AGIResults } from './AGIMed/AGIResults'

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

export const AGIMed: React.FC = () => {
    const [result, setResult] = useState<AGIMedResult | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleAnalyzeSymptoms = async (symptoms: string) => {
        setIsLoading(true)

        // Simulate AGI Medical Analysis
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock medical analysis result
        const mockResult: AGIMedResult = {
            symptoms,
            confidence: Math.round(85 + Math.random() * 10),
            recommendations: [
                "Consult with a healthcare professional immediately",
                "Monitor symptoms for the next 24-48 hours",
                "Stay hydrated and get adequate rest",
                "Avoid strenuous physical activity"
            ],
            possibleConditions: [
                { name: "Viral Upper Respiratory Infection", probability: 78 },
                { name: "Allergic Rhinitis", probability: 45 },
                { name: "Bacterial Sinusitis", probability: 32 }
            ],
            timestamp: new Date().toISOString(),
            agiVersion: "AGIMed v9.1.0 Ultra"
        }

        setResult(mockResult)
        setIsLoading(false)
    }

    const handleNewAnalysis = () => {
        setResult(null)
    }

    return (
        <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            color: '#e2e8f0',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    textAlign: 'center',
                    marginBottom: '32px'
                }}
            >
                <h1 style={{
                    fontSize: '42px',
                    fontWeight: 800,
                    margin: '0 0 16px 0',
                    background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                }}>
                    🏥 AGIMed Ultra
                </h1>
                <p style={{
                    fontSize: '20px',
                    color: '#94a3b8',
                    margin: '0 0 8px 0'
                }}>
                    Advanced AI Medical Analysis System
                </p>
                <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                }}>
                    Powered by EuroWeb Platform | Medical-Grade Intelligence
                </p>
            </motion.div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {!result ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AGIForm
                            onSubmitAction={handleAnalyzeSymptoms}
                            isLoading={isLoading}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AGIResults
                            result={result}
                            onNewAnalysisAction={handleNewAnalysis}
                        />
                    </motion.div>
                )}
            </div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                    marginTop: '48px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    maxWidth: '1200px',
                    margin: '48px auto 0'
                }}
            >
                <div style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid #06b6d4',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>🧠</div>
                    <h3 style={{ color: '#06b6d4', fontSize: '18px', margin: '0 0 8px 0' }}>
                        AI-Powered Analysis
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                        Advanced machine learning algorithms analyze symptoms and provide medical insights with high accuracy.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid #3b82f6',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔬</div>
                    <h3 style={{ color: '#3b82f6', fontSize: '18px', margin: '0 0 8px 0' }}>
                        Medical Database
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                        Access to comprehensive medical knowledge base with real-time updates from global health institutions.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>🛡️</div>
                    <h3 style={{ color: '#10b981', fontSize: '18px', margin: '0 0 8px 0' }}>
                        Privacy Protected
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                        All data is processed securely with military-grade encryption. No personal information is stored.
                    </p>
                </div>

                <div style={{
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid #7c3aed',
                    borderRadius: '12px',
                    padding: '24px'
                }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚡</div>
                    <h3 style={{ color: '#7c3aed', fontSize: '18px', margin: '0 0 8px 0' }}>
                        Real-Time Results
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                        Get instant medical analysis and recommendations powered by cutting-edge AI technology.
                    </p>
                </div>
            </motion.div>

            {/* Disclaimer */}
            <div style={{
                marginTop: '48px',
                padding: '20px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                textAlign: 'center',
                maxWidth: '800px',
                margin: '48px auto 0'
            }}>
                <p style={{
                    color: '#fca5a5',
                    fontSize: '14px',
                    margin: 0,
                    fontWeight: 600
                }}>
                    ⚠️ Medical Disclaimer: This tool is for informational purposes only and should not replace professional medical advice.
                    Always consult with qualified healthcare professionals for medical concerns.
                </p>
            </div>
        </div>
    )
}

export default AGIMed
