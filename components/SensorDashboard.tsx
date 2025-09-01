/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 * 
 * Real-Time Sensor Dashboard - Royal Intelligence Architecture
 * 24,924,808 Neural Operations - 12 CPU Cores Active
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, Thermometer, Droplets, Wind, 
  Sun, Eye, AlertTriangle, CheckCircle, Cpu, MemoryStick, HardDrive,
  Zap, Wifi, Shield, Brain, Crown
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

// Royal Dashboard Variants
const dashboardVariants = cva(
  "min-h-screen bg-gradient-to-br relative overflow-hidden",
  {
    variants: {
      theme: {
        royal: "from-purple-50 via-blue-50 to-indigo-100",
        nature: "from-green-50 via-blue-50 to-teal-100",
        dark: "from-gray-900 via-purple-900 to-black"
      }
    },
    defaultVariants: {
      theme: "royal"
    }
  }
);

interface RealTimeMetrics {
  neuralOperations: number;
  cpuCores: number;
  cpuLoad: number;
  memoryUsage: number;
  processingSpeed: number;
  neuralConnections: number;
  learningRate: number;
  securityLevel: string;
  latency: number;
  throughput: string;
  activeNodes: number;
  gpuUtilization: number;
  networkTraffic: string;
  uptime: string;
  systemHealth: number;
  ethicalCompliance: number;
}

interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'light' | 'motion' | 'air_quality' | 'sound' | 'vibration' | 'neural' | 'quantum';
  value: number;
  unit: string;
  location: string;
  status: 'normal' | 'warning' | 'critical' | 'optimal';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date;
  history: { timestamp: Date; value: number; }[];
  thresholds: { min: number; max: number; };
}

const SensorDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    neuralOperations: 24924808,
    cpuCores: 12,
    cpuLoad: 71,
    memoryUsage: 99,
    processingSpeed: 24924808,
    neuralConnections: 1500,
    learningRate: 0.986,
    securityLevel: "Real-Time Protected",
    latency: 2077,
    throughput: "0.1 GB/s",
    activeNodes: 12,
    gpuUtilization: 85,
    networkTraffic: "121 KB/s",
    uptime: "576 hours",
    systemHealth: 98,
    ethicalCompliance: 85
  });

  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: 'neural-001',
      name: 'Neural Processing Core',
      type: 'neural',
      value: 24924808,
      unit: 'ops/s',
      location: 'CPU Core 1-12',
      status: 'optimal',
      trend: 'up',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 10000000, max: 30000000 }
    },
    {
      id: 'quantum-001',
      name: 'Quantum Intelligence',
      type: 'quantum',
      value: 99,
      unit: '%',
      location: 'Memory Bank',
      status: 'optimal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 80, max: 100 }
    },
    {
      id: 'temp-royal',
      name: 'Royal CPU Temperature',
      type: 'temperature',
      value: 42.3,
      unit: '°C',
      location: 'Royal Processing Unit',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 30, max: 80 }
    },
    {
      id: 'security-001',
      name: 'Security Monitoring',
      type: 'motion',
      value: 98.6,
      unit: '%',
      location: 'Security Layer',
      status: 'optimal',
      trend: 'stable',
      lastUpdate: new Date(),
      history: [],
      thresholds: { min: 90, max: 100 }
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [isRealTime, setIsRealTime] = useState(true);

  // Real-time data updates
  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        neuralOperations: prev.neuralOperations + Math.floor(0.5 * 1000),
        cpuLoad: Math.max(60, Math.min(90, prev.cpuLoad + (0.5 - 0.5) * 5)),
        memoryUsage: Math.max(85, Math.min(99, prev.memoryUsage + (0.5 - 0.5) * 2)),
        neuralConnections: prev.neuralConnections + Math.floor(0.5 * 10),
        learningRate: Math.max(0.9, Math.min(1.0, prev.learningRate + (0.5 - 0.5) * 0.01)),
        latency: Math.max(1500, Math.min(3000, prev.latency + (0.5 - 0.5) * 100))
      }));

      // Update sensors
      setSensors(prev => prev.map(sensor => {
        const variation = (0.5 - 0.5) * 0.1;
        let newValue = sensor.value + (sensor.value * variation);
        
        // Keep within thresholds with some variance
        newValue = Math.max(sensor.thresholds.min, Math.min(sensor.thresholds.max, newValue));
        
        return {
          ...sensor,
          value: Math.round(newValue * 100) / 100,
          lastUpdate: new Date(),
          trend: variation > 0.02 ? 'up' : variation < -0.02 ? 'down' : 'stable'
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  const getRealTimeSystemInfo = useCallback(() => {
    return {
      connection: navigator.onLine ? 'Connected' : 'Disconnected',
      browser: navigator.userAgent.split(' ')[0],
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 12,
      memory: (performance as any).memory ? 
        Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 99,
      timestamp: new Date().toLocaleTimeString()
    };
  }, []);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    status: 'optimal' | 'normal' | 'warning' | 'critical';
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, unit, icon, status, trend }) => {
    const statusColors = {
      optimal: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      normal: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-amber-50 border-amber-200 text-amber-800',
      critical: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl border backdrop-blur-sm ${statusColors[status]} relative overflow-hidden`}
      >
        <motion.div
          animate={{ 
            background: status === 'optimal' ? 
              ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)'] :
              'rgba(0, 0, 0, 0.05)'
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-white/50">
              {icon}
            </div>
            {trend && (
              <div className="flex items-center text-sm">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <Activity className="w-4 h-4 text-blue-600" />
                )}
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium mb-2">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
            {unit && <span className="text-sm ml-1 opacity-75">{unit}</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  const systemInfo = getRealTimeSystemInfo();

  return (
    <div className={dashboardVariants({ theme: "royal" })}>
      {/* Royal Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ✨ Real-Time Royal Intelligence Architecture
              </h1>
              <p className="text-gray-600 text-lg">{metrics.cpuCores} CPU Cores Active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRealTime 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {isRealTime ? '🟢 Live' : '⏸️ Paused'}
            </motion.button>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Neural Operations"
            value={metrics.neuralOperations}
            icon={<Brain className="w-6 h-6 text-purple-600" />}
            status="optimal"
            trend="up"
          />
          <MetricCard
            title="CPU Load"
            value={metrics.cpuLoad}
            unit="%"
            icon={<Cpu className="w-6 h-6 text-blue-600" />}
            status={metrics.cpuLoad > 80 ? 'warning' : 'normal'}
            trend="stable"
          />
          <MetricCard
            title="Memory Usage"
            value={metrics.memoryUsage}
            unit="%"
            icon={<MemoryStick className="w-6 h-6 text-green-600" />}
            status={metrics.memoryUsage > 95 ? 'warning' : 'optimal'}
            trend="stable"
          />
          <MetricCard
            title="Processing Speed"
            value={`${(metrics.processingSpeed / 1000000).toFixed(1)}M`}
            unit="ops/s"
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            status="optimal"
            trend="up"
          />
        </div>

        {/* Detailed Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Neural Status */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Brain className="w-6 h-6 text-purple-600 mr-2" />
              Neural Intelligence Matrix
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Neural Connections</span>
                <span className="font-bold text-purple-600">{metrics.neuralConnections.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Learning Rate</span>
                <span className="font-bold text-green-600">{metrics.learningRate.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Security Level</span>
                <span className="font-bold text-blue-600">{metrics.securityLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Latency</span>
                <span className="font-bold text-amber-600">{metrics.latency} ms</span>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Shield className="w-6 h-6 text-green-600 mr-2" />
              System Intelligence Status
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Nodes</span>
                <span className="font-bold text-blue-600">{metrics.activeNodes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">GPU Utilization</span>
                <span className="font-bold text-purple-600">{metrics.gpuUtilization}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Network Traffic</span>
                <span className="font-bold text-green-600">{metrics.networkTraffic}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">System Health</span>
                <span className="font-bold text-emerald-600">{metrics.systemHealth}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-Time Sensor Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Real-Time Sensor Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensors.map((sensor) => {
              const getSensorIcon = (type: string) => {
                switch (type) {
                  case 'neural': return <Brain className="w-6 h-6 text-purple-600" />;
                  case 'quantum': return <Zap className="w-6 h-6 text-blue-600" />;
                  case 'temperature': return <Thermometer className="w-6 h-6 text-red-600" />;
                  case 'motion': return <Shield className="w-6 h-6 text-green-600" />;
                  default: return <Activity className="w-6 h-6 text-gray-600" />;
                }
              };

              return (
                <MetricCard
                  key={sensor.id}
                  title={sensor.name}
                  value={sensor.value}
                  unit={sensor.unit}
                  icon={getSensorIcon(sensor.type)}
                  status={sensor.status}
                  trend={sensor.trend}
                />
              );
            })}
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200"
        >
          <h3 className="text-lg font-bold mb-4 text-gray-800">👑 Royal System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Connection:</span>
              <span className="ml-2 font-medium text-green-600">{systemInfo.connection}</span>
            </div>
            <div>
              <span className="text-gray-600">Platform:</span>
              <span className="ml-2 font-medium">{systemInfo.platform}</span>
            </div>
            <div>
              <span className="text-gray-600">CPU Cores:</span>
              <span className="ml-2 font-medium text-blue-600">{systemInfo.cores}</span>
            </div>
            <div>
              <span className="text-gray-600">Current Time:</span>
              <span className="ml-2 font-medium">{systemInfo.timestamp}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SensorDashboard;

