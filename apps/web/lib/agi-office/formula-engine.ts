/**
 * AGISheet Formula Engine - Real Mathematical & Statistical Functions
 * Universal Office Tools - Production Formula Engine
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra AGI
 * @license MIT
 */

export interface FormulaFunction {
    name: string;
    category: string;
    description: string;
    syntax: string;
    examples: string[];
}

export interface FormulaEngine {
    evaluate(formula: string, context: Map<string, any>): any;
    validateFormula(formula: string): { valid: boolean; error?: string };
    getDependencies(formula: string): string[];
    supportedFunctions: FormulaFunction[];
}

export class AGIFormulaEngine implements FormulaEngine {
    private functions: Map<string, Function> = new Map()

    constructor() {
        this.initializeFunctions()
    }

    // Core evaluation method
    evaluate(formula: string, context: Map<string, any>): any {
        try {
            // Remove = if present
            const cleanFormula = formula.startsWith('=') ? formula.slice(1) : formula

            // Replace cell references with values
            let processedFormula = this.replaceCellReferences(cleanFormula, context)

            // Replace function calls
            processedFormula = this.replaceFunctionCalls(processedFormula)

            // Evaluate the expression
            return this.safeEval(processedFormula)
        } catch (_error) {
            return `#ERROR: ${_error}`
        }
    }

