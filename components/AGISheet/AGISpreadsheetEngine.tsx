/**
 * EuroWeb AGI Spreadsheet Engine - Universal Excel-like System
 * Industrial-Grade Spreadsheet with AI Enhancement
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'

// CVA Classes for styling
const containerVariants = cva(
  "min-h-screen p-6 font-sans text-white",
  {
    variants: {
      theme: {
        default: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        dark: "bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900",
        industrial: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
      }
    },
    defaultVariants: {
      theme: "industrial"
    }
  }
)

const headerVariants = cva(
  "mb-6 p-6 rounded-xl border backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-white/5 border-blue-500/30",
        glass: "bg-white/10 border-white/20",
        solid: "bg-slate-800 border-slate-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const buttonVariants = cva(
  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-blue-500/20 border border-blue-500 text-blue-400 hover:bg-blue-500/30",
        success: "bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30",
        purple: "bg-purple-500/20 border border-purple-500 text-purple-400 hover:bg-purple-500/30",
        orange: "bg-orange-500/20 border border-orange-500 text-orange-400 hover:bg-orange-500/30",
        gold: "bg-yellow-500/20 border border-yellow-500 text-yellow-400 hover:bg-yellow-500/30"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
)

const cardVariants = cva(
  "p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-slate-800/80 border-blue-500/30 hover:bg-slate-700/80 hover:scale-105",
        glass: "bg-white/5 border-white/20 hover:bg-white/10",
        solid: "bg-slate-800 border-slate-700 hover:bg-slate-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const gridCellVariants = cva(
  "flex items-center justify-center text-xs border border-blue-500/30",
  {
    variants: {
      type: {
        header: "w-12 h-9 bg-slate-700/90 font-semibold text-blue-400",
        colHeader: "w-30 h-9 bg-slate-700/90 font-semibold text-blue-400",
        cell: "w-30 h-9 cursor-pointer text-white",
        evenRow: "bg-slate-900/80",
        oddRow: "bg-slate-800/80"
      }
    },
    defaultVariants: {
      type: "cell"
    }
  }
)

// Interface definitions for Spreadsheet
interface SpreadsheetCell {
  id: string
  row: number
  col: number
  value: string | number
  formula?: string
  type: 'text' | 'number' | 'formula' | 'date'
  style?: CellStyle
}

interface CellStyle {
  backgroundColor?: string
  textColor?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  textAlign?: 'left' | 'center' | 'right'
}

interface SpreadsheetTemplate {
  id: string
  name: string
  icon: string
  description: string
  category: 'personal' | 'business' | 'financial' | 'legal' | 'government' | 'military'
  columns: string[]
  sampleData: any[]
}

// Sample spreadsheet templates
const spreadsheetTemplates: SpreadsheetTemplate[] = [
  {
    id: 'personal-budget',
    name: 'Personal Budget Tracker',
    icon: '💰',
    description: 'Track personal income, expenses, and savings',
    category: 'personal',
    columns: ['Date', 'Description', 'Category', 'Income', 'Expense', 'Balance'],
    sampleData: [
      ['2024-01-01', 'Salary', 'Income', 5000, 0, 5000],
      ['2024-01-02', 'Groceries', 'Food', 0, 250, 4750],
      ['2024-01-03', 'Rent', 'Housing', 0, 1200, 3550]
    ]
  },
  {
    id: 'business-analytics',
    name: 'Business Analytics Dashboard',
    icon: '📊',
    description: 'Track KPIs, revenue, and business metrics',
    category: 'business',
    columns: ['Month', 'Revenue', 'Costs', 'Profit', 'ROI %', 'Growth %'],
    sampleData: [
      ['Jan 2024', 125000, 85000, 40000, 32.0, 15.2],
      ['Feb 2024', 138000, 92000, 46000, 33.3, 18.5],
      ['Mar 2024', 155000, 98000, 57000, 36.8, 24.0]
    ]
  },
  {
    id: 'legal-case-tracker',
    name: 'Legal Case Management',
    icon: '∞',
    description: 'Track legal cases, deadlines, and outcomes',
    category: 'legal',
    columns: ['Case ID', 'Client', 'Type', 'Status', 'Deadline', 'Priority'],
    sampleData: [
      ['C2024-001', 'ABC Corp', 'Contract', 'Active', '2024-03-15', 'High'],
      ['C2024-002', 'John Smith', 'Personal Injury', 'Review', '2024-02-28', 'Medium'],
      ['C2024-003', 'XYZ Ltd', 'Intellectual Property', 'Pending', '2024-04-10', 'High']
    ]
  },
  {
    id: 'financial-portfolio',
    name: 'Investment Portfolio',
    icon: '📈',
    description: 'Track investments, stocks, and financial assets',
    category: 'financial',
    columns: ['Asset', 'Type', 'Quantity', 'Purchase Price', 'Current Price', 'P&L'],
    sampleData: [
      ['AAPL', 'Stock', 100, 150.00, 185.25, 3525],
      ['MSFT', 'Stock', 50, 280.50, 315.75, 1762.5],
      ['BTC', 'Crypto', 0.5, 45000, 52000, 3500]
    ]
  },
  {
    id: 'government-budget',
    name: 'Government Budget Allocation',
    icon: '🏛️',
    description: 'Track government spending and budget allocation',
    category: 'government',
    columns: ['Department', 'Allocated Budget', 'Spent', 'Remaining', 'Utilization %'],
    sampleData: [
      ['Healthcare', 500000000, 425000000, 75000000, 85.0],
      ['Education', 350000000, 290000000, 60000000, 82.9],
      ['Defense', 800000000, 720000000, 80000000, 90.0]
    ]
  },
  {
    id: 'military-operations',
    name: 'Military Operations Tracker',
    icon: '🛡️',
    description: 'Track military operations and resource allocation',
    category: 'military',
    columns: ['Operation', 'Status', 'Personnel', 'Equipment', 'Budget', 'Timeline'],
    sampleData: [
      ['Op Alpha', 'Active', 250, 'Heavy', 2500000, '30 days'],
      ['Op Beta', 'Planning', 150, 'Medium', 1800000, '45 days'],
      ['Op Gamma', 'Completed', 400, 'Full', 5200000, 'Completed']
    ]
  }
]

/**
 * AGI Spreadsheet Engine Component
 * Excel-like functionality with AI enhancement
 */
