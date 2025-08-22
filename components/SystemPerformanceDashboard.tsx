// EuroWeb Ultra - System Performance Dashboard
// Monitorim i performancës në kohë reale për të gjithë sistemin

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature: number;
    frequency: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    swap: number;
  };
  network: {
    upload: number;
    download: number;
    latency: number;
    connections: number;
  };
  ai: {
    neuralLoad: number;
    activeModels: number;
    requests: number;
    averageResponseTime: number;
  };
  energy: {
    consumption: number;
    efficiency: number;
    carbonFootprint: number;
    renewablePercentage: number;
  };
  security: {
    threats: number;
    blocked: number;
    risk: 'low' | 'medium' | 'high';
    lastScan: Date;
  };
}

interface AlertRule {
  id: string;
  metric: string;
  threshold: number;
  condition: 'above' | 'below';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  active: boolean;
}

interface Alert {
  id: string;
  rule: AlertRule;
  value: number;
  timestamp: Date;
  acknowledged: boolean;
}

export default function SystemPerformanceDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    timestamp: new Date(),
    cpu: { usage: 45, cores: 8, temperature: 65, frequency: 3.2 },
    memory: { used: 8.5, total: 16, percentage: 53, swap: 2.1 },
    network: { upload: 125, download: 450, latency: 15, connections: 147 },
    ai: { neuralLoad: 72, activeModels: 6, requests: 1247, averageResponseTime: 250 },
    energy: { consumption: 145.6, efficiency: 87.2, carbonFootprint: 32.4, renewablePercentage: 85 },
    security: { threats: 3, blocked: 157, risk: 'low', lastScan: new Date() }
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: 'cpu-high',
      metric: 'cpu.usage',
      threshold: 80,
      condition: 'above',
      severity: 'warning',
      message: 'CPU usage is critically high',
      active: true
    },
    {
      id: 'memory-high',
      metric: 'memory.percentage',
      threshold: 85,
      condition: 'above',
      severity: 'critical',
      message: 'Memory usage approaching limit',
      active: true
    },
    {
      id: 'neural-load',
      metric: 'ai.neuralLoad',
      threshold: 90,
      condition: 'above',
      severity: 'warning',
      message: 'Neural load is too high - throttling recommended',
      active: true
    },
    {
      id: 'security-threats',
      metric: 'security.threats',
      threshold: 5,
      condition: 'above',
      severity: 'critical',
      message: 'Multiple security threats detected',
      active: true
    }
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [historicalData, setHistoricalData] = useState<SystemMetrics[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Simulon matjen e metrikave të reja
  const generateMetrics = useCallback((): SystemMetrics => {
    const prevMetrics = metrics;
    
    return {
      timestamp: new Date(),
      cpu: {
        usage: Math.max(10, Math.min(95, prevMetrics.cpu.usage + (Math.random() - 0.5) * 10)),
        cores: 8,
        temperature: Math.max(45, Math.min(85, prevMetrics.cpu.temperature + (Math.random() - 0.5) * 5)),
        frequency: Math.max(1.8, Math.min(4.2, prevMetrics.cpu.frequency + (Math.random() - 0.5) * 0.2))
      },
      memory: {
        used: Math.max(4, Math.min(15, prevMetrics.memory.used + (Math.random() - 0.5) * 1)),
        total: 16,
        percentage: 0,
        swap: Math.max(0, Math.min(4, prevMetrics.memory.swap + (Math.random() - 0.5) * 0.5))
      },
      network: {
        upload: Math.max(50, Math.min(1000, prevMetrics.network.upload + (Math.random() - 0.5) * 100)),
        download: Math.max(100, Math.min(2000, prevMetrics.network.download + (Math.random() - 0.5) * 200)),
        latency: Math.max(5, Math.min(100, prevMetrics.network.latency + (Math.random() - 0.5) * 10)),
        connections: Math.max(50, Math.min(500, prevMetrics.network.connections + Math.floor((Math.random() - 0.5) * 20)))
      },
      ai: {
        neuralLoad: Math.max(20, Math.min(95, prevMetrics.ai.neuralLoad + (Math.random() - 0.5) * 8)),
        activeModels: Math.max(3, Math.min(12, prevMetrics.ai.activeModels + Math.floor((Math.random() - 0.5) * 2))),
        requests: prevMetrics.ai.requests + Math.floor(Math.random() * 50),
        averageResponseTime: Math.max(100, Math.min(1000, prevMetrics.ai.averageResponseTime + (Math.random() - 0.5) * 50))
      },
      energy: {
        consumption: Math.max(100, Math.min(300, prevMetrics.energy.consumption + (Math.random() - 0.5) * 20)),
        efficiency: Math.max(70, Math.min(95, prevMetrics.energy.efficiency + (Math.random() - 0.5) * 2)),
        carbonFootprint: Math.max(15, Math.min(60, prevMetrics.energy.carbonFootprint + (Math.random() - 0.5) * 5)),
        renewablePercentage: Math.max(60, Math.min(95, prevMetrics.energy.renewablePercentage + (Math.random() - 0.5) * 3))
      },
      security: {
        threats: Math.max(0, Math.min(10, prevMetrics.security.threats + Math.floor((Math.random() - 0.7) * 3))),
        blocked: prevMetrics.security.blocked + Math.floor(Math.random() * 10),
        risk: prevMetrics.security.threats > 5 ? 'high' : prevMetrics.security.threats > 2 ? 'medium' : 'low',
        lastScan: new Date()
      }
    };
  }, [metrics]);

  // Kontrollojë dhe gjeneron alerts
  const checkAlerts = useCallback((newMetrics: SystemMetrics) => {
    const newAlerts: Alert[] = [];
    
    alertRules.forEach(rule => {
      if (!rule.active) return;
      
      // Extract metric value using dot notation
      const metricValue = rule.metric.split('.').reduce((obj: any, key) => obj?.[key], newMetrics);
      
      if (metricValue !== undefined) {
        const shouldAlert = rule.condition === 'above' 
          ? metricValue > rule.threshold 
          : metricValue < rule.threshold;
          
        if (shouldAlert) {
          const existingAlert = alerts.find(alert => 
            alert.rule.id === rule.id && !alert.acknowledged
          );
          
          if (!existingAlert) {
            newAlerts.push({
              id: `alert-${Date.now()}-${rule.id}`,
              rule,
              value: metricValue,
              timestamp: new Date(),
              acknowledged: false
            });
          }
        }
      }
    });
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
    }
  }, [alertRules, alerts]);

  // Auto-refresh metrics
  useEffect(() => {
    if (!isAutoRefresh) return;
    
    const interval = setInterval(() => {
      const newMetrics = generateMetrics();
      // Calculate memory percentage
      newMetrics.memory.percentage = (newMetrics.memory.used / newMetrics.memory.total) * 100;
      
      setMetrics(newMetrics);
      setHistoricalData(prev => [...prev.slice(-119), newMetrics]); // Keep last 120 points
      checkAlerts(newMetrics);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoRefresh, generateMetrics, checkAlerts]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: Alert['rule']['severity']) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'warning': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 System Performance Dashboard</h1>
            <p className="text-indigo-100">
              Monitorim në kohë reale i të gjithë infrastrukturës EuroWeb Ultra
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-indigo-200">Last Update</div>
              <div className="font-semibold">{metrics.timestamp.toLocaleTimeString()}</div>
            </div>
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isAutoRefresh 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              }`}
            >
              {isAutoRefresh ? '⏸️ Pause' : '▶️ Resume'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <AnimatePresence>
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-red-600">🚨 Active Alerts ({activeAlerts.length})</h2>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.rule.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{alert.rule.message}</div>
                      <div className="text-sm opacity-75">
                        {alert.rule.metric}: {alert.value} {alert.rule.condition} {alert.rule.threshold}
                      </div>
                      <div className="text-xs opacity-50">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm"
                    >
                      Acknowledge
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">💻 CPU</h3>
            <div className="text-2xl">🔥</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Usage:</span>
              <span className={`font-bold ${getMetricColor(metrics.cpu.usage, { good: 50, warning: 75 })}`}>
                {metrics.cpu.usage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className={`font-bold ${getMetricColor(metrics.cpu.temperature, { good: 65, warning: 75 })}`}>
                {metrics.cpu.temperature.toFixed(0)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-bold text-blue-600">{metrics.cpu.frequency.toFixed(1)} GHz</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  metrics.cpu.usage < 50 ? 'bg-green-500' :
                  metrics.cpu.usage < 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.cpu.usage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Memory Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🧠 Memory</h3>
            <div className="text-2xl">💾</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Used:</span>
              <span className={`font-bold ${getMetricColor(metrics.memory.percentage, { good: 60, warning: 80 })}`}>
                {metrics.memory.used.toFixed(1)} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-blue-600">{metrics.memory.total} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage:</span>
              <span className={`font-bold ${getMetricColor(metrics.memory.percentage, { good: 60, warning: 80 })}`}>
                {metrics.memory.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  metrics.memory.percentage < 60 ? 'bg-green-500' :
                  metrics.memory.percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.memory.percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Network Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🌐 Network</h3>
            <div className="text-2xl">📡</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Download:</span>
              <span className="font-bold text-green-600">{metrics.network.download} MB/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Upload:</span>
              <span className="font-bold text-blue-600">{metrics.network.upload} MB/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Latency:</span>
              <span className={`font-bold ${getMetricColor(metrics.network.latency, { good: 30, warning: 60 })}`}>
                {metrics.network.latency}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections:</span>
              <span className="font-bold text-purple-600">{metrics.network.connections}</span>
            </div>
          </div>
        </motion.div>

        {/* AI Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">🤖 AI Systems</h3>
            <div className="text-2xl">🧠</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Neural Load:</span>
              <span className={`font-bold ${getMetricColor(metrics.ai.neuralLoad, { good: 60, warning: 80 })}`}>
                {metrics.ai.neuralLoad.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Models:</span>
              <span className="font-bold text-green-600">{metrics.ai.activeModels}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Requests:</span>
              <span className="font-bold text-blue-600">{metrics.ai.requests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Response:</span>
              <span className={`font-bold ${getMetricColor(metrics.ai.averageResponseTime, { good: 300, warning: 600 })}`}>
                {metrics.ai.averageResponseTime}ms
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Energy & Security Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">🌱 Energy & Environment</h3>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{metrics.energy.consumption.toFixed(1)}</div>
              <div className="text-sm text-gray-600">kWh consumed</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getMetricColor(100 - metrics.energy.efficiency, { good: 20, warning: 40 })}`}>
                {metrics.energy.efficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.energy.carbonFootprint.toFixed(1)}</div>
              <div className="text-sm text-gray-600">kg CO2</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.energy.renewablePercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">renewable</div>
            </div>
          </div>
        </motion.div>

        {/* Security Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">🛡️ Security Status</h3>
            <div className={`text-3xl ${
              metrics.security.risk === 'low' ? '🟢' :
              metrics.security.risk === 'medium' ? '🟡' : '🔴'
            }`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                metrics.security.threats === 0 ? 'text-green-600' :
                metrics.security.threats < 3 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.security.threats}
              </div>
              <div className="text-sm text-gray-600">active threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.security.blocked}</div>
              <div className="text-sm text-gray-600">blocked today</div>
            </div>
            <div className="col-span-2 text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                metrics.security.risk === 'low' ? 'bg-green-100 text-green-800' :
                metrics.security.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Risk Level: {metrics.security.risk.toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance History Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">📈 Performance History</h2>
          <div className="flex gap-2">
            {(['1h', '6h', '24h', '7d'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        
        {historicalData.length > 0 ? (
          <div className="h-64 flex items-end space-x-1">
            {historicalData.slice(-60).map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-end space-y-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(data.cpu.usage / 100) * 100}%` }}
                  title={`CPU: ${data.cpu.usage.toFixed(1)}%`}
                />
                <div
                  className="w-full bg-green-500"
                  style={{ height: `${(data.memory.percentage / 100) * 100}%` }}
                  title={`Memory: ${data.memory.percentage.toFixed(1)}%`}
                />
                <div
                  className="w-full bg-purple-500 rounded-b"
                  style={{ height: `${(data.ai.neuralLoad / 100) * 100}%` }}
                  title={`Neural Load: ${data.ai.neuralLoad.toFixed(1)}%`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Collecting performance data...
          </div>
        )}
        
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span>Neural Load</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
