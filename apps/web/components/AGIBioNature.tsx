/**
 * AGI Bio-Nature Intelligence Dashboard
 * EuroWeb Platform v9.0.1 - Environmental AI Module
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 9.0.1 Ultra
 * @license MIT
 * @created August 25, 2025
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BiomeData {
  id: string
  name: string
  temperature: number
  humidity: number
  biodiversity: number
  healthIndex: number
  species: string[]
  threats: string[]
  location: string
  icon: string
}

export const AGIBioNature: React.FC = () => {
  const [selectedBiome, setSelectedBiome] = useState('mediterranean')
  const [aiAnalysis, setAiAnalysis] = useState(false)
  const [loading, setLoading] = useState(false)

  const biomes: Record<string, BiomeData> = {
    mediterranean: {
      id: 'mediterranean',
      name: 'Mediterranean Basin',
      temperature: 22,
      humidity: 65,
      biodiversity: 87,
      healthIndex: 78,
      species: ['Oak Trees', 'Pine Forests', 'Wildflowers', 'Birds of Prey'],
      threats: ['Drought', 'Urbanization', 'Climate Change'],
      location: 'Southern Europe, Balkans',
      icon: '🌿'
    },
    alpine: {
      id: 'alpine',
      name: 'Alpine Regions',
      temperature: 8,
      humidity: 80,
      biodiversity: 72,
      healthIndex: 85,
      species: ['Mountain Pine', 'Alpine Flowers', 'Mountain Goats', 'Eagles'],
      threats: ['Global Warming', 'Tourism Impact', 'Pollution'],
      location: 'Mountain Ranges',
      icon: '🏔️'
    },
    coastal: {
      id: 'coastal',
      name: 'Coastal Ecosystems',
      temperature: 18,
      humidity: 85,
      biodiversity: 91,
      healthIndex: 70,
      species: ['Seagrass', 'Fish Species', 'Seabirds', 'Marine Mammals'],
      threats: ['Pollution', 'Overfishing', 'Sea Level Rise'],
      location: 'Adriatic & Mediterranean Coast',
      icon: '🌊'
    }
  }

  const runAiAnalysis = async () => {
    setLoading(true)
    setAiAnalysis(false)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setAiAnalysis(true)
    setLoading(false)
  }

  const currentBiome = biomes[selectedBiome]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
            🌱 AGI Bio-Nature Intelligence
            <span className="text-green-400 text-2xl">v9.0.1</span>
          </h1>
          <p className="text-green-200 text-lg">
            🤖 AI-powered ecosystem monitoring & biodiversity analysis
          </p>
        </motion.div>

        {/* Biome Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-green-800 p-4 rounded-xl border border-green-700">
            <label className="block text-green-300 font-semibold mb-3">🌍 Select Ecosystem</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(biomes).map((biome) => (
                <button
                  key={biome.id}
                  onClick={() => setSelectedBiome(biome.id)}
                  className={`p-3 rounded-lg transition-all flex items-center gap-2 ${
                    selectedBiome === biome.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-green-700 text-green-200 hover:bg-green-600'
                  }`}
                >
                  <span className="text-2xl">{biome.icon}</span>
                  <span className="font-semibold">{biome.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Current Biome Data */}
        <motion.div
          key={selectedBiome}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-green-800 p-6 rounded-xl border border-green-700">
            <h3 className="text-lg font-semibold text-green-300 mb-2">🌡️ Temperature</h3>
            <p className="text-3xl font-bold text-white">{currentBiome.temperature}°C</p>
            <p className="text-green-200 text-sm">Average annual</p>
          </div>

          <div className="bg-green-800 p-6 rounded-xl border border-green-700">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">💧 Humidity</h3>
            <p className="text-3xl font-bold text-white">{currentBiome.humidity}%</p>
            <div className="mt-2 h-2 bg-green-700 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${currentBiome.humidity}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-green-800 p-6 rounded-xl border border-green-700">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">🦋 Biodiversity</h3>
            <p className="text-3xl font-bold text-white">{currentBiome.biodiversity}%</p>
            <p className="text-green-200 text-sm">Species richness</p>
          </div>

          <div className="bg-green-800 p-6 rounded-xl border border-green-700">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">💚 Health Index</h3>
            <p className="text-3xl font-bold text-white">{currentBiome.healthIndex}%</p>
            <p className="text-green-200 text-sm">Ecosystem health</p>
          </div>
        </motion.div>

        {/* Species & Threats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-green-800 p-6 rounded-xl border border-green-700"
          >
            <h3 className="text-xl font-semibold text-green-300 mb-4">🦜 Key Species</h3>
            <div className="space-y-2">
              {currentBiome.species.map((species, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-700 rounded">
                  <span className="text-green-400">🌿</span>
                  <span className="text-white">{species}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-800 p-6 rounded-xl border border-red-700"
          >
            <h3 className="text-xl font-semibold text-red-300 mb-4">⚠️ Environmental Threats</h3>
            <div className="space-y-2">
              {currentBiome.threats.map((threat, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-700 rounded">
                  <span className="text-red-400">⚠️</span>
                  <span className="text-white">{threat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">🤖 AI Ecosystem Analysis</h3>
            <button
              onClick={runAiAnalysis}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? '🔄 Analyzing...' : '🚀 Run AI Analysis'}
            </button>
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-4xl mb-2"
                >
                  🧠
                </motion.div>
                <p className="text-green-400">AI is analyzing ecosystem data...</p>
              </motion.div>
            )}

            {aiAnalysis && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-700 p-4 rounded-lg"
              >
                <h4 className="font-semibold text-green-400 mb-2">🎯 AI Recommendations:</h4>
                <div className="space-y-2 text-slate-300">
                  <p>• Increase monitoring of temperature fluctuations</p>
                  <p>• Implement conservation measures for vulnerable species</p>
                  <p>• Establish protected corridors for wildlife migration</p>
                  <p>• Monitor water quality and pollution levels</p>
                  <p>• Develop sustainable tourism practices</p>
                </div>
                <div className="mt-4 p-3 bg-green-900 rounded">
                  <p className="text-green-300 text-sm">
                    ✅ <strong>Overall Assessment:</strong> Ecosystem shows moderate health with potential for improvement through targeted conservation efforts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-green-400"
        >
          <p>🌍 Protecting Balkan biodiversity through AI-powered environmental intelligence</p>
          <p className="text-sm mt-2 text-green-500">EuroWeb Platform v9.0.1 • © 2025 Ledjan Ahmati</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AGIBioNature
