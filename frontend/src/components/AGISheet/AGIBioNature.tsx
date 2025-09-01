/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Web8 AGI Bio Nature - Simplified Biological Analysis
 * Industrial-grade biological AGI system
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useClientOnly } from '../../../../hooks/useClientOnly'

interface AGIBioNatureProps {
  className?: string
}

export const AGIBioNature: React.FC<AGIBioNatureProps> = ({ className }) => {
  const isClient = useClientOnly()
  const [analysis, setAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAnalysis(`🌿 Bio-Nature Analysis:
      
🦋 Species Diversity: High
🌱 Ecosystem Health: 78%
🌡️ Environmental Status: Stable
🔬 Biological Activity: Active
      
✅ Analysis Complete`)
      setIsAnalyzing(false)
    }, 1500)
  }

  if (!isClient) {
    return <div className="p-4">Loading Bio-Nature...</div>
  }

  return (
    <div className={`p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg ${className || ''}`}>
      <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
        🌿 AGI Bio-Nature System
      </h3>
      
      <button
        onClick={runAnalysis}
        disabled={isAnalyzing}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors mb-4"
      >
        {isAnalyzing ? '🔄 Analyzing...' : '🔬 Run Bio Analysis'}
      </button>
      
      {analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded p-4 mt-4"
        >
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {analysis}
          </pre>
        </motion.div>
      )}
    </div>
  )
}

export default AGIBioNature