    validateFormula(formula: string): { valid: boolean; error?: string } {
        try {
            // Basic syntax validation
            if (!formula) {return { valid: false, error: 'Empty formula' }}

            const cleanFormula = formula.startsWith('=') ? formula.slice(1) : formula

            // Check for balanced parentheses
            let parenCount = 0
            for (const char of cleanFormula) {
                if (char === '(') {parenCount++}
                if (char === ')') {parenCount--}
                if (parenCount < 0) {return { valid: false, error: 'Unmatched closing parenthesis' }}
            }
            if (parenCount !== 0) {return { valid: false, error: 'Unmatched opening parenthesis' }}

            // Check for valid function names
            const functionPattern = /([A-Z_][A-Z0-9_]*)\s*\(/g
            let match
            while ((match = functionPattern.exec(cleanFormula)) !== null) {
                const funcName = match[1]
                if (!this.functions.has(funcName)) {
                    return { valid: false, error: `Unknown function: ${funcName}` }
                }
            }

            return { valid: true }
        } catch (_error) {
            return { valid: false, error: `Validation error: ${_error}` }
        }
    }

    getDependencies(formula: string): string[] {
        const dependencies: string[] = []
        const cellPattern = /[A-Z]+[0-9]+/g
        const rangePattern = /[A-Z]+[0-9]+:[A-Z]+[0-9]+/g

        let match
        while ((match = cellPattern.exec(formula)) !== null) {
            if (!dependencies.includes(match[0])) {
                dependencies.push(match[0])
            }
        }

        while ((match = rangePattern.exec(formula)) !== null) {
            const range = this.expandRange(match[0])
            range.forEach(cell => {
                if (!dependencies.includes(cell)) {
                    dependencies.push(cell)
                }
            })
        }

        return dependencies
    }

    // Initialize all built-in functions
    private initializeFunctions(): void {
        // Mathematical functions
        this.functions.set('SUM', (...args: number[]) => args.reduce((a, b) => a + b, 0))
        this.functions.set('AVERAGE', (...args: number[]) => args.reduce((a, b) => a + b, 0) / args.length)
        this.functions.set('MIN', (...args: number[]) => Math.min(...args))
        this.functions.set('MAX', (...args: number[]) => Math.max(...args))
        this.functions.set('COUNT', (...args: any[]) => args.filter(x => typeof x === 'number').length)
        this.functions.set('COUNTA', (...args: any[]) => args.filter(x => x !== null && x !== undefined && x !== '').length)
        this.functions.set('ABS', (num: number) => Math.abs(num))
        this.functions.set('ROUND', (num: number, digits = 0) => Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits))
        this.functions.set('SQRT', (num: number) => Math.sqrt(num))
        this.functions.set('POWER', (base: number, exponent: number) => Math.pow(base, exponent))
        this.functions.set('EXP', (num: number) => Math.exp(num))
        this.functions.set('LN', (num: number) => Math.log(num))
        this.functions.set('LOG', (num: number, base = 10) => Math.log(num) / Math.log(base))
        this.functions.set('PI', () => Math.PI)
        this.functions.set('RAND', () => Math.random())
        this.functions.set('RANDBETWEEN', (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min)

        // Statistical functions
        this.functions.set('STDEV', (...args: number[]) => {
            const avg = args.reduce((a, b) => a + b, 0) / args.length
            const variance = args.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (args.length - 1)
            return Math.sqrt(variance)
        })
        this.functions.set('VAR', (...args: number[]) => {
            const avg = args.reduce((a, b) => a + b, 0) / args.length
            return args.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (args.length - 1)
        })
        this.functions.set('MEDIAN', (...args: number[]) => {
            const sorted = args.sort((a, b) => a - b)
            const mid = Math.floor(sorted.length / 2)
            return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
        })
        this.functions.set('MODE', (...args: number[]) => {
            const freq: Map<number, number> = new Map()
            args.forEach(num => freq.set(num, (freq.get(num) ?? 0) + 1))
            let maxFreq = 0
            let mode = args[0]
            freq.forEach((count, num) => {
                if (count > maxFreq) {
                    maxFreq = count
                    mode = num
                }
            })
            return mode
        })

        // Logical functions
        this.functions.set('IF', (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue)
        this.functions.set('AND', (...conditions: boolean[]) => conditions.every(c => c))
        this.functions.set('OR', (...conditions: boolean[]) => conditions.some(c => c))
        this.functions.set('NOT', (condition: boolean) => !condition)
        this.functions.set('TRUE', () => true)
        this.functions.set('FALSE', () => false)

        // Text functions
        this.functions.set('CONCATENATE', (...args: string[]) => args.join(''))
        this.functions.set('LEN', (text: string) => text.length)
        this.functions.set('UPPER', (text: string) => text.toUpperCase())
        this.functions.set('LOWER', (text: string) => text.toLowerCase())
        this.functions.set('LEFT', (text: string, numChars: number) => text.substring(0, numChars))
        this.functions.set('RIGHT', (text: string, numChars: number) => text.substring(text.length - numChars))
        this.functions.set('MID', (text: string, start: number, numChars: number) => text.substring(start - 1, start - 1 + numChars))
        this.functions.set('TRIM', (text: string) => text.trim())
        this.functions.set('FIND', (findText: string, withinText: string, startNum = 1) => {
            const index = withinText.indexOf(findText, startNum - 1)
            return index === -1 ? '#VALUE!' : index + 1
        })

        // Date functions
        this.functions.set('NOW', () => new Date())
        this.functions.set('TODAY', () => new Date().toDateString())
        this.functions.set('YEAR', (date: Date) => date.getFullYear())
        this.functions.set('MONTH', (date: Date) => date.getMonth() + 1)
        this.functions.set('DAY', (date: Date) => date.getDate())
        this.functions.set('WEEKDAY', (date: Date) => date.getDay() + 1)
        this.functions.set('DATEDIF', (startDate: Date, endDate: Date, unit: string) => {
            const diff = endDate.getTime() - startDate.getTime()
            switch (unit.toUpperCase()) {
                case 'D': return Math.floor(diff / (1000 * 60 * 60 * 24))
                case 'M': return Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44))
                case 'Y': return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
                default: return '#VALUE!'
            }
        })

        // Financial functions
        this.functions.set('PV', (rate: number, nper: number, pmt: number, fv = 0, type = 0) => {
            if (rate === 0) {return -pmt * nper - fv}
            const pvAnnuity = pmt * (1 - Math.pow(1 + rate, -nper)) / rate
            const pvLump = fv / Math.pow(1 + rate, nper)
            return type === 0 ? -pvAnnuity - pvLump : -(pvAnnuity * (1 + rate)) - pvLump
        })
        this.functions.set('FV', (rate: number, nper: number, pmt: number, pv = 0, type = 0) => {
            if (rate === 0) {return -pv - pmt * nper}
            const fvAnnuity = pmt * (Math.pow(1 + rate, nper) - 1) / rate
            const fvLump = pv * Math.pow(1 + rate, nper)
            return type === 0 ? -fvAnnuity - fvLump : -(fvAnnuity * (1 + rate)) - fvLump
        })
        this.functions.set('PMT', (rate: number, nper: number, pv: number, fv = 0, type = 0) => {
            if (rate === 0) {return (-pv - fv) / nper}
            const factor = type === 0 ? 1 : 1 + rate
            return (-pv * Math.pow(1 + rate, nper) - fv) / (factor * (Math.pow(1 + rate, nper) - 1) / rate)
        })

        // Lookup functions
        this.functions.set('VLOOKUP', (lookupValue: any, tableArray: any[][], colIndex: number, exactMatch = false) => {
            for (let i = 0; i < tableArray.length; i++) {
                const row = tableArray[i]
                if (exactMatch ? row[0] === lookupValue : row[0].toString().includes(lookupValue.toString())) {
                    return row[colIndex - 1] ?? '#N/A'
                }
            }
            return '#N/A'
        })
        this.functions.set('INDEX', (array: any[][], row: number, col: number) => {
            return array[row - 1]?.[col - 1] ?? '#REF!'
        })
        this.functions.set('MATCH', (lookupValue: any, lookupArray: any[], matchType = 1) => {
            for (let i = 0; i < lookupArray.length; i++) {
                if (matchType === 0 && lookupArray[i] === lookupValue) {return i + 1}
                if (matchType === 1 && lookupArray[i] >= lookupValue) {return i + 1}
                if (matchType === -1 && lookupArray[i] <= lookupValue) {return i + 1}
            }
            return '#N/A'
        })
    }

