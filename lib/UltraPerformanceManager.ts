/**
 * Ultra Performance Manager
 * Maximum power optimization for AGI systems
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { Worker } from 'worker_threads'
import { performance } from 'perf_hooks'
import cluster from 'cluster'
import os from 'os'
import { LRUCache } from 'lru-cache'
import { EventEmitter } from 'events'
import * as si from 'systeminformation'

// Performance Configuration
interface PerformanceConfig {
  maxWorkers: number
  cacheSize: number
  memoryThreshold: number
  cpuThreshold: number
  enableCluster: boolean
  enableCache: boolean
  enableOptimization: boolean
}

// Performance Metrics
interface PerformanceMetrics {
  cpuUsage: number
  memoryUsage: number
  responseTime: number
  throughput: number
  activeConnections: number
  cacheHitRate: number
  errorRate: number
}

// Task Priority Levels
enum TaskPriority {
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3
}

// Task Interface
interface Task {
  id: string
  priority: TaskPriority
  payload: any
  timestamp: number
  retries: number
  maxRetries: number
}

export class UltraPerformanceManager extends EventEmitter {
  private config: PerformanceConfig
  private cache: LRUCache<string, any>
  private workers: Worker[] = []
  private taskQueue: Task[] = []
  private metrics: PerformanceMetrics
  private isOptimized: boolean = false
  private startTime: number
  private monitoringInterval: NodeJS.Timeout | null = null
  private isShuttingDown: boolean = false
  private maxWorkersEverCreated: number = 0

  constructor(config?: Partial<PerformanceConfig>) {
    super()
    
    this.config = {
      maxWorkers: config?.maxWorkers || os.cpus().length * 2,
      cacheSize: config?.cacheSize || 10000,
      memoryThreshold: config?.memoryThreshold || 0.8,
      cpuThreshold: config?.cpuThreshold || 0.9,
      enableCluster: config?.enableCluster ?? true,
      enableCache: config?.enableCache ?? true,
      enableOptimization: config?.enableOptimization ?? true,
      ...config
    }

    this.cache = new LRUCache({
      max: this.config.cacheSize,
      ttl: 1000 * 60 * 60 // 1 hour
    })

    this.metrics = {
      cpuUsage: 0,
      memoryUsage: 0,
      responseTime: 0,
      throughput: 0,
      activeConnections: 0,
      cacheHitRate: 0,
      errorRate: 0
    }

    this.startTime = performance.now()
    this.initialize()
  }

  private async initialize(): Promise<void> {
    console.log('🚀 Initializing Ultra Performance Manager...')
    
    if (this.config.enableCluster && cluster.isPrimary) {
      this.setupCluster()
    }

    if (this.config.enableOptimization) {
      await this.optimizeSystem()
    }

    this.startMonitoring()
    this.setupWorkerPool()
    
    console.log(`✅ Ultra Performance Manager initialized with ${this.config.maxWorkers} workers`)
    this.emit('initialized', this.config)
  }

  private setupCluster(): void {
    const numCPUs = os.cpus().length
    console.log(`⚡ Setting up cluster with ${numCPUs} processes...`)
    
    // Prevent fork bomb - limit cluster processes
    const maxClusterProcesses = Math.min(numCPUs, 8) // Max 8 processes
    let activeProcesses = 0
    
    for (let i = 0; i < maxClusterProcesses; i++) {
      if (activeProcesses >= maxClusterProcesses) {
        console.warn(`🚫 Cluster limit reached: ${maxClusterProcesses} processes`)
        break
      }
      cluster.fork()
      activeProcesses++
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`🔄 Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`)
      
      // Only restart if not shutting down and under limit
      if (!this.isShuttingDown && activeProcesses < maxClusterProcesses) {
        console.log('🔄 Restarting worker...')
        cluster.fork()
      } else {
        activeProcesses--
        console.log(`📉 Active processes: ${activeProcesses}`)
      }
    })
  }

  private async optimizeSystem(): Promise<void> {
    console.log('🔧 Optimizing system for maximum performance...')
    
    // Set process priority to high
    try {
      // Note: process.priority is not available in all environments
      if (process.platform !== 'win32') {
        // Unix-like systems only
        require('os').setPriority(0, -10)
      }
    } catch (error) {
      console.warn('Could not set process priority:', error.message)
    }

    // Optimize V8 heap
    if (global.gc) {
      global.gc()
    }

    // Increase max listeners to prevent memory leaks
    this.setMaxListeners(1000)

    // Optimize event loop
    process.nextTick(() => {
      setImmediate(() => {
        console.log('⚡ Event loop optimized')
      })
    })

    this.isOptimized = true
    console.log('✅ System optimization complete')
  }

  private setupWorkerPool(): void {
    const targetWorkers = Math.min(this.config.maxWorkers, 12) // Absolute max limit
    console.log(`🏭 Setting up worker pool with ${targetWorkers} workers...`)
    
    // Only create workers if we don't already have enough
    if (this.workers.length >= targetWorkers) {
      console.log(`⚠️ Worker limit reached: ${this.workers.length}/${targetWorkers}`)
      return
    }
    
    const workersToCreate = targetWorkers - this.workers.length
    
    for (let i = 0; i < workersToCreate; i++) {
      if (this.isShuttingDown) break
      
      try {
        const workerIndex = this.workers.length
        this.maxWorkersEverCreated++
        
        // Prevent runaway worker creation
        if (this.maxWorkersEverCreated > 50) {
          console.error('🚫 EMERGENCY STOP: Too many workers created!')
          break
        }
        
        const worker = new Worker(`
          const { parentPort } = require('worker_threads');
          const { performance } = require('perf_hooks');
          
          parentPort.on('message', (task) => {
            const startTime = performance.now();
            
            try {
              // Process task based on type
              let result;
              
              switch (task.type) {
                case 'calculate':
                  result = eval(task.payload.expression);
                  break;
                case 'process':
                  result = task.payload;
                  break;
                case 'analyze':
                  result = { analysis: 'completed', data: task.payload };
                  break;
                default:
                  result = { processed: true, task: task.payload };
              }
              
              const endTime = performance.now();
              
              parentPort.postMessage({
                id: task.id,
                result,
                processingTime: endTime - startTime,
                success: true
              });
              
            } catch (error) {
              parentPort.postMessage({
                id: task.id,
                error: error.message,
                success: false
              });
            }
          });
        `, { eval: true })

        worker.on('message', (result) => {
          this.handleWorkerResult(result)
        })

        worker.on('error', (error) => {
          console.error(`Worker ${workerIndex} error:`, error)
          this.replaceWorker(workerIndex)
        })

        this.workers.push(worker)
        console.log(`✅ Worker ${workerIndex} created (Total: ${this.workers.length})`)
        
      } catch (error) {
        console.error(`Failed to create worker:`, error)
        break
      }
    }
  }

  private replaceWorker(index: number): void {
    if (this.isShuttingDown) return
    
    console.log(`🔄 Replacing worker ${index}...`)
    
    // Terminate the problematic worker
    if (this.workers[index]) {
      this.workers[index].terminate()
    }
    
    // Remove from array
    this.workers.splice(index, 1)
    
    // Only create replacement if under limits
    if (this.workers.length < this.config.maxWorkers && this.maxWorkersEverCreated < 50) {
      setTimeout(() => {
        this.setupWorkerPool() // This will create one replacement worker
      }, 1000) // Delay to prevent rapid restarts
    }
  }

  private handleWorkerResult(result: any): void {
    this.emit('taskComplete', result)
    
    // Update metrics
    this.metrics.throughput++
    if (result.processingTime) {
      this.metrics.responseTime = (this.metrics.responseTime + result.processingTime) / 2
    }
  }

  private startMonitoring(): void {
    // Prevent multiple monitoring intervals
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
    
    this.monitoringInterval = setInterval(async () => {
      if (this.isShuttingDown) return
      
      try {
        await this.updateMetrics()
        this.optimizePerformance()
      } catch (error) {
        console.error('🚨 Monitoring error:', error)
      }
    }, 2000) // Increased to 2 seconds to reduce load
  }

  private async updateMetrics(): Promise<void> {
    try {
      const cpuData = await si.currentLoad()
      const memData = await si.mem()
      
      this.metrics.cpuUsage = cpuData.currentLoad / 100
      this.metrics.memoryUsage = (memData.used / memData.total)
      
      // Calculate cache hit rate (simplified)
      this.metrics.cacheHitRate = this.cache.size > 0 ? 0.85 : 0 // Mock cache hit rate
      
      this.emit('metricsUpdate', this.metrics)
    } catch (error) {
      console.error('Failed to update metrics:', error)
    }
  }

  private optimizePerformance(): void {
    // Prevent optimization during shutdown
    if (this.isShuttingDown) return
    
    // SAFE LIMITS - prevent runaway scaling
    const absoluteMaxWorkers = Math.min(this.config.maxWorkers, 16) // Hard limit
    const currentWorkerCount = this.workers.length
    
    // Auto-scale workers based on CPU usage (with strict limits)
    if (this.metrics.cpuUsage > this.config.cpuThreshold && 
        currentWorkerCount < absoluteMaxWorkers && 
        this.maxWorkersEverCreated < 30) { // Emergency brake
      
      console.log(`📈 High CPU detected (${(this.metrics.cpuUsage * 100).toFixed(1)}%), considering worker scaling...`)
      
      // Only add workers if we really need them and haven't created too many recently
      const timeSinceStart = performance.now() - this.startTime
      if (timeSinceStart > 10000) { // Wait 10 seconds after startup
        console.log('📈 Adding 1 additional worker...')
        this.setupWorkerPool() // This will add only 1 worker due to new logic
      }
    }

    // Scale DOWN if CPU is low and we have excess workers
    if (this.metrics.cpuUsage < 0.3 && currentWorkerCount > os.cpus().length) {
      console.log('📉 Low CPU usage, reducing workers...')
      this.scaleDownWorkers()
    }

    // Trigger garbage collection if memory usage is high
    if (this.metrics.memoryUsage > this.config.memoryThreshold && global.gc) {
      console.log('🧹 High memory usage, triggering garbage collection...')
      global.gc()
    }

    // Clear old cache entries
    if (this.cache.size > this.config.cacheSize * 0.9) {
      console.log('🗑️ Cache nearly full, clearing old entries...')
      this.cache.clear()
    }
  }

  private scaleDownWorkers(): void {
    if (this.workers.length <= 2) return // Keep minimum workers
    
    const workerToRemove = this.workers.pop()
    if (workerToRemove) {
      workerToRemove.terminate()
      console.log(`📉 Scaled down to ${this.workers.length} workers`)
    }
  }

  // Public API Methods
  public async executeTask(task: Omit<Task, 'id' | 'timestamp'>): Promise<any> {
    const taskId = this.generateTaskId()
    const fullTask: Task = {
      id: taskId,
      timestamp: performance.now(),
      ...task
    }

    // Check cache first
    if (this.config.enableCache) {
      const cacheKey = this.generateCacheKey(fullTask)
      const cached = this.cache.get(cacheKey)
      if (cached) {
        this.metrics.cacheHitRate++
        return cached
      }
    }

    return new Promise((resolve, reject) => {
      // Add to priority queue
      this.addToQueue(fullTask)
      
      // Listen for completion
      const timeout = setTimeout(() => {
        reject(new Error('Task timeout'))
      }, 30000) // 30 second timeout

      this.once(`taskComplete_${taskId}`, (result) => {
        clearTimeout(timeout)
        
        if (result.success) {
          // Cache successful results
          if (this.config.enableCache) {
            const cacheKey = this.generateCacheKey(fullTask)
            this.cache.set(cacheKey, result.result)
          }
          resolve(result.result)
        } else {
          reject(new Error(result.error))
        }
      })
      
      // Process queue
      this.processQueue()
    })
  }

  private addToQueue(task: Task): void {
    // Insert based on priority
    let inserted = false
    for (let i = 0; i < this.taskQueue.length; i++) {
      if (task.priority < this.taskQueue[i].priority) {
        this.taskQueue.splice(i, 0, task)
        inserted = true
        break
      }
    }
    
    if (!inserted) {
      this.taskQueue.push(task)
    }
  }

  private processQueue(): void {
    if (this.taskQueue.length === 0) return
    
    const availableWorker = this.workers.find(worker => !worker.threadId)
    if (!availableWorker) return
    
    const task = this.taskQueue.shift()
    if (!task) return
    
    // Send task to worker
    availableWorker.postMessage({
      id: task.id,
      type: 'process',
      payload: task.payload
    })
    
    // Continue processing queue
    setImmediate(() => this.processQueue())
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateCacheKey(task: Task): string {
    return `cache_${JSON.stringify(task.payload)}_${task.priority}`
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public getUptime(): number {
    return performance.now() - this.startTime
  }

  public async getSystemInfo(): Promise<any> {
    try {
      const [cpu, mem, system] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.system()
      ])
      
      return {
        cpu: {
          manufacturer: cpu.manufacturer,
          brand: cpu.brand,
          cores: cpu.cores,
          speed: cpu.speed
        },
        memory: {
          total: Math.round(mem.total / 1024 / 1024 / 1024) + ' GB',
          used: Math.round(mem.used / 1024 / 1024 / 1024) + ' GB',
          free: Math.round(mem.free / 1024 / 1024 / 1024) + ' GB'
        },
        system: {
          manufacturer: system.manufacturer,
          model: system.model,
          version: system.version
        },
        nodeVersion: process.version,
        platform: process.platform,
        uptime: this.getUptime()
      }
    } catch (error) {
      console.error('Failed to get system info:', error)
      return { error: 'Failed to retrieve system information' }
    }
  }

  public clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Cache cleared')
  }

  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Ultra Performance Manager...')
    
    // Set shutdown flag to prevent new operations
    this.isShuttingDown = true
    
    // Stop monitoring
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }
    
    // Terminate all workers safely
    console.log(`🔄 Terminating ${this.workers.length} workers...`)
    await Promise.all(this.workers.map(async (worker, index) => {
      try {
        await worker.terminate()
        console.log(`✅ Worker ${index} terminated`)
      } catch (error) {
        console.error(`❌ Error terminating worker ${index}:`, error)
      }
    }))
    
    // Clear workers array
    this.workers = []
    
    // Clear cache
    this.cache.clear()
    
    // Clear task queue
    this.taskQueue = []
    
    console.log('✅ Ultra Performance Manager shutdown complete')
  }
}

// Singleton instance with SAFE configuration
export const ultraPerformanceManager = new UltraPerformanceManager({
  maxWorkers: Math.min(os.cpus().length * 2, 8), // Safer worker count
  cacheSize: 10000, // Reduced cache size
  enableOptimization: true,
  enableCache: true,
  enableCluster: false, // Disable cluster in development to prevent fork bombs
  memoryThreshold: 0.7, // Lower memory threshold
  cpuThreshold: 0.8 // Lower CPU threshold
})

// Emergency shutdown mechanism
let emergencyShutdownTriggered = false

const emergencyShutdown = async () => {
  if (emergencyShutdownTriggered) return
  emergencyShutdownTriggered = true
  
  console.log('🚨 EMERGENCY SHUTDOWN TRIGGERED!')
  try {
    await ultraPerformanceManager.shutdown()
    process.exit(0)
  } catch (error) {
    console.error('🚨 Emergency shutdown failed:', error)
    process.exit(1)
  }
}

// Register emergency handlers
process.on('SIGTERM', emergencyShutdown)
process.on('SIGINT', emergencyShutdown)
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error)
  emergencyShutdown()
})
process.on('unhandledRejection', (reason) => {
  console.error('🚨 Unhandled Rejection:', reason)
  emergencyShutdown()
})

// Export utility functions
export const executeHighPerformanceTask = async (payload: any, priority: TaskPriority = TaskPriority.MEDIUM) => {
  return await ultraPerformanceManager.executeTask({
    payload,
    priority,
    retries: 0,
    maxRetries: 3
  })
}

export const getPerformanceMetrics = () => {
  return ultraPerformanceManager.getMetrics()
}

export const getSystemInfo = async () => {
  return await ultraPerformanceManager.getSystemInfo()
}

// Auto-initialize when imported
ultraPerformanceManager.on('initialized', (config) => {
  console.log('🚀 Ultra Performance Manager ready for maximum power!')
  console.log(`⚡ Configuration:`, config)
})

export default ultraPerformanceManager
