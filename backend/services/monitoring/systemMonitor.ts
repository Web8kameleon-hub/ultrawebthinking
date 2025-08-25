/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * Industrial System Monitor - Real Hardware & Performance Metrics
 */

import { 
  cpu, 
  mem, 
  osInfo, 
  currentLoad, 
  networkStats, 
  fsSize, 
  processes,
  disksIO,
  networkInterfaces,
  cpuTemperature,
  battery,
  graphics
} from 'systeminformation';

export interface SystemMetrics {
  timestamp: string;
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    physicalCores: number;
    usage: number;
    temperature?: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usagePercent: number;
    available: number;
  };
  disk: Array<{
    filesystem: string;
    type: string;
    size: number;
    used: number;
    available: number;
    usagePercent: number;
    mount: string;
  }>;
  network: {
    interfaces: Array<{
      name: string;
      ip4: string;
      ip6: string;
      mac: string;
      speed: number;
      type: string;
    }>;
    stats: Array<{
      iface: string;
      rx_bytes: number;
      tx_bytes: number;
      rx_sec: number;
      tx_sec: number;
    }>;
  };
  processes: {
    running: number;
    sleeping: number;
    blocked: number;
    zombie: number;
    topByMemory: Array<{
      pid: number;
      name: string;
      cpu: number;
      memory: number;
      memoryPercent: number;
    }>;
    topByCpu: Array<{
      pid: number;
      name: string;
      cpu: number;
      memory: number;
      memoryPercent: number;
    }>;
  };
  system: {
    platform: string;
    distro: string;
    release: string;
    kernel: string;
    arch: string;
    hostname: string;
    uptime: number;
  };
  performance: {
    score: number; // 0-100
    bottlenecks: string[];
    recommendations: string[];
  };
  battery?: {
    hasBattery: boolean;
    cycleCount: number;
    isCharging: boolean;
    percent: number;
    timeRemaining: number;
  };
  graphics?: Array<{
    vendor: string;
    model: string;
    vram: number;
    temperature?: number;
  }>;
}

export interface PerformanceAlert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'cpu' | 'memory' | 'disk' | 'network' | 'temperature' | 'battery';
  message: string;
  threshold: number;
  currentValue: number;
  recommendation: string;
  autoResolve: boolean;
}

export interface SystemTrend {
  metric: string;
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  predictedValues: Array<{
    timestamp: string;
    value: number;
  }>;
}

export class IndustrialSystemMonitor {
  private metrics: SystemMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private readonly maxHistorySize = 1000;
  private monitoringInterval?: NodeJS.Timeout;

  // Alert thresholds
  private readonly thresholds = {
    cpu: { warning: 80, critical: 95 },
    memory: { warning: 85, critical: 95 },
    disk: { warning: 85, critical: 95 },
    temperature: { warning: 70, critical: 85 },
    battery: { warning: 20, critical: 10 }
  };

