/**
 * Lightweight Kristal Dashboard
 * Optimized for Performance - No Heavy Animations
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useLightSystemStream } from '../hooks/useLightSystemStream';
import NavBreadcrumb from './NavBreadcrumb';
import styles from './UltraDashboardKristal.module.css';

const UltraDashboardLight: React.FC = () => {
  const { data, isConnected, error } = useLightSystemStream();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe time formatting for hydration
  const formatTime = (timestamp?: number) => {
    if (!isClient || !timestamp) return '--:--:--';
    return new Date(timestamp).toLocaleTimeString();
  };

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.navigation}>
          <NavBreadcrumb />
        </div>
        
        <div className={styles.errorContainer}>
          <h1>🚨 Connection Error</h1>
          <p>Unable to connect to system stream: {error}</p>
          <button onClick={() => window.location.reload()}>
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Navigation */}
      <div className={styles.navigation}>
        <NavBreadcrumb />
      </div>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brandSection}>
          <h1 className={styles.brandTitle}>💎 EuroWeb Ultra</h1>
          <span className={styles.brandSubtitle}>Lightweight Performance Edition</span>
        </div>
        
        <div className={styles.statusSection}>
          <div className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            <span className={styles.statusDot}></span>
            <span>{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
          </div>
          
          <div className={styles.systemHealth}>
            <span className={styles.healthLabel}>Last Update:</span>
            <span className={styles.healthValue}>
              {formatTime(data?.timestamp)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        
        {/* Live Metrics Cards */}
        <section className={styles.metricsSection}>
          <h2 className={styles.sectionTitle}>📊 Live Metrics (Lightweight)</h2>
          
          <div className={styles.metricsGrid}>
            {/* CPU Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricIcon}>🖥️</span>
                <h3>CPU Usage</h3>
              </div>
              <div className={styles.metricValue}>
                <span className={styles.bigNumber}>
                  {data?.cpu?.toFixed(1) || '0.0'}%
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricBarFill}
                  style={{ 
                    width: `${data?.cpu || 0}%`,
                    backgroundColor: (data?.cpu || 0) > 70 ? '#ef4444' : '#10b981'
                  }}
                ></div>
              </div>
            </div>

            {/* Memory Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricIcon}>🧠</span>
                <h3>Memory Usage</h3>
              </div>
              <div className={styles.metricValue}>
                <span className={styles.bigNumber}>
                  {data?.memory?.toFixed(1) || '0.0'}%
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricBarFill}
                  style={{ 
                    width: `${data?.memory || 0}%`,
                    backgroundColor: (data?.memory || 0) > 80 ? '#ef4444' : '#10b981'
                  }}
                ></div>
              </div>
            </div>

            {/* AGI Processing Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricIcon}>🤖</span>
                <h3>AGI Processing</h3>
              </div>
              <div className={styles.metricValue}>
                <span className={styles.bigNumber}>
                  {data?.agi?.toFixed(1) || '0.0'}%
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricBarFill}
                  style={{ 
                    width: `${data?.agi || 0}%`,
                    backgroundColor: (data?.agi || 0) > 85 ? '#ef4444' : (data?.agi || 0) > 80 ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
            </div>

            {/* Network Card */}
            <div className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <span className={styles.metricIcon}>🌐</span>
                <h3>Network Latency</h3>
              </div>
              <div className={styles.metricValue}>
                <span className={styles.bigNumber}>
                  {data?.network?.toFixed(0) || '0'} ms
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricBarFill}
                  style={{ 
                    width: `${Math.min(100, (data?.network || 0) / 2.5)}%`,
                    backgroundColor: (data?.network || 0) > 120 ? '#ef4444' : '#10b981'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple Status */}
        <section className={styles.alertsSection}>
          <h2 className={styles.sectionTitle}>⚡ System Status</h2>
          
          <div className={styles.alertsList}>
            <div className={styles.noAlerts}>
              {!data ? (
                '⏳ Loading system data...'
              ) : (
                <>
                  ✅ System operational - Lightweight mode active<br />
                  🔄 Updates every 10 seconds to reduce CPU usage<br />
                  💾 Memory optimized - No heavy animations<br />
                  🌐 Connection: {isConnected ? '🟢 Live' : '🔴 Disconnected'}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Quick Controls */}
        <section className={styles.controlsSection}>
          <h2 className={styles.sectionTitle}>⚡ Performance Mode</h2>
          
          <div className={styles.quickControls}>
            <button 
              className={`${styles.controlBtn} ${styles.boostBtn}`}
              onClick={() => window.location.href = '/'}
            >
              📊 Full Dashboard
            </button>
            <button 
              className={`${styles.controlBtn} ${styles.meshBtn}`}
              onClick={() => window.location.href = '/admin'}
            >
              ⚡ Admin Panel
            </button>
            <button 
              className={`${styles.controlBtn} ${styles.shieldBtn}`}
              onClick={() => window.location.reload()}
            >
              🔄 Refresh
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UltraDashboardLight;
