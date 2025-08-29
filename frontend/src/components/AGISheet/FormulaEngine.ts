/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Web8 Formula Engine - Excel-like Formula Processing
 * Industrial-grade formula calculation system for AGI spreadsheets
 */

interface CellData {
  id: string
  value: string | number
  formula?: string
  type: 'text' | 'number' | 'formula' | 'agi'
  computed?: any
  neural?: any
}

interface FormulaContext {
  cells: CellData[]
  getCellValue: (cellId: string) => any
  getCellRange: (range: string) => any[]
}

export class FormulaEngine {
  private context: FormulaContext | null = null

  constructor() {
    // Initialize formula engine
  }

  /**
   * Set the context for formula evaluation
   */
  setContext(cells: CellData[]) {
    this.context = {
      cells,
      getCellValue: (cellId: string) => {
        const cell = cells.find(c => c.id === cellId)
        return cell?.computed !== undefined ? cell.computed : cell?.value || 0
      },
      getCellRange: (range: string) => {
        const values = this.parseRange(range, cells)
        return values.map(cell => cell?.computed !== undefined ? cell.computed : cell?.value || 0)
      }
    }
  }

  /**
   * Evaluate a formula and return the result
   */
  async evaluateFormula(formula: string, cells?: CellData[]): Promise<any> {
    if (cells) this.setContext(cells)
    
    if (!this.context) {
      throw new Error('Formula context not set')
    }

    // Remove = prefix
    const cleanFormula = formula.startsWith('=') ? formula.substring(1) : formula

    try {
      return this.processFormula(cleanFormula)
    } catch (error) {
      console.error('Formula evaluation error:', error)
      return `#ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Process and calculate formula
   */
  private processFormula(formula: string): any {
    if (!this.context) return '#ERROR: No context'

    // Basic Excel-like functions
    const upperFormula = formula.toUpperCase()

    // SUM function: =SUM(A1:A5)
    if (upperFormula.startsWith('SUM(')) {
      const range = this.extractFunctionArgument(formula, 'SUM')
      const values = this.context.getCellRange(range)
      return values.reduce((sum, val) => sum + (Number(val) || 0), 0)
    }

    // AVERAGE function: =AVERAGE(B1:B10)
    if (upperFormula.startsWith('AVERAGE(')) {
      const range = this.extractFunctionArgument(formula, 'AVERAGE')
      const values = this.context.getCellRange(range)
      const numericValues = values.filter(val => !isNaN(Number(val)))
      return numericValues.length > 0 
        ? numericValues.reduce((sum, val) => sum + Number(val), 0) / numericValues.length 
        : 0
    }

    // COUNT function: =COUNT(C1:C10)
    if (upperFormula.startsWith('COUNT(')) {
      const range = this.extractFunctionArgument(formula, 'COUNT')
      const values = this.context.getCellRange(range)
      return values.filter(val => !isNaN(Number(val)) && val !== '' && val !== null).length
    }

    // MAX function: =MAX(D1:D5)
    if (upperFormula.startsWith('MAX(')) {
      const range = this.extractFunctionArgument(formula, 'MAX')
      const values = this.context.getCellRange(range)
      const numericValues = values.filter(val => !isNaN(Number(val))).map(Number)
      return numericValues.length > 0 ? Math.max(...numericValues) : 0
    }

    // MIN function: =MIN(E1:E5)
    if (upperFormula.startsWith('MIN(')) {
      const range = this.extractFunctionArgument(formula, 'MIN')
      const values = this.context.getCellRange(range)
      const numericValues = values.filter(val => !isNaN(Number(val))).map(Number)
      return numericValues.length > 0 ? Math.min(...numericValues) : 0
    }

    // IF function: =IF(F1>10,"High","Low")
    if (upperFormula.startsWith('IF(')) {
      return this.processIfFunction(formula)
    }

    // CONCAT function: =CONCAT(G1," - ",H1)
    if (upperFormula.startsWith('CONCAT(')) {
      return this.processConcatFunction(formula)
    }

    // Simple arithmetic expressions: =A1+B1*2
    if (this.isArithmeticExpression(formula)) {
      return this.evaluateArithmetic(formula)
    }

    // Single cell reference: =A1
    if (this.isCellReference(formula)) {
      return this.context.getCellValue(formula.toUpperCase())
    }

    // If nothing matches, return the formula as text
    return formula
  }

  /**
   * Extract function argument (range or expression)
   */
  private extractFunctionArgument(formula: string, functionName: string): string {
    const start = formula.indexOf('(') + 1
    const end = formula.lastIndexOf(')')
    return formula.substring(start, end).trim()
  }

  /**
   * Process IF function: IF(condition, trueValue, falseValue)
   */
  private processIfFunction(formula: string): any {
    const args = this.parseFunctionArguments(formula, 'IF')
    if (args.length !== 3) return '#ERROR: IF requires 3 arguments'

    const [condition, trueValue, falseValue] = args
    const conditionResult = this.evaluateCondition(condition || '')
    
    return conditionResult ? this.evaluateValue(trueValue || '') : this.evaluateValue(falseValue || '')
  }

  /**
   * Process CONCAT function
   */
  private processConcatFunction(formula: string): string {
    const args = this.parseFunctionArguments(formula, 'CONCAT')
    return args.map(arg => this.evaluateValue(arg)).join('')
  }

  /**
   * Parse function arguments, handling nested commas
   */
  private parseFunctionArguments(formula: string, functionName: string): string[] {
    const argsString = this.extractFunctionArgument(formula, functionName)
    const args: string[] = []
    let current = ''
    let depth = 0
    let inQuotes = false

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i]
      
      if (char === '"' && (i === 0 || argsString[i-1] !== '\\')) {
        inQuotes = !inQuotes
      }
      
      if (!inQuotes) {
        if (char === '(' || char === '[') depth++
        if (char === ')' || char === ']') depth--
      }
      
      if (char === ',' && depth === 0 && !inQuotes) {
        args.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    if (current.trim()) {
      args.push(current.trim())
    }
    
    return args
  }

  /**
   * Evaluate a condition for IF function
   */
  private evaluateCondition(condition: string): boolean {
    // Simple comparison operators
    if (condition.includes('>=')) {
      const [left, right] = condition.split('>=').map(s => s.trim())
      return Number(this.evaluateValue(left || '')) >= Number(this.evaluateValue(right || ''))
    }
    if (condition.includes('<=')) {
      const [left, right] = condition.split('<=').map(s => s.trim())
      return Number(this.evaluateValue(left || '')) <= Number(this.evaluateValue(right || ''))
    }
    if (condition.includes('>')) {
      const [left, right] = condition.split('>').map(s => s.trim())
      return Number(this.evaluateValue(left || '')) > Number(this.evaluateValue(right || ''))
    }
    if (condition.includes('<')) {
      const [left, right] = condition.split('<').map(s => s.trim())
      return Number(this.evaluateValue(left || '')) < Number(this.evaluateValue(right || ''))
    }
    if (condition.includes('=')) {
      const [left, right] = condition.split('=').map(s => s.trim())
      return this.evaluateValue(left || '') == this.evaluateValue(right || '')
    }
    
    // If no operator, treat as truthy check
    return Boolean(this.evaluateValue(condition))
  }

  /**
   * Evaluate a value (cell reference, number, or string)
   */
  private evaluateValue(value: string): any {
    if (!this.context) return value

    // Remove quotes from strings
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1)
    }

    // Cell reference
    if (this.isCellReference(value)) {
      return this.context.getCellValue(value.toUpperCase())
    }

    // Number
    if (!isNaN(Number(value))) {
      return Number(value)
    }

    // Default to string
    return value
  }

  /**
   * Check if formula is an arithmetic expression
   */
  private isArithmeticExpression(formula: string): boolean {
    return /[+\-*/]/.test(formula) && 
           (this.containsCellReferences(formula) || /\d/.test(formula))
  }

  /**
   * Evaluate arithmetic expression
   */
  private evaluateArithmetic(formula: string): number {
    if (!this.context) return 0

    let expression = formula
    
    // Replace cell references with their values
    const cellRefs = formula.match(/[A-Z]+\d+/g) || []
    for (const cellRef of cellRefs) {
      const value = this.context.getCellValue(cellRef)
      expression = expression.replace(new RegExp(cellRef, 'g'), String(Number(value) || 0))
    }

    try {
      // Basic arithmetic evaluation (safer than eval)
      return this.safeArithmeticEval(expression)
    } catch {
      return 0
    }
  }

  /**
   * Safe arithmetic evaluation without using eval()
   */
  private safeArithmeticEval(expression: string): number {
    // Remove whitespace and validate expression contains only safe characters
    const cleaned = expression.replace(/\s/g, '')
    if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
      throw new Error('Invalid arithmetic expression')
    }

    // Simple arithmetic parser for basic operations
    // This is a simplified version - could be enhanced with a proper parser
    try {
      return Function(`"use strict"; return (${cleaned})`)()
    } catch {
      throw new Error('Cannot evaluate expression')
    }
  }

  /**
   * Check if value is a cell reference (A1, B2, etc.)
   */
  private isCellReference(value: string): boolean {
    return /^[A-Z]+\d+$/i.test(value.trim())
  }

  /**
   * Check if formula contains cell references
   */
  private containsCellReferences(formula: string): boolean {
    return /[A-Z]+\d+/i.test(formula)
  }

  /**
   * Parse range notation (A1:A5) and return array of cells
   */
  private parseRange(range: string, cells: CellData[]): CellData[] {
    if (!range.includes(':')) {
      // Single cell
      return cells.filter(cell => cell.id === range.toUpperCase())
    }

    const [start, end] = range.split(':').map(r => r?.trim().toUpperCase())
    const startCol = start?.match(/[A-Z]+/)?.[0] || 'A'
    const startRow = parseInt(start?.match(/\d+/)?.[0] || '1')
    const endCol = end?.match(/[A-Z]+/)?.[0] || 'A'
    const endRow = parseInt(end?.match(/\d+/)?.[0] || '1')

    const result: CellData[] = []
    
    // Convert column letters to numbers for range calculation
    const startColNum = this.columnToNumber(startCol)
    const endColNum = this.columnToNumber(endCol)

    for (let row = startRow; row <= endRow; row++) {
      for (let colNum = startColNum; colNum <= endColNum; colNum++) {
        const colLetter = this.numberToColumn(colNum)
        const cellId = `${colLetter}${row}`
        const cell = cells.find(c => c.id === cellId)
        if (cell) result.push(cell)
      }
    }

    return result
  }

  /**
   * Convert column letter to number (A=1, B=2, etc.)
   */
  private columnToNumber(column: string): number {
    let result = 0
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 64)
    }
    return result
  }

  /**
   * Convert number to column letter (1=A, 2=B, etc.)
   */
  private numberToColumn(num: number): string {
    let result = ''
    while (num > 0) {
      num--
      result = String.fromCharCode(65 + (num % 26)) + result
      num = Math.floor(num / 26)
    }
    return result
  }

  /**
   * Get supported functions list
   */
  getSupportedFunctions(): string[] {
    return [
      'SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN', 
      'IF', 'CONCAT',
      'Arithmetic: +, -, *, /',
      'Cell References: A1, B2, etc.',
      'Ranges: A1:A5, B1:C10'
    ]
  }
}

export default FormulaEngine
