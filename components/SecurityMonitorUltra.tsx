'use client';

/**
 * Security Monitor Ultra - Advanced Security Dashboard
 * Real-time security monitoring and threat detection
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @version 1.0.0 Ultra Professional
 */

import * as React from 'react';
import { useState, useEffect } from 'react';

interface SecurityEvent {
  id: string;
  type: 'critical' | 'warn' | 'info';
  message: string;
  ip: string;
  userAgent?: string;
  path?: string;
  timestamp: string;
  payload?: number;
}

interface SecurityStats {
  systemStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  totalRequests: number;
  blockedIPs: number;
  alertsGenerated: number;
  systemUptime: string;
}

export function SecurityMonitorUltra(): React.ReactElement {
  const [stats, setStats] = useState<SecurityStats>({
    systemStatus: 'HEALTHY',
    totalRequests: 15847,
    blockedIPs: 23,
    alertsGenerated: 156,
    systemUptime: '1h 0m 0s'
  });

  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'critical',
      message: 'High request rate detected: 105 req/min',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0',
      path: '/api/test',
      timestamp: '6:58:51 PM'
    },
    {
      id: '2',
      type: 'warn',
      message: 'Large payload size detected: 600000 bytes',
      ip: '10.0.0.15',
      timestamp: '6:53:51 PM',
      payload: 600000
    },
    {
      id: '3',
      type: 'warn',
      message: 'Suspicious user agent: python-requests/2.28.1',
      ip: '203.0.113.45',
      userAgent: 'python-requests/2.28.1',
      timestamp: '6:48:51 PM'
    }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const __interval = setInterval(() => {
      setStats((prev: SecurityStats) => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 10),
        alertsGenerated: prev.alertsGenerated + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(__interval);
  }, [autoRefresh]);

  const __getEventColor = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'critical': return { bg: '#dc2626', border: '#ef4444', text: '#fca5a5' };
      case 'warn': return { bg: '#d97706', border: '#f59e0b', text: '#fbbf24' };
      case 'info': return { bg: '#1e40af', border: '#3b82f6', text: '#93c5fd' };
    }
  };

  const __refreshLogs = () => {
    // Simulate new event
    const newEvent: SecurityEvent = {
      id: Date.now().toString(),
      type: Math.random() > 0.7 ? 'critical' : 'warn',
      message: 'New security event detected',
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date().toLocaleTimeString()
    };

    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only 10 latest events
  };

  const __clearLogs = () => {
    setEvents([]);
  };

  const __getStatusColor = (status: SecurityStats['systemStatus']) => {
    switch (status) {
      case 'HEALTHY': return { bg: '#16a34a', text: '#dcfce7' };
      case 'WARNING': return { bg: '#d97706', text: '#fef3c7' };
      case 'CRITICAL': return { bg: '#dc2626', text: '#fecaca' };
    }
  };

  return (
    <div className="security-monitor-ultra">
      <style jsx>{`
        .security-monitor-ultra {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
          padding: 2rem;
          border-radius: 1rem;
          font-family: 'Courier New', monospace;
          min-height: 600px;
        }
        
        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #334155;
        }
        
        .monitor-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00ff00;
          text-shadow: 0 0 10px #00ff0050;
        }
        
        .control-panel {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .events-section {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid #334155;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #334155;
        }
        
        .event-item {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 0.25rem;
          border-left: 4px solid;
          background: rgba(0, 0, 0, 0.3);
        }
        
        .event-critical {
          border-left-color: #dc2626;
          background: rgba(220, 38, 38, 0.1);
        }
        
        .event-warn {
          border-left-color: #d97706;
          background: rgba(217, 119, 6, 0.1);
        }
        
        .event-info {
          border-left-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .event-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        
        .event-type {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          margin-right: 0.5rem;
        }
        
        .event-timestamp {
          color: #94a3b8;
          font-size: 0.875rem;
          margin-left: auto;
        }
        
        .event-message {
          color: #e2e8f0;
          margin-bottom: 0.25rem;
        }
        
        .event-details {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        
        .btn-primary:hover {
          background: #2563eb;
        }
        
        .btn-danger {
          background: #dc2626;
          color: white;
        }
        
        .btn-danger:hover {
          background: #b91c1c;
        }
        
        .toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .toggle input {
          width: 40px;
          height: 20px;
          appearance: none;
          background: #64748b;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .toggle input:checked {
          background: #10b981;
        }
        
        .toggle input::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: transform 0.2s;
        }
        
        .toggle input:checked::before {
          transform: translateX(20px);
        }
        
        .status-healthy {
          color: #16a34a;
        }
        
        .status-warning {
          color: #d97706;
        }
        
        .status-critical {
          color: #dc2626;
        }
      `}</style>

      <div className="monitor-header">
        <h1 className="monitor-title">🛡️ Security Monitor Ultra</h1>
        <div className="control-panel">
          <div className="toggle">
            <span>Auto Refresh</span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
          </div>
          <button className="btn btn-primary" onClick={__refreshLogs}>
            🔄 Refresh
          </button>
          <button className="btn btn-danger" onClick={__clearLogs}>
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className={`stat-value status-${stats.systemStatus.toLowerCase()}`}>
            {stats.systemStatus}
          </div>
          <div className="stat-label">System Status</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {stats.totalRequests.toLocaleString()}
          </div>
          <div className="stat-label">Total Requests</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#dc2626' }}>
            {stats.blockedIPs}
          </div>
          <div className="stat-label">Blocked IPs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#d97706' }}>
            {stats.alertsGenerated}
          </div>
          <div className="stat-label">Alerts Generated</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.systemUptime}
          </div>
          <div className="stat-label">System Uptime</div>
        </div>
      </div>

      <div className="events-section">
        <div className="events-header">
          <h2>🚨 Security Events</h2>
          <span>{events.length} events</span>
        </div>
        
        <div className="events-list">
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
              No security events to display
            </div>
          ) : (
            events.map((event) => {
              const colors = __getEventColor(event.type);
              return (
                <div key={event.id} className={`event-item event-${event.type}`}>
                  <div className="event-header">
                    <span 
                      className="event-type"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {event.type}
                    </span>
                    <span className="event-timestamp">{event.timestamp}</span>
                  </div>
                  <div className="event-message">{event.message}</div>
                  <div className="event-details">
                    IP: {event.ip}
                    {event.userAgent && ` • User-Agent: ${event.userAgent}`}
                    {event.path && ` • Path: ${event.path}`}
                    {event.payload && ` • Payload: ${event.payload} bytes`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}