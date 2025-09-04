/**
 * EuroWeb Ultra Sandbox Engine - AGEIM Developer Mode
 * Autonomous Growth Environment for Industrial Modules
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 1.0.0 Sandbox
 * @license MIT - Secure Sandbox Mode
 */

import fs from 'fs'
import path from 'path'
import { runDevEcho } from './modules/DevEcho'
import { runTestMemory } from './modules/TestMemory'
import { runTestPlanner } from './modules/TestPlanner'

interface SandboxResult {
  memory: any
  planner: any
  devEcho: any
  timestamp: string
  executionTime: number
  systemHealth: number
  securityCheck: boolean
}

interface SandboxConfig {
  maxExecutionTime: number
  allowedOperations: string[]
  securityLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  isolationMode: boolean
}

const SANDBOX_CONFIG: SandboxConfig = {
  maxExecutionTime: 30000, // 30 seconds max
  allowedOperations: ['READ', 'WRITE_SANDBOX', 'SIMULATE', 'TEST'],
  securityLevel: 'HIGH',
  isolationMode: true
}

export class SandboxEngine {
  private logPath: string
  private outputPath: string
  private memoryPath: string
  private isRunning: boolean = false

  constructor() {
    this.logPath = path.join(__dirname, 'storage', 'sandbox-log.txt')
    this.outputPath = path.join(__dirname, 'storage', 'sandbox-output.json')
    this.memoryPath = path.join(__dirname, 'storage', 'sandbox-memory.json')
    this.initializeStorage()
  }

