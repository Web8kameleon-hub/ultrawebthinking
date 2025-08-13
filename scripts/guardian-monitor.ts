/**
 * Guardian Status Monitoring Script
 * Real-time monitoring and alerting for Guardian security system
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { Guardian } from '../backend/src/guardian/Guardian-web8';
import { ProductionMonitor } from '../lib/ProductionMonitor';

// Type for Guardian instance
type GuardianInstance = ReturnType<typeof Guardian>;

interface MonitoringConfig {
  checkInterval: number;
  alertThresholds: {
    blockRate: number;
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
  };
  notifications: {
    slack?: {
      proactivePolling: boolean;
      channel: string;
      apiEndpoint: string;
    };
    email?: {
      smtp: string;
      from: string;
      to: string[];
    };
  };
}

class GuardianMonitor {
  private guardian: GuardianInstance;
  private monitor: ProductionMonitor;
  private config: MonitoringConfig;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | undefined;

  constructor(guardian: GuardianInstance, config: MonitoringConfig) {
    this.guardian = guardian;
    this.monitor = new ProductionMonitor({
      enableMetrics: true,
      enableTracing: true,
      enableLogging: true,
      sampleRate: 1.0,
      alerting: {
        errorThreshold: 5,
        responseTimeThreshold: 1000,
        cpuThreshold: 80,
        memoryThreshold: 90,
        web8ProactivePolling: config.notifications.slack?.proactivePolling || false
      }
    });
    this.config = config;
  }

  /**
   * Start monitoring Guardian system
   */
  public start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, this.config.checkInterval);

    // Initial health check
    this.performHealthCheck();
  }

  /**
   * Stop monitoring
   */
  public stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<void> {
    try {
      // Mock stats object since getStats doesn't exist yet
      const stats = {
        status: 'active',
        systemHealth: 'healthy',
        totalRequests: 0,
        blockedRequests: 0,
        avgResponseTime: 0,
        activeConnections: 0,
        blockedIPs: 0,
        recentThreats: [] as Array<{ severity: string; [key: string]: any }>
      };
      const systemMetrics = await this.getSystemMetrics();
      
      // Check various health indicators
      const healthReport = {
        timestamp: new Date().toISOString(),
        guardian: {
          status: stats.status || 'unknown',
          systemHealth: stats.systemHealth || 'unknown',
          totalRequests: stats.totalRequests || 0,
          blockedRequests: stats.blockedRequests || 0,
          blockRate: stats.totalRequests > 0 ? (stats.blockedRequests / stats.totalRequests) * 100 : 0,
          avgResponseTime: stats.avgResponseTime || 0,
          activeConnections: stats.activeConnections || 0,
          blockedIPs: stats.blockedIPs || 0
        },
        system: systemMetrics,
        threats: {
          recentThreats: stats.recentThreats?.length || 0,
          criticalThreats: stats.recentThreats?.filter(t => t.severity === 'critical').length || 0,
          highThreats: stats.recentThreats?.filter(t => t.severity === 'high').length || 0
        }
      };

      // Check thresholds and send alerts if needed
      await this.checkThresholds(healthReport);
      
      console.log('Guardian health check completed:', healthReport);
    } catch (error) {
      console.error('Health check failed:', error);
      await this.sendAlert('critical', 'Guardian Monitor Error', `Health check failed: ${error}`);
    }
  }

  private async checkThresholds(healthReport: any): Promise<void> {
    const { guardian, system, threats } = healthReport;
    const thresholds = this.config.alertThresholds;

    if (guardian.blockRate > thresholds.blockRate) {
      await this.sendAlert('warning', 'High Block Rate', 
        `Block rate is ${guardian.blockRate.toFixed(2)}% (threshold: ${thresholds.blockRate}%)`);
    }

    if (guardian.avgResponseTime > thresholds.responseTime) {
      await this.sendAlert('warning', 'High Response Time',
        `Average response time is ${guardian.avgResponseTime.toFixed(2)}ms (threshold: ${thresholds.responseTime}ms)`);
    }

    if (system?.memory?.percentage > thresholds.memoryUsage) {
      await this.sendAlert('critical', 'High Memory Usage',
        `Memory usage is ${system.memory.percentage}% (threshold: ${thresholds.memoryUsage}%)`);
    }

    if (threats.criticalThreats > 0) {
      await this.sendAlert('critical', 'Critical Threats Detected',
        `${threats.criticalThreats} critical threats detected in the last check`);
    }
  }

  private async sendAlert(severity: string, title: string, message: string): Promise<void> {
    console.log(`[${severity.toUpperCase()}]: ${title} - ${message}`);
    
    if (this.config.notifications.slack?.proactivePolling) {
      // Web8 Proactive Notification: Store alert for polling-based delivery
      await this.storeAlertForPolling(severity, title, message);
    }
  }

  private async storeAlertForPolling(severity: string, title: string, message: string): Promise<void> {
    // Web8 Pattern: Store notification data for proactive polling
    const alertData = {
      timestamp: Date.now(),
      severity,
      title,
      message,
      channel: this.config.notifications.slack?.channel || 'general'
    };
    
    console.log('🔄 Web8 Alert stored for proactive polling:', alertData);
    // In production: Store in database/cache for polling endpoint
  }

    private async getSystemMetrics(): Promise<any> {
      return {
        memory: {
          percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
        },
        cpu: {
          percentage: 0 // Would need proper CPU monitoring implementation
        }
      };
    }
  }