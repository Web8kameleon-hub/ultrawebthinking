// backend/agi/monitor.ts
/**
 * Monitor.ts
 * Sistem monitorimi dhe logging për AGI
 * © Web8 UltraThinking – Ledjan Ahmati
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  component: string;
  data?: any;
  requestId?: string;
}

interface SystemMetrics {
  memoryUsage: NodeJS.MemoryUsage;
  uptime: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private metrics: SystemMetrics;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.startMetricsCollection();
  }

  private initializeMetrics(): SystemMetrics {
    return {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      activeConnections: 0,
      requestsPerMinute: 0,
      errorRate: 0
    };
  }

  private startMetricsCollection(): void {
    // Update metrics every 10 seconds
    setInterval(() => {
      this.updateMetrics();
    }, 10000);
  }

  private updateMetrics(): void {
    this.metrics = {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      activeConnections: Math.floor(Math.random() * 50) + 10, // Simulated
      requestsPerMinute: Math.floor(Math.random() * 100) + 20, // Simulated
      errorRate: Math.random() * 5 // 0-5% error rate
    };
  }

  debug(message: string, component: string = 'AGI', data?: any, requestId?: string): void {
    this.log('debug', message, component, data, requestId);
  }

  info(message: string, component: string = 'AGI', data?: any, requestId?: string): void {
    this.log('info', message, component, data, requestId);
  }

  warn(message: string, component: string = 'AGI', data?: any, requestId?: string): void {
    this.log('warn', message, component, data, requestId);
  }

  error(message: string, component: string = 'AGI', data?: any, requestId?: string): void {
    this.log('error', message, component, data, requestId);
  }

  critical(message: string, component: string = 'AGI', data?: any, requestId?: string): void {
    this.log('critical', message, component, data, requestId);
  }

  private log(level: LogLevel, message: string, component: string, data?: any, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      component,
      data,
      requestId
    };

    this.logs.unshift(entry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output for development
    if (process.env.NODE_ENV !== 'production') {
      this.consoleOutput(entry);
    }
  }

  private consoleOutput(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.component}]`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(`${prefix} ${entry.message}`, entry.data || '');
        break;
      case 'info':
        console.info(`${prefix} ${entry.message}`, entry.data || '');
        break;
      case 'warn':
        console.warn(`${prefix} ${entry.message}`, entry.data || '');
        break;
      case 'error':
      case 'critical':
        console.error(`${prefix} ${entry.message}`, entry.data || '');
        break;
    }
  }

  getLogs(level?: LogLevel, component?: string, limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (component) {
      filteredLogs = filteredLogs.filter(log => log.component === component);
    }

    return filteredLogs.slice(0, limit);
  }

  getMetrics(): SystemMetrics {
    return { ...this.metrics };
  }

  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check memory usage
    const memUsageMB = this.metrics.memoryUsage.heapUsed / 1024 / 1024;
    if (memUsageMB > 500) {
      score -= 20;
      issues.push('High memory usage detected');
      recommendations.push('Consider memory optimization');
    }

    // Check error rate
    if (this.metrics.errorRate > 2) {
      score -= 15;
      issues.push('High error rate detected');
      recommendations.push('Review error logs and fix issues');
    }

    // Check uptime
    if (this.metrics.uptime < 300) { // Less than 5 minutes
      score -= 10;
      issues.push('System recently restarted');
      recommendations.push('Monitor for stability');
    }

    // Recent error logs
    const recentErrors = this.logs.filter(log => 
      log.level === 'error' || log.level === 'critical'
    ).slice(0, 5);

    if (recentErrors.length > 3) {
      score -= 25;
      issues.push('Multiple recent errors detected');
      recommendations.push('Investigate error patterns');
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (score < 50) status = 'critical';
    else if (score < 75) status = 'warning';

    return {
      status,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }

  clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared', 'Monitor');
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const header = 'Timestamp,Level,Component,Message,RequestId\n';
      const rows = this.logs.map(log => 
        `${log.timestamp},${log.level},${log.component},"${log.message}",${log.requestId || ''}`
      ).join('\n');
      return header + rows;
    }

    return JSON.stringify(this.logs, null, 2);
  }

  // Performance monitoring
  startTimer(operation: string): string {
    const timerId = `timer-${Date.now()}-${Math.random()}`;
    const startTime = performance.now();
    
    this.debug(`Started timer for operation: ${operation}`, 'Performance', { timerId, startTime });
    
    return timerId;
  }

  endTimer(timerId: string, operation: string): number {
    const endTime = performance.now();
    const duration = endTime - (this.extractStartTime(timerId) || endTime);
    
    this.info(`Completed operation: ${operation} in ${duration.toFixed(2)}ms`, 'Performance', { 
      timerId, 
      duration,
      operation 
    });
    
    return duration;
  }

  private extractStartTime(timerId: string): number | null {
    // In a real implementation, we'd store timer start times
    // For now, we'll return null and rely on the calling code
    return null;
  }

  // Request tracking
  trackRequest(method: string, path: string, requestId: string): void {
    this.info(`Request started: ${method} ${path}`, 'Request', { method, path, requestId });
  }

  trackResponse(statusCode: number, duration: number, requestId: string): void {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.log(level, `Request completed: ${statusCode} in ${duration}ms`, 'Response', { 
      statusCode, 
      duration, 
      requestId 
    });
  }
}

// Singleton instance
export const logger = new Logger();

// Export additional utilities
export type { LogLevel, LogEntry, SystemMetrics };
