/**
 * AGI Core Engine Ultra - Multi-Sensor Live Metrics Dashboard
 * Real-time Module Monitoring with Live Charts and Analytics
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 10.0.0 MULTI-SENSOR INDUSTRIAL
 * @license MIT
 * @created September 4, 2025
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AGIMultiSensorDashboard.module.css';

// ====================================================================
// TYPES & INTERFACES - MULTI-SENSOR DEFINITIONS
// ====================================================================

interface ModuleMetric {
  id: string;
  name: string;
  type: 'sensor' | 'processor' | 'network' | 'storage' | 'memory' | 'quantum' | 'neural' | 'ai';
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  timestamp: number;
  location?: string;
  metadata?: Record<string, any>;
}

interface SystemModule {
  moduleId: string;
  moduleName: string;
  moduleType: 'hardware' | 'software' | 'virtual' | 'quantum';
  isActive: boolean;
  metrics: ModuleMetric[];
  lastUpdate: number;
  uptime: number;
  location: string;
}

interface MetricHistory {
  timestamp: number;
  value: number;
}

interface ModulesData {
  timestamp: number;
  modules: SystemModule[];
  totalModules: number;
  activeModules: number;
  systemUptime: number;
  platform: string;
  arch: string;
  nodeVersion: string;
}

// ====================================================================
// SPARKLINE CHART COMPONENT
// ====================================================================

interface SparklineProps {
  data: MetricHistory[];
  width?: number;
  height?: number;
  color?: string;
  maxPoints?: number;
}

const MetricSparkline: React.FC<SparklineProps> = ({ 
  data, 
  width = 120, 
  height = 40, 
  color = '#00ff88',
  maxPoints = 50
}) => {
  if (!data || data.length === 0) {
    return (
      <div 
        className={`${styles.sparklinePlaceholder} ${styles.sparklinePlaceholderSize}`}
      >
        No Data
      </div>
    );
  }

  const recentData = data.slice(-maxPoints);
  const minValue = Math.min(...recentData.map(d => d.value));
  const maxValue = Math.max(...recentData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = recentData.map((d, i) => {
    const x = (i / (recentData.length - 1)) * width;
    const y = height - ((d.value - minValue) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`${styles.sparklineContainer} ${styles.sparklineContainerSize}`}>
      <svg width={width} height={height} className={styles.sparklineSvg}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className={styles.sparklineLine}
        />
        <circle
          cx={recentData.length > 0 ? ((recentData.length - 1) / (recentData.length - 1)) * width : 0}
          cy={recentData.length > 0 ? height - ((recentData[recentData.length - 1].value - minValue) / range) * height : height / 2}
          r="3"
          fill={color}
          className={styles.sparklinePoint}
        />
      </svg>
      <div className={styles.sparklineValue}>
        {recentData[recentData.length - 1]?.value?.toFixed(1) || '0'}
      </div>
    </div>
  );
};

// ====================================================================
// MAIN MULTI-SENSOR DASHBOARD COMPONENT
// ====================================================================

const AGIMultiSensorDashboard: React.FC = () => {
  // ----------------------------------------------------------------
  // STATE MANAGEMENT - MULTI-SENSOR DATA
  // ----------------------------------------------------------------
  
  const [modulesData, setModulesData] = useState<ModulesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Metric histories for sparkline charts
  const metricHistories = useRef<Map<string, MetricHistory[]>>(new Map());
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const eventSource = useRef<EventSource | null>(null);

  // ----------------------------------------------------------------
  // REAL DATA INGESTION - SSE FIRST, POLLING FALLBACK
  // ----------------------------------------------------------------

  const establishSSEConnection = useCallback(() => {
    try {
      // Try SSE first for real-time updates
      const sse = new EventSource('/api/system/stream');
      
      sse.onopen = () => {
        console.log('SSE connection established for multi-sensor data');
        setIsConnected(true);
        setError(null);
      };
      
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // If we get system data from SSE, we can derive module metrics
          if (data.cpu || data.memory || data.network) {
            updateMetricHistories(data);
            setLastUpdate(Date.now());
          }
        } catch (e) {
          console.warn('SSE data parsing error:', e);
        }
      };
      
      sse.onerror = () => {
        console.warn('SSE connection lost, falling back to polling');
        setIsConnected(false);
        sse.close();
        startPolling(); // Fallback to polling
      };
      
      eventSource.current = sse;
    } catch (error) {
      console.error('SSE setup failed, using polling:', error);
      startPolling();
    }
  }, []);

  const fetchModulesData = useCallback(async () => {
    try {
      const response = await fetch('/api/modules/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ModulesData = await response.json();
      setModulesData(data);
      setLastUpdate(Date.now());
      setError(null);
      
      // Update metric histories for sparklines
      updateMetricHistoriesFromModules(data);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error fetching modules data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMetricHistoriesFromModules = useCallback((data: ModulesData) => {
    const now = Date.now();
    
    data.modules.forEach(module => {
      module.metrics.forEach(metric => {
        const key = `${module.moduleId}_${metric.id}`;
        const currentHistory = metricHistories.current.get(key) || [];
        
        // Add new data point
        const newPoint: MetricHistory = {
          timestamp: now,
          value: metric.value
        };
        
        // Keep only last 100 points for performance
        const updatedHistory = [...currentHistory, newPoint].slice(-100);
        metricHistories.current.set(key, updatedHistory);
      });
    });
  }, []);

  const updateMetricHistories = useCallback((sseData: any) => {
    const now = Date.now();
    
    // Map SSE system data to our metric format
    if (sseData.cpu) {
      const key = 'proc_001_cpu_usage';
      const currentHistory = metricHistories.current.get(key) || [];
      const newPoint: MetricHistory = {
        timestamp: now,
        value: sseData.cpu.usage || 0
      };
      const updatedHistory = [...currentHistory, newPoint].slice(-100);
      metricHistories.current.set(key, updatedHistory);
    }
    
    if (sseData.memory) {
      const key = 'mem_001_memory_usage';
      const currentHistory = metricHistories.current.get(key) || [];
      const newPoint: MetricHistory = {
        timestamp: now,
        value: sseData.memory.usedPercent || 0
      };
      const updatedHistory = [...currentHistory, newPoint].slice(-100);
      metricHistories.current.set(key, updatedHistory);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    
    // Initial fetch
    fetchModulesData();
    
    // Poll every 2 seconds for real-time updates
    pollingInterval.current = setInterval(() => {
      fetchModulesData();
    }, 2000);
  }, [fetchModulesData]);

  // ----------------------------------------------------------------
  // LIFECYCLE MANAGEMENT
  // ----------------------------------------------------------------

  useEffect(() => {
    // Start polling immediately for fast data loading
    startPolling();
    
    // Also try SSE for real-time updates
    establishSSEConnection();

    return () => {
      if (eventSource.current) {
        eventSource.current.close();
      }
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [establishSSEConnection, startPolling]);

  // ----------------------------------------------------------------
  // UTILITY FUNCTIONS
  // ----------------------------------------------------------------

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return '#00ff88';
      case 'warning': return '#ff9500';
      case 'critical': return '#ff4444';
      case 'offline': return '#666666';
      default: return '#00ff88';
    }
  };

  const getModuleTypeIcon = (type: string): string => {
    switch (type) {
      case 'hardware': return '🔧';
      case 'software': return '💾';
      case 'virtual': return '🌐';
      case 'quantum': return '⚛️';
      default: return '📊';
    }
  };

  const formatUptime = (uptime: number): string => {
    const seconds = Math.floor(uptime / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // ----------------------------------------------------------------
  // RENDER COMPONENTS
  // ----------------------------------------------------------------

  const renderModuleCard = (module: SystemModule) => (
    <motion.div
      key={module.moduleId}
      className={styles.moduleCard}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.moduleHeader}>
        <div className={styles.moduleIcon}>
          {getModuleTypeIcon(module.moduleType)}
        </div>
        <div className={styles.moduleInfo}>
          <h3 className={styles.moduleName}>{module.moduleName}</h3>
          <span className={styles.moduleLocation}>{module.location}</span>
        </div>
        <div className={`${styles.moduleStatus} ${styles[module.isActive ? 'active' : 'inactive']}`}>
          {module.isActive ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>
      
      <div className={styles.moduleMetrics}>
        {module.metrics.map(metric => (
          <div key={metric.id} className={styles.metricRow}>
            <div className={styles.metricInfo}>
              <span className={styles.metricName}>{metric.name}</span>
              <span className={styles.metricValue}>
                {metric.value} {metric.unit}
              </span>
            </div>
            <div className={styles.metricChart}>
              <MetricSparkline
                data={metricHistories.current.get(`${module.moduleId}_${metric.id}`) || []}
                color={getStatusColor(metric.status)}
                width={100}
                height={30}
              />
            </div>
            <div 
              className={`${styles.metricStatus} ${styles[metric.status]}`}
            >
              {metric.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.moduleFooter}>
        <span className={styles.moduleUptime}>
          Uptime: {formatUptime(module.uptime)}
        </span>
        <span className={styles.moduleUpdate}>
          Updated: {new Date(module.lastUpdate).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );

  // ----------------------------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------------------------

  if (isLoading && !modulesData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <h2>Initializing Multi-Sensor AGI Dashboard...</h2>
        <p>Connecting to live module data streams</p>
      </div>
    );
  }

  if (error && !modulesData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Multi-Sensor Dashboard Error</h2>
        <p>Error: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
            fetchModulesData();
          }}
          className={styles.retryButton}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <motion.div 
        className={styles.dashboardHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.dashboardTitle}>
          AGI Multi-Sensor Dashboard
        </h1>
        <div className={styles.dashboardStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Modules</span>
            <span className={styles.statValue}>{modulesData?.totalModules || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Active</span>
            <span className={styles.statValue}>{modulesData?.activeModules || 0}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>System Uptime</span>
            <span className={styles.statValue}>
              {modulesData ? formatUptime(modulesData.systemUptime) : '0h 0m'}
            </span>
          </div>
          <div className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            {isConnected ? '🔗 SSE Connected' : '📡 Polling Mode'}
          </div>
        </div>
      </motion.div>

      {/* System Info */}
      {modulesData && (
        <motion.div 
          className={styles.systemInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>Platform: {modulesData.platform}</span>
          <span>Architecture: {modulesData.arch}</span>
          <span>Node.js: {modulesData.nodeVersion}</span>
          <span>Last Update: {new Date(lastUpdate).toLocaleTimeString()}</span>
        </motion.div>
      )}

      {/* Modules Grid */}
      <div className={styles.modulesGrid}>
        <AnimatePresence>
          {modulesData?.modules.map(renderModuleCard)}
        </AnimatePresence>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button 
            onClick={() => setError(null)}
            className={styles.dismissButton}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default AGIMultiSensorDashboard;