const AGISpreadsheetEngine: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Generate spreadsheet grid with CVA classes
  const generateGrid = (rows: number = 15, cols: number = 8): React.ReactElement[] => {
    const grid: React.ReactElement[] = []
    const colHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    
    // Header row
    grid.push(
      <div key="header" className="flex bg-slate-700/90">
        <div className={gridCellVariants({ type: "header" })}>
          #
        </div>
        {colHeaders.slice(0, cols).map((col) => (
          <div key={col} className={gridCellVariants({ type: "colHeader" })}>
            {col}
          </div>
        ))}
      </div>
    )

    // Data rows
    for (let row = 1; row <= rows; row++) {
      const rowElement = (
        <div key={row} className="flex">
          <div className={gridCellVariants({ type: "header" })}>
            {row}
          </div>
          {colHeaders.slice(0, cols).map((col, colIndex) => (
            <div
              key={`${col}${row}`}
              className={clsx(
                gridCellVariants({ type: "cell" }),
                row % 2 === 0 ? gridCellVariants({ type: "evenRow" }) : gridCellVariants({ type: "oddRow" })
              )}
            >
              {row === 1 && colIndex < 4 ? ['Sample', 'Data', 'Here', 'AI'][colIndex] : ''}
            </div>
          ))}
        </div>
      )
      grid.push(rowElement)
    }
    
    return grid
  }

  return (
    <div className={containerVariants({ theme: "industrial" })}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={headerVariants()}
      >
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          📊 AGI Spreadsheet Engine
        </h1>
        <p className="text-lg text-slate-300 mb-4">
          Universal Excel-like System with AI Enhancement - {currentTime}
        </p>

        {/* Toolbar */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button className={buttonVariants({ variant: "success" })}>
            📄 New Sheet
          </button>
          <button className={buttonVariants({ variant: "primary" })}>
            💾 Save
          </button>
          <button className={buttonVariants({ variant: "purple" })}>
            🤖 AI Assist
          </button>
          <button className={buttonVariants({ variant: "orange" })}>
            📊 Charts
          </button>
          <button className={buttonVariants({ variant: "gold" })}>
            🔗 Share
          </button>
        </div>
      </motion.div>

      {/* Spreadsheet Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        <h3 className="text-xl font-semibold text-blue-400 mb-4">
          🏗️ Universal Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spreadsheetTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className={cardVariants()}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white m-0">
                    {template.name}
                  </h4>
                  <div className="text-xs text-blue-400 uppercase">
                    {template.category}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 m-0 leading-relaxed">
                {template.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Spreadsheet Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-4 mb-6"
      >
        <h3 className="text-xl font-semibold text-blue-400 mb-4">
          📋 Active Spreadsheet
        </h3>
        
        {/* Formula Bar */}
        <div className="flex items-center gap-3 mb-4 p-2 bg-slate-700/80 rounded-md">
          <div className="text-sm text-blue-400 font-semibold w-15">
            A1
          </div>
          <input
            type="text"
            placeholder="Enter formula or value..."
            className="flex-1 bg-slate-800/80 border border-blue-500/30 rounded px-3 py-1.5 text-white text-sm"
          />
          <button className={buttonVariants({ variant: "success" })}>
            ✓
          </button>
        </div>

        {/* Spreadsheet Grid */}
        <div className="border border-blue-500/30 rounded-md overflow-auto max-h-96">
          {generateGrid()}
        </div>
      </motion.div>

      {/* AI Features Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-4"
      >
        <h3 className="text-xl font-semibold text-purple-400 mb-4">
          🤖 AI-Powered Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
            <div className="text-green-400 text-sm font-semibold mb-2">
              🧠 Smart Formulas
            </div>
            <div className="text-white text-xs">
              AI suggests and auto-completes complex formulas
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-semibold mb-2">
              📊 Data Insights
            </div>
            <div className="text-white text-xs">
              Automatic pattern recognition and trend analysis
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-semibold mb-2">
              🔮 Predictions
            </div>
            <div className="text-white text-xs">
              Predictive modeling and future value forecasting
            </div>
          </div>
          
          <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-4">
            <div className="text-orange-400 text-sm font-semibold mb-2">
              🔍 Smart Search
            </div>
            <div className="text-white text-xs">
              Natural language queries across all data
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export { AGISpreadsheetEngine }

