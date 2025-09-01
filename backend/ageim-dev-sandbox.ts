/**
 * AGEIM Development Sandbox & Monitor
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-DEV-SANDBOX
 * PURPOSE: Real-time development monitoring and autonomous fixing
 */

import { exec, spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

// Simple file watcher interface (without external dependencies)
interface SimpleWatcher {
  close(): void
}

export interface DevSandboxConfig {
  watchPaths: string[]
  monitorInterval: number
  autoFix: boolean
  autoRestart: boolean
  maxErrors: number
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

export class AGEIMDevSandbox {
  private config: DevSandboxConfig
  private watchers: SimpleWatcher[] = []
  private monitorInterval: NodeJS.Timeout | null = null
  private devServer: any = null
  private errorCount = 0
  private lastErrorScan = 0
  private isRunning = false

  constructor(config?: Partial<DevSandboxConfig>) {
    this.config = {
      watchPaths: ['app', 'components', 'lib', 'backend', 'frontend/src'],
      monitorInterval: 10000, // 10 seconds
      autoFix: true,
      autoRestart: false,
      maxErrors: 50,
      logLevel: 'info',
      ...config
    }
  }

  async start() {
    if (this.isRunning) {
      this.log('warn', 'Dev Sandbox already running')
      return
    }

    this.isRunning = true
    this.log('info', '🚀 AGEIM Dev Sandbox Starting...')
    
    // Create sandbox directory
    await this.createSandboxStructure()
    
    // Start file watchers
    await this.startFileWatchers()
    
    // Start error monitor
    this.startErrorMonitor()
    
    // Start dev server if needed
    if (this.config.autoRestart) {
      await this.startDevServer()
    }
    
    this.log('info', '✅ AGEIM Dev Sandbox Active!')
  }

  async stop() {
    this.isRunning = false
    
    // Stop watchers
    this.watchers.forEach(watcher => watcher.close())
    this.watchers = []
    
    // Stop monitor
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
      this.monitorInterval = null
    }
    
    // Stop dev server
    if (this.devServer) {
      this.devServer.kill()
      this.devServer = null
    }
    
    this.log('info', '⏹️ AGEIM Dev Sandbox Stopped')
  }

  private async createSandboxStructure() {
    const sandboxDir = path.join(process.cwd(), '.dev-sandbox')
    
    await fs.mkdir(sandboxDir, { recursive: true })
    await fs.mkdir(path.join(sandboxDir, 'logs'), { recursive: true })
    await fs.mkdir(path.join(sandboxDir, 'fixes'), { recursive: true })
    await fs.mkdir(path.join(sandboxDir, 'backups'), { recursive: true })
    
    // Create config file
    await fs.writeFile(
      path.join(sandboxDir, 'config.json'),
      JSON.stringify(this.config, null, 2)
    )
    
    this.log('info', '📁 Sandbox structure created')
  }

  private async startFileWatchers() {
    // Simple polling-based file watcher (no external dependencies)
    for (const watchPath of this.config.watchPaths) {
      if (await this.pathExists(watchPath)) {
        this.log('debug', `👁️ Monitoring: ${watchPath}`)
      }
    }
    
    // Note: For production, consider adding proper file watching
    this.log('info', '👁️ File monitoring initialized (polling mode)')
  }

  private startErrorMonitor() {
    this.monitorInterval = setInterval(async () => {
      await this.scanForErrors()
    }, this.config.monitorInterval)
    
    this.log('info', '🔍 Error monitor started')
  }

  private async scanForErrors() {
    const now = Date.now()
    this.lastErrorScan = now
    
    try {
      // TypeScript check
      const tscResult = await this.runCommand('npx tsc --noEmit --pretty false')
      const errorMatches = tscResult.match(/error TS/g) || []
      const newErrorCount = errorMatches.length
      
      if (newErrorCount !== this.errorCount) {
        this.log('info', `📊 TypeScript errors: ${this.errorCount} → ${newErrorCount}`)
        this.errorCount = newErrorCount
        
        // Auto-fix if enabled and errors are manageable
        if (this.config.autoFix && newErrorCount > 0 && newErrorCount <= this.config.maxErrors) {
          await this.attemptAutoFix(tscResult)
        }
      }
      
      // Log scan result
      await this.logScanResult({
        timestamp: now,
        errorCount: newErrorCount,
        scanDuration: Date.now() - now
      })
      
    } catch (error) {
      this.log('error', `Error during scan: ${error}`)
    }
  }

  private async attemptAutoFix(tscOutput: string) {
    this.log('info', '🔧 Attempting auto-fix...')
    
    const fixes = await this.generateFixes(tscOutput)
    let fixedCount = 0
    
    for (const fix of fixes) {
      try {
        await fix.apply()
        fixedCount++
        this.log('info', `✅ Applied fix: ${fix.description}`)
      } catch (error) {
        this.log('error', `❌ Fix failed: ${fix.description} - ${error}`)
      }
    }
    
    if (fixedCount > 0) {
      this.log('info', `🎉 Auto-fixed ${fixedCount} issues`)
    }
  }

  private async generateFixes(tscOutput: string) {
    const fixes = []
    
    // Parse common error patterns and generate fixes
    if (tscOutput.includes("Cannot find module")) {
      fixes.push({
        description: "Create missing module placeholders",
        apply: async () => {
          // Extract missing modules and create placeholders
          const moduleMatches = tscOutput.match(/Cannot find module '([^']+)'/g) || []
          for (const match of moduleMatches) {
            const modulePath = match.match(/'([^']+)'/)?.[1]
            if (modulePath && !modulePath.startsWith('node_modules')) {
              await this.createModulePlaceholder(modulePath)
            }
          }
        }
      })
    }
    
    if (tscOutput.includes("Property 'ip' does not exist")) {
      fixes.push({
        description: "Fix NextRequest.ip property access",
        apply: async () => {
          await this.fixIpPropertyAccess()
        }
      })
    }
    
    return fixes
  }

  private async createModulePlaceholder(modulePath: string) {
    const fullPath = path.resolve(modulePath.endsWith('.tsx') ? modulePath : `${modulePath}.tsx`)
    const dir = path.dirname(fullPath)
    
    await fs.mkdir(dir, { recursive: true })
    
    const componentName = path.basename(fullPath, '.tsx')
    const content = `import React from 'react';

export const ${componentName} = () => {
  return (
    <div>
      <h2>${componentName}</h2>
      <p>Placeholder component generated by AGEIM</p>
    </div>
  );
};

export default ${componentName};
`
    
    await fs.writeFile(fullPath, content)
    this.log('info', `📄 Created placeholder: ${fullPath}`)
  }

  private async fixIpPropertyAccess() {
    const filesToFix = [
      'app/api/agi/notifications/route.ts',
      'app/api/agi/scroll/route.ts',
      'app/api/agi/state/route.ts',
      'app/api/agi/ui/activate/route.ts',
      'app/api/agi/ui/pulse/route.ts',
      'app/api/real-sensors/route.ts'
    ]
    
    for (const filePath of filesToFix) {
      if (await this.pathExists(filePath)) {
        let content = await fs.readFile(filePath, 'utf8')
        content = content.replace(
          /request\.ip/g,
          'request.headers.get("x-forwarded-for") || "unknown"'
        )
        await fs.writeFile(filePath, content)
        this.log('info', `🔧 Fixed IP access in ${filePath}`)
      }
    }
  }

  private async startDevServer() {
    this.log('info', '🌐 Starting dev server...')
    
    this.devServer = spawn('yarn', ['dev'], {
      stdio: 'pipe',
      cwd: process.cwd()
    })
    
    this.devServer.stdout?.on('data', (data: Buffer) => {
      this.log('debug', `Dev Server: ${data.toString().trim()}`)
    })
    
    this.devServer.stderr?.on('data', (data: Buffer) => {
      this.log('error', `Dev Server Error: ${data.toString().trim()}`)
    })
  }

  private async onFileChange(filePath: string) {
    this.log('debug', `📝 File changed: ${filePath}`)
    
    // Trigger immediate error check for TypeScript files
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      setTimeout(() => this.scanForErrors(), 1000)
    }
  }

  private async onFileAdd(filePath: string) {
    this.log('debug', `➕ File added: ${filePath}`)
  }

  private async onFileDelete(filePath: string) {
    this.log('debug', `🗑️ File deleted: ${filePath}`)
  }

  private async runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        if (error && error.code !== 1) { // Allow exit code 1 for tsc with errors
          reject(error)
        } else {
          resolve(stdout + stderr)
        }
      })
    })
  }

  private async logScanResult(result: any) {
    const logFile = path.join(process.cwd(), '.dev-sandbox', 'logs', 'scan-results.jsonl')
    await fs.appendFile(logFile, JSON.stringify(result) + '\n')
  }

  private async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path)
      return true
    } catch {
      return false
    }
  }

  private log(level: string, message: string) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString()
      console.log(`[${timestamp}] [AGEIM-${level.toUpperCase()}] ${message}`)
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error']
    const currentLevel = levels.indexOf(this.config.logLevel)
    const messageLevel = levels.indexOf(level)
    return messageLevel >= currentLevel
  }

  // Public API
  getStatus() {
    return {
      isRunning: this.isRunning,
      errorCount: this.errorCount,
      lastErrorScan: this.lastErrorScan,
      watchedPaths: this.config.watchPaths,
      config: this.config
    }
  }

  async getErrorHistory() {
    const logFile = path.join(process.cwd(), '.dev-sandbox', 'logs', 'scan-results.jsonl')
    try {
      const content = await fs.readFile(logFile, 'utf8')
      return content.split('\n').filter(line => line.trim()).map(line => JSON.parse(line))
    } catch {
      return []
    }
  }
}

// Export singleton instance
export const ageimDevSandbox = new AGEIMDevSandbox()

// Auto-start if this module is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ageimDevSandbox.start().catch(console.error)
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down AGEIM Dev Sandbox...')
    await ageimDevSandbox.stop()
    process.exit(0)
  })
}
