/**
 * AGI Medical Form Component
 * Medical AI Analysis Input Form
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client'

import { motion } from 'framer-motion'
import React, { useState } from 'react'

export type AGIFormProps = {
  onSubmitAction: (input: string) => void
  isLoading?: boolean
}

export const AGIForm: React.FC<AGIFormProps> = ({ onSubmitAction, isLoading = false }) => {
  const [input, setInput] = useState('')
  const [charCount, setCharCount] = useState(0)
  const maxChars = 500

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSubmitAction(input.trim())
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
      className="w-full max-w-4xl mx-auto mb-8 bg-white bg-opacity-95 border border-blue-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center gap-3">
          🔬 Medical AI Analysis
        </h2>
        <p className="text-gray-600">
          Describe symptoms or medical conditions for AI-powered analysis and recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter symptoms, medical history, or questions for AI analysis..."
            disabled={isLoading}
            className="w-full h-32 p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {charCount}/{maxChars}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            💡 AI will analyze medical patterns and provide evidence-based insights
          </div>
          
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <span>🚀</span>
                Analyze with AI
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}
