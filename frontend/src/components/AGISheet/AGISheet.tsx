/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Web8 AGI Spreadsheet System - Core Component
 * Industrial-grade AGI spreadsheet with real-time neural processing
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

interface CellData {
  id: string
  value: string | number
  formula?: string
  type: 'text' | 'number' | 'formula' | 'agi'
  computed?: any
  neural?: any
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

  // Initialize engines
  const cellEngine = useMemo(() => new CellEngine(), [])

  useEffect(() => {
    if (initialData.length > 0) {
      const initialCells = initialData.map((data, index) => ({
        id: `A${index + 1}`,
        value: data.value || '',
        type: data.type || 'text',
        formula: data.formula
      }))
      setCells(initialCells)
    } else {
      // Create default grid
      const defaultCells: CellData[] = []
      for (let row = 1; row <= 10; row++) {
        for (let col = 0; col < 5; col++) {
          const columnLetter = String.fromCharCode(65 + col) // A, B, C, D, E
          defaultCells.push({
            id: `${columnLetter}${row}`,
            value: '',
            type: 'text'
          })
        }
      }
      setCells(defaultCells)
    }
  }, [initialData])

  const handleCellUpdate = async (cellId: string, value: string) => {
    setIsProcessing(true)
    
    try {
      let cellType: CellData['type'] = 'text'
      let computed: any = value
      let neural: any = null

      // Detect cell type
      if (value.startsWith('=')) {
        cellType = 'formula'
        if (enableFormulas) {
          // Simple formula evaluation - can be enhanced later
          computed = value // For now, just store the formula
        }
      } else if (value.startsWith('agi:') && enableAGI) {
        cellType = 'agi'
        // AGI processing placeholder - can be enhanced later
        neural = { result: `AGI: Processing "${value}"...` }
        computed = neural.result
      } else if (!isNaN(Number(value)) && value !== '') {
        cellType = 'number'
        computed = Number(value)
      }

      // Update cell
      setCells(prev => prev.map(cell => 
        cell.id === cellId 
          ? { ...cell, value, type: cellType, computed, neural }
          : cell
      ))

      onCellChange?.(cellId, { value, computed, neural })
      
    } catch (error) {
      console.error('Cell update error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderCell = (cell: CellData) => {
    const isSelected = selectedCell === cell.id
    const displayValue = cell.computed !== undefined ? cell.computed : cell.value
    
    return (
      <motion.div
        key={cell.id}
        className={`
          relative border border-gray-200 dark:border-gray-700 p-2 min-h-[40px] 
          flex items-center justify-center text-sm transition-all duration-200
          ${isSelected ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
          ${cell.type === 'formula' ? 'text-blue-600 dark:text-blue-400' : ''}
          ${cell.type === 'agi' ? 'text-purple-600 dark:text-purple-400' : ''}
          ${cell.neural ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedCell(cell.id)}
      >
        <input
          type="text"
          value={cell.value}
          onChange={(e) => handleCellUpdate(cell.id, e.target.value)}
          className="w-full h-full bg-transparent border-none outline-none text-center"
          placeholder={cell.id}
        />
        
        {cell.neural && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
        )}
        
        {isProcessing && selectedCell === cell.id && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
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
                  const cell = cells.find(c => c.id === cellId) || { id: cellId, value: '', type: 'text' as const }
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
