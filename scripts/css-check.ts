#!/usr/bin/env tsx

/**
 * CSS Approach Verification Script
 * Ensures we use only CSS Modules + CVA (no Panda CSS)
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

import { readFileSync, existsSync } from 'fs'
import { glob } from 'glob'
import { join } from 'path'

const PROJECT_ROOT = process.cwd()

interface CSSReport {
  cssModules: string[]
  cvaUsage: string[]
  pandaUsage: string[]
  cssInJsUsage: string[]
  scssFiles: string[]
  success: boolean
}

async function analyzeCSSApproach(): Promise<CSSReport> {
  const report: CSSReport = {
    cssModules: [],
    cvaUsage: [],
    pandaUsage: [],
    cssInJsUsage: [],
    scssFiles: [],
    success: false
  }

  // Find CSS Modules
  const cssModules = await glob('**/*.module.css', { 
    ignore: ['node_modules/**', '.next/**'] 
  })
  report.cssModules = cssModules

  // Find SCSS/SASS files (forbidden)
  const scssFiles = await glob('**/*.{scss,sass,less}', { 
    ignore: ['node_modules/**', '.next/**'] 
  })
  report.scssFiles = scssFiles

  // Analyze TypeScript files
  const tsFiles = await glob('**/*.{ts,tsx}', { 
    ignore: ['node_modules/**', '.next/**'] 
  })

  for (const file of tsFiles) {
    if (!existsSync(file)) continue
    
    try {
      const content = readFileSync(file, 'utf-8')

      // Check for CVA usage
      if (content.includes('class-variance-authority') || content.includes('cva')) {
        report.cvaUsage.push(file)
      }

      // Check for Panda CSS (forbidden) - only actual imports/usage, ignore own definitions  
      const pandaImportRegex = /(import\s+.*['"].*panda['"\/]|from\s+['"].*panda['"\/]|import\s+.*['"].*@pandacss|from\s+['"].*@pandacss)/
      const pandaUsageRegex = /(panda\(|pandaTokens\.|styled-system\/)/
      // Ignore self (css-check.ts) and comment/string contexts
      const isOwnFile = file.includes('css-check.ts')
      if (!isOwnFile && (pandaImportRegex.test(content) || pandaUsageRegex.test(content))) {
        report.pandaUsage.push(file)
      }

      // Check for CSS-in-JS (forbidden) - but ignore template literals in comments
      const cssInJsRegex = /(styled`|css`|styled\.|styled\()/
      if (cssInJsRegex.test(content) && !file.includes('css-check.ts')) {
        report.cssInJsUsage.push(file)
      }
    } catch (error) {
      console.warn(`Could not read file: ${file}`)
    }
  }

  // Check package.json for forbidden dependencies
  const packageJsonPath = join(PROJECT_ROOT, 'package.json')
  if (existsSync(packageJsonPath)) {
    const packageContent = readFileSync(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageContent)
    
    const forbiddenDeps = [
      'panda', '@pandacss/dev', 'styled-system',
      'styled-components', '@emotion/react', '@emotion/styled',
      'sass', 'less', 'stylus'
    ]

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    for (const dep of forbiddenDeps) {
      if (allDeps[dep]) {
        console.error(`❌ Forbidden dependency found: ${dep}`)
        report.success = false
        return report
      }
    }
  }

  // Determine success
  report.success = 
    report.cssModules.length > 0 &&
    report.cvaUsage.length > 0 &&
    report.pandaUsage.length === 0 &&
    report.cssInJsUsage.length === 0 &&
    report.scssFiles.length === 0

  return report
}

function printReport(report: CSSReport) {
  console.log('\n🎨 CSS Approach Analysis Report')
  console.log('═'.repeat(50))
  
  console.log(`\n✅ CSS Modules: ${report.cssModules.length} files`)
  if (report.cssModules.length > 0) {
    report.cssModules.slice(0, 5).forEach(file => 
      console.log(`   📄 ${file}`)
    )
    if (report.cssModules.length > 5) {
      console.log(`   ... and ${report.cssModules.length - 5} more`)
    }
  }

  console.log(`\n✅ CVA Usage: ${report.cvaUsage.length} files`)
  if (report.cvaUsage.length > 0) {
    report.cvaUsage.slice(0, 3).forEach(file => 
      console.log(`   🎯 ${file}`)
    )
    if (report.cvaUsage.length > 3) {
      console.log(`   ... and ${report.cvaUsage.length - 3} more`)
    }
  }

  if (report.pandaUsage.length > 0) {
    console.log(`\n❌ Panda CSS Usage: ${report.pandaUsage.length} files`)
    report.pandaUsage.forEach(file => 
      console.log(`   🚫 ${file}`)
    )
  }

  if (report.cssInJsUsage.length > 0) {
    console.log(`\n❌ CSS-in-JS Usage: ${report.cssInJsUsage.length} files`)
    report.cssInJsUsage.forEach(file => 
      console.log(`   🚫 ${file}`)
    )
  }

  if (report.scssFiles.length > 0) {
    console.log(`\n❌ SCSS/SASS Files: ${report.scssFiles.length} files`)
    report.scssFiles.forEach(file => 
      console.log(`   🚫 ${file}`)
    )
  }

  console.log(`\n${  '═'.repeat(50)}`)
  
  if (report.success) {
    console.log('🎉 SUCCESS: Perfect CSS approach!')
    console.log('✅ Using CSS Modules + CVA only')
    console.log('✅ No Panda CSS detected')
    console.log('✅ No CSS-in-JS detected')
    console.log('✅ No SCSS/SASS detected')
  } else {
    console.log('⚠️  WARNING: CSS approach violations detected!')
    console.log('Expected: CSS Modules + CVA only')
    console.log('Forbidden: Panda CSS, CSS-in-JS, SCSS/SASS')
  }

  console.log('\n🏗️ EuroWeb Ultra Platform - Pure TypeScript Architecture')
  console.log('👤 Creator: Ledjan Ahmati (100% Owner)')
  console.log('📧 Contact: dealsjona@gmail.com')
}

// Main execution
async function main() {
  try {
    console.log('🔍 Analyzing CSS approach...')
    const report = await analyzeCSSApproach()
    printReport(report)
    
    process.exit(report.success ? 0 : 1)
  } catch (error) {
    console.error('❌ Error analyzing CSS approach:', error)
    process.exit(1)
  }
}

main()
