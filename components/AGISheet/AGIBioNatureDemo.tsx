/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Web8 AGI Bio Nature Demo - Biological & Environmental Analysis
 * Industrial-grade biological AGI with nature conservation focus
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { useClientOnly } from '../../hooks/useClientOnly'
import styles from './AGIBioNatureDemo.module.css'

const bioVariants = cva(styles.bioDemo, {
  variants: {
    theme: {
      nature: "from-green-50 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900",
      forest: "from-green-100 via-lime-50 to-green-100 dark:from-green-800 dark:via-lime-900 dark:to-green-800",
      ocean: "from-blue-50 via-cyan-50 to-blue-100 dark:from-blue-900 dark:via-cyan-900 dark:to-blue-900",
      earth: "from-yellow-50 via-orange-50 to-red-100 dark:from-yellow-900 dark:via-orange-900 dark:to-red-900"
    },
    size: {
      compact: "p-4",
      standard: "p-6",
      expanded: "p-8"
    }
  },
  defaultVariants: {
    theme: "nature",
    size: "standard"
  }
})

interface BiologicalData {
  species: string
  habitat: string
  conservationStatus: 'Least Concern' | 'Near Threatened' | 'Vulnerable' | 'Endangered' | 'Critically Endangered'
  population: number
  threats: string[]
  recommendations: string[]
  ecosystemHealth: number
  biodiversityIndex: number
}

interface AGIBioNatureDemoProps {
  theme?: 'nature' | 'forest' | 'ocean' | 'earth'
  size?: 'compact' | 'standard' | 'expanded'
  realTimeMode?: boolean
  className?: string
}

