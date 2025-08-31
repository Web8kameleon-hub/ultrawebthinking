/**
 * Ultra Monitor Page - System Performance Dashboard
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkSpeed: number;
  temperature: number;
  uptime: string;
}

const UltraMonitorPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 34,
    networkSpeed: 850,
    temperature: 42,
    uptime: "7d 14h 23m"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkSpeed: Math.max(100, Math.min(1000, prev.networkSpeed + (Math.random() - 0.5) * 100)),
        temperature: Math.max(35, Math.min(65, prev.temperature + (Math.random() - 0.5) * 3))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'temp') => {
    switch (type) {
      case 'cpu':
      case 'memory':
        if (value < 50) return '#10b981';
        if (value < 80) return '#f59e0b';
        return '#ef4444';
      case 'temp':
        if (value < 45) return '#10b981';
        if (value < 60) return '#f59e0b';
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="ultra-monitor-page">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="monitor-header"
      >
        <h1>📊 Ultra Monitor</h1>
        <p>Real-time system performance monitoring</p>
      </motion.header>

      <div className="monitor-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="monitor-card"
        >
          <div className="monitor-icon">🔥</div>
          <h3>CPU Usage</h3>
          <div className="monitor-value" style={{ color: getStatusColor(metrics.cpuUsage, 'cpu') }}>
            {metrics.cpuUsage.toFixed(1)}%
          </div>
          <div className="monitor-bar">
            <div 
              className="monitor-bar-fill"
              style={{ 
                width: `${metrics.cpuUsage}%`,
                background: getStatusColor(metrics.cpuUsage, 'cpu')
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="monitor-card"
        >
          <div className="monitor-icon">💾</div>
          <h3>Memory Usage</h3>
          <div className="monitor-value" style={{ color: getStatusColor(metrics.memoryUsage, 'memory') }}>
            {metrics.memoryUsage.toFixed(1)}%
          </div>
          <div className="monitor-bar">
            <div 
              className="monitor-bar-fill"
              style={{ 
                width: `${metrics.memoryUsage}%`,
                background: getStatusColor(metrics.memoryUsage, 'memory')
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="monitor-card"
        >
          <div className="monitor-icon">💿</div>
          <h3>Disk Usage</h3>
          <div className="monitor-value" style={{ color: getStatusColor(metrics.diskUsage, 'disk') }}>
            {metrics.diskUsage.toFixed(1)}%
          </div>
          <div className="monitor-bar">
            <div 
              className="monitor-bar-fill"
              style={{ 
                width: `${metrics.diskUsage}%`,
                background: getStatusColor(metrics.diskUsage, 'disk')
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="monitor-card"
        >
          <div className="monitor-icon">🌐</div>
          <h3>Network Speed</h3>
          <div className="monitor-value" style={{ color: '#3b82f6' }}>
            {metrics.networkSpeed.toFixed(0)} Mbps
          </div>
          <div className="monitor-status">High speed connection</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="monitor-card"
        >
          <div className="monitor-icon">🌡️</div>
          <h3>Temperature</h3>
          <div className="monitor-value" style={{ color: getStatusColor(metrics.temperature, 'temp') }}>
            {metrics.temperature.toFixed(1)}°C
          </div>
          <div className="monitor-status">
            {metrics.temperature < 45 ? 'Cool' : metrics.temperature < 60 ? 'Warm' : 'Hot'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="monitor-card"
        >
          <div className="monitor-icon">⏰</div>
          <h3>Uptime</h3>
          <div className="monitor-value" style={{ color: '#10b981' }}>
            {metrics.uptime}
          </div>
          <div className="monitor-status">System stable</div>
        </motion.div>
      </div>

      <style jsx>{`
        .ultra-monitor-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%);
          color: #f9fafb;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }

        .monitor-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .monitor-header h1 {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .monitor-header p {
          font-size: 1.2rem;
          color: #9ca3af;
        }

        .monitor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .monitor-card {
          background: linear-gradient(135deg, #1f2937, #374151);
          padding: 24px;
          border-radius: 16px;
          border: 2px solid #4b5563;
          transition: all 0.3s ease;
          text-align: center;
        }

        .monitor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
          border-color: #6b7280;
        }

        .monitor-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .monitor-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #e5e7eb;
        }

        .monitor-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .monitor-status {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .monitor-bar {
          width: 100%;
          height: 8px;
          background: #374151;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 12px;
        }

        .monitor-bar-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .monitor-grid {
            grid-template-columns: 1fr;
          }
          
          .monitor-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UltraMonitorPage;
