/**
 * EuroWeb Web8 Platform - Advanced Tech Guard 
 * Intelligent content replacement for pure TypeScript
 * 
 * @author Ledjan Ahmati (100% Pronar) 
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial  
 * @license MIT
 */

import * as fs from 'fs'
import * as path from 'path'

const SMART_REPLACEMENTS = [
  // Fix hook comments back to actual imports (if needed)
  { from: /\/\/ NO HOOKS - Use props instead/g, to: '' },
  
  // Fix className= back to className= temporarily for proper conversion
  { from: /className=/g, to: 'style={{}}' },
  
  // Remove .js extensions completely
  { from: /\.ts"/g, to: '.ts"' },
  { from: /\.tsx"/g, to: '.tsx"' },
  { from: /\.mts"/g, to: '.mts"' },
  { from: /\.cts"/g, to: '.cts"' },
  
  // Remove  imports completely
  { from: /import.*from ['"]['"].*\n/g, to: '' },
  { from: //g, to: '' },
  
  // Remove / from content (keep as comments only in test files)
  { from: /(?!.*\.test\.)/g, to: '' },
  { from: /(?!st)/g, to: '' },
  
  // Clean function declarations
  { from: /export default function/g, to: 'export default function' },
  
  // Clean fetch calls
  { from: /fetch\(/g, to: '// REMOVED: // REMOVED: fetch(' },
  
  // Clean async/{ from: /async\s+function/g, to: 'function' },
  { from: /await\s+/g, to: '' },
  
  // Clean className to inline styles for pure CSS
  { from: /className=["'][^"']*["']/g, to: 'className={{}}' }
]

class SmartTechCleaner {
  private filesProcessed = 0
  private replacements = 0

  public async clean(): Promise<void> {
    console.log('🔧 EuroWeb Web8 - SMART TECH CLEANER')
    console.log('🎯 Intelligent content replacement')
    console.log('👨‍💻 Autor: Ledjan Ahmati (100% Pronar)')
    console.log('')

    this.processDirectory('.')
    
    console.log('')
    console.log('📊 SMART CLEANING RESULTS:')
    console.log('='.repeat(50))
    console.log(`📁 Files processed: ${this.filesProcessed}`)
    console.log(`🔄 Replacements made: ${this.replacements}`)
    console.log('')
    console.log('✅ Smart cleaning complete!')
  }

  private async processDirectory(dir: string): Promise<void> {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !this.shouldIgnoreDir(item)) {
        this.processDirectory(fullPath)
      } else if (stat.isFile() && this.shouldProcessFile(fullPath)) {
        this.processFile(fullPath)
      }
    }
  }

  private shouldIgnoreDir(name: string): boolean {
    const ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'coverage', '.yarn']
    return ignoreDirs.includes(name) || name.startsWith('.')
  }

  private shouldProcessFile(filePath: string): boolean {
    const ext = path.extname(filePath)
    return ['.ts', '.tsx', '.mts', '.json', '.css'].includes(ext)
  }

  private async processFile(filePath: string): Promise<void> {
    try {
      let content = fs.readFileSync(filePath, 'utf-8')
      let changed = false
      let fileReplacements = 0

      for (const replacement of SMART_REPLACEMENTS) {
        const before = content
        content = content.replace(replacement.from, replacement.to)
        if (content !== before) {
          changed = true
          fileReplacements++
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8')
        console.log(`   🔧 Fixed: ${path.relative('.', filePath)} (${fileReplacements} replacements)`)
        this.filesProcessed++
        this.replacements += fileReplacements
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${filePath}: ${error}`)
    }
  }
}

// Run the smart cleaner
const cleaner = new SmartTechCleaner()
cleaner.clean().catch(console.error)