  async getCurrentMetrics(): Promise<SystemMetrics> {
    try {
      const timestamp = new Date().toISOString();

      // Gather all system information
      const [
        cpuInfo,
        memInfo,
        osData,
        loadData,
        networkData,
        diskData,
        processData,
        diskIO,
        interfaces,
        tempData,
        batteryData,
        graphicsData
      ] = await Promise.all([
        cpu(),
        mem(),
        osInfo(),
        currentLoad(),
        networkStats(),
        fsSize(),
        processes(),
        disksIO(),
        networkInterfaces(),
        cpuTemperature().catch(() => null),
        battery().catch(() => null),
        graphics().catch(() => null)
      ]);

      // Process CPU data
      const cpuMetrics = {
        manufacturer: cpuInfo.manufacturer,
        brand: cpuInfo.brand,
        speed: cpuInfo.speed,
        cores: cpuInfo.cores,
        physicalCores: cpuInfo.physicalCores,
        usage: Math.round(loadData.currentLoad),
        temperature: tempData?.main || undefined
      };

      // Process memory data
      const memoryMetrics = {
        total: memInfo.total,
        free: memInfo.free,
        used: memInfo.used,
        usagePercent: Math.round((memInfo.used / memInfo.total) * 100),
        available: memInfo.available
      };

      // Process disk data
      const diskMetrics = diskData.map(disk => ({
        filesystem: disk.fs,
        type: disk.type,
        size: disk.size,
        used: disk.used,
        available: disk.available,
        usagePercent: Math.round((disk.used / disk.size) * 100),
        mount: disk.mount
      }));

      // Process network data
      const networkMetrics = {
        interfaces: interfaces.filter(iface => !iface.internal).map(iface => ({
          name: iface.iface,
          ip4: iface.ip4 || '',
          ip6: iface.ip6 || '',
          mac: iface.mac,
          speed: iface.speed || 0,
          type: iface.type
        })),
        stats: networkData.map(stat => ({
          iface: stat.iface,
          rx_bytes: stat.rx_bytes,
          tx_bytes: stat.tx_bytes,
          rx_sec: stat.rx_sec,
          tx_sec: stat.tx_sec
        }))
      };

      // Process process data
      const processMetrics = {
        running: processData.running || 0,
        sleeping: processData.sleeping || 0,
        blocked: processData.blocked || 0,
        zombie: 0, // Default since it might not be available on all systems
        topByMemory: processData.list
          .sort((a, b) => b.mem - a.mem)
          .slice(0, 10)
          .map(proc => ({
            pid: proc.pid,
            name: proc.name,
            cpu: proc.cpu,
            memory: proc.mem,
            memoryPercent: proc.memRss
          })),
        topByCpu: processData.list
          .sort((a, b) => b.cpu - a.cpu)
          .slice(0, 10)
          .map(proc => ({
            pid: proc.pid,
            name: proc.name,
            cpu: proc.cpu,
            memory: proc.mem,
            memoryPercent: proc.memRss
          }))
      };

      // System info
      const systemMetrics = {
        platform: osData.platform,
        distro: osData.distro,
        release: osData.release,
        kernel: osData.kernel,
        arch: osData.arch,
        hostname: osData.hostname,
        uptime: osData.uptime || 0
      };

      // Performance scoring
      const performanceScore = this.calculatePerformanceScore({
        cpu: cpuMetrics.usage,
        memory: memoryMetrics.usagePercent,
        disk: Math.max(...diskMetrics.map(d => d.usagePercent)),
        temperature: cpuMetrics.temperature
      });

      // Battery info (if available)
      const batteryMetrics = batteryData ? {
        hasBattery: batteryData.hasBattery,
        cycleCount: batteryData.cycleCount,
        isCharging: batteryData.isCharging,
        percent: batteryData.percent,
        timeRemaining: batteryData.timeRemaining
      } : undefined;

      // Graphics info (if available)
      const graphicsMetrics = graphicsData ? graphicsData.controllers.map(gpu => ({
        vendor: gpu.vendor,
        model: gpu.model,
        vram: gpu.vram || 0,
        temperature: gpu.temperatureGpu
      })) : undefined;

      const metrics: SystemMetrics = {
        timestamp,
        cpu: cpuMetrics,
        memory: memoryMetrics,
        disk: diskMetrics,
        network: networkMetrics,
        processes: processMetrics,
        system: systemMetrics,
        performance: performanceScore,
        battery: batteryMetrics,
        graphics: graphicsMetrics
      };

      // Store metrics and check for alerts
      this.addMetrics(metrics);
      this.checkAlerts(metrics);

      return metrics;

    } catch (error) {
      console.error('🔧 System metrics collection error:', error);
      throw new Error(`Failed to collect system metrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculatePerformanceScore(metrics: {
    cpu: number;
    memory: number;
    disk: number;
    temperature?: number;
  }): { score: number; bottlenecks: string[]; recommendations: string[] } {
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];
    
    let score = 100;

    // CPU performance impact
    if (metrics.cpu > 90) {
      score -= 30;
      bottlenecks.push('High CPU usage');
      recommendations.push('Check for resource-intensive processes');
    } else if (metrics.cpu > 70) {
      score -= 15;
      bottlenecks.push('Elevated CPU usage');
      recommendations.push('Monitor CPU-intensive applications');
    }

    // Memory performance impact
    if (metrics.memory > 90) {
      score -= 25;
      bottlenecks.push('High memory usage');
      recommendations.push('Close unnecessary applications or add more RAM');
    } else if (metrics.memory > 75) {
      score -= 10;
      bottlenecks.push('Elevated memory usage');
      recommendations.push('Monitor memory-intensive applications');
    }

    // Disk performance impact
    if (metrics.disk > 95) {
      score -= 20;
      bottlenecks.push('Disk space critical');
      recommendations.push('Free up disk space immediately');
    } else if (metrics.disk > 85) {
      score -= 10;
      bottlenecks.push('Low disk space');
      recommendations.push('Consider cleaning up files or expanding storage');
    }

    // Temperature impact
    if (metrics.temperature && metrics.temperature > 80) {
      score -= 15;
      bottlenecks.push('High system temperature');
      recommendations.push('Check cooling system and clean dust from fans');
    }

    return {
      score: Math.max(0, score),
      bottlenecks,
      recommendations
    };
  }

  private addMetrics(metrics: SystemMetrics): void {
    this.metrics.push(metrics);
    
    // Limit history size
    if (this.metrics.length > this.maxHistorySize) {
      this.metrics = this.metrics.slice(-this.maxHistorySize);
    }
  }

  private checkAlerts(metrics: SystemMetrics): void {
    const timestamp = new Date().toISOString();

    // CPU alerts
    if (metrics.cpu.usage >= this.thresholds.cpu.critical) {
      this.addAlert({
        id: `cpu-critical-${Date.now()}`,
        timestamp,
        severity: 'critical',
        category: 'cpu',
        message: `Critical CPU usage: ${metrics.cpu.usage}%`,
        threshold: this.thresholds.cpu.critical,
        currentValue: metrics.cpu.usage,
        recommendation: 'Immediately check for runaway processes and kill if necessary',
        autoResolve: true
      });
    } else if (metrics.cpu.usage >= this.thresholds.cpu.warning) {
      this.addAlert({
        id: `cpu-warning-${Date.now()}`,
        timestamp,
        severity: 'medium',
        category: 'cpu',
        message: `High CPU usage: ${metrics.cpu.usage}%`,
        threshold: this.thresholds.cpu.warning,
        currentValue: metrics.cpu.usage,
        recommendation: 'Monitor system load and consider optimizing resource-intensive processes',
        autoResolve: true
      });
    }

    // Memory alerts
    if (metrics.memory.usagePercent >= this.thresholds.memory.critical) {
      this.addAlert({
        id: `memory-critical-${Date.now()}`,
        timestamp,
        severity: 'critical',
        category: 'memory',
        message: `Critical memory usage: ${metrics.memory.usagePercent}%`,
        threshold: this.thresholds.memory.critical,
        currentValue: metrics.memory.usagePercent,
        recommendation: 'Close unnecessary applications or restart system if needed',
        autoResolve: true
      });
    }

    // Disk alerts
    metrics.disk.forEach((disk, index) => {
      if (disk.usagePercent >= this.thresholds.disk.critical) {
        this.addAlert({
          id: `disk-critical-${index}-${Date.now()}`,
          timestamp,
          severity: 'critical',
          category: 'disk',
          message: `Critical disk usage on ${disk.mount}: ${disk.usagePercent}%`,
          threshold: this.thresholds.disk.critical,
          currentValue: disk.usagePercent,
          recommendation: 'Free up disk space immediately to prevent system issues',
          autoResolve: false
        });
      }
    });

    // Temperature alerts
    if (metrics.cpu.temperature && metrics.cpu.temperature >= this.thresholds.temperature.critical) {
      this.addAlert({
        id: `temperature-critical-${Date.now()}`,
        timestamp,
        severity: 'critical',
        category: 'temperature',
        message: `Critical CPU temperature: ${metrics.cpu.temperature}°C`,
        threshold: this.thresholds.temperature.critical,
        currentValue: metrics.cpu.temperature,
        recommendation: 'Check system cooling immediately to prevent hardware damage',
        autoResolve: true
      });
    }

    // Battery alerts (if applicable)
    if (metrics.battery && metrics.battery.hasBattery && metrics.battery.percent <= this.thresholds.battery.critical) {
      this.addAlert({
        id: `battery-critical-${Date.now()}`,
        timestamp,
        severity: 'high',
        category: 'battery',
        message: `Critical battery level: ${metrics.battery.percent}%`,
        threshold: this.thresholds.battery.critical,
        currentValue: metrics.battery.percent,
        recommendation: 'Connect to power source immediately',
        autoResolve: true
      });
    }
  }

  private addAlert(alert: PerformanceAlert): void {
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(a => 
      a.category === alert.category && 
      a.severity === alert.severity &&
      a.autoResolve === alert.autoResolve
    );

    if (!existingAlert) {
      this.alerts.push(alert);
      
      // Limit alert history
      if (this.alerts.length > 100) {
        this.alerts = this.alerts.slice(-50);
      }
    }
  }

  getMetricsHistory(hours = 24): SystemMetrics[] {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.metrics.filter(m => new Date(m.timestamp) >= cutoff);
  }

  getActiveAlerts(): PerformanceAlert[] {
    // Return alerts from last hour
    const cutoff = new Date(Date.now() - (60 * 60 * 1000));
    return this.alerts.filter(a => new Date(a.timestamp) >= cutoff);
  }

  getAllAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  calculateTrends(hours = 24): SystemTrend[] {
    const history = this.getMetricsHistory(hours);
    if (history.length < 10) return []; // Need minimum data points

    const trends: SystemTrend[] = [];

    // CPU trend
    const cpuValues = history.map(h => h.cpu.usage);
    trends.push(this.calculateTrend('cpu_usage', cpuValues, 'percentage'));

    // Memory trend
    const memValues = history.map(h => h.memory.usagePercent);
    trends.push(this.calculateTrend('memory_usage', memValues, 'percentage'));

    // Disk trend (highest usage)
    const diskValues = history.map(h => Math.max(...h.disk.map(d => d.usagePercent)));
    trends.push(this.calculateTrend('disk_usage', diskValues, 'percentage'));

    return trends;
  }

  private calculateTrend(metric: string, values: number[], unit: string): SystemTrend {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    // Simple linear regression
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const confidence = Math.min(1, Math.abs(slope) / 10); // Normalized confidence

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (slope > 0.1) trend = 'increasing';
    else if (slope < -0.1) trend = 'decreasing';

    // Generate predictions for next 12 hours
    const predictedValues = Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() + (i + 1) * 60 * 60 * 1000).toISOString(),
      value: Math.max(0, Math.min(100, y[y.length - 1] + slope * (i + 1)))
    }));

    return {
      metric,
      timeframe: '24h',
      trend,
      confidence,
      predictedValues
    };
  }

  startContinuousMonitoring(intervalMinutes = 1): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.getCurrentMetrics();
      } catch (error) {
        console.error('Continuous monitoring error:', error);
      }
    }, intervalMinutes * 60 * 1000);

    console.log(`🔧 Started continuous system monitoring (${intervalMinutes} minute intervals)`);
  }

  stopContinuousMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
      console.log('🔧 Stopped continuous system monitoring');
    }
  }

  // Health check endpoint data
  getHealthCheck(): {
    status: 'healthy' | 'warning' | 'critical';
    timestamp: string;
    uptime: number;
    version: string;
    checks: Record<string, boolean>;
  } {
    const latest = this.metrics[this.metrics.length - 1];
    const activeAlerts = this.getActiveAlerts();
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (activeAlerts.some(a => a.severity === 'critical')) status = 'critical';
    else if (activeAlerts.some(a => a.severity === 'high' || a.severity === 'medium')) status = 'warning';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: latest?.system.uptime || 0,
      version: '8.0.0-WEB8',
      checks: {
        cpu: !latest || latest.cpu.usage < 90,
        memory: !latest || latest.memory.usagePercent < 90,
        disk: !latest || latest.disk.every(d => d.usagePercent < 95),
        temperature: !latest?.cpu.temperature || latest.cpu.temperature < 80
      }
    };
  }

  // System summary for dashboard
  getSummary(): {
    performance: number;
    status: string;
    alerts: number;
    uptime: string;
    resources: {
      cpu: number;
      memory: number;
      disk: number;
    };
  } {
    const latest = this.metrics[this.metrics.length - 1];
    const activeAlerts = this.getActiveAlerts();
    
    if (!latest) {
      return {
        performance: 0,
        status: 'unknown',
        alerts: 0,
        uptime: '0s',
        resources: { cpu: 0, memory: 0, disk: 0 }
      };
    }

    const formatUptime = (seconds: number): string => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    return {
      performance: latest.performance.score,
      status: this.getHealthCheck().status,
      alerts: activeAlerts.length,
      uptime: formatUptime(latest.system.uptime),
      resources: {
        cpu: latest.cpu.usage,
        memory: latest.memory.usagePercent,
        disk: Math.max(...latest.disk.map(d => d.usagePercent))
      }
    };
  }
}

// Export singleton instance
export const industrialSystemMonitor = new IndustrialSystemMonitor();
