import { Parser } from 'hot-formula-parser';

interface Cell {
  id: string;
  row: number;
  col: number;
  type: 'formula' | 'text' | 'media' | 'agi';
  content: string;
  value?: any;
  isEditing?: boolean;
  isComputing?: boolean;
  hasError?: boolean;
}

interface FormulaResult {
  value: any;
  error?: string;
  type: 'number' | 'string' | 'boolean' | 'error';
}

export class FormulaEngine {
  private parser: Parser;
  private customFunctions: Map<string, Function>;

  constructor() {
    this.parser = new Parser();
    this.customFunctions = new Map();
    this.initializeCustomFunctions();
    this.registerCustomFunctions();
  }

  /**
   * Evaluate a formula expression
   */
  async evaluate(formula: string, context: Map<string, Cell>): Promise<any> {
    try {
      // Remove the leading = if present
      const cleanFormula = formula.startsWith('=') ? formula.slice(1) : formula;
      
      // Replace cell references with actual values
      const processedFormula = this.replaceCellReferences(cleanFormula, context);
      
      // Parse and evaluate the formula
      const result = this.parser.parse(processedFormula);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return this.formatResult(result.result);
    } catch (error) {
      throw new Error(`Formula evaluation failed: ${error}`);
    }
  }

  /**
   * Replace cell references (A1, B2, etc.) with actual values
   */
  private replaceCellReferences(formula: string, context: Map<string, Cell>): string {
    return formula.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
      const colIndex = this.columnToIndex(col);
      const rowIndex = parseInt(row) - 1;
      const cellId = `${rowIndex}-${colIndex}`;
      const cell = context.get(cellId);
      
      if (!cell || cell.value === undefined || cell.value === '') {
        return '0';
      }
      
      // If the cell contains a number, return it as is
      if (typeof cell.value === 'number') {
        return cell.value.toString();
      }
      
      // If it's a string that looks like a number, return it
      const numValue = parseFloat(cell.value);
      if (!isNaN(numValue)) {
        return numValue.toString();
      }
      
      // For text values, wrap in quotes
      return `"${cell.value.toString().replace(/"/g, '""')}"`;
    });
  }

  /**
   * Initialize custom functions for AGISheet
   */
  private initializeCustomFunctions(): void {
    // Statistical functions
    this.customFunctions.set('AVERAGE', (values: number[]) => {
      const numbers = values.filter(v => typeof v === 'number');
      return numbers.length > 0 ? numbers.reduce((a, b) => a + b) / numbers.length : 0;
    });

    this.customFunctions.set('MEDIAN', (values: number[]) => {
      const numbers = values.filter(v => typeof v === 'number').sort((a, b) => a - b);
      if (numbers.length === 0) return 0;
      const mid = Math.floor(numbers.length / 2);
      return numbers.length % 2 === 0 
        ? (numbers[mid - 1] + numbers[mid]) / 2 
        : numbers[mid];
    });

    // String functions
    this.customFunctions.set('CONCAT', (...args: any[]) => {
      return args.map(arg => String(arg)).join('');
    });

    this.customFunctions.set('UPPER', (text: string) => {
      return String(text).toUpperCase();
    });

    this.customFunctions.set('LOWER', (text: string) => {
      return String(text).toLowerCase();
    });

    this.customFunctions.set('LEN', (text: string) => {
      return String(text).length;
    });

    // Date functions
    this.customFunctions.set('NOW', () => {
      return new Date().toISOString();
    });

    this.customFunctions.set('TODAY', () => {
      return new Date().toISOString().split('T')[0];
    });

    // AGI-specific functions
    this.customFunctions.set('SENTIMENT', (text: string) => {
      return this.analyzeSentiment(String(text));
    });

    this.customFunctions.set('WORDCOUNT', (text: string) => {
      return String(text).split(/\s+/).filter(word => word.length > 0).length;
    });

    this.customFunctions.set('LANGUAGE', (text: string) => {
      // Simple language detection based on common words
      const str = String(text).toLowerCase();
      if (str.includes('the ') || str.includes(' and ') || str.includes(' is ')) return 'en';
      if (str.includes('dhe ') || str.includes(' është ') || str.includes(' një ')) return 'sq';
      if (str.includes('et ') || str.includes(' est ') || str.includes(' le ')) return 'fr';
      return 'unknown';
    });

    // Math functions
    this.customFunctions.set('ROUND', (num: number, decimals: number = 0) => {
      const factor = Math.pow(10, decimals);
      return Math.round(Number(num) * factor) / factor;
    });

    this.customFunctions.set('RANDOM', (min: number = 0, max: number = 1) => {
      return Math.random() * (Number(max) - Number(min)) + Number(min);
    });

    // Conditional functions
    this.customFunctions.set('IF', (condition: boolean, trueValue: any, falseValue: any) => {
      return condition ? trueValue : falseValue;
    });

    // Array functions
    this.customFunctions.set('COUNT', (...values: any[]) => {
      return values.filter(v => v !== null && v !== undefined && v !== '').length;
    });

    this.customFunctions.set('COUNTA', (...values: any[]) => {
      return values.filter(v => v !== null && v !== undefined).length;
    });
  }

  /**
   * Register custom functions with the parser
   */
  private registerCustomFunctions(): void {
    this.customFunctions.forEach((func, name) => {
      this.parser.setFunction(name, func as (params: unknown) => unknown);
    });
  }

  /**
   * Convert column letter to index (A=0, B=1, etc.)
   */
  private columnToIndex(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return result - 1;
  }

  /**
   * Convert index to column letter (0=A, 1=B, etc.)
   */
  private indexToColumn(index: number): string {
    let result = '';
    let num = index;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  }

  /**
   * Format the result based on its type
   */
  private formatResult(value: any): any {
    if (typeof value === 'number') {
      // Round very small numbers to avoid floating point precision issues
      if (Math.abs(value) < 1e-10) return 0;
      // Round to 10 decimal places to avoid very long decimals
      if (value % 1 !== 0) {
        return Math.round(value * 1e10) / 1e10;
      }
      return value;
    }
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value);
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(text: string): string {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy', 'love', 'best', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'sad', 'angry', 'disappointed', 'frustrated'];
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Get available function names
   */
  getFunctionNames(): string[] {
    return Array.from(this.customFunctions.keys()).sort();
  }

  /**
   * Validate formula syntax
   */
  validateFormula(formula: string): { isValid: boolean; error?: string } {
    try {
      const cleanFormula = formula.startsWith('=') ? formula.slice(1) : formula;
      const result = this.parser.parse(cleanFormula);
      
      if (result.error) {
        return { isValid: false, error: result.error };
      }
      
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: String(error) };
    }
  }

  /**
   * Get formula dependencies (referenced cells)
   */
  getDependencies(formula: string): string[] {
    const dependencies: string[] = [];
    const cleanFormula = formula.startsWith('=') ? formula.slice(1) : formula;
    
    const cellRefPattern = /([A-Z]+)(\d+)/g;
    let match;
    
    while ((match = cellRefPattern.exec(cleanFormula)) !== null) {
      const colIndex = this.columnToIndex(match[1]);
      const rowIndex = parseInt(match[2]) - 1;
      const cellId = `${rowIndex}-${colIndex}`;
      if (!dependencies.includes(cellId)) {
        dependencies.push(cellId);
      }
    }
    
    return dependencies;
  }
}
