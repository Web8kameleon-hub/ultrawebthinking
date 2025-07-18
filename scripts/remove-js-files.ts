#!/usr/bin/env tsx
/**
 * EuroWeb TypeScript-Only Enforcer
 * Removes all JavaScript files and enforces pure TypeScript development
 */

import { readdirSync, statSync, unlinkSync, rmSync, existsSync } from 'fs'
import { join, extname } from 'path'
import chalk from 'chalk'

class TypeScriptOnlyEnforcer {
  private rootDir: string
  private excludeDirs = ['node_modules', '.git', '.next', 'coverage']
  private jsFilesFound: string[] = []
  private distFoldersFound: string[] = []

  constructor() {
    this.rootDir = process.cwd()
  }

  async enforceTypeScriptOnly(): Promise<void> {
    console.log(chalk.blue('🔧 EuroWeb TypeScript-Only Enforcer'))
    console.log(chalk.gray('─'.repeat(50)))

    // Step 1: Find and remove JavaScript files
    this.findAndRemoveJSFiles()
    
    // Step 2: Remove dist folders
    this.removeDistFolders()
    
    // Step 3: Remove service worker files
    this.removeServiceWorkerFiles()
    
    // Step 4: Clean build artifacts
    this.cleanBuildArtifacts()
    
    // Step 5: Create TypeScript enforcement rules
    this.createEnforcementRules()

    console.log(chalk.green('\n🎉 TypeScript-only enforcement completed!'))
  }