export const AGIBioNatureDemo: React.FC<AGIBioNatureDemoProps> = ({
  theme = 'nature',
  size = 'standard',
  realTimeMode = false,
  className
}) => {
  const isClient = useClientOnly()
  const [currentData, setCurrentData] = useState<BiologicalData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string>('')
  const [mode, setMode] = useState<'monitor' | 'analyze' | 'conservation'>('monitor')

  // Sample biological data
  const speciesDatabase = [
    {
      species: "Panthera leo (African Lion)",
      habitat: "African Savanna",
      conservationStatus: 'Vulnerable' as const,
      population: 23000,
      threats: ["Habitat loss", "Human-wildlife conflict", "Poaching"],
      recommendations: ["Protected area expansion", "Community engagement", "Anti-poaching measures"],
      ecosystemHealth: 72,
      biodiversityIndex: 8.4
    },
    {
      species: "Ailuropoda melanoleuca (Giant Panda)",
      habitat: "Bamboo forests of China",
      conservationStatus: 'Vulnerable' as const,
      population: 1864,
      threats: ["Habitat fragmentation", "Climate change", "Low reproduction rate"],
      recommendations: ["Habitat corridors", "Breeding programs", "Climate adaptation"],
      ecosystemHealth: 68,
      biodiversityIndex: 7.2
    },
    {
      species: "Balaenoptera musculus (Blue Whale)",
      habitat: "Global ocean systems",
      conservationStatus: 'Endangered' as const,
      population: 15000,
      threats: ["Ship strikes", "Ocean noise", "Climate change"],
      recommendations: ["Shipping lane modifications", "Noise reduction", "Marine protected areas"],
      ecosystemHealth: 65,
      biodiversityIndex: 9.1
    }
  ]

  const generateRandomData = (): BiologicalData => {
    const randomSpecies = speciesDatabase[Math.floor(0.5 * speciesDatabase.length)]
    
    if (!randomSpecies) {
      // Fallback data if no species found
      return {
        species: 'Unknown Species',
        habitat: 'Unknown Habitat', 
        conservationStatus: 'Vulnerable' as const,
        threats: ['Data not available'],
        recommendations: ['Further research needed'],
        population: 1000,
        ecosystemHealth: 60,
        biodiversityIndex: 5
      }
    }
    
    return {
      ...randomSpecies,
      population: randomSpecies.population + Math.floor(0.5 * 1000 - 500),
      ecosystemHealth: 60 + Math.floor(0.5 * 30),
      biodiversityIndex: 5 + 0.5 * 5
    }
  }

  useEffect(() => {
    if (realTimeMode) {
      const interval = setInterval(() => {
        setCurrentData(generateRandomData())
      }, 8000)
      
      return () => clearInterval(interval)
    }
    return undefined
  }, [realTimeMode])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisResult('')

    // Simulate AI biological analysis
    setTimeout(() => {
      const analysis = `🌿 AGI Bio-Nature Analysis Complete:
      
🦎 Species Assessment: ${currentData?.species || 'Unknown Species'}
🏠 Habitat: ${currentData?.habitat || 'Unknown Habitat'}
⚠️ Conservation Status: ${currentData?.conservationStatus || 'Not Assessed'}
📊 Population Estimate: ${currentData?.population?.toLocaleString() || 'Unknown'}

🌍 Ecosystem Analysis:
• Health Index: ${currentData?.ecosystemHealth || 0}% 
• Biodiversity Score: ${currentData?.biodiversityIndex?.toFixed(1) || 0}/10
• Threat Level: ${currentData?.threats?.length || 0} identified threats
• Conservation Priority: ${currentData?.conservationStatus === 'Critically Endangered' ? 'URGENT' : 'Moderate'}

🛡️ AI Conservation Recommendations:
${currentData?.recommendations?.map(rec => `• ${rec}`).join('\n') || '• No recommendations available'}

🔬 Analysis Confidence: 91.3%
📅 Generated: ${new Date().toLocaleString()}
🌱 Next Assessment: ${new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}`

      setAnalysisResult(analysis)
      setIsAnalyzing(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Least Concern': return 'text-green-600 dark:text-green-400'
      case 'Near Threatened': return 'text-yellow-600 dark:text-yellow-400'
      case 'Vulnerable': return 'text-orange-600 dark:text-orange-400'
      case 'Endangered': return 'text-red-600 dark:text-red-400'
      case 'Critically Endangered': return 'text-red-800 dark:text-red-300 font-bold'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-500">Loading Bio-Nature AGI...</div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br ${bioVariants({ theme, size })} rounded-lg shadow-xl backdrop-blur-sm border border-green-200 dark:border-green-700 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          🌿 AGI Bio-Nature Demo
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('monitor')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === 'monitor' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            🦋 Monitor
          </button>
          
          <button
            onClick={() => setMode('analyze')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === 'analyze' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            🔬 Analyze
          </button>
          
          <button
            onClick={() => setMode('conservation')}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              mode === 'conservation' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            🛡️ Conserve
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'monitor' && (
        <div className="space-y-6">
          {currentData ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    🦎 Species Information
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Species:</span> {currentData.species}
                    </div>
                    <div>
                      <span className="font-medium">Habitat:</span> {currentData.habitat}
                    </div>
                    <div>
                      <span className="font-medium">Population:</span> {currentData.population.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 ${getStatusColor(currentData.conservationStatus)}`}>
                        {currentData.conservationStatus}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    🌍 Ecosystem Health
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Health Index</span>
                        <span>{currentData.ecosystemHealth}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${currentData.ecosystemHealth}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Biodiversity</span>
                        <span>{currentData.biodiversityIndex.toFixed(1)}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentData.biodiversityIndex / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">⚠️ Current Threats:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentData.threats.map((threat, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-xs"
                    >
                      {threat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No species data loaded</p>
              <button
                onClick={() => setCurrentData(generateRandomData())}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                🦋 Load Sample Species
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'analyze' && (
        <div className="space-y-6">
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !currentData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Ecosystem...</span>
                </span>
              ) : (
                '🔬 Run Bio-AI Analysis'
              )}
            </button>
          </div>

          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4"
            >
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {analysisResult}
              </pre>
            </motion.div>
          )}
        </div>
      )}

      {mode === 'conservation' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-6"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              Conservation Protocol Active
            </h3>
            
            {currentData && (
              <div className="space-y-4">
                <div className="text-emerald-700 dark:text-emerald-300">
                  <h4 className="font-semibold mb-2">🎯 Recommended Actions:</h4>
                  <div className="space-y-2">
                    {currentData.recommendations.map((rec, index) => (
                      <p key={index} className="text-sm">• {rec}</p>
                    ))}
                  </div>
                </div>
                
                <button className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  🌱 Initialize Conservation Plan
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Bar */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          {realTimeMode && (
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Tracking</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Species: {currentData ? '1' : '0'} loaded</span>
          <span>Bio-AGI: 🌿</span>
        </div>
      </div>
    </div>
  )
}

export default AGIBioNatureDemo

