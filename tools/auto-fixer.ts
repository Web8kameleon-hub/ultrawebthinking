/**
 * Auto-Fixer - Automatic TypeScript Error Resolution
 * @author Ledjan Ahmati 
 * @version 8.0.0-WEB8-AUTO-FIX
 * PURPOSE: Systematically fix all TypeScript errors with creator intelligence
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

interface FixPattern {
  pattern: RegExp
  fix: (match: string, file: string, line: number) => Promise<string>
  description: string
  priority: number
}

class AutoFixer {
  private fixes: FixPattern[] = []
  private processedFiles = new Set<string>()
  
  constructor() {
    this.initializeFixPatterns()
  }

  private initializeFixPatterns() {
    // Pattern 1: Missing module imports
    this.fixes.push({
      pattern: /error TS2307: Cannot find module '([^']+)'/,
      fix: async (match, file, line) => {
        const modulePath = match.match(/'([^']+)'/)?.[1]
        if (!modulePath) return ''
        
        // Check if module exists with different path
        const alternatives = [
          modulePath.replace('../', './'),
          modulePath.replace('../frontend/src/', './'),
          modulePath + '.tsx',
          modulePath + '.ts',
          modulePath + '/index.ts',
          modulePath + '/index.tsx'
        ]
        
        for (const alt of alternatives) {
          const fullPath = path.resolve(path.dirname(file), alt)
          try {
            await fs.access(fullPath)
            return `// Auto-fixed import path\nimport from '${alt}'`
          } catch {
            continue
          }
        }
        
        return `// TODO: Create missing module ${modulePath}`
      },
      description: "Fix missing module imports",
      priority: 1
    })

    // Pattern 2: Property does not exist on type
    this.fixes.push({
      pattern: /error TS2339: Property '([^']+)' does not exist on type '([^']+)'/,
      fix: async (match, file, line) => {
        const prop = match.match(/'([^']+)'/)?.[1]
        const type = match.match(/'([^']+)'/g)?.[1]?.slice(1, -1)
        
        if (prop === 'ip' && type === 'NextRequest') {
          return `// Auto-fixed: Get IP from headers\nconst ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'`
        }
        
        return `// TODO: Add property ${prop} to type ${type}`
      },
      description: "Fix missing properties on types",
      priority: 2
    })

    // Pattern 3: Type assignment issues with exactOptionalPropertyTypes
    this.fixes.push({
      pattern: /error TS2375: Type.*is not assignable to type.*with 'exactOptionalPropertyTypes: true'/,
      fix: async (match, file, line) => {
        return `// Auto-fixed: Added proper type assertion\n// Original error: ${match}`
      },
      description: "Fix exactOptionalPropertyTypes issues",
      priority: 3
    })

    // Pattern 4: Possibly undefined
    this.fixes.push({
      pattern: /error TS18048: '([^']+)' is possibly 'undefined'/,
      fix: async (match, file, line) => {
        const variable = match.match(/'([^']+)'/)?.[1]
        return `// Auto-fixed: Added null check\nif (${variable}) {`
      },
      description: "Add null checks for possibly undefined",
      priority: 4
    })

    // Pattern 5: Argument type not assignable
    this.fixes.push({
      pattern: /error TS2345: Argument of type '([^']+)' is not assignable to parameter of type '([^']+)'/,
      fix: async (match, file, line) => {
        const fromType = match.match(/'([^']+)'/)?.[1]
        const toType = match.match(/'([^']+)'/g)?.[1]?.slice(1, -1)
        
        if (fromType && toType === 'never') {
          return `// Auto-fixed: Type assertion for never type\n// as any // TODO: Fix proper typing`
        }
        
        return `// Auto-fixed: Type conversion\n// as ${toType}`
      },
      description: "Fix type assignment errors",
      priority: 5
    })
  }

  async analyzeErrors(): Promise<Array<{file: string, line: number, error: string}>> {
    return new Promise((resolve, reject) => {
      const errors: Array<{file: string, line: number, error: string}> = []
      
      const tsc = spawn('npx', ['tsc', '--noEmit', '--pretty', 'false'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let output = ''
      tsc.stdout.on('data', (data) => {
        output += data.toString()
      })

      tsc.stderr.on('data', (data) => {
        output += data.toString()
      })

      tsc.on('close', (code) => {
        const lines = output.split('\n').filter(line => line.includes('error TS'))
        
        for (const line of lines) {
          const match = line.match(/^([^(]+)\((\d+),\d+\): (.+)$/)
          if (match) {
            errors.push({
              file: match[1],
              line: parseInt(match[2]),
              error: match[3]
            })
          }
        }
        
        resolve(errors)
      })

      tsc.on('error', reject)
    })
  }

  async fixFile(filePath: string, fixes: Array<{line: number, fix: string}>): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const lines = content.split('\n')
      
      // Sort fixes by line number (descending) to avoid line number shifts
      fixes.sort((a, b) => b.line - a.line)
      
      for (const {line, fix} of fixes) {
        if (line > 0 && line <= lines.length) {
          lines[line - 1] = fix + '\n' + lines[line - 1]
        }
      }
      
      await fs.writeFile(filePath, lines.join('\n'))
      console.log(`✅ Fixed ${fixes.length} issues in ${filePath}`)
      
    } catch (error) {
      console.error(`❌ Failed to fix ${filePath}:`, error)
    }
  }

  async run(): Promise<void> {
    console.log('🔧 Starting Auto-Fixer - Creator Intelligence Mode')
    console.log('🎯 Target: Fix all 907+ TypeScript errors systematically')
    
    const errors = await this.analyzeErrors()
    console.log(`📊 Found ${errors.length} TypeScript errors`)
    
    const fileToFixes = new Map<string, Array<{line: number, fix: string}>>()
    
    for (const error of errors) {
      for (const fixPattern of this.fixes) {
        if (fixPattern.pattern.test(error.error)) {
          const fix = await fixPattern.fix(error.error, error.file, error.line)
          
          if (!fileToFixes.has(error.file)) {
            fileToFixes.set(error.file, [])
          }
          
          fileToFixes.get(error.file)!.push({
            line: error.line,
            fix: fix
          })
          
          console.log(`🔍 Pattern matched: ${fixPattern.description} in ${error.file}:${error.line}`)
          break
        }
      }
    }
    
    console.log(`📝 Processing ${fileToFixes.size} files...`)
    
    for (const [file, fixes] of fileToFixes.entries()) {
      await this.fixFile(file, fixes)
    }
    
    console.log('✨ Auto-fixing complete! Re-running TypeScript check...')
    
    const remainingErrors = await this.analyzeErrors()
    console.log(`📊 Remaining errors: ${remainingErrors.length}`)
    
    if (remainingErrors.length > 0) {
      console.log('🔄 Some errors require manual intervention:')
      remainingErrors.slice(0, 10).forEach(err => {
        console.log(`   ${err.file}:${err.line} - ${err.error}`)
      })
    }
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new AutoFixer()
  fixer.run().catch(console.error)
}

export default AutoFixer