    private replaceCellReferences(formula: string, context: Map<string, any>): string {
        // Replace single cell references (e.g., A1, B2)
        const cellPattern = /([A-Z]+[0-9]+)/g
        formula = formula.replace(cellPattern, (match) => {
            const value = context.get(match)
            return value !== undefined ? String(value) : '0'
        })

        // Replace range references (e.g., A1:A10)
        const rangePattern = /([A-Z]+[0-9]+:[A-Z]+[0-9]+)/g
        formula = formula.replace(rangePattern, (match) => {
            const cells = this.expandRange(match)
            const values = cells.map(cell => context.get(cell) ?? 0)
            return `[${values.join(',')}]`
        })

        return formula
    }

    private replaceFunctionCalls(formula: string): string {
        const functionPattern = /([A-Z_][A-Z0-9_]*)\s*\(([^)]*)\)/g

        return formula.replace(functionPattern, (match, funcName, args) => {
            const func = this.functions.get(funcName)
            if (!func) {return `#NAME?`}

            try {
                // Parse arguments
                const parsedArgs = this.parseArguments(args)
                const result = func(...parsedArgs)
                return String(result)
            } catch (_error) {
                return `#VALUE!`
            }
        })
    }

    private parseArguments(argsString: string): any[] {
        if (!argsString.trim()) {return []}

        const args: any[] = []
        let current = ''
        let depth = 0
        let inQuotes = false

        for (let i = 0; i < argsString.length; i++) {
            const char = argsString[i]

            if (char === '"' && (i === 0 ?? argsString[i - 1] !== '\\')) {
                inQuotes = !inQuotes
                current += char
            } else if (!inQuotes) {
                if (char === '(') {depth++}
                else if (char === ')') {depth--}
                else if (char === ',' && depth === 0) {
                    args.push(this.parseValue(current.trim()))
                    current = ''
                    continue
                }
                current += char
            } else {
                current += char
            }
        }

        if (current.trim()) {
            args.push(this.parseValue(current.trim()))
        }

        return args
    }

    private parseValue(value: string): any {
        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            const arrayContent = value.slice(1, -1)
            return arrayContent.split(',').map(v => this.parseValue(v.trim()))
        }

        // Handle strings
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1)
        }

        // Handle booleans
        if (value.toLowerCase() === 'true') {return true}
        if (value.toLowerCase() === 'false') {return false}

        // Handle numbers
        const num = parseFloat(value)
        if (!isNaN(num)) {return num}

        return value
    }

    private expandRange(range: string): string[] {
        const [start, end] = range.split(':')
        const startCol = start.match(/[A-Z]+/)?.[0] ?? 'A'
        const startRow = parseInt(start.match(/[0-9]+/)?.[0] ?? '1')
        const endCol = end.match(/[A-Z]+/)?.[0] ?? 'A'
        const endRow = parseInt(end.match(/[0-9]+/)?.[0] ?? '1')

        const cells: string[] = []

        for (let col = this.columnToNumber(startCol); col <= this.columnToNumber(endCol); col++) {
            for (let row = startRow; row <= endRow; row++) {
                cells.push(this.numberToColumn(col) + row)
            }
        }

        return cells
    }

    private columnToNumber(column: string): number {
        let result = 0
        for (let i = 0; i < column.length; i++) {
            result = result * 26 + (column.charCodeAt(i) - 64)
        }
        return result
    }

    private numberToColumn(num: number): string {
        let result = ''
        while (num > 0) {
            num--
            result = String.fromCharCode(65 + (num % 26)) + result
            num = Math.floor(num / 26)
        }
        return result
    }

    private safeEval(expression: string): any {
        // Simple mathematical expression evaluator
        // This is a basic implementation - in production, use a proper expression parser
        try {
            // Basic safety check - only allow numbers, operators, and parentheses
            if (!/^[0-9+\-*/.() \[\],]+$/.test(expression)) {
                return '#VALUE!'
            }

            // Use Function constructor for safer evaluation than eval
            return new Function(`return ${  expression}`)()
        } catch {
            return '#VALUE!'
        }
    }

    get supportedFunctions(): FormulaFunction[] {
        return [
            { name: 'SUM', category: 'math', description: 'Adds all numbers in a range', syntax: 'SUM(number1, [number2], ...)', examples: ['SUM(A1:A10)', 'SUM(1,2,3,4,5)'] },
            { name: 'AVERAGE', category: 'statistical', description: 'Returns the average of arguments', syntax: 'AVERAGE(number1, [number2], ...)', examples: ['AVERAGE(A1:A10)', 'AVERAGE(1,2,3,4,5)'] },
            { name: 'IF', category: 'logical', description: 'Returns one value if condition is true, another if false', syntax: 'IF(logical_test, value_if_true, value_if_false)', examples: ['IF(A1>10,"High","Low")'] },
            { name: 'VLOOKUP', category: 'lookup', description: 'Searches for a value in the first column of a table', syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])', examples: ['VLOOKUP(A1,B:D,2,FALSE)'] },
            { name: 'CONCATENATE', category: 'text', description: 'Joins several text strings into one string', syntax: 'CONCATENATE(text1, [text2], ...)', examples: ['CONCATENATE("Hello"," ","World")'] },
            { name: 'NOW', category: 'date', description: 'Returns the current date and time', syntax: 'NOW()', examples: ['NOW()'] },
            { name: 'PMT', category: 'financial', description: 'Calculates payment for a loan', syntax: 'PMT(rate, nper, pv, [fv], [type])', examples: ['PMT(0.05/12,60,15000)'] }
        ]
    }
}
