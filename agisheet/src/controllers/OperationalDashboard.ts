/**
 * OperationalDashboard - AGI Operational Intelligence Dashboard
 * Web8 AGISheet Kameleoni Real-time Operations Control Center
 */

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'neural' | 'status';
  position: { x: number; y: number; width: number; height: number };
  data: any;
  refreshInterval: number;
  visible: boolean;
  permissions: string[];
}

export interface MetricData {
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  threshold?: { warning: number; critical: number };
  timestamp: Date;
  source: string;
}

export interface AlertData {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
  tags: string[];
}

export interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  lastCheck: Date;
  details: Record<string, any>;
}

export interface DashboardState {
  widgets: DashboardWidget[];
  layout: string;
  theme: 'light' | 'dark' | 'auto';
  autoRefresh: boolean;
  refreshRate: number;
  fullscreen: boolean;
  userId: string;
  permissions: string[];
}

export class OperationalDashboard {
  private widgets: Map<string, DashboardWidget> = new Map();
  private metrics: Map<string, MetricData[]> = new Map();
  private alerts: Map<string, AlertData> = new Map();
  private systemStatus: Map<string, SystemStatus> = new Map();
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  private dashboardState: DashboardState;
  private eventLog: Array<{ timestamp: Date; event: string; data: any }> = [];

  constructor(userId: string = 'system', permissions: string[] = ['read', 'write']) {
    this.dashboardState = {
      widgets: [],
      layout: 'default',
      theme: 'dark',
      autoRefresh: true,
      refreshRate: 5000,
      fullscreen: false,
      userId,
      permissions
    };
    
    this.setupDefaultWidgets();
    this.startSystemMonitoring();
    this.initializeMetrics();
  }

  public addWidget(widget: DashboardWidget): void {
    this.widgets.set(widget.id, widget);
    this.dashboardState.widgets.push(widget);
    
    if (widget.refreshInterval > 0) {
      this.setupWidgetRefresh(widget);
    }
    
    this.logEvent('widget_added', { widgetId: widget.id, type: widget.type });
    this.notifySubscribers('widget_added', widget);
  }

  public removeWidget(widgetId: string): boolean {
    if (this.widgets.has(widgetId)) {
      this.widgets.delete(widgetId);
      this.dashboardState.widgets = this.dashboardState.widgets.filter(w => w.id !== widgetId);
      
      // Clear refresh timer
      const timer = this.refreshTimers.get(widgetId);
      if (timer) {
        clearInterval(timer);
        this.refreshTimers.delete(widgetId);
      }
      
      this.logEvent('widget_removed', { widgetId });
      this.notifySubscribers('widget_removed', { widgetId });
      return true;
    }
    return false;
  }

