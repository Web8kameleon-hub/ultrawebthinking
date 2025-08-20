/**
 * AGI Medical Results Component
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
  result: AGIMedResult | null
  onNewAnalysisAction: () => void
}

export const AGIResults: React.FC<AGIResultsProps> = ({ result, onNewAnalysisAction }) => {
  if (!result) {
    return (
      <div className="text-center py-16 px-5 text-slate-400">
        <div className="text-6xl mb-6">🏥</div>
        <h3 className="text-2xl font-semibold mb-3 text-green-500">
          AGI Medical Ready for Analysis
        </h3>
        <p className="text-base">
          Use the form above to start medical AI analysis
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header with confidence score */}
      <div className="bg-white bg-opacity-95 border border-green-200 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-600 flex items-center gap-3">
            🎯 Analysis Results
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Confidence</div>
              <div className="text-xl font-bold text-green-600">
                {(result.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Analyzed Symptoms:</h3>
          <p className="text-gray-700 leading-relaxed">{result.symptoms}</p>
        </div>
      </div>

      {/* Possible Conditions */}
      <div className="bg-white bg-opacity-95 border border-orange-200 rounded-2xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-3">
          🔍 Possible Conditions
        </h3>
        <div className="space-y-3">
          {result.possibleConditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-orange-50 border border-orange-300 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-orange-800">
                  {condition.name}
                </h4>
                <span className="text-sm font-bold text-orange-600">
                  {(condition.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${condition.probability * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white bg-opacity-95 border border-blue-200 rounded-2xl p-6 mb-6 shadow-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-3">
          💡 AI Recommendations
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 leading-relaxed flex-1">
                {recommendation}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analysis Info and Actions */}
      <div className="bg-white bg-opacity-95 border border-gray-200 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <div>Analysis completed: {new Date(result.timestamp).toLocaleString()}</div>
            <div>AGI Version: {result.agiVersion}</div>
          </div>
          
          <motion.button
            onClick={onNewAnalysisAction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <span>🔄</span>
            New Analysis
          </motion.button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mt-6">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div className="text-sm text-yellow-800">
            <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export type { AGIMedResult, AGIResultsProps }