  private initializeStorage(): void {
    const storageDir = path.join(__dirname, 'storage')
    
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true })
    }

    // Initialize log file
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, `[${new Date().toISOString()}] EuroWeb Ultra Sandbox Engine Initialized\n`)
    }

    // Initialize memory file
    if (!fs.existsSync(this.memoryPath)) {
      const initialMemory = {
        initialized: new Date().toISOString(),
        modules: [],
        tests: [],
        performance: {
          averageExecutionTime: 0,
          successRate: 100,
          lastExecution: null
        }
      }
      fs.writeFileSync(this.memoryPath, JSON.stringify(initialMemory, null, 2))
    }
  }

  private log(message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): void {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] [${level}] ${message}\n`
    fs.appendFileSync(this.logPath, logEntry)
    console.log(`🔒 SANDBOX ${level}: ${message}`)
  }

  private async securityCheck(): Promise<boolean> {
    try {
      // Check if sandbox is isolated
      const projectRoot = path.resolve(__dirname, '..')
      const sandboxRoot = __dirname
      
      if (!sandboxRoot.includes('web8-sandbox')) {
        this.log('Security violation: Not running in sandbox directory', 'ERROR')
        return false
      }

      // Check execution time limits
      if (this.isRunning) {
        this.log('Security violation: Sandbox already running', 'WARN')
        return false
      }

      this.log('Security check passed', 'INFO')
      return true
    } catch (error) {
      this.log(`Security check failed: ${error}`, 'ERROR')
      return false
    }
  }

  public async runSandbox(): Promise<SandboxResult> {
    const startTime = Date.now()
    
    try {
      // Security validation
      const securityPassed = await this.securityCheck()
      if (!securityPassed) {
        throw new Error('Security check failed - Sandbox execution aborted')
      }

      this.isRunning = true
      this.log('Starting sandbox execution', 'INFO')

      // Run sandbox modules with timeout protection
      const executionPromise = this.executeModules()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution timeout')), SANDBOX_CONFIG.maxExecutionTime)
      })

      const results = await Promise.race([executionPromise, timeoutPromise]) as any

      const executionTime = Date.now() - startTime
      const sandboxResult: SandboxResult = {
        ...results,
        timestamp: new Date().toISOString(),
        executionTime,
        systemHealth: this.calculateSystemHealth(results),
        securityCheck: true
      }

      // Save results
      fs.writeFileSync(this.outputPath, JSON.stringify(sandboxResult, null, 2))
      this.updateMemory(sandboxResult)
      
      this.log(`Sandbox execution completed in ${executionTime}ms`, 'INFO')
      return sandboxResult

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorResult: SandboxResult = {
        memory: { error: errorMessage },
        planner: { error: errorMessage },
        devEcho: { error: errorMessage },
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime,
        systemHealth: 0,
        securityCheck: false
      }

      this.log(`Sandbox execution failed: ${errorMessage}`, 'ERROR')
      fs.writeFileSync(this.outputPath, JSON.stringify(errorResult, null, 2))
      return errorResult

    } finally {
      this.isRunning = false
    }
  }

  private async executeModules(): Promise<any> {
    this.log('Executing sandbox modules', 'INFO')

    // Run all modules in parallel with individual error handling
    const [memoryResult, plannerResult, devEchoResult] = await Promise.allSettled([
      runTestMemory().catch((err: any) => ({ error: err.message, module: 'TestMemory' })),
      runTestPlanner().catch((err: any) => ({ error: err.message, module: 'TestPlanner' })),
      runDevEcho().catch((err: any) => ({ error: err.message, module: 'DevEcho' }))
    ])

    return {
      memory: memoryResult.status === 'fulfilled' ? memoryResult.value : memoryResult.reason,
      planner: plannerResult.status === 'fulfilled' ? plannerResult.value : plannerResult.reason,
      devEcho: devEchoResult.status === 'fulfilled' ? devEchoResult.value : devEchoResult.reason
    }
  }

  private calculateSystemHealth(results: any): number {
    let health = 100
    
    if (results.memory?.error) health -= 30
    if (results.planner?.error) health -= 30
    if (results.devEcho?.error) health -= 20
    
    if (results.memory?.performance < 80) health -= 10
    if (results.planner?.performance < 80) health -= 10

    return Math.max(0, health)
  }

  private updateMemory(result: SandboxResult): void {
    try {
      const memory = JSON.parse(fs.readFileSync(this.memoryPath, 'utf-8'))
      
      memory.tests.push({
        timestamp: result.timestamp,
        executionTime: result.executionTime,
        systemHealth: result.systemHealth,
        securityCheck: result.securityCheck
      })

      // Keep only last 100 tests
      if (memory.tests.length > 100) {
        memory.tests = memory.tests.slice(-100)
      }

      // Update performance metrics
      const successfulTests = memory.tests.filter((t: any) => t.systemHealth > 70)
      memory.performance = {
        averageExecutionTime: memory.tests.reduce((sum: number, t: any) => sum + t.executionTime, 0) / memory.tests.length,
        successRate: (successfulTests.length / memory.tests.length) * 100,
        lastExecution: result.timestamp
      }

      fs.writeFileSync(this.memoryPath, JSON.stringify(memory, null, 2))
      this.log('Memory updated successfully', 'INFO')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(`Failed to update memory: ${errorMessage}`, 'ERROR')
    }
  }

  public getStatus(): any {
    try {
      const memory = JSON.parse(fs.readFileSync(this.memoryPath, 'utf-8'))
      const lastOutput = fs.existsSync(this.outputPath) 
        ? JSON.parse(fs.readFileSync(this.outputPath, 'utf-8'))
        : null

      return {
        isRunning: this.isRunning,
        config: SANDBOX_CONFIG,
        memory: memory.performance,
        lastExecution: lastOutput,
        uptime: Date.now() - new Date(memory.initialized).getTime()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(`Failed to get status: ${errorMessage}`, 'ERROR')
      return { error: errorMessage }
    }
  }

  public readLogs(lines: number = 50): string[] {
    try {
      const logs = fs.readFileSync(this.logPath, 'utf-8')
      return logs.split('\n').slice(-lines).filter(line => line.trim())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(`Failed to read logs: ${errorMessage}`, 'ERROR')
      return [`Error reading logs: ${errorMessage}`]
    }
  }

  public clearSandbox(): void {
    try {
      // Clear output but preserve memory and logs
      if (fs.existsSync(this.outputPath)) {
        fs.unlinkSync(this.outputPath)
      }
      
      this.log('Sandbox cleared successfully', 'INFO')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.log(`Failed to clear sandbox: ${errorMessage}`, 'ERROR')
    }
  }
}

// Export singleton instance
export const sandboxEngine = new SandboxEngine()

// Main execution function for external use
export async function runSandbox(): Promise<SandboxResult> {
  return await sandboxEngine.runSandbox()
}
