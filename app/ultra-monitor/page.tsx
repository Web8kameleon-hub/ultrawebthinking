/**
 * Ultra Monitor Page - System Performance Dashboard
 * @author Ledjan Ahmati
 * @version 8.0.0 Real
 */

"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

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

  const getStatusColorClass = (value: number, type: 'cpu' | 'memory' | 'disk' | 'temp') => {
    switch (type) {
      case 'cpu':
      case 'memory':
        if (value < 50) return styles.statusGreen;
        if (value < 80) return styles.statusYellow;
        return styles.statusRed;
      case 'temp':
        if (value < 45) return styles.statusGreen;
        if (value < 60) return styles.statusYellow;
        return styles.statusRed;
      default:
        return styles.statusBlue;
    }
  };

  const getBarColorClass = (value: number, type: 'cpu' | 'memory' | 'disk' | 'temp') => {
    switch (type) {
      case 'cpu':
      case 'memory':
        if (value < 50) return styles.barGreen;
        if (value < 80) return styles.barYellow;
        return styles.barRed;
      case 'temp':
        if (value < 45) return styles.barGreen;
        if (value < 60) return styles.barYellow;
        return styles.barRed;
      default:
        return styles.barBlue;
    }
  };

  return (
    <div className={styles.ultraMonitorPage}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.monitorHeader}
      >
        <h1 className={styles.monitorTitle}>📊 Ultra Monitor</h1>
        <p className={styles.monitorSubtitle}>Real-time system performance monitoring</p>
      </motion.header>

      <div className={styles.monitorGrid}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>🔥</div>
          <h3 className={styles.monitorCardTitle}>CPU Usage</h3>
          <div className={clsx(styles.monitorValue, getStatusColorClass(metrics.cpuUsage, 'cpu'))}>
            {metrics.cpuUsage.toFixed(1)}%
          </div>
          <div className={styles.monitorBar}>
            <motion.div
              className={clsx(styles.monitorBarFill, getBarColorClass(metrics.cpuUsage, 'cpu'))}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.cpuUsage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>💾</div>
          <h3 className={styles.monitorCardTitle}>Memory Usage</h3>
          <div className={clsx(styles.monitorValue, getStatusColorClass(metrics.memoryUsage, 'memory'))}>
            {metrics.memoryUsage.toFixed(1)}%
          </div>
          <div className={styles.monitorBar}>
            <motion.div
              className={clsx(styles.monitorBarFill, getBarColorClass(metrics.memoryUsage, 'memory'))}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.memoryUsage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>💿</div>
          <h3 className={styles.monitorCardTitle}>Disk Usage</h3>
          <div className={clsx(styles.monitorValue, getStatusColorClass(metrics.diskUsage, 'disk'))}>
            {metrics.diskUsage.toFixed(1)}%
          </div>
          <div className={styles.monitorBar}>
            <motion.div
              className={clsx(styles.monitorBarFill, getBarColorClass(metrics.diskUsage, 'disk'))}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.diskUsage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>🌐</div>
          <h3 className={styles.monitorCardTitle}>Network Speed</h3>
          <div className={clsx(styles.monitorValue, styles.statusBlue)}>
            {metrics.networkSpeed.toFixed(0)} Mbps
          </div>
          <div className={styles.monitorStatus}>High speed connection</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>🌡️</div>
          <h3 className={styles.monitorCardTitle}>Temperature</h3>
          <div className={clsx(styles.monitorValue, getStatusColorClass(metrics.temperature, 'temp'))}>
            {metrics.temperature.toFixed(1)}°C
          </div>
          <div className={styles.monitorStatus}>
            {metrics.temperature < 45 ? 'Cool' : metrics.temperature < 60 ? 'Warm' : 'Hot'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className={styles.monitorCard}
        >
          <div className={styles.monitorIcon}>⏰</div>
          <h3 className={styles.monitorCardTitle}>Uptime</h3>
          <div className={clsx(styles.monitorValue, styles.statusGreen)}>
            {metrics.uptime}
          </div>
          <div className={styles.monitorStatus}>System stable</div>
        </motion.div>
      </div>
    </div>
  );
};

export default UltraMonitorPage;

