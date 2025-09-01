/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-REAL-ONLY
 * @contact dealsjona@gmail.com
 * 
 * Web8 AGI Spreadsheet System - REAL-ONLY Component
 * Industrial-grade AGI spreadsheet with real-time neural processing
 * NO FAKE DATA - ALL VALUES MUST HAVE PROVENANCE
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { CellEngine } from './CellEngine'
import { AGISheetDemo } from './AGISheetDemo'
import { AGISpreadsheetEngine } from './AGISpreadsheetEngine'
import { useClientOnly } from '../../../../hooks/useClientOnly'
import styles from './AGISheet.module.css'

// REAL-ONLY Types
type Provenance = {
  source: string
  fetchedAt: string
  ttlSeconds: number
  responseTimeMs?: number
}

type RealData<T> = {
  data: T
  provenance: Provenance
}

type RealResult<T> = 
  | { ok: true; data: T & { provenance: Provenance } }
  | { ok: false; kind: "NO_DATA" | "MISSING_TOOL" | "ERROR"; message: string; fix?: string[] }

// AGI Client for real calls
async function agiCall<T>(kind: string, args: any): Promise<RealResult<T>> {
  try {
    const response = await fetch('/api/agi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, args })
    })
    return await response.json()
  } catch (error) {
    return {
      ok: false,
      kind: "ERROR",
      message: String(error),
      fix: ["Check API connection", "Verify AGI service"]
    }
  }
}

const sheetVariants = cva(styles.sheet, {
  variants: {
    theme: {
      royal: 'from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-black',
      dark: 'from-gray-900 via-purple-900 to-black',
      nature: 'from-green-50 via-blue-50 to-teal-100 dark:from-green-900 dark:via-blue-900 dark:to-teal-900',
      industrial: 'from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900'
    },
    size: {
      compact: 'min-h-[400px]',
      standard: 'min-h-[600px]',
      expanded: 'min-h-[800px]',
      fullscreen: 'min-h-screen'
    }
  },
  defaultVariants: {
    theme: 'royal',
    size: 'standard'
  }
})

interface AGISheetProps {
  theme?: 'royal' | 'dark' | 'nature' | 'industrial'
  size?: 'compact' | 'standard' | 'expanded' | 'fullscreen'
  initialData?: any[]
  onCellChange?: (cell: string, value: any) => void
  enableDemo?: boolean
  enableFormulas?: boolean
  enableAGI?: boolean
  className?: string
}

// REAL-ONLY Cell Data Structure  
interface CellData {
  id: string
  value: RealData<string | number> | null  // ONLY real data with provenance
  formula?: string
  type: 'text' | 'number' | 'formula' | 'agi'
  agiBinding?: string  // AGI capability binding (e.g., "WEATHER.NOW lat=51.5 lon=7.0")
  lastUpdate?: number
  error?: string | undefined
}

// Real Guard Component
function RealGuard({ data, children, className }: { 
  data?: any; 
  children: React.ReactNode; 
  className?: string 
}) {
  if (data === undefined) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-gray-500">Loading real data...</div>
      </div>
    )
  }
  
  if (data === null) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-yellow-600">No real data available</div>
      </div>
    )
  }
  
  // Check if data has valid provenance
  if (!data?.provenance?.source || !data?.provenance?.fetchedAt) {
    return (
      <div className={`flex items-center justify-center p-4 border border-red-300 ${className}`}>
        <div className="text-red-600">Invalid data: Missing provenance</div>
      </div>
    )
  }
  
  // Check if data is stale
  const age = (Date.now() - new Date(data.provenance.fetchedAt).getTime()) / 1000
  if (age > data.provenance.ttlSeconds) {
    return (
      <div className={`flex items-center justify-center p-4 border border-yellow-300 ${className}`}>
        <div className="text-yellow-600">Data stale (TTL expired)</div>
      </div>
    )
  }
  
  return <>{children}</>
}

