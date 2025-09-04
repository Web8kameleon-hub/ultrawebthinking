// Performance Monitoring System for EuroWeb Ultra
export interface PerformanceMetrics {
  timestamp: number;
  route: string;
  method: string;
  duration: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: number;
  userAgent?: string;
  locale?: string;
  clientId?: string;
}

export interface AGIPerformanceMetrics {
  moduleType: 'core' | 'semantic' | 'planner' | 'executor' | 'monitor';
  operation: string;
  duration: number;
  memoryBefore: number;
  memoryAfter: number;
  success: boolean;
  errorType?: string;
  inputSize?: number;
  outputSize?: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
  avgResponseTime: number;
  cacheSize: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private agiMetrics: AGIPerformanceMetrics[] = [];
  private cacheMetrics: Map<string, CacheMetrics> = new Map();
  private readonly maxMetricsSize = 10000;
  private startTime = Date.now();

  // HTTP Request Performance Tracking
  startRequest(route: string, method: string): string {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store start time for this request
    (global as any).__requestStartTimes = (global as any).__requestStartTimes || new Map();
    (global as any).__requestStartTimes.set(requestId, {
      startTime: Date.now(),
      startMemory: process.memoryUsage(),
      route,
      method
    });
    
    return requestId;
  }

  endRequest(requestId: string, statusCode: number, userAgent?: string, locale?: string, clientId?: string): void {
    const startData = (global as any).__requestStartTimes?.get(requestId);
    if (!startData) return;

    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    
    const metric: PerformanceMetrics = {
      timestamp: endTime,
      route: startData.route,
      method: startData.method,
      duration: endTime - startData.startTime,
      statusCode,
      memoryUsage: {
        rss: endMemory.rss - startData.startMemory.rss,
        heapUsed: endMemory.heapUsed - startData.startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - startData.startMemory.heapTotal,
        external: endMemory.external - startData.startMemory.external,
        arrayBuffers: endMemory.arrayBuffers - startData.startMemory.arrayBuffers
      },
      userAgent,
      locale,
      clientId
    };

    this.addMetric(metric);
    (global as any).__requestStartTimes.delete(requestId);
  }

