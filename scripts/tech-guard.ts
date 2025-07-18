/**
 * EuroWeb Web8 Platform - Tech Guard
 * Script industrial per kontrollin e teknologjive te ndaluara
 * 
 * @author Ledjan Ahmati (100% Pronar)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

import fs from 'fs'
import path from 'path'

// Lista e teknologjive te NDALUARA - ZERO TOLERANCE
const FORBIDDEN_TECH = [
  // JavaScript Files - VETEM TYPESCRIPT
  '.js', '.jsx', '.cjs', '.mjs',
  
  // React Hooks - JO HOOKS
  'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo',
  'useRef', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
  
  // State Management - JO STATE LIBS
  'redux', 'zustand', 'jotai', 'recoil', 'mobx', 'valtio',
  'react-redux', '@reduxjs/toolkit', 'redux-toolkit',
  
  // Styling - VETEM VANILLA CSS + PANDA
  'tailwind', 'tailwindcss', 'styled-system', 'styled-components', 'emotion',
  '@emotion/', 'styled-jsx', 'stitches', 'theme-ui', 'chakra-ui',
  'material-ui', 'mui', 'antd', 'bootstrap', 'bulma',
  
  // Build Tools - JO COMPLEX BUILDS
  'vite', 'webpack', 'rollup', 'parcel', 'esbuild', 'swc-loader',
  'vite.config', 'webpack.config', 'rollup.config', 'babel',
  
  // Testing - VETEM VITEST
  'jest', 'jasmine', 'mocha', 'karma', 'cypress', 'playwright',
  '__mocks__', '@/ui',
  'enzyme', 'sinon', 'chai',
  
  // Package Managers - VETEM YARN
  'npm install', 'npm run', 'pnpm', 'bun', 'package-lock.json', 'pnpm-lock.yaml',
  
  // Meta Frameworks - JO META
  'create-react-app', 'next/font', 'next/image', 'next/link',
  'gatsby', 'remix', 'nuxt', 'sveltekit', 'astro', 'storybook',
  
  // Async Patterns - MBAJME SYNC
  'async/await', 'Promise.all', 'Promise.race', 'function',
  '.then(', '.catch(',
  
  // Query Libraries - JO QUERY LIBS
  'react-query', 'swr', 'apollo', 'relay', 'urql', 'graphql-request',
  'axios', 'fetch(', 'XMLHttpRequest',
  
  // CSS Frameworks - VETEM VANILLA
  'style={{', 'tw-', 'class=', 'styled.', 'css`', 'sx=',
  
  // Magic Tools - JO MAGIC
  'auto-import', 'unplugin', 'magic-string', 'code-generator'
]

// Direktoritë që injororhen
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'coverage', '.yarn', 'scripts']

// Fajllat që injororhen (konfigurimi)
const IGNORE_FILES = ['.eslintrc.json', 'next-env.d.ts', 'next.config.mts', 'postman']

// Ekstensionet e LEJUARA
const ALLOWED_EXT = ['.ts', '.tsx', '.mts', '.css', '.json', '.md']

interface ViolationResult {
  file: string
  tech: string
  line: number
  content: string
}

class EuroWebTechGuard {
  private violations: ViolationResult[] = []
  private badFiles: string[] = []
  private totalFiles = 0
  private cleanFiles = 0

  public scan(): void {
    console.log('🛡️  EuroWeb Web8 - TECH GUARD')
    console.log('🚀 Pure TypeScript + ESM + Yarn Berry + Vitest Only')
    console.log('👨‍💻 Autor: Ledjan Ahmati (100% Pronar)')
    console.log('')
    
    this.scanDir('.')
    this.showResults()
  }

  private scanDir(dir: string): void {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && !IGNORE_DIRS.includes(item) && !item.startsWith('.')) {
        this.scanDir(fullPath)
      } else if (stat.isFile()) {
        this.scanFile(fullPath)
      }
    }
  }

  private scanFile(filePath: string): void {
    this.totalFiles++
    const ext = path.extname(filePath)
    const relativePath = path.relative('.', filePath)
    
    // Check file extension
    if (!ALLOWED_EXT.includes(ext) && !path.basename(filePath).startsWith('.')) {
      this.badFiles.push(relativePath)
      console.log(`⛔ BAD FILE: ${relativePath}`)
      return
    }

    // Scan content for text files
    if (['.ts', '.tsx', '.mts', '.js', '.jsx', '.json', '.css'].includes(ext)) {
      this.scanContent(filePath, relativePath)
    } else {
      this.cleanFiles++
    }
  }

  private scanContent(filePath: string, relativePath: string): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')
      let hasViolation = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        for (const tech of FORBIDDEN_TECH) {
          if (line.includes(tech)) {
            this.violations.push({
              file: relativePath,
              tech,
              line: i + 1,
              content: line.trim()
            })
            
            if (!hasViolation) {
              console.log(`⛔ FORBIDDEN TECH in ${relativePath}:`)
              hasViolation = true
            }
            console.log(`   Line ${i + 1}: "${tech}"`)
          }
        }
      }

      if (!hasViolation) {
        this.cleanFiles++
      }
    } catch (error) {
      console.warn(`⚠️  Cannot read: ${relativePath}`)
    }
  }

  private showResults(): void {
    console.log('\n📊 SCAN RESULTS:')
    console.log('='.repeat(50))
    console.log(`📁 Total files: ${this.totalFiles}`)
    console.log(`✅ Clean files: ${this.cleanFiles}`)
    console.log(`⛔ Bad files: ${this.badFiles.length}`)
    console.log(`🚫 Violations: ${this.violations.length}`)

    if (this.badFiles.length > 0 || this.violations.length > 0) {
      console.log('\n❌ PROJECT IS NOT CLEAN!')
      console.log('\n🧹 ACTIONS NEEDED:')
      
      if (this.badFiles.length > 0) {
        console.log('\n📁 Remove these files:')
        this.badFiles.slice(0, 10).forEach(file => console.log(`   - ${file}`))
        if (this.badFiles.length > 10) {
          console.log(`   ... and ${this.badFiles.length - 10} more`)
        }
      }

      if (this.violations.length > 0) {
        console.log('\n🔧 Fix these violations:')
        const techGroups = new Map<string, ViolationResult[]>()
        
        this.violations.forEach(v => {
          if (!techGroups.has(v.tech)) {
            techGroups.set(v.tech, [])
          }
          techGroups.get(v.tech)!.push(v)
        })

        for (const [tech, violations] of techGroups) {
          console.log(`\n   • ${tech} (${violations.length} times)`)
          violations.slice(0, 3).forEach(v => {
            console.log(`     → ${v.file}:${v.line}`)
          })
          if (violations.length > 3) {
            console.log(`     ... and ${violations.length - 3} more`)
          }
        }
      }

      console.log('\n💡 INDUSTRIAL RULES:')
      console.log('   ✅ Only: .ts, .tsx, .mts, .css')
      console.log('   ✅ Use: TypeScript + ESM + Yarn Berry')
      console.log('   ✅ Test: Only Vitest (NO Jest)')
      console.log('   ✅ Style: Vanilla CSS + PandaCSS only')
      console.log('   ✅ Animation: Framer Motion only')
      console.log('   ✅ State: NO hooks, props only')
      console.log('   ✅ Build: NO complex bundlers')
      console.log('   ✅ Async: SYNC patterns only')
      console.log('')

      process.exit(1)
    } else {
      console.log('\n🎉 SUCCESS! PROJECT IS 100% CLEAN!')
      console.log('\n✅ EuroWeb Web8 Industrial Architecture:')
      console.log('   🔹 Pure TypeScript + ESM')
      console.log('   🔹 Yarn Berry 4 + PnP')
      console.log('   🔹 Vitest Testing')
      console.log('   🔹 Vanilla CSS + PandaCSS')
      console.log('   🔹 Framer Motion Animation')
      console.log('   🔹 Zero forbidden technologies')
      console.log('\n🚀 Ready for AGI Development!')
      
      process.exit(0)
    }
  }
}

// Run the guard
const guard = new EuroWebTechGuard()
guard.scan()
