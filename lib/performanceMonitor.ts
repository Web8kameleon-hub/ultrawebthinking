/**
 * Web8 Industrial Performance Monitor
 * Production-ready performance tracking dhe optimization
 * 
 * @author UltraWeb Industrial Team
 * @version 8.0.0-PERFORMANCE
 */

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  category: 'response_time' | 'memory' | 'cpu' | 'database' | 'cache' | 'neural';
  endpoint?: string;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  current: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
    activeConnections: number;
  };
  averages: {
    responseTime24h: number;
    memoryUsage24h: number;
    requestsPer24h: number;
  };
  peaks: {
    maxResponseTime: number;
    maxMemoryUsage: number;
    maxConcurrentUsers: number;
  };
  neural: {
    searchesPerHour: number;
    avgNeuralResponseTime: number;
    cacheHitRate: number;
  };
}

class IndustrialPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 10000; // Keep last 10k metrics
  private requestStartTimes = new Map<string, number>();
  private concurrentRequests = 0;
  private readonly startTime = Date.now();
  
  /**
   * Start tracking request performance
   */
  startRequest(requestId: string, endpoint: string): void {
    this.requestStartTimes.set(requestId, Date.now());
    this.concurrentRequests++;
    
    this.addMetric({
      name: 'concurrent_requests',
      value: this.concurrentRequests,
      unit: 'count',
      category: 'response_time',
      endpoint,
      metadata: { requestId }
    });
  }
  
  /**
   * End tracking request performance
   */
  endRequest(
    requestId: string, 
    endpoint: string, 
    statusCode: number,
    metadata?: Record<string, any>
  ): number {
    const startTime = this.requestStartTimes.get(requestId);
    if (!startTime) return 0;
    
    const responseTime = Date.now() - startTime;
    this.requestStartTimes.delete(requestId);
    this.concurrentRequests = Math.max(0, this.concurrentRequests - 1);
    
    this.addMetric({
      name: 'response_time',
      value: responseTime,
      unit: 'ms',
      category: 'response_time',
      endpoint,
      metadata: { 
        requestId, 
        statusCode, 
        ...metadata 
      }
    });
    
    return responseTime;
  }
  
  /**
   * Track memory usage
   */
  trackMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    
    this.addMetric({
      name: 'heap_used',
      value: memUsage.heapUsed,
      unit: 'bytes',
      category: 'memory',
      metadata: {
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers
      }
    });
  }
  
  /**
   * Track database operation
   */
  trackDatabaseOperation(
    operation: string,
    duration: number,
    success: boolean,
    metadata?: Record<string, any>
  ): void {
    this.addMetric({
      name: 'database_operation',
      value: duration,
      unit: 'ms',
      category: 'database',
      metadata: {
        operation,
        success,
        ...metadata
      }
    });
  }
  
  /**
   * Track cache operation
   */
  trackCacheOperation(
    operation: 'hit' | 'miss' | 'set' | 'delete',
    key: string,
    duration?: number
  ): void {
    this.addMetric({
      name: 'cache_operation',
      value: duration || 0,
      unit: 'ms',
      category: 'cache',
      metadata: {
        operation,
        key: key.substring(0, 50) // Truncate long keys
      }
    });
  }
  
  /**
   * Track neural search operation
   */
  trackNeuralSearch(
    query: string,
    resultsCount: number,
    duration: number,
    cacheHit: boolean,
    metadata?: Record<string, any>
  ): void {
    this.addMetric({
      name: 'neural_search',
      value: duration,
      unit: 'ms',
      category: 'neural',
      metadata: {
        queryLength: query.length,
        resultsCount,
        cacheHit,
        ...metadata
      }
    });
  }
  
  /**
   * Get performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    const now = Date.now();
    const last24h = this.getMetricsInTimeRange(now - 24 * 60 * 60 * 1000, now);
    
    // Calculate response time stats
    const responseTimeMetrics = last24h.filter(m => m.name === 'response_time');
    const avgResponseTime24h = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length
      : 0;
    
    const maxResponseTime = responseTimeMetrics.length > 0
      ? Math.max(...responseTimeMetrics.map(m => m.value))
      : 0;
    
    // Calculate memory stats
    const memoryMetrics = last24h.filter(m => m.name === 'heap_used');
    const avgMemoryUsage24h = memoryMetrics.length > 0
      ? memoryMetrics.reduce((sum, m) => sum + m.value, 0) / memoryMetrics.length
      : 0;
    
    const maxMemoryUsage = memoryMetrics.length > 0
      ? Math.max(...memoryMetrics.map(m => m.value))
      : 0;
    
    // Calculate neural stats
    const neuralMetrics = last24h.filter(m => m.name === 'neural_search');
    const avgNeuralResponseTime = neuralMetrics.length > 0
      ? neuralMetrics.reduce((sum, m) => sum + m.value, 0) / neuralMetrics.length
      : 0;
    
    const cacheHits = neuralMetrics.filter(m => m.metadata?.['cacheHit']).length;
    const cacheHitRate = neuralMetrics.length > 0 ? (cacheHits / neuralMetrics.length) * 100 : 0;
    
    // Current stats
    const currentMemory = process.memoryUsage().heapUsed;
    
    return {
      current: {
        responseTime: this.getLatestMetricValue('response_time') || 0,
        memoryUsage: currentMemory,
        cpuUsage: 0, // Would be calculated from actual CPU metrics
        activeConnections: this.concurrentRequests
      },
      averages: {
        responseTime24h: avgResponseTime24h,
        memoryUsage24h: avgMemoryUsage24h,
        requestsPer24h: responseTimeMetrics.length
      },
      peaks: {
        maxResponseTime,
        maxMemoryUsage,
        maxConcurrentUsers: Math.max(...last24h
          .filter(m => m.name === 'concurrent_requests')
          .map(m => m.value), 0)
      },
      neural: {
        searchesPerHour: Math.round(neuralMetrics.length / 24),
        avgNeuralResponseTime,
        cacheHitRate
      }
    };
  }
  
  /**
   * Get performance metrics for monitoring
   */
  getMetricsForMonitoring(): PerformanceMetric[] {
    return this.metrics.slice(-100); // Last 100 metrics
  }
  
  /**
   * Clear old metrics
   */
  clearOldMetrics(): void {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
    this.metrics = this.metrics.filter(
      metric => new Date(metric.timestamp).getTime() > cutoff
    );
    
    }
  
  /**
   * Get system uptime
   */
  getUptime(): number {
    return Date.now() - this.startTime;
  }
  
  // Private methods
  
  private addMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.push(fullMetric);
    
    // Keep metrics within limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
  
  private getMetricsInTimeRange(startTime: number, endTime: number): PerformanceMetric[] {
    return this.metrics.filter(metric => {
      const metricTime = new Date(metric.timestamp).getTime();
      return metricTime >= startTime && metricTime <= endTime;
    });
  }
  
  private getLatestMetricValue(name: string): number | undefined {
    const metric = this.metrics
      .filter(m => m.name === name)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return metric?.value;
  }
}

// Singleton instance
export const performanceMonitor = new IndustrialPerformanceMonitor();

// Middleware wrapper for automatic request tracking
export function withPerformanceTracking(
  handler: (req: unknown, res: unknown) => Promise<any>
) {
  return async (req: unknown, res: unknown) => {
    const requestId = (req as any).headers?.get?.('x-request-id') || 
                     `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const endpoint = (req as any).url || 'unknown';
    performanceMonitor.startRequest(requestId, endpoint);
    
    try {
      const result = await handler(req, res);
      performanceMonitor.endRequest(requestId, endpoint, 200);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      performanceMonitor.endRequest(requestId, endpoint, 500, { error: errorMessage });
      throw error;
    }
  };
}