/**
 * 🧪 Live AGI Testing Dashboard - Real-time Neural Response Testing
 * Interactive testing interface for neural engine validation
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-LIVE-TESTING
 * @contact dealsjona@gmail.com
 */

"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { pureNeuralEngine, type PureNeuralContext } from '../../lib/pure-neural-engine'

interface TestResult {
  input: string
  output: string
  language: 'sq' | 'en'
  mood: string
  hasTemplate: boolean
  creativity: number
  timestamp: number
}

export default function LiveTestingDashboard() {
  const [testInput, setTestInput] = useState('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [autoTest, setAutoTest] = useState(false)

  const predefinedTests = [
    // Albanian Tests
    "gati për revolucion!",
    "si mund të ndërtoj AI?", 
    "dua të krijoj diçka të re",
    "jam i lodhur por excited",
    "çfarë mendoni për AGI?",
    
    // English Tests
    "ready for something amazing!",
    "how can I build neural networks?",
    "I want to create something innovative",
    "tired but excited about tech",
    "what do you think about AGI?"
  ]

  const runSingleTest = async (input: string) => {
    setIsRunning(true)
    
    // Detect language
    const language = /[çëqxzÇËQXZ]/.test(input) ? 'sq' : 'en'
    
    // Determine mood
    let mood: 'excited' | 'curious' | 'helpful' | 'creative' = 'helpful'
    if (/gati|ready|revolucion|amazing/.test(input.toLowerCase())) {
      mood = 'excited'
    } else if (/\?|çfarë|si|what|how/.test(input.toLowerCase())) {
      mood = 'curious'
    } else if (/krijim|build|create|projekt/.test(input.toLowerCase())) {
      mood = 'creative'
    }
    
    const context: PureNeuralContext = {
      message: input,
      language,
      mood,
      history: []
    }
    
    // Get neural response
    const response = pureNeuralEngine.generateResponse(context)
    
    // Analyze response
    const hasTemplate = /I understand|interesting|how would you like|let me think/i.test(response)
    const creativity = calculateCreativity(response)
    
    const result: TestResult = {
      input,
      output: response,
      language,
      mood,
      hasTemplate,
      creativity,
      timestamp: Date.now()
    }
    
    setTestResults(prev => [result, ...prev.slice(0, 19)]) // Keep last 20
    setIsRunning(false)
    
    return result
  }

  const calculateCreativity = (response: string): number => {
    let score = 50 // Base score
    
    // Check for emojis (creativity indicator)
    const emojiCount = (response.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
    score += emojiCount * 5
    
    // Check for exclamation marks (enthusiasm)
    const exclamationCount = (response.match(/!/g) || []).length
    score += exclamationCount * 3
    
    // Check for unique words
    const uniqueWords = ['revolucion', 'fantastik', 'revolucionare', 'extraordinary', 'revolutionary']
    const uniqueWordCount = uniqueWords.filter(word => response.toLowerCase().includes(word)).length
    score += uniqueWordCount * 10
    
    // Penalty for template words
    const templateWords = ['understand', 'interesting', 'continue', 'help you with']
    const templateCount = templateWords.filter(word => response.toLowerCase().includes(word)).length
    score -= templateCount * 20
    
    return Math.max(0, Math.min(100, score))
  }

  const runAllTests = async () => {
    setTestResults([])
    for (const test of predefinedTests) {
      await runSingleTest(test)
      await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
    }
  }

  const runAutoTests = async () => {
    if (!autoTest) return
    
    const randomTest = predefinedTests[Math.floor(Math.random() * predefinedTests.length)]
    await runSingleTest(randomTest)
  }

  useEffect(() => {
    if (!autoTest) return
    
    const interval = setInterval(runAutoTests, 3000)
    return () => clearInterval(interval)
  }, [autoTest])

  const averageCreativity = testResults.length > 0 
    ? testResults.reduce((sum, result) => sum + result.creativity, 0) / testResults.length 
    : 0

  const templateCount = testResults.filter(result => result.hasTemplate).length
  const successRate = testResults.length > 0 
    ? ((testResults.length - templateCount) / testResults.length) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-8 py-6 max-w-[1920px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🧪 Live Neural Testing Dashboard
          </h1>
          <p className="text-xl xl:text-2xl text-gray-300">
            Real-time validation of template-free AI responses
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 xl:p-8 shadow-xl"
          >
            <div className="text-3xl xl:text-4xl font-bold text-green-400 mb-3">
              {successRate.toFixed(1)}%
            </div>
            <div className="text-base xl:text-lg text-gray-300">Template-Free Rate</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 xl:p-8 shadow-xl"
          >
            <div className="text-3xl xl:text-4xl font-bold text-purple-400 mb-3">
              {averageCreativity.toFixed(1)}
            </div>
            <div className="text-base xl:text-lg text-gray-300">Avg Creativity Score</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${averageCreativity}%` }}
              ></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 xl:p-8 shadow-xl"
          >
            <div className="text-3xl xl:text-4xl font-bold text-blue-400 mb-3">
              {testResults.length}
            </div>
            <div className="text-base xl:text-lg text-gray-300">Tests Completed</div>
            <div className="text-sm text-gray-400 mt-1">
              {testResults.filter(r => r.language === 'sq').length} Albanian / {testResults.filter(r => r.language === 'en').length} English
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 xl:p-8 shadow-xl"
          >
            <div className="text-3xl xl:text-4xl font-bold text-red-400 mb-3">
              {templateCount}
            </div>
            <div className="text-base xl:text-lg text-gray-300">Templates Detected</div>
            <div className="text-sm text-gray-400 mt-1">
              {templateCount > 0 ? `${((templateCount/testResults.length)*100).toFixed(1)}% failure rate` : 'Perfect performance'}
            </div>
          </motion.div>
        </div>

        {/* Test Controls */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Test Controls</h3>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter test message (Albanian or English)..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && testInput.trim() && runSingleTest(testInput)}
            />
            
            <button
              onClick={() => testInput.trim() && runSingleTest(testInput)}
              disabled={isRunning || !testInput.trim()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              {isRunning ? 'Testing...' : 'Run Test'}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              Run All Tests
            </button>
            
            <button
              onClick={() => setAutoTest(!autoTest)}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                autoTest 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {autoTest ? 'Stop Auto-Test' : 'Start Auto-Test'}
            </button>

            <button
              onClick={() => setTestResults([])}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
          
          {testResults.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No tests run yet. Try running a test above!
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <motion.div
                  key={result.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${
                    result.hasTemplate 
                      ? 'bg-red-500/20 border-red-500/30' 
                      : 'bg-green-500/20 border-green-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-300">
                        {result.language.toUpperCase()} | {result.mood}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.hasTemplate 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {result.hasTemplate ? 'TEMPLATE' : 'CREATIVE'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Score: {result.creativity}/100
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-2">
                    <strong>Input:</strong> {result.input}
                  </div>
                  
                  <div className="text-sm text-white">
                    <strong>Output:</strong> {result.output}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
