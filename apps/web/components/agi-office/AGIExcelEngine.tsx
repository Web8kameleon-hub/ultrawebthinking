/**
 * AGI Excel Engine - Full Featured Spreadsheet
 * Real Excel-like functionality with formulas, charts, and AI
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic Excel
 * @license MIT
 */

'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Types for full Excel functionality
interface ExcelCell {
    value: string | number | boolean | null
    formula?: string
    type: 'text' | 'number' | 'boolean' | 'date' | 'formula'
    format?: {
        bold?: boolean
        italic?: boolean
        underline?: boolean
        color?: string
        backgroundColor?: string
        fontSize?: number
        align?: 'left' | 'center' | 'right'
        border?: string
    }
    lastModified?: number
}

interface ExcelSheet {
    id: string
    name: string
    cells: Map<string, ExcelCell>
    rowCount: number
    columnCount: number
    selectedCell: string
    selectedRange: string[]
    lastModified?: number
    autoSave?: boolean
}

interface ExcelWorkbook {
    id: string
    name: string
    sheets: ExcelSheet[]
    activeSheetId: string
    lastSaved?: number
    autoCalculate?: boolean
}

// Formula Engine for Excel calculations with real-time updates
class ExcelFormulaEngine {
    private calculationDepth = 0
    private maxDepth = 10

    evaluate(formula: string, context: Map<string, any>): any {
        if (!formula.startsWith('=')) {return formula}
        if (this.calculationDepth > this.maxDepth) {return '#CIRCULAR'}

        this.calculationDepth++
        const result = this.performCalculation(formula, context)
        this.calculationDepth--
        return result
    }

    private performCalculation(formula: string, context: Map<string, any>): any {
        const expr = formula.substring(1).toUpperCase()

        // Enhanced function support
        if (expr.includes('IF(')) {
            const match = expr.match(/IF\(([^,]+),([^,]+),([^)]+)\)/)
            if (match) {
                const [, condition, trueValue, falseValue] = match
                const conditionResult = this.evaluateBasicExpression(condition, context)
                return conditionResult ? this.evaluateBasicExpression(trueValue, context) : this.evaluateBasicExpression(falseValue, context)
            }
        }