  public updateWidget(widgetId: string, updates: Partial<DashboardWidget>): void {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      Object.assign(widget, updates);
      
      // Update in state array
      const stateWidget = this.dashboardState.widgets.find(w => w.id === widgetId);
      if (stateWidget) {
        Object.assign(stateWidget, updates);
      }
      
      // Restart refresh timer if interval changed
      if (updates.refreshInterval !== undefined) {
        const timer = this.refreshTimers.get(widgetId);
        if (timer) {
          clearInterval(timer);
        }
        if (updates.refreshInterval > 0) {
          this.setupWidgetRefresh(widget);
        }
      }
      
      this.logEvent('widget_updated', { widgetId, updates });
      this.notifySubscribers('widget_updated', { widgetId, updates });
    }
  }

  public updateMetric(metricId: string, data: MetricData): void {
    if (!this.metrics.has(metricId)) {
      this.metrics.set(metricId, []);
    }
    
    const metricHistory = this.metrics.get(metricId)!;
    metricHistory.push(data);
    
    // Maintain history size (keep last 1000 points)
    if (metricHistory.length > 1000) {
      metricHistory.splice(0, metricHistory.length - 500);
    }
    
    // Update widgets that display this metric
    this.updateMetricWidgets(metricId, data);
    
    this.notifySubscribers('metric_updated', { metricId, data });
  }

  public addAlert(alert: AlertData): void {
    this.alerts.set(alert.id, alert);
    
    // Update alert widgets
    this.updateAlertWidgets();
    
    this.logEvent('alert_created', alert);
    this.notifySubscribers('alert_added', alert);
  }

  public getDashboardData(): any {
    const currentMetrics: Record<string, MetricData> = {};
    Array.from(this.metrics.entries()).forEach(([metricId, history]) => {
      if (history.length > 0) {
        currentMetrics[metricId] = history[history.length - 1];
      }
    });
    
    const unacknowledgedAlerts = Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return {
      widgets: Array.from(this.widgets.values()),
      metrics: currentMetrics,
      alerts: unacknowledgedAlerts,
      stats: this.getDashboardStats()
    };
  }

  public getDashboardStats(): Record<string, any> {
    const totalWidgets = this.widgets.size;
    const widgetTypes = new Map<string, number>();
    
    Array.from(this.widgets.values()).forEach(widget => {
      widgetTypes.set(widget.type, (widgetTypes.get(widget.type) || 0) + 1);
    });
    
    const totalAlerts = this.alerts.size;
    const unacknowledgedAlerts = Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged).length;
    
    const alertLevels = new Map<string, number>();
    Array.from(this.alerts.values()).forEach(alert => {
      alertLevels.set(alert.level, (alertLevels.get(alert.level) || 0) + 1);
    });
    
    return {
      totalWidgets,
      widgetTypes: Object.fromEntries(widgetTypes),
      totalMetrics: this.metrics.size,
      totalAlerts,
      unacknowledgedAlerts,
      alertLevels: Object.fromEntries(alertLevels),
      eventLogSize: this.eventLog.length
    };
  }

  public cleanup(): void {
    // Clear all timers
    Array.from(this.refreshTimers.values()).forEach(timer => {
      clearInterval(timer);
    });
    this.refreshTimers.clear();
    
    // Clear subscribers
    this.subscribers.clear();
    
    // Log cleanup
    this.logEvent('dashboard_cleanup', {});
  }

  private setupDefaultWidgets(): void {
    // System Overview Widget
    this.addWidget({
      id: 'system_overview',
      title: 'System Overview',
      type: 'status',
      position: { x: 0, y: 0, width: 4, height: 2 },
      data: {},
      refreshInterval: 5000,
      visible: true,
      permissions: ['read']
    });

    // Performance Metrics Widget
    this.addWidget({
      id: 'performance_metrics',
      title: 'Performance Metrics',
      type: 'chart',
      position: { x: 4, y: 0, width: 4, height: 2 },
      data: { chartType: 'line', metrics: ['cpu', 'memory', 'response_time'] },
      refreshInterval: 3000,
      visible: true,
      permissions: ['read']
    });
  }

  private setupWidgetRefresh(widget: DashboardWidget): void {
    const timer = setInterval(() => {
      if (this.dashboardState.autoRefresh && widget.visible) {
        this.refreshWidget(widget.id);
      }
    }, widget.refreshInterval);
    
    this.refreshTimers.set(widget.id, timer);
  }

  private refreshWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (widget) {
      const newData = { updated: new Date() };
      widget.data = newData;
      
      this.notifySubscribers('widget_refreshed', { widgetId, data: newData });
    }
  }

  private updateMetricWidgets(metricId: string, data: MetricData): void {
    Array.from(this.widgets.values()).forEach(widget => {
      if (widget.type === 'metric' && widget.data.metricId === metricId) {
        widget.data.currentValue = data;
        this.notifySubscribers('widget_updated', { widgetId: widget.id, data: widget.data });
      }
    });
  }

  private updateAlertWidgets(): void {
    Array.from(this.widgets.values()).forEach(widget => {
      if (widget.type === 'alert') {
        this.refreshWidget(widget.id);
      }
    });
  }

  private startSystemMonitoring(): void {
    // Simulate system monitoring
    setInterval(() => {
      this.updateMetric('cpu_usage', {
        value: Math.random() * 100,
        unit: '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        timestamp: new Date(),
        source: 'system_monitor'
      });
    }, 10000); // Check every 10 seconds
  }

  private initializeMetrics(): void {
    // Initialize some default metrics
    this.updateMetric('cpu_usage', {
      value: 50,
      unit: '%',
      trend: 'stable',
      timestamp: new Date(),
      source: 'system_monitor'
    });
  }

  private logEvent(event: string, data: any): void {
    this.eventLog.push({
      timestamp: new Date(),
      event,
      data
    });
    
    // Maintain log size
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-500);
    }
  }

  private notifySubscribers(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in subscriber callback for event ${event}:`, error);
        }
      }
    }
  }
}