export const AGISheet: React.FC<AGISheetProps> = ({
  theme = 'royal',
  size = 'standard',
  initialData = [],
  onCellChange,
  enableDemo = true,
  enableFormulas = true,
  enableAGI = true,
  className
}) => {
  const isClient = useClientOnly()
  const [cells, setCells] = useState<CellData[]>([])
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<'sheet' | 'demo' | 'engine'>('sheet')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize engines
  const cellEngine = useMemo(() => new CellEngine(), [])

  useEffect(() => {
    // Only initialize once to prevent infinite loops
    if (!isInitialized) {
      if (initialData.length > 0) {
        const initialCells = initialData.map((data, index) => ({
          id: `A${index + 1}`,
          value: data.value ? {
            data: data.value,
            provenance: {
              source: 'initial-data',
              fetchedAt: new Date().toISOString(),
              ttlSeconds: 3600
            }
          } : null,
          type: data.type || 'text' as const,
          formula: data.formula
        }))
        setCells(initialCells)
      } else {
        // DON'T create default fake data - wait for real data
        setCells([])
      }
      setIsInitialized(true)
    }
  }, [initialData, isInitialized])

  // REAL-ONLY cell update - no fake processing
  const handleCellUpdate = async (cellId: string, newValue: string) => {
    setIsProcessing(true)
    
    try {
      let cellType: CellData['type'] = 'text'
      let realValue: RealData<string | number> | null = null
      let error: string | undefined

      if (newValue === '') {
        // Empty cell
        realValue = null
      } else if (newValue.startsWith('=')) {
        cellType = 'formula'
        if (enableFormulas) {
          // TODO: Connect to real formula engine
          error = "Formula engine not connected"
        }
      } else if (newValue.startsWith('agi:') && enableAGI) {
        cellType = 'agi'
        // Extract AGI command
        const command = newValue.slice(4).trim()
        
        // Call REAL AGI service
        const result = await agiCall<{value: string | number}>('CELL.PROCESS', { command, cellId })
        if (result.ok) {
          realValue = {
            data: result.data.value,
            provenance: result.data.provenance
          }
        } else {
          error = `AGI Error: ${result.message}`
        }
      } else {
        // Regular value with manual provenance
        cellType = !isNaN(Number(newValue)) && newValue !== '' ? 'number' : 'text'
        realValue = {
          data: cellType === 'number' ? Number(newValue) : newValue,
          provenance: {
            source: 'user-input',
            fetchedAt: new Date().toISOString(),
            ttlSeconds: 3600
          }
        }
      }

      // Update cell with REAL data only
      setCells(prev => prev.map(cell => 
        cell.id === cellId 
          ? { ...cell, value: realValue, type: cellType, lastUpdate: Date.now(), error }
          : cell
      ))

      onCellChange?.(cellId, realValue)
      
    } catch (error) {
      console.error('Cell update error:', error)
      setCells(prev => prev.map(cell => 
        cell.id === cellId 
          ? { ...cell, error: String(error), lastUpdate: Date.now() }
          : cell
      ))
    } finally {
      setIsProcessing(false)
    }
  }

  // REAL-ONLY cell renderer
  const renderCell = (cell: CellData) => {
    const isSelected = selectedCell === cell.id
    
    // Extract display value from real data
    const displayValue = cell.value ? String(cell.value.data) : ''
    const hasRealData = cell.value !== null
    const hasError = !!cell.error
    
    return (
      <RealGuard data={cell.value} key={cell.id}>
        <motion.div
          className={`
            relative border border-gray-200 dark:border-gray-700 p-2 min-h-[40px] 
            flex items-center justify-center text-sm transition-all duration-200
            ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
            ${cell.type === 'formula' ? 'text-blue-600 dark:text-blue-400' : ''}
            ${cell.type === 'agi' ? 'text-purple-600 dark:text-purple-400' : ''}
            ${hasRealData ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20' : ''}
            ${hasError ? 'bg-red-50 dark:bg-red-900/20 border-red-300' : ''}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedCell(cell.id)}
        >
          <input
            type="text"
            value={displayValue}
            onChange={(e) => handleCellUpdate(cell.id, e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none text-center"
            placeholder={hasError ? "ERROR" : cell.id}
          />
          
          {/* Real data indicator */}
          {hasRealData && cell.value && (
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
              title={`Source: ${cell.value.provenance.source}`}
            />
          )}
          
          {/* Error indicator */}
          {hasError && (
            <div 
              className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"
              title={cell.error}
            />
          )}
          
          {/* Processing indicator */}
          {isProcessing && selectedCell === cell.id && (
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </RealGuard>
    )
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-500">Loading AGI Sheet...</div>
      </div>
    )
  }

  return (
    <div className={`${sheetVariants({ theme, size })} bg-gradient-to-br ${className || ''}`}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧠 Web8 AGI Sheet
          </h1>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('sheet')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'sheet' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Spreadsheet
            </button>
            
            {enableDemo && (
              <button
                onClick={() => setMode('demo')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  mode === 'demo' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                Demo
              </button>
            )}
            
            <button
              onClick={() => setMode('engine')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'engine' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Engine
            </button>
          </div>
        </div>

        {/* Content */}
        {mode === 'demo' && enableDemo ? (
          <AGISheetDemo theme="industrial" />
        ) : mode === 'engine' ? (
          <AGISpreadsheetEngine />
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            {/* Column Headers */}
            <div className="grid grid-cols-6 bg-gray-100 dark:bg-gray-800">
              <div className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300"></div>
              {['A', 'B', 'C', 'D', 'E'].map(col => (
                <div key={col} className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                  {col}
                </div>
              ))}
            </div>

            {/* Rows */}
            {Array.from({ length: 10 }, (_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
                {/* Row Header */}
                <div className="p-3 text-center font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {rowIndex + 1}
                </div>
                
                {/* Cells */}
                {['A', 'B', 'C', 'D', 'E'].map(col => {
                  const cellId = `${col}${rowIndex + 1}`
                  const cell = cells.find(c => c.id === cellId)
                  
                  // Only render existing cells with real data
                  if (!cell) {
                    return (
                      <div 
                        key={cellId}
                        className="border border-gray-200 dark:border-gray-700 p-2 min-h-[40px] flex items-center justify-center text-sm text-gray-400"
                        onClick={() => setSelectedCell(cellId)}
                      >
                        <span className="text-xs">{cellId}</span>
                      </div>
                    )
                  }
                  
                  return renderCell(cell)
                })}
              </div>
            ))}
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Selected: {selectedCell || 'None'}</span>
            {isProcessing && (
              <span className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Formulas: {enableFormulas ? '✅' : '❌'}</span>
            <span>AGI: {enableAGI ? '🧠' : '❌'}</span>
            <span>Cells: {cells.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AGISheet
