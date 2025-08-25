/**
 * EuroWeb Ultra - Central Module Controller
 * Kontrollon të gjitha modulet nga një vend i vetëm
 * Memory optimized - nuk krijon tab të veçanta
 */

'use client'

import { useState } from 'react'

interface ModuleState {
  [key: string]: boolean
}

const MODULES = [
  'agixmed',
  'lora-gateway',
  'agi-dashboard',
  'utt-bridge',
  'blockchain',
  'neural-search',
  'eco-system',
  'bio-nature',
  'office-suite'
]

export default function ModuleController() {
  const [modules, setModules] = useState<ModuleState>(() => {
    // Të gjitha modulet janë OFF në fillim për të kursyer memory
    return MODULES.reduce((acc, module) => {
      acc[module] = false
      return acc
    }, {} as ModuleState)
  })

  const toggleModule = (moduleName: string) => {
    setModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }))
  }

  const toggleAll = (state: boolean) => {
    setModules(prev => {
      const newState = { ...prev }
      MODULES.forEach(module => {
        newState[module] = state
      })
      return newState
    })
  }

  const activeCount = Object.values(modules).filter(Boolean).length

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-md">
      <h3 className="text-xl font-bold mb-4">🎛️ Module Controller</h3>

      {/* Master Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => toggleAll(true)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
        >
          ALL ON
        </button>
        <button
          onClick={() => toggleAll(false)}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
        >
          ALL OFF
        </button>
        <span className="text-sm text-gray-400 flex items-center">
          Active: {activeCount}/{MODULES.length}
        </span>
      </div>

      {/* Individual Module Controls */}
      <div className="space-y-2">
        {MODULES.map(module => (
          <div key={module} className="flex items-center justify-between">
            <span className="text-sm capitalize">
              {module.replace('-', ' ')}
            </span>
            <button
              onClick={() => toggleModule(module)}
              className={`w-12 h-6 rounded-full transition-colors ${modules[module]
                  ? 'bg-green-500'
                  : 'bg-gray-600'
                }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${modules[module]
                  ? 'translate-x-6'
                  : 'translate-x-1'
                }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Memory Usage Warning */}
      {activeCount > 3 && (
        <div className="mt-4 p-2 bg-yellow-800 text-yellow-200 rounded text-xs">
          ⚠️ {activeCount} module aktive - mund të konsumojnë shumë memory
        </div>
      )}
    </div>
  )
}
