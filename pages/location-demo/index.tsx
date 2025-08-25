/**
 * Location Demo Page
 * EuroWeb Platform v9.0.1
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @license MIT
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function LocationDemoPage() {
  const [selectedLocation, setSelectedLocation] = useState('tirana')

  const locations = {
    tirana: { name: 'Tirana, Albania', lat: 41.3275, lng: 19.8187, temp: 22 },
    pristina: { name: 'Pristina, Kosovo', lat: 42.6629, lng: 21.1655, temp: 19 },
    skopje: { name: 'Skopje, N. Macedonia', lat: 42.0, lng: 21.4335, temp: 21 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-8 flex items-center gap-3"
        >
          📍 Location Intelligence Demo
          <span className="text-green-400 text-2xl">v9.0.1</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-4">🗺️ Location Selector</h3>
            <div className="space-y-3">
              {Object.entries(locations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedLocation === key
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {location.name}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4">📊 Location Data</h3>
            {selectedLocation && (
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400">Name</label>
                  <p className="text-white font-semibold">{locations[selectedLocation as keyof typeof locations].name}</p>
                </div>
                <div>
                  <label className="text-slate-400">Coordinates</label>
                  <p className="text-white">
                    {locations[selectedLocation as keyof typeof locations].lat}°, {locations[selectedLocation as keyof typeof locations].lng}°
                  </p>
                </div>
                <div>
                  <label className="text-slate-400">Temperature</label>
                  <p className="text-white text-2xl font-bold">
                    {locations[selectedLocation as keyof typeof locations].temp}°C
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-slate-800 p-6 rounded-xl border border-slate-700"
        >
          <h3 className="text-xl font-semibold text-purple-400 mb-4">🎯 Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-3xl mb-2">🌍</div>
              <p className="text-white font-semibold">Real-time Location</p>
              <p className="text-slate-400 text-sm">GPS coordinates</p>
            </div>
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-3xl mb-2">🌡️</div>
              <p className="text-white font-semibold">Weather Data</p>
              <p className="text-slate-400 text-sm">Live temperature</p>
            </div>
            <div className="text-center p-4 bg-slate-700 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <p className="text-white font-semibold">Mobile Ready</p>
              <p className="text-slate-400 text-sm">Responsive design</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export { LocationDemoPage }