  private async findAndRemoveJSFiles(dir: string = this.rootDir): Promise<void> {
    try {
      const items = readdirSync(dir)
      
      for (const item of items) {
        const fullPath = join(dir, item)
        const stat = statSync(fullPath)
        const relativePath = fullPath.replace(this.rootDir, '.')

        if (stat.isDirectory()) {
          if (!this.excludeDirs.includes(item)) {
            this.findAndRemoveJSFiles(fullPath)
          }
        } else {
          const ext = extname(item)
          
          // Remove JavaScript files
          if (['.js', '.jsx', '.mjs', '.cjs'].includes(ext)) {
            // Keep essential config files but warn about them
            if (this.isEssentialConfigFile(item)) {
              console.log(chalk.yellow(`⚠️ Keeping essential config: ${relativePath}`))
            } else {
              unlinkSync(fullPath)
              this.jsFilesFound.push(relativePath)
              console.log(chalk.red(`🗑️ Removed JS file: ${relativePath}`))
            }
          }
          
          // Remove service worker files
          if (item.includes('sw.') || item.includes('service-worker') || item.includes('workbox')) {
            unlinkSync(fullPath)
            console.log(chalk.red(`🗑️ Removed service worker: ${relativePath}`))
          }
        }
      }
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Could not scan directory: ${dir}`))
    }
  }

  private isEssentialConfigFile(filename: string): boolean {
    const essentialConfigs = [
      'next.config.js',
      '.config.js', 
      'tailwind.config.js',
      'postcss.config.js'
    ]
    return essentialConfigs.includes(filename)
  }

  private async removeDistFolders(): Promise<void> {
    console.log(chalk.yellow('\n🗂️ Removing dist folders...'))
    
    const distPaths = [
      'dist',
      'build', 
      '.next',
      'out',
      'coverage',
      '.turbo'
    ]

    for (const distPath of distPaths) {
      const fullPath = join(this.rootDir, distPath)
      if (existsSync(fullPath)) {
        rmSync(fullPath, { recursive: true, force: true })
        this.distFoldersFound.push(distPath)
        console.log(chalk.red(`🗑️ Removed dist folder: ${distPath}`))
      }
    }
  }

  private async removeServiceWorkerFiles(): Promise<void> {
    console.log(chalk.yellow('\n🚫 Removing service worker files...'))
    
    const swPaths = [
      'public/sw.js',
      'public/service-worker.js',
      'public/workbox-*.js',
      'sw.js',
      'service-worker.js'
    ]

    for (const swPath of swPaths) {
      const fullPath = join(this.rootDir, swPath)
      if (existsSync(fullPath)) {
        unlinkSync(fullPath)
        console.log(chalk.red(`🗑️ Removed service worker: ${swPath}`))
      }
    }
  }

  private async cleanBuildArtifacts(): Promise<void> {
    console.log(chalk.yellow('\n🧹 Cleaning build artifacts...'))
    
    const artifactPaths = [
      'node_modules/.cache',
      '.yarn/cache',
      'tsconfig.tsbuildinfo',
      '.eslintcache'
    ]

    for (const artifactPath of artifactPaths) {
      const fullPath = join(this.rootDir, artifactPath)
      if (existsSync(fullPath)) {
        rmSync(fullPath, { recursive: true, force: true })
        console.log(chalk.green(`✅ Cleaned: ${artifactPath}`))
      }
    }
  }

  private async createEnforcementRules(): Promise<void> {
    console.log(chalk.yellow('\n📋 Creating TypeScript enforcement rules...'))
    
    // Create .tsonly file
    const tsOnlyContent = `# EuroWeb Platform - TypeScript Only
# Ky projekt mbështet vetëm TypeScript - No JavaScript allowed

enforced: true
last_cleanup: ${new Date().toISOString()}
js_files_removed: ${this.jsFilesFound.length}
dist_folders_removed: ${this.distFoldersFound.length}

# Allowed extensions
allowed:
  - .ts
  - .tsx
  - .mts
  - .d.ts

# Forbidden extensions  
forbidden:
  - .js
  - .jsx
  - .mjs
  - .cjs
  - .vue
  - .svelte

# Build outputs to clean
build_outputs:
  - dist/
  - build/
  - .next/
  - out/
  - coverage/

platform: EuroWeb Web8 AGI System
version: 1.0.0
`

    const { writeFileSync } = import('fs')
    writeFileSync(join(this.rootDir, '.tsonly'), tsOnlyContent)
    console.log(chalk.green('✅ Created .tsonly enforcement file'))

    // Update .gitignore to exclude JS files
    this.updateGitignore()
  }

  private async updateGitignore(): Promise<void> {
    const gitignorePath = join(this.rootDir, '.gitignore')
    const { readFileSync, writeFileSync } = import('fs')
    
    let gitignoreContent = ''
    if (existsSync(gitignorePath)) {
      gitignoreContent = readFileSync(gitignorePath, 'utf8')
    }

    const tsOnlyRules = `
# EuroWeb TypeScript-Only Rules
*.js
*.jsx
*.mjs
*.cjs
!next.config.js
!.config.js
!tailwind.config.js
!postcss.config.js

# Build outputs
dist/
build/
out/
.next/
coverage/
.turbo/

# Service workers
sw.js
service-worker.js
workbox-*.js

# Cache directories
node_modules/.cache/
.yarn/cache/
.eslintcache
tsconfig.tsbuildinfo
`

    if (!gitignoreContent.includes('EuroWeb TypeScript-Only Rules')) {
      gitignoreContent += tsOnlyRules
      writeFileSync(gitignorePath, gitignoreContent)
      console.log(chalk.green('✅ Updated .gitignore with TypeScript-only rules'))
    }
  }

  private printSummary(): void {
    console.log(chalk.blue('\n📊 Cleanup Summary:'))
    console.log(chalk.cyan(`🗑️ JavaScript files removed: ${this.jsFilesFound.length}`))
    console.log(chalk.cyan(`📁 Dist folders removed: ${this.distFoldersFound.length}`))
    console.log(chalk.green('✅ Project is now TypeScript-only'))
    
    if (this.jsFilesFound.length > 0) {
      console.log(chalk.yellow('\n📋 Removed JavaScript files:'))
      this.jsFilesFound.forEach(file => {
        console.log(chalk.gray(`  - ${file}`))
      })
    }
  }
}

// Main execution
function main() {
  const enforcer = new TypeScriptOnlyEnforcer()
  enforcer.enforceTypeScriptOnly()
  enforcer.printSummary()
  
  console.log(chalk.blue('\n🚀 EuroWeb is now pure TypeScript!'))
  console.log(chalk.cyan('Ready for AGI development: yarn dev:start'))
}

if (require.main === module) {
  main().catch(console.error)
}

export default TypeScriptOnlyEnforcer