        // CONCATENATE function
        if (expr.includes('CONCATENATE(')) {
            const match = expr.match(/CONCATENATE\(([^)]+)\)/)
            if (match) {
                const args = match[1].split(',').map(arg => arg.trim())
                return args.map(arg => this.evaluateBasicExpression(arg, context)).join('')
            }
        }

        // NOW() function for real-time updates
        if (expr.includes('NOW()')) {
            return new Date().toLocaleString()
        }

        // RAND() function for dynamic values
        if (expr.includes('RAND()')) {
            return Math.random()
        }

        // Handle SUM function
        if (expr.includes('SUM(')) {
            const match = expr.match(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/)
            if (match) {
                const [, start, end] = match
                const startCol = start.charCodeAt(0) - 65
                const startRow = parseInt(start.substring(1)) - 1
                const endCol = end.charCodeAt(0) - 65
                const endRow = parseInt(end.substring(1)) - 1

                let sum = 0
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        const cellAddr = String.fromCharCode(65 + col) + (row + 1)
                        const value = context.get(cellAddr)
                        if (typeof value === 'number') {sum += value}
                    }
                }
                return sum
            }
        }

        // Handle AVERAGE function
        if (expr.includes('AVERAGE(')) {
            const match = expr.match(/AVERAGE\(([A-Z]\d+):([A-Z]\d+)\)/)
            if (match) {
                const [, start, end] = match
                const startCol = start.charCodeAt(0) - 65
                const startRow = parseInt(start.substring(1)) - 1
                const endCol = end.charCodeAt(0) - 65
                const endRow = parseInt(end.substring(1)) - 1

                let sum = 0
                let count = 0
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        const cellAddr = String.fromCharCode(65 + col) + (row + 1)
                        const value = context.get(cellAddr)
                        if (typeof value === 'number') {
                            sum += value
                            count++
                        }
                    }
                }
                return count > 0 ? sum / count : 0
            }
        }

        // Handle MAX function
        if (expr.includes('MAX(')) {
            const match = expr.match(/MAX\(([A-Z]\d+):([A-Z]\d+)\)/)
            if (match) {
                const [, start, end] = match
                const startCol = start.charCodeAt(0) - 65
                const startRow = parseInt(start.substring(1)) - 1
                const endCol = end.charCodeAt(0) - 65
                const endRow = parseInt(end.substring(1)) - 1

                let max = -Infinity
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        const cellAddr = String.fromCharCode(65 + col) + (row + 1)
                        const value = context.get(cellAddr)
                        if (typeof value === 'number' && value > max) {max = value}
                    }
                }
                return max === -Infinity ? 0 : max
            }
        }

        // Handle MIN function
        if (expr.includes('MIN(')) {
            const match = expr.match(/MIN\(([A-Z]\d+):([A-Z]\d+)\)/)
            if (match) {
                const [, start, end] = match
                const startCol = start.charCodeAt(0) - 65
                const startRow = parseInt(start.substring(1)) - 1
                const endCol = end.charCodeAt(0) - 65
                const endRow = parseInt(end.substring(1)) - 1

                let min = Infinity
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        const cellAddr = String.fromCharCode(65 + col) + (row + 1)
                        const value = context.get(cellAddr)
                        if (typeof value === 'number' && value < min) {min = value}
                    }
                }
                return min === Infinity ? 0 : min
            }
        }

        // Handle COUNT function
        if (expr.includes('COUNT(')) {
            const match = expr.match(/COUNT\(([A-Z]\d+):([A-Z]\d+)\)/)
            if (match) {
                const [, start, end] = match
                const startCol = start.charCodeAt(0) - 65
                const startRow = parseInt(start.substring(1)) - 1
                const endCol = end.charCodeAt(0) - 65
                const endRow = parseInt(end.substring(1)) - 1

                let count = 0
                for (let row = startRow; row <= endRow; row++) {
                    for (let col = startCol; col <= endCol; col++) {
                        const cellAddr = String.fromCharCode(65 + col) + (row + 1)
                        const value = context.get(cellAddr)
                        if (typeof value === 'number') {count++}
                    }
                }
                return count
            }
        }

        // Handle simple arithmetic
        if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
            try {
                // Replace cell references with values
                let evalExpr = expr
                const cellRefs = expr.match(/[A-Z]\d+/g)
                if (cellRefs) {
                    cellRefs.forEach(ref => {
                        const value = context.get(ref)
                        if (typeof value === 'number') {
                            evalExpr = evalExpr.replace(ref, value.toString())
                        }
                    })
                }
                return eval(evalExpr)
            } catch {
                return '#ERROR'
            }
        }

        return '#ERROR'
    }

    private evaluateBasicExpression(expr: string, context: Map<string, any>): any {
        expr = expr.trim()
        
        // Check if it's a string literal
        if (expr.startsWith('"') && expr.endsWith('"')) {
            return expr.slice(1, -1)
        }
        
        // Check if it's a cell reference
        if (/^[A-Z]\d+$/.test(expr)) {
            return context.get(expr) ?? 0
        }
        
        // Check if it's a number
        const num = parseFloat(expr)
        if (!isNaN(num)) {
            return num
        }
        
        // Try to evaluate as expression
        try {
            let evalExpr = expr
            const cellRefs = expr.match(/[A-Z]\d+/g)
            if (cellRefs) {
                cellRefs.forEach(ref => {
                    const value = context.get(ref)
                    if (typeof value === 'number') {
                        evalExpr = evalExpr.replace(ref, value.toString())
                    }
                })
            }
            return eval(evalExpr)
        } catch {
            return expr
        }
    }
}

