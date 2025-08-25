/**
 * 🤖 AGI Project Organizer - Intelligent Project Structure Management
 * Autonomously organizes and optimizes project structure based on EuroWeb concept
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-AGI-ORGANIZER
 * @contact dealsjona@gmail.com
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join, extname, dirname, basename } from 'path'

export interface ProjectStructure {
  path: string
  type: 'file' | 'directory'
  name: string
  size?: number
  lastModified?: Date
  category?: 'core' | 'feature' | 'config' | 'asset' | 'test' | 'docs'
  importance?: 'critical' | 'high' | 'medium' | 'low'
  dependencies?: string[]
  children?: ProjectStructure[]
}

export interface ProjectConcept {
  name: string
  description: string
  architecture: 'web8' | 'agi' | 'neural' | 'hybrid'
  primaryLanguage: 'typescript' | 'javascript' | 'python'
  framework: 'nextjs' | 'react' | 'vue' | 'vanilla'
  features: string[]
  targetAudience: string[]
  coreValues: string[]
}

export class AGIProjectOrganizer {
  private projectRoot: string
  private concept: ProjectConcept
  private structure: ProjectStructure | null = null

  constructor(projectRoot: string, concept: ProjectConcept) {
    this.projectRoot = projectRoot
    this.concept = concept
  }

  // 🧠 AGI Analysis of Project Structure
  async analyzeProject(): Promise<ProjectStructure> {
    console.log('🤖 AGI analyzing project structure...')
    
    this.structure = this.scanDirectory(this.projectRoot)
    this.categorizeFiles(this.structure)
    this.assessImportance(this.structure)
    this.analyzeDependencies(this.structure)
    
    return this.structure
  }

  // 📁 Recursive directory scanning
  private scanDirectory(dirPath: string): ProjectStructure {
    const stats = statSync(dirPath)
    const name = basename(dirPath)
    
    const structure: ProjectStructure = {
      path: dirPath,
      type: stats.isDirectory() ? 'directory' : 'file',
      name,
      size: stats.size,
      lastModified: stats.mtime,
      children: []
    }

    if (stats.isDirectory()) {
      try {
        const items = readdirSync(dirPath)
        structure.children = items
          .filter(item => !this.shouldIgnore(item))
          .map(item => this.scanDirectory(join(dirPath, item)))
          .sort((a, b) => {
            // Directories first, then files
            if (a.type !== b.type) {
              return a.type === 'directory' ? -1 : 1
            }
            return a.name.localeCompare(b.name)
          })
      } catch (error) {
        console.warn(`Cannot read directory: ${dirPath}`)
      }
    }

    return structure
  }

  // 🔍 Intelligent file categorization
  private categorizeFiles(structure: ProjectStructure): void {
    if (structure.type === 'file') {
      const ext = extname(structure.name).toLowerCase()
      const filename = structure.name.toLowerCase()
      const path = structure.path.toLowerCase()

      // Core system files
      if (filename.includes('web8') || filename.includes('neural') || filename.includes('agi')) {
        structure.category = 'core'
      }
      // Configuration files
      else if (['.json', '.js', '.ts', '.mjs'].includes(ext) && 
               (filename.includes('config') || filename.includes('eslint') || filename.includes('next'))) {
        structure.category = 'config'
      }
      // Test files
      else if (filename.includes('test') || filename.includes('spec') || path.includes('/tests/')) {
        structure.category = 'test'
      }
      // Documentation
      else if (['.md', '.txt'].includes(ext) || filename.includes('readme') || filename.includes('doc')) {
        structure.category = 'docs'
      }
      // Assets
      else if (['.png', '.jpg', '.svg', '.ico', '.css'].includes(ext)) {
        structure.category = 'asset'
      }
      // Features
      else if (['.tsx', '.ts', '.jsx', '.js'].includes(ext) && 
               (path.includes('/components/') || path.includes('/app/') || path.includes('/lib/'))) {
        structure.category = 'feature'
      }
      else {
        structure.category = 'feature' // Default
      }
    }

    // Process children
    structure.children?.forEach(child => this.categorizeFiles(child))
  }

  // ⚡ Assess file importance based on AGI analysis
  private assessImportance(structure: ProjectStructure): void {
    if (structure.type === 'file') {
      const filename = structure.name.toLowerCase()
      const path = structure.path.toLowerCase()
      
      // Critical files
      if (filename.includes('neural-response-engine') || 
          filename.includes('pure-neural-engine') ||
          filename.includes('web8') ||
          filename === 'package.json' ||
          filename === 'next.config.mts') {
        structure.importance = 'critical'
      }
      // High importance
      else if (structure.category === 'core' || 
               filename.includes('ultrai') ||
               filename.includes('agi') ||
               path.includes('/components/agi')) {
        structure.importance = 'high'
      }
      // Medium importance
      else if (structure.category === 'feature' || structure.category === 'config') {
        structure.importance = 'medium'
      }
      // Low importance
      else {
        structure.importance = 'low'
      }
    }

    structure.children?.forEach(child => this.assessImportance(child))
  }

  // 🔗 Analyze file dependencies
  private analyzeDependencies(structure: ProjectStructure): void {
    if (structure.type === 'file' && ['.ts', '.tsx', '.js', '.jsx'].includes(extname(structure.name))) {
      try {
        const content = readFileSync(structure.path, 'utf-8')
        const imports = this.extractImports(content)
        structure.dependencies = imports
      } catch (error) {
        console.warn(`Cannot read file: ${structure.path}`)
      }
    }

    structure.children?.forEach(child => this.analyzeDependencies(child))
  }

  // 📤 Extract import statements
  private extractImports(content: string): string[] {
    const importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g
    const imports: string[] = []
    let match

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1])
    }

    return imports
  }

  // 🚫 Files to ignore during scanning
  private shouldIgnore(name: string): boolean {
    const ignorePatterns = [
      'node_modules',
      '.next',
      '.git',
      'dist',
      'build',
      '.DS_Store',
      'Thumbs.db',
      '.env.local',
      '.env.development.local',
      '.env.production.local'
    ]

    return ignorePatterns.some(pattern => name.includes(pattern))
  }

  // 🎯 Generate optimization recommendations
  generateRecommendations(): string[] {
    if (!this.structure) {
      throw new Error('Project must be analyzed first')
    }

    const recommendations: string[] = []

    // Check for core AGI structure
    const hasNeuralEngine = this.findFileByName(this.structure, 'neural-response-engine.ts') ||
                           this.findFileByName(this.structure, 'pure-neural-engine.ts')
    
    if (!hasNeuralEngine) {
      recommendations.push('🧠 Missing neural response engine - critical for AGI functionality')
    }

    // Check for Web8 components
    const web8Components = this.findFilesByPattern(this.structure, /web8/i)
    if (web8Components.length === 0) {
      recommendations.push('🌐 Consider adding Web8 prefixed components for brand consistency')
    }

    // Check for performance optimization
    const hasLazyLoader = this.findFileByName(this.structure, 'LazyLoader.tsx')
    if (!hasLazyLoader) {
      recommendations.push('⚡ Add LazyLoader component for performance optimization')
    }

    // Check for translation support
    const hasTranslation = this.findFilesByPattern(this.structure, /translat/i)
    if (hasTranslation.length === 0) {
      recommendations.push('🌍 Add translation system for multilingual support (Albanian priority)')
    }

    return recommendations
  }

  // 🔍 Helper methods for finding files
  private findFileByName(structure: ProjectStructure, name: string): ProjectStructure | null {
    if (structure.type === 'file' && structure.name === name) {
      return structure
    }

    if (structure.children) {
      for (const child of structure.children) {
        const found = this.findFileByName(child, name)
        if (found) return found
      }
    }

    return null
  }

  private findFilesByPattern(structure: ProjectStructure, pattern: RegExp): ProjectStructure[] {
    const results: ProjectStructure[] = []

    if (structure.type === 'file' && pattern.test(structure.name)) {
      results.push(structure)
    }

    if (structure.children) {
      for (const child of structure.children) {
        results.push(...this.findFilesByPattern(child, pattern))
      }
    }

    return results
  }

  // 📊 Generate project report
  generateReport(): string {
    if (!this.structure) {
      throw new Error('Project must be analyzed first')
    }

    const stats = this.calculateStats(this.structure)
    const recommendations = this.generateRecommendations()

    return `
🤖 AGI Project Analysis Report
═══════════════════════════════

📁 PROJECT: ${this.concept.name}
🏗️  ARCHITECTURE: ${this.concept.architecture.toUpperCase()}
🎯 FRAMEWORK: ${this.concept.framework.toUpperCase()}

📊 STRUCTURE STATISTICS:
┌─────────────────────┬─────────┐
│ Category            │ Count   │
├─────────────────────┼─────────┤
│ 🔥 Critical Files   │ ${stats.critical.toString().padStart(7)} │
│ ⚡ High Priority    │ ${stats.high.toString().padStart(7)} │
│ 📦 Medium Priority  │ ${stats.medium.toString().padStart(7)} │
│ 📄 Low Priority     │ ${stats.low.toString().padStart(7)} │
├─────────────────────┼─────────┤
│ 📁 Total Files      │ ${stats.totalFiles.toString().padStart(7)} │
│ 📂 Directories      │ ${stats.totalDirs.toString().padStart(7)} │
└─────────────────────┴─────────┘

🎯 OPTIMIZATION RECOMMENDATIONS:
${recommendations.map(rec => `• ${rec}`).join('\n')}

🚀 AGI COMPLIANCE SCORE: ${this.calculateComplianceScore()}%

💡 NEXT STEPS:
• Implement missing neural components
• Optimize performance with lazy loading
• Enhance Albanian language support
• Add comprehensive testing suite
`
  }

  // 📈 Calculate project statistics
  private calculateStats(structure: ProjectStructure): any {
    const stats = {
      totalFiles: 0,
      totalDirs: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    const traverse = (node: ProjectStructure) => {
      if (node.type === 'file') {
        stats.totalFiles++
        switch (node.importance) {
          case 'critical': stats.critical++; break
          case 'high': stats.high++; break
          case 'medium': stats.medium++; break
          case 'low': stats.low++; break
        }
      } else {
        stats.totalDirs++
      }

      node.children?.forEach(traverse)
    }

    traverse(structure)
    return stats
  }

  // 🎯 Calculate AGI compliance score
  private calculateComplianceScore(): number {
    if (!this.structure) return 0

    let score = 0
    const maxScore = 100

    // Neural engine presence (30 points)
    if (this.findFileByName(this.structure, 'neural-response-engine.ts') ||
        this.findFileByName(this.structure, 'pure-neural-engine.ts')) {
      score += 30
    }

    // Web8 components (20 points)
    const web8Components = this.findFilesByPattern(this.structure, /web8/i)
    if (web8Components.length > 0) {
      score += 20
    }

    // Performance optimization (15 points)
    if (this.findFileByName(this.structure, 'LazyLoader.tsx')) {
      score += 15
    }

    // Translation support (15 points)
    const translationFiles = this.findFilesByPattern(this.structure, /translat/i)
    if (translationFiles.length > 0) {
      score += 15
    }

    // AGI features (10 points)
    const agiFiles = this.findFilesByPattern(this.structure, /agi/i)
    if (agiFiles.length >= 3) {
      score += 10
    }

    // Project structure (10 points)
    const hasComponents = this.findFilesByPattern(this.structure, /components/i).length > 0
    const hasLib = this.findFilesByPattern(this.structure, /lib/i).length > 0
    if (hasComponents && hasLib) {
      score += 10
    }

    return Math.min(score, maxScore)
  }
}

// 🎯 EuroWeb Project Concept Definition
export const euroWebConcept: ProjectConcept = {
  name: "EuroWeb AGI Platform",
  description: "Revolutionary AI platform with Albanian language mastery and neural processing",
  architecture: "hybrid",
  primaryLanguage: "typescript",
  framework: "nextjs",
  features: [
    "Neural Response Engine",
    "Albanian Language Support", 
    "Real-time AGI Processing",
    "Multi-model AI Integration",
    "Performance Optimization",
    "Creative AI Responses",
    "Ethical AI Filtering",
    "Universal Translation"
  ],
  targetAudience: [
    "Albanian Speakers",
    "AI Researchers", 
    "Developers",
    "Creative Professionals"
  ],
  coreValues: [
    "Innovation",
    "Cultural Preservation",
    "Performance Excellence",
    "Ethical AI",
    "User Experience"
  ]
}

// 🚀 AGI Auto-Organization Function
export async function autoOrganizeProject(projectPath: string): Promise<string> {
  console.log('🤖 AGI Project Organizer starting...')
  
  const organizer = new AGIProjectOrganizer(projectPath, euroWebConcept)
  
  try {
    await organizer.analyzeProject()
    const report = organizer.generateReport()
    
    console.log(report)
    return report
    
  } catch (error) {
    console.error('❌ AGI Organization failed:', error)
    throw error
  }
}