  // AGI Performance Tracking
  startAGIOperation(moduleType: AGIPerformanceMetrics['moduleType'], operation: string): string {
    const operationId = `agi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    (global as any).__agiOperationStartTimes = (global as any).__agiOperationStartTimes || new Map();
    (global as any).__agiOperationStartTimes.set(operationId, {
      startTime: Date.now(),
      memoryBefore: process.memoryUsage().heapUsed,
      moduleType,
      operation
    });
    
    return operationId;
  }

  endAGIOperation(
    operationId: string, 
    success: boolean = true, 
    errorType?: string,
    inputSize?: number,
    outputSize?: number
  ): void {
    const startData = (global as any).__agiOperationStartTimes?.get(operationId);
    if (!startData) return;

    const endTime = Date.now();
    const memoryAfter = process.memoryUsage().heapUsed;
    
    const metric: AGIPerformanceMetrics = {
      moduleType: startData.moduleType,
      operation: startData.operation,
      duration: endTime - startData.startTime,
      memoryBefore: startData.memoryBefore,
      memoryAfter,
      success,
      errorType,
      inputSize,
      outputSize
    };

    this.addAGIMetric(metric);
    (global as any).__agiOperationStartTimes.delete(operationId);
  }

  // Cache Performance Tracking
  recordCacheHit(cacheType: string, responseTime: number): void {
    const current = this.cacheMetrics.get(cacheType) || {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      cacheSize: 0
    };

    current.hits++;
    current.totalRequests++;
    current.avgResponseTime = ((current.avgResponseTime * (current.totalRequests - 1)) + responseTime) / current.totalRequests;
    current.hitRate = (current.hits / current.totalRequests) * 100;

    this.cacheMetrics.set(cacheType, current);
  }

  recordCacheMiss(cacheType: string, responseTime: number): void {
    const current = this.cacheMetrics.get(cacheType) || {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      cacheSize: 0
    };

    current.misses++;
    current.totalRequests++;
    current.avgResponseTime = ((current.avgResponseTime * (current.totalRequests - 1)) + responseTime) / current.totalRequests;
    current.hitRate = (current.hits / current.totalRequests) * 100;

    this.cacheMetrics.set(cacheType, current);
  }

  // Metrics Storage
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics to prevent memory bloat
    if (this.metrics.length > this.maxMetricsSize) {
      this.metrics = this.metrics.slice(-this.maxMetricsSize);
    }
  }

  private addAGIMetric(metric: AGIPerformanceMetrics): void {
    this.agiMetrics.push(metric);
    
    if (this.agiMetrics.length > this.maxMetricsSize) {
      this.agiMetrics = this.agiMetrics.slice(-this.maxMetricsSize);
    }
  }

  // Analytics & Reporting
  getPerformanceReport(timeWindow: number = 3600000): {
    http: any;
    agi: any;
    cache: any;
    system: any;
  } {
    const now = Date.now();
    const cutoff = now - timeWindow;

    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);
    const recentAGIMetrics = this.agiMetrics.filter(m => m.duration > 0); // Filter valid metrics

    return {
      http: this.analyzeHTTPMetrics(recentMetrics),
      agi: this.analyzeAGIMetrics(recentAGIMetrics),
      cache: this.analyzeCacheMetrics(),
      system: this.getSystemMetrics()
    };
  }

  private analyzeHTTPMetrics(metrics: PerformanceMetrics[]) {
    if (metrics.length === 0) return { totalRequests: 0 };

    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const avgMemory = metrics.reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / metrics.length;
    
    const statusCodes = metrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const routeStats = metrics.reduce((acc, m) => {
      if (!acc[m.route]) {
        acc[m.route] = { count: 0, avgDuration: 0, totalDuration: 0 };
      }
      acc[m.route].count++;
      acc[m.route].totalDuration += m.duration;
      acc[m.route].avgDuration = acc[m.route].totalDuration / acc[m.route].count;
      return acc;
    }, {} as Record<string, any>);

    return {
      totalRequests: metrics.length,
      avgResponseTime: Math.round(avgDuration),
      avgMemoryUsage: Math.round(avgMemory / 1024 / 1024), // MB
      statusCodes,
      routeStats,
      slowestRoutes: Object.entries(routeStats)
        .sort(([,a], [,b]) => (b as any).avgDuration - (a as any).avgDuration)
        .slice(0, 5)
    };
  }

  private analyzeAGIMetrics(metrics: AGIPerformanceMetrics[]) {
    if (metrics.length === 0) return { totalOperations: 0 };

    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const successRate = (metrics.filter(m => m.success).length / metrics.length) * 100;
    
    const moduleStats = metrics.reduce((acc, m) => {
      if (!acc[m.moduleType]) {
        acc[m.moduleType] = { count: 0, avgDuration: 0, totalDuration: 0, successCount: 0 };
      }
      acc[m.moduleType].count++;
      acc[m.moduleType].totalDuration += m.duration;
      acc[m.moduleType].avgDuration = acc[m.moduleType].totalDuration / acc[m.moduleType].count;
      if (m.success) acc[m.moduleType].successCount++;
      return acc;
    }, {} as Record<string, any>);

    return {
      totalOperations: metrics.length,
      avgDuration: Math.round(avgDuration),
      successRate: Math.round(successRate * 100) / 100,
      moduleStats,
      errorTypes: metrics
        .filter(m => !m.success && m.errorType)
        .reduce((acc, m) => {
          acc[m.errorType!] = (acc[m.errorType!] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };
  }

  private analyzeCacheMetrics() {
    const cacheStats: Record<string, CacheMetrics> = {};
    
    this.cacheMetrics.forEach((metrics, cacheType) => {
      cacheStats[cacheType] = { ...metrics };
    });

    return cacheStats;
  }

  private getSystemMetrics() {
    const uptime = Date.now() - this.startTime;
    const memory = process.memoryUsage();
    
    return {
      uptime: Math.round(uptime / 1000), // seconds
      memory: {
        rss: Math.round(memory.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memory.heapTotal / 1024 / 1024), // MB
        external: Math.round(memory.external / 1024 / 1024), // MB
      },
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid
    };
  }

  // Real-time Monitoring
  getRealtimeStats() {
    const now = Date.now();
    const last5Minutes = now - 300000; // 5 minutes
    
    const recentMetrics = this.metrics.filter(m => m.timestamp > last5Minutes);
    const recentAGIMetrics = this.agiMetrics.filter(m => m.duration > 0);
    
    return {
      timestamp: now,
      activeRequests: recentMetrics.length,
      avgResponseTime: recentMetrics.length > 0 
        ? Math.round(recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length)
        : 0,
      agiOperations: recentAGIMetrics.length,
      memoryUsage: process.memoryUsage(),
      uptime: Date.now() - this.startTime
    };
  }

  // Export/Import for persistence
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      agiMetrics: this.agiMetrics,
      cacheMetrics: Object.fromEntries(this.cacheMetrics),
      startTime: this.startTime
    });
  }

  importMetrics(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.metrics = parsed.metrics || [];
      this.agiMetrics = parsed.agiMetrics || [];
      this.cacheMetrics = new Map(Object.entries(parsed.cacheMetrics || {}));
      this.startTime = parsed.startTime || Date.now();
    } catch (error) {
      console.error('❌ Failed to import metrics:', error);
    }
  }

  // Clear old metrics
  clearOldMetrics(olderThan: number = 86400000): void { // 24 hours default
    const cutoff = Date.now() - olderThan;
    
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.agiMetrics = this.agiMetrics.filter(m => m.duration > 0);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