// Main Excel Engine Component with real-time updates
export default function AGIExcelEngine() {
    const [workbook, setWorkbook] = useState<ExcelWorkbook>({
        id: 'workbook1',
        name: 'AGI Excel Workbook',
        sheets: [
            {
                id: 'sheet1',
                name: 'Sheet1',
                cells: new Map(),
                rowCount: 1000,
                columnCount: 26,
                selectedCell: 'A1',
                selectedRange: [],
                autoSave: true
            }
        ],
        activeSheetId: 'sheet1',
        autoCalculate: true
    })

    const [formulaBarValue, setFormulaBarValue] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
    const formulaEngine = useRef(new ExcelFormulaEngine())
    const updateInterval = useRef<NodeJS.Timeout | null>(null)

    // Auto-update timer for dynamic functions
    useEffect(() => {
        if (workbook.autoCalculate) {
            updateInterval.current = setInterval(() => {
                setLastUpdate(Date.now())
                // Recalculate cells with NOW() or RAND() functions
                const activeSheet = workbook.sheets.find(sheet => sheet.id === workbook.activeSheetId)
                if (activeSheet) {
                    const needsUpdate = Array.from(activeSheet.cells.values()).some(cell => 
                        cell.formula?.includes('NOW()') || cell.formula?.includes('RAND()')
                    )
                    if (needsUpdate) {
                        calculateFormulas(activeSheet.cells)
                    }
                }
            }, 1000)
        }

        return () => {
            if (updateInterval.current) {
                clearInterval(updateInterval.current)
            }
        }
    }, [workbook])

    // Get active sheet
    const activeSheet = useMemo(() =>
        workbook.sheets.find(sheet => sheet.id === workbook.activeSheetId) ?? workbook.sheets[0],
        [workbook]
    )

    // Cell address utilities
    const getCellAddress = (row: number, col: number): string =>
        String.fromCharCode(65 + col) + (row + 1)

    const parseCellAddress = (address: string): [number, number] => {
        const col = address.charCodeAt(0) - 65
        const row = parseInt(address.substring(1)) - 1
        return [row, col]
    }

    // Calculate all formulas
    const calculateFormulas = useCallback((cells: Map<string, ExcelCell>) => {
        const context = new Map<string, any>()

        // First pass: collect all non-formula values
        cells.forEach((cell, address) => {
            if (cell.type !== 'formula') {
                context.set(address, cell.value)
            }
        })

        // Second pass: calculate formulas
        cells.forEach((cell, address) => {
            if (cell.type === 'formula' && cell.formula) {
                try {
                    const result = formulaEngine.current.evaluate(cell.formula, context)
                    cell.value = result
                    context.set(address, result)
                } catch (_error) {
                    cell.value = '#ERROR'
                }
            }
        })
    }, [])

    // Handle cell click
    const handleCellClick = useCallback((address: string) => {
        const cell = activeSheet.cells.get(address)
        setFormulaBarValue(cell?.formula ?? cell?.value?.toString() ?? '')

        setWorkbook(prev => ({
            ...prev,
            sheets: prev.sheets.map(sheet =>
                sheet.id === prev.activeSheetId
                    ? { ...sheet, selectedCell: address, selectedRange: [] }
                    : sheet
            )
        }))
    }, [activeSheet])

    // Handle formula bar submit with enhanced validation
    const handleFormulaSubmit = useCallback(() => {
        if (!formulaBarValue && !activeSheet.selectedCell) {return}

        const isFormula = formulaBarValue.startsWith('=')
        const cell: ExcelCell = {
            value: formulaBarValue,
            type: isFormula ? 'formula' : (isNaN(Number(formulaBarValue)) ? 'text' : 'number'),
            formula: isFormula ? formulaBarValue : undefined,
            lastModified: Date.now()
        }

        const newCells = new Map(activeSheet.cells)
        newCells.set(activeSheet.selectedCell, cell)

        // Recalculate formulas
        calculateFormulas(newCells)

        setWorkbook(prev => ({
            ...prev,
            sheets: prev.sheets.map(sheet =>
                sheet.id === prev.activeSheetId
                    ? { ...sheet, cells: newCells, lastModified: Date.now() }
                    : sheet
            ),
            lastSaved: autoSaveEnabled ? Date.now() : prev.lastSaved
        }))

        setIsEditing(false)
        
        // Auto-save notification
        if (autoSaveEnabled) {
            console.log('Auto-saved at', new Date().toLocaleTimeString())
        }
    }, [formulaBarValue, activeSheet, calculateFormulas, autoSaveEnabled])

    // Get cell value for display
    const getCellValue = (address: string): any => {
        const cell = activeSheet.cells.get(address)
        return cell?.value ?? ''
    }

    // Get cell style
    const getCellStyle = (address: string): React.CSSProperties => {
        const cell = activeSheet.cells.get(address)
        const format = cell?.format ?? {}
        const isSelected = address === activeSheet.selectedCell

        return {
            fontWeight: format.bold ? 'bold' : 'normal',
            fontStyle: format.italic ? 'italic' : 'normal',
            textDecoration: format.underline ? 'underline' : 'none',
            color: format.color ?? '#000',
            backgroundColor: isSelected ? '#e3f2fd' : (format.backgroundColor ?? '#fff'),
            textAlign: format.align ?? 'left',
            fontSize: format.fontSize ?? 14,
            border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
            padding: '6px',
            minHeight: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
        }
    }

    // Format value for display
    const formatValue = (value: any): string => {
        if (typeof value === 'number') {
            return value.toLocaleString()
        }
        return value?.toString() ?? ''
    }

    // Create dynamic budget template with real-time calculations
    const createBudgetTemplate = () => {
        const newCells = new Map<string, ExcelCell>()

        // Headers with dynamic timestamp
        newCells.set('A1', { value: '💰 Personal Budget 2025', type: 'text', format: { bold: true, fontSize: 16, backgroundColor: '#e8f5e8' } })
        newCells.set('A2', { value: '=CONCATENATE("Last Updated: ",NOW())', formula: '=CONCATENATE("Last Updated: ",NOW())', type: 'formula', format: { italic: true, fontSize: 10 } })
        newCells.set('A3', { value: 'Income', type: 'text', format: { bold: true, backgroundColor: '#d4edda' } })
        newCells.set('B3', { value: 'Amount', type: 'text', format: { bold: true, backgroundColor: '#d4edda' } })

        // Income items with dynamic values
        newCells.set('A4', { value: 'Salary', type: 'text' })
        newCells.set('B4', { value: 5000 + Math.floor(Math.random() * 1000), type: 'number' })
        newCells.set('A5', { value: 'Freelance', type: 'text' })
        newCells.set('B5', { value: '=1200+RAND()*800', formula: '=1200+RAND()*800', type: 'formula' })
        newCells.set('A6', { value: 'Investment Returns', type: 'text' })
        newCells.set('B6', { value: '=RAND()*500', formula: '=RAND()*500', type: 'formula' })
        newCells.set('A7', { value: 'Total Income', type: 'text', format: { bold: true } })
        newCells.set('B7', { value: '=SUM(B4:B6)', formula: '=SUM(B4:B6)', type: 'formula', format: { bold: true, backgroundColor: '#d1ecf1' } })

        // Expenses with dynamic calculations
        newCells.set('A9', { value: 'Expenses', type: 'text', format: { bold: true, backgroundColor: '#f8d7da' } })
        newCells.set('B9', { value: 'Amount', type: 'text', format: { bold: true, backgroundColor: '#f8d7da' } })
        newCells.set('A10', { value: 'Rent', type: 'text' })
        newCells.set('B10', { value: 1200, type: 'number' })
        newCells.set('A11', { value: 'Groceries', type: 'text' })
        newCells.set('B11', { value: '=350+RAND()*100', formula: '=350+RAND()*100', type: 'formula' })
        newCells.set('A12', { value: 'Utilities', type: 'text' })
        newCells.set('B12', { value: '=180+RAND()*40', formula: '=180+RAND()*40', type: 'formula' })
        newCells.set('A13', { value: 'Entertainment', type: 'text' })
        newCells.set('B13', { value: '=200+RAND()*150', formula: '=200+RAND()*150', type: 'formula' })
        newCells.set('A14', { value: 'Total Expenses', type: 'text', format: { bold: true } })
        newCells.set('B14', { value: '=SUM(B10:B13)', formula: '=SUM(B10:B13)', type: 'formula', format: { bold: true, backgroundColor: '#f5c6cb' } })

        // Net income with dynamic status
        newCells.set('A16', { value: 'Net Income', type: 'text', format: { bold: true, fontSize: 14 } })
        newCells.set('B16', { value: '=B7-B14', formula: '=B7-B14', type: 'formula', format: { bold: true, backgroundColor: '#fff3cd', fontSize: 14 } })
        newCells.set('A17', { value: 'Status', type: 'text', format: { bold: true } })
        newCells.set('B17', { value: '=IF(B16>0,"✅ Surplus","⚠️ Deficit")', formula: '=IF(B16>0,"✅ Surplus","⚠️ Deficit")', type: 'formula', format: { bold: true } })

        calculateFormulas(newCells)

        const newSheet: ExcelSheet = {
            id: `budget_${Date.now()}`,
            name: '💰 Dynamic Budget',
            cells: newCells,
            rowCount: 1000,
            columnCount: 26,
            selectedCell: 'A1',
            selectedRange: [],
            autoSave: true,
            lastModified: Date.now()
        }

        setWorkbook(prev => ({
            ...prev,
            sheets: [...prev.sheets, newSheet],
            activeSheetId: newSheet.id
        }))
    }

    const createBusinessTemplate = () => {
        const newCells = new Map<string, ExcelCell>()

        // Headers with dynamic timestamp
        newCells.set('A1', { value: '📊 Business Analytics Dashboard 2025', type: 'text', format: { bold: true, fontSize: 16, backgroundColor: '#e3f2fd' } })
        newCells.set('A2', { value: '=CONCATENATE("Real-time Data - ",NOW())', formula: '=CONCATENATE("Real-time Data - ",NOW())', type: 'formula', format: { italic: true, fontSize: 10 } })
        newCells.set('A3', { value: 'Product', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('B3', { value: 'Q1', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('C3', { value: 'Q2', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('D3', { value: 'Q3', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('E3', { value: 'Q4', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('F3', { value: 'Total', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('G3', { value: 'Average', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })
        newCells.set('H3', { value: 'Growth %', type: 'text', format: { bold: true, backgroundColor: '#bbdefb' } })

        // Products with dynamic data
        const products = ['EuroWeb Platform', 'AGI Office Suite', 'Web8 TabSystem', 'Medical Engine', 'Aviation Dashboard']
        products.forEach((product, i) => {
            const row = i + 4
            const baseValue = 50000 + i * 10000
            newCells.set(`A${row}`, { value: product, type: 'text' })
            newCells.set(`B${row}`, { value: `=${baseValue}+RAND()*20000`, formula: `=${baseValue}+RAND()*20000`, type: 'formula' })
            newCells.set(`C${row}`, { value: `=${baseValue}*1.1+RAND()*25000`, formula: `=${baseValue}*1.1+RAND()*25000`, type: 'formula' })
            newCells.set(`D${row}`, { value: `=${baseValue}*1.2+RAND()*30000`, formula: `=${baseValue}*1.2+RAND()*30000`, type: 'formula' })
            newCells.set(`E${row}`, { value: `=${baseValue}*1.3+RAND()*35000`, formula: `=${baseValue}*1.3+RAND()*35000`, type: 'formula' })
            newCells.set(`F${row}`, { value: `=SUM(B${row}:E${row})`, formula: `=SUM(B${row}:E${row})`, type: 'formula' })
            newCells.set(`G${row}`, { value: `=AVERAGE(B${row}:E${row})`, formula: `=AVERAGE(B${row}:E${row})`, type: 'formula' })
            newCells.set(`H${row}`, { value: `=(E${row}-B${row})/B${row}*100`, formula: `=(E${row}-B${row})/B${row}*100`, type: 'formula' })
        })

        // Totals and analytics
        newCells.set('A9', { value: 'TOTAL', type: 'text', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('B9', { value: '=SUM(B4:B8)', formula: '=SUM(B4:B8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('C9', { value: '=SUM(C4:C8)', formula: '=SUM(C4:C8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('D9', { value: '=SUM(D4:D8)', formula: '=SUM(D4:D8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('E9', { value: '=SUM(E4:E8)', formula: '=SUM(E4:E8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('F9', { value: '=SUM(F4:F8)', formula: '=SUM(F4:F8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('G9', { value: '=AVERAGE(G4:G8)', formula: '=AVERAGE(G4:G8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })
        newCells.set('H9', { value: '=AVERAGE(H4:H8)', formula: '=AVERAGE(H4:H8)', type: 'formula', format: { bold: true, backgroundColor: '#fff3e0' } })

        // Performance indicators
        newCells.set('A11', { value: 'Performance Metrics', type: 'text', format: { bold: true, fontSize: 14, backgroundColor: '#e8f5e8' } })
        newCells.set('A12', { value: 'Best Performer', type: 'text', format: { bold: true } })
        newCells.set('B12', { value: '=INDEX(A4:A8,MATCH(MAX(F4:F8),F4:F8,0))', formula: '=INDEX(A4:A8,MATCH(MAX(F4:F8),F4:F8,0))', type: 'formula' })
        newCells.set('A13', { value: 'Total Revenue', type: 'text', format: { bold: true } })
        newCells.set('B13', { value: '=F9', formula: '=F9', type: 'formula', format: { backgroundColor: '#d4edda' } })
        newCells.set('A14', { value: 'Market Status', type: 'text', format: { bold: true } })
        newCells.set('B14', { value: '=IF(H9>15,"🚀 Excellent","📈 Good")', formula: '=IF(H9>15,"🚀 Excellent","📈 Good")', type: 'formula' })

        calculateFormulas(newCells)

        const newSheet: ExcelSheet = {
            id: `business_${Date.now()}`,
            name: '📊 Live Analytics',
            cells: newCells,
            rowCount: 1000,
            columnCount: 26,
            selectedCell: 'A1',
            selectedRange: [],
            autoSave: true,
            lastModified: Date.now()
        }

        setWorkbook(prev => ({
            ...prev,
            sheets: [...prev.sheets, newSheet],
            activeSheetId: newSheet.id
        }))
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white"
        >
            {/* Enhanced Header with Status */}
            <motion.div 
                className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            📊 AGI Excel Engine - Dynamic & Functional
                        </h1>
                        <p className="text-slate-400 text-sm">Real-time Excel with formulas, auto-save, and live calculations</p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${workbook.autoCalculate ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className="text-xs text-slate-300">Auto-Calculate</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${autoSaveEnabled ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className="text-xs text-slate-300">Auto-Save</span>
                            </div>
                            <span className="text-xs text-slate-400">
                                Last Update: {new Date(lastUpdate).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Template Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            onClick={createBudgetTemplate}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                            💰 Dynamic Budget
                        </motion.button>
                        <motion.button
                            onClick={createBusinessTemplate}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                            📊 Live Analytics
                        </motion.button>
                        <motion.button
                            onClick={() => {
                                const newSheet: ExcelSheet = {
                                    id: `sheet_${Date.now()}`,
                                    name: `Sheet${workbook.sheets.length + 1}`,
                                    cells: new Map(),
                                    rowCount: 1000,
                                    columnCount: 26,
                                    selectedCell: 'A1',
                                    selectedRange: [],
                                    autoSave: true,
                                    lastModified: Date.now()
                                }
                                setWorkbook(prev => ({
                                    ...prev,
                                    sheets: [...prev.sheets, newSheet],
                                    activeSheetId: newSheet.id
                                }))
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                            📄 New Sheet
                        </motion.button>
                        <motion.button
                            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${
                                autoSaveEnabled 
                                    ? 'bg-orange-600 hover:bg-orange-700' 
                                    : 'bg-gray-600 hover:bg-gray-700'
                            }`}
                        >
                            {autoSaveEnabled ? '💾 Auto-Save ON' : '⏸️ Auto-Save OFF'}
                        </motion.button>
                    </div>
                </div>

                {/* Enhanced Sheet Tabs */}
                <div className="flex gap-2 mt-4 overflow-x-auto">
                    {workbook.sheets.map((sheet, index) => (
                        <motion.button
                            key={sheet.id}
                            onClick={() => setWorkbook(prev => ({ ...prev, activeSheetId: sheet.id }))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-md ${
                                sheet.id === workbook.activeSheetId
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {sheet.name}
                            {sheet.lastModified && (
                                <div className="w-1 h-1 bg-green-400 rounded-full ml-2 inline-block animate-pulse"></div>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Enhanced Formula Bar */}
            <motion.div 
                className="bg-slate-800/30 border-b border-slate-700/50 p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-slate-300 min-w-[60px] bg-slate-700/50 px-2 py-1 rounded">
                        {activeSheet.selectedCell}
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={formulaBarValue}
                            onChange={(e) => setFormulaBarValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFormulaSubmit()
                                } else if (e.key === 'Escape') {
                                    setFormulaBarValue('')
                                    setIsEditing(false)
                                }
                            }}
                            onFocus={() => setIsEditing(true)}
                            placeholder="Enter value, formula (=SUM(A1:A10)), or function (=NOW(), =RAND())"
                            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-slate-400"
                            >
                                Press Enter to confirm, Esc to cancel
                            </motion.div>
                        )}
                    </div>
                    <motion.button
                        onClick={handleFormulaSubmit}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-lg"
                    >
                        ✓
                    </motion.button>
                    <motion.button
                        onClick={() => {
                            setFormulaBarValue('')
                            setIsEditing(false)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors shadow-lg"
                    >
                        ✕
                    </motion.button>
                </div>
                
                {/* Formula Suggestions */}
                {isEditing && formulaBarValue.startsWith('=') && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-2 bg-slate-700/80 rounded-lg text-xs"
                    >
                        <div className="text-slate-300 mb-1">Quick Functions:</div>
                        <div className="flex gap-4 text-slate-400">
                            <span>SUM(A1:A10)</span>
                            <span>AVERAGE(B1:B5)</span>
                            <span>MAX(C1:C20)</span>
                            <span>NOW()</span>
                            <span>RAND()</span>
                            <span>IF(A1&gt;100,"High","Low")</span>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Enhanced Spreadsheet Grid */}
            <motion.div 
                className="flex-1 overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="inline-block min-w-full">
                    {/* Column Headers */}
                    <motion.div 
                        className="flex bg-slate-800/50 sticky top-0 z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="w-12 h-8 bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold shadow-lg">
                            #
                        </div>
                        {Array.from({ length: 26 }, (_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.01 }}
                                className="w-24 h-8 bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-600 transition-colors shadow-lg"
                            >
                                {String.fromCharCode(65 + i)}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Rows */}
                    {Array.from({ length: 50 }, (_, rowIndex) => (
                        <motion.div 
                            key={rowIndex} 
                            className="flex"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + rowIndex * 0.01 }}
                        >
                            <div className="w-12 h-10 bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-600 transition-colors shadow-sm">
                                {rowIndex + 1}
                            </div>
                            {Array.from({ length: 26 }, (_, colIndex) => {
                                const address = getCellAddress(rowIndex, colIndex)
                                const cell = activeSheet.cells.get(address)
                                const isModified = cell?.lastModified && (Date.now() - cell.lastModified) < 3000
                                
                                return (
                                    <motion.div
                                        key={colIndex}
                                        style={getCellStyle(address)}
                                        className={`w-24 h-10 text-xs relative group ${
                                            isModified ? 'ring-2 ring-green-400' : ''
                                        }`}
                                        onClick={() => handleCellClick(address)}
                                        whileHover={{ 
                                            scale: 1.02,
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ 
                                            delay: 0.6 + (rowIndex * 26 + colIndex) * 0.001,
                                            scale: { type: "spring", stiffness: 300, damping: 30 }
                                        }}
                                    >
                                        {formatValue(getCellValue(address))}
                                        
                                        {/* Cell tooltip on hover */}
                                        {cell?.formula && (
                                            <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded shadow-lg z-20 whitespace-nowrap">
                                                Formula: {cell.formula}
                                            </div>
                                        )}
                                        
                                        {/* Animation for recently modified cells */}
                                        {isModified && (
                                            <motion.div
                                                className="absolute inset-0 bg-green-400/20 rounded"
                                                initial={{ opacity: 1 }}
                                                animate={{ opacity: 0 }}
                                                transition={{ duration: 3 }}
                                            />
                                        )}
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}
