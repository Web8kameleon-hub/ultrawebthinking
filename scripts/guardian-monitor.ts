/**
 * Guardian Status Monitoring Script
 * Real-time monitoring and alerting for Guardian security system
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

import { Guardian } from '../backend/guardian/Guardian';
import { ProductionMonitor } from '../lib/ProductionMonitor';

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
      webhook: string;
      channel: string;
    };
    email?: {
      smtp: string;
      from: string;
      to: string[];
    };
  };
}

class GuardianMonitor {
  private guardian: Guardian;
  private monitor: ProductionMonitor;
  private config: MonitoringConfig;
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;

  constructor(guardian: Guardian, config: MonitoringConfig) {
    this.guardian = guardian;
    this.monitor = new ProductionMonitor({
      enableSlackAlerts: true,
      slackWebhookUrl: config.notifications.slack?.webhook || ''
    });
    this.config = config;
  }

  /**
   * Start monitoring Guardian system
   */
  public start(): void {
    if (this.isRunning) {
      console.log('🔄 Guardian Monitor already running');
      return;
    }

    console.log('🚀 Starting Guardian Monitor...');
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
      console.log('⏹️ Guardian Monitor not running');
      return;
    }

    console.log('🛑 Stopping Guardian Monitor...');
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
      const stats = this.guardian.getStats();
      const dashboard = this.guardian.getDashboard();
      const systemMetrics = await this.getSystemMetrics();
      
      // Check various health indicators
      const healthReport = {
        timestamp: new Date().toISOString(),
        guardian: {
          status: dashboard.status,
          systemHealth: stats.systemHealth,
          totalRequests: stats.totalRequests,
          blockedRequests: stats.blockedRequests,
          blockRate: stats.totalRequests > 0 ? (stats.blockedRequests / stats.totalRequests) * 100 : 0,
          avgResponseTime: stats.avgResponseTime,
          activeConnections: stats.activeConnections,
          blockedIPs: stats.blockedIPs
        },
        system: systemMetrics,
        threats: {
          recentThreats: dashboard.recentThreats.length,
          criticalThreats: dashboard.recentThreats.filter(t => t.severity === 'critical').length,
          highThreats: dashboard.recentThreats.filter(t => t.severity === 'high').length
        }
      };

      // Log health report
      console.log(`📊 Guardian Health Report: ${JSON.stringify(healthReport, null, 2)}`);

      // Check for alerts
      await this.checkAlerts(healthReport);

      // Store metrics for trending
      this.storeMetrics(healthReport);

    } catch (error) {
      console.error('❌ Guardian health check failed:', error);
      await this.sendAlert('critical', 'Guardian Monitor Error', `Health check failed: ${error}`);
    }
  }

  /**
   * Get system metrics
   */
  private async getSystemMetrics(): Promise<any> {
    const used = process.memoryUsage();
    const loadAvg = process.loadavg ? process.loadavg() : [0, 0, 0];

    return {
      memory: {
        used: Math.round(used.rss / 1024 / 1024 * 100) / 100, // MB
        heap: Math.round(used.heapUsed / 1024 / 1024 * 100) / 100, // MB
        external: Math.round(used.external / 1024 / 1024 * 100) / 100, // MB
        percentage: Math.round((used.rss / (1024 * 1024 * 1024)) * 100) // % of 1GB
      },
      cpu: {
        loadAvg1: loadAvg[0],
        loadAvg5: loadAvg[1],
        loadAvg15: loadAvg[2]
      },
      process: {
        uptime: process.uptime(),
        pid: process.pid,
        nodeVersion: process.version
      }
    };
  }

  /**
   * Check for alert conditions
   */
  private async checkAlerts(healthReport: any): Promise<void> {
    const { guardian, system, threats } = healthReport;
    const thresholds = this.config.alertThresholds;

    // Block rate alert
    if (guardian.blockRate > thresholds.blockRate) {
      await this.sendAlert(
        'high',
        'High Block Rate Alert',
        `Block rate is ${guardian.blockRate.toFixed(2)}% (threshold: ${thresholds.blockRate}%)`
      );
    }

    // Response time alert
    if (guardian.avgResponseTime > thresholds.responseTime) {
      await this.sendAlert(
        'medium',
        'High Response Time Alert',
        `Average response time is ${guardian.avgResponseTime.toFixed(2)}ms (threshold: ${thresholds.responseTime}ms)`
      );
    }

    // Memory usage alert
    if (system.memory.percentage > thresholds.memoryUsage) {
      await this.sendAlert(
        'high',
        'High Memory Usage Alert',
        `Memory usage is ${system.memory.percentage}% (threshold: ${thresholds.memoryUsage}%)`
      );
    }

    // Critical threats alert
    if (threats.criticalThreats > 0) {
      await this.sendAlert(
        'critical',
        'Critical Threats Detected',
        `${threats.criticalThreats} critical threats detected in the last check`
      );
    }

    // System health alert
    if (guardian.systemHealth === 'critical') {
      await this.sendAlert(
        'critical',
        'Guardian System Critical',
        'Guardian system health is critical - immediate attention required'
      );
    } else if (guardian.systemHealth === 'degraded') {
      await this.sendAlert(
        'medium',
        'Guardian System Degraded',
        'Guardian system health is degraded - monitoring required'
      );
    }
  }

  /**
   * Send alert notification
   */
  private async sendAlert(severity: string, title: string, message: string): Promise<void> {
    const alert = {
      timestamp: new Date().toISOString(),
      severity,
      title,
      message,
      source: 'Guardian Monitor'
    };

    console.log(`🚨 ALERT [${severity.toUpperCase()}]: ${title} - ${message}`);

    // Send to Slack if configured
    if (this.config.notifications.slack) {
      await this.sendSlackAlert(alert);
    }

    // Send email if configured
    if (this.config.notifications.email) {
      await this.sendEmailAlert(alert);
    }

    // Store alert for dashboard
    this.storeAlert(alert);
  }

  /**
   * Send Slack notification
   */
  private async sendSlackAlert(alert: any): Promise<void> {
    try {
      const slack = this.config.notifications.slack!;
      const color = this.getSeverityColor(alert.severity);
      
      const payload = {
        channel: slack.channel,
        username: 'Guardian Monitor',
        icon_emoji: ':shield:',
        attachments: [
          {
            color,
            title: `🛡️ ${alert.title}`,
            text: alert.message,
            fields: [
              {
                title: 'Severity',
                value: alert.severity.toUpperCase(),
                short: true
              },
              {
                title: 'Time',
                value: alert.timestamp,
                short: true
              }
            ],
            footer: 'EuroWeb Guardian v8.0.0',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      const response = await fetch(slack.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Failed to send Slack alert:', response.statusText);
      }
    } catch (error) {
      console.error('Slack alert error:', error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailAlert(alert: any): Promise<void> {
    // Email implementation would go here
    // For now, just log
    console.log(`📧 Email alert would be sent: ${alert.title}`);
  }

  /**
   * Store metrics for trending
   */
  private storeMetrics(healthReport: any): void {
    // Store metrics in time-series database or file
    // Implementation depends on storage choice (InfluxDB, PostgreSQL, etc.)
    console.log('📈 Storing metrics for trending analysis');
  }

  /**
   * Store alert for dashboard
   */
  private storeAlert(alert: any): void {
    // Store alert for dashboard display
    console.log('💾 Storing alert for dashboard');
  }

  /**
   * Get color for Slack based on severity
   */
  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      case 'low': return '#00cc44';
      default: return '#666666';
    }
  }

  /**
   * Get monitoring summary
   */
  public getSummary(): any {
    return {
      isRunning: this.isRunning,
      startTime: this.intervalId ? 'Running' : 'Stopped',
      config: this.config,
      guardian: this.guardian.getDashboard()
    };
  }
}

// Export for production use
export { GuardianMonitor };

// CLI usage if run directly
if (require.main === module) {
  const guardian = new Guardian();
  
  const monitor = new GuardianMonitor(guardian, {
    checkInterval: 30000, // 30 seconds
    alertThresholds: {
      blockRate: 20, // 20%
      responseTime: 2000, // 2 seconds
      errorRate: 5, // 5%
      memoryUsage: 80 // 80%
    },
    notifications: {
      slack: {
        webhook: process.env.SLACK_WEBHOOK_URL || '',
        channel: '#security-alerts'
      }
    }
  });

  // Start monitoring
  monitor.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down Guardian Monitor...');
    monitor.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down Guardian Monitor...');
    monitor.stop();
    process.exit(0);
  });

  console.log('🛡️ Guardian Monitor started successfully');
  console.log('📊 Monitoring Guardian security system...');
  console.log('⏹️ Press Ctrl+C to stop');
}
