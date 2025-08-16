/**
 * Guardian Security Dashboard Component
 * Real-time threat monitoring and security analytics
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import styles from './GuardianDashboard.module.css';

interface ThreatLog {
  timestamp: string;
  ip: string;
  reason: string;
  userAgent?: string;
  path?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
}

interface GuardianStats {
  totalRequests: number;
  blockedRequests: number;
  uniqueIPs: number;
  blockedIPs: number;
  avgResponseTime: number;
  activeConnections: number;
  systemHealth: 'healthy' | 'degraded' | 'critical';
}

interface GuardianData {
  status: 'active' | 'inactive';
  stats: GuardianStats;
  recentThreats: ThreatLog[];
  blockedIPs: string[];
  config: {
    maxRequestsPerMinute: number;
    maxPayloadSize: number;
    blockDuration: number;
  };
}

export default function GuardianDashboard() {
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockIP, setBlockIP] = useState('');
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchGuardianData();
    const interval = setInterval(fetchGuardianData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchGuardianData = async () => {
    try {
      const response = await fetch('/api/guardian');
      if (!response.ok) throw new Error('Failed to fetch Guardian data');
      
      const result = await response.json();
      setGuardianData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async () => {
    if (!blockIP.trim() || !blockReason.trim()) {
      alert('Both IP and reason are required');
      return;
    }

    try {
      const response = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'block',
          ip: blockIP.trim(),
          reason: blockReason.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to block IP');

      setBlockIP('');
      setBlockReason('');
      fetchGuardianData();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleUnblockIP = async (ip: string) => {
    try {
      const response = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unblock',
          ip
        })
      });

      if (!response.ok) throw new Error('Failed to unblock IP');
      fetchGuardianData();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleGuardian = async () => {
    if (!guardianData) return;

    try {
      const response = await fetch('/api/guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          active: guardianData.status === 'inactive'
        })
      });

      if (!response.ok) throw new Error('Failed to toggle Guardian');
      fetchGuardianData();
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffcc00';
      case 'low': return '#88cc00';
      default: return '#666';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return '#00cc44';
      case 'degraded': return '#ffcc00';
      case 'critical': return '#ff4444';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Guardian Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  if (!guardianData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No Guardian data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🛡️ Guardian Security Dashboard</h1>
        <div className={styles.statusBadge}>
          <span 
            className={`${styles.status} ${guardianData.status === 'active' ? styles.active : styles.inactive}`}
          >
            {guardianData.status.toUpperCase()}
          </span>
          <button 
            onClick={toggleGuardian}
            className={styles.toggleButton}
          >
            {guardianData.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* System Health */}
        <div className={styles.card}>
          <h3>System Health</h3>
          <div 
            className={styles.healthStatus}
            style={{ color: getHealthColor(guardianData.stats.systemHealth) } as any}
          >
            {guardianData.stats.systemHealth.toUpperCase()}
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.card}>
          <h3>Request Statistics</h3>
          <div className={styles.stat}>
            <span>Total Requests:</span>
            <span>{guardianData.stats.totalRequests.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span>Blocked Requests:</span>
            <span className={styles.blocked}>{guardianData.stats.blockedRequests.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span>Block Rate:</span>
            <span>
              {guardianData.stats.totalRequests > 0 
                ? ((guardianData.stats.blockedRequests / guardianData.stats.totalRequests) * 100).toFixed(2)
                : 0}%
            </span>
          </div>
        </div>

        {/* Network Stats */}
        <div className={styles.card}>
          <h3>Network Statistics</h3>
          <div className={styles.stat}>
            <span>Unique IPs:</span>
            <span>{guardianData.stats.uniqueIPs}</span>
          </div>
          <div className={styles.stat}>
            <span>Blocked IPs:</span>
            <span className={styles.blocked}>{guardianData.stats.blockedIPs}</span>
          </div>
          <div className={styles.stat}>
            <span>Active Connections:</span>
            <span>{guardianData.stats.activeConnections}</span>
          </div>
        </div>

        {/* Performance */}
        <div className={styles.card}>
          <h3>Performance</h3>
          <div className={styles.stat}>
            <span>Avg Response Time:</span>
            <span>{guardianData.stats.avgResponseTime.toFixed(2)}ms</span>
          </div>
        </div>
      </div>

      {/* Manual IP Management */}
      <div className={styles.manualControl}>
        <h3>Manual IP Management</h3>
        <div className={styles.blockForm}>
          <input
            type="text"
            placeholder="IP Address"
            value={blockIP}
            onChange={(e) => setBlockIP(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Block Reason"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            className={styles.input}
          />
          <button 
            onClick={handleBlockIP}
            className={styles.blockButton}
          >
            Block IP
          </button>
        </div>
      </div>

      {/* Recent Threats */}
      <div className={styles.threatsSection}>
        <h3>Recent Threats</h3>
        <div className={styles.threatsList}>
          {guardianData.recentThreats.length === 0 ? (
            <div className={styles.noThreats}>No recent threats detected</div>
          ) : (
            guardianData.recentThreats.map((threat, index) => (
              <div key={index} className={styles.threat}>
                <div className={styles.threatHeader}>
                  <span 
                    className={styles.severity}
                    style={{ backgroundColor: getSeverityColor(threat.severity) } as any}
                  >
                    {threat.severity.toUpperCase()}
                  </span>
                  <span className={styles.timestamp}>
                    {new Date(threat.timestamp).toLocaleString()}
                  </span>
                  <span className={`${styles.blocked} ${threat.blocked ? styles.wasBlocked : styles.wasDetected}`}>
                    {threat.blocked ? 'BLOCKED' : 'DETECTED'}
                  </span>
                </div>
                <div className={styles.threatDetails}>
                  <div><strong>IP:</strong> {threat.ip}</div>
                  <div><strong>Reason:</strong> {threat.reason}</div>
                  {threat.path && <div><strong>Path:</strong> {threat.path}</div>}
                  {threat.userAgent && (
                    <div><strong>User Agent:</strong> {threat.userAgent}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Blocked IPs */}
      <div className={styles.blockedSection}>
        <h3>Currently Blocked IPs</h3>
        <div className={styles.blockedList}>
          {guardianData.blockedIPs.length === 0 ? (
            <div className={styles.noBlocked}>No IPs currently blocked</div>
          ) : (
            guardianData.blockedIPs.map((ip, index) => (
              <div key={index} className={styles.blockedIP}>
                <span>{ip}</span>
                <button 
                  onClick={() => handleUnblockIP(ip)}
                  className={styles.unblockButton}
                >
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
