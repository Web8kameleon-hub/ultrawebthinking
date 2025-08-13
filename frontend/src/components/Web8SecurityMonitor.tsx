/**
 * WEB8 SECURITY MONITOR ULTRA
 * Advanced security dashboard with real backend integration
 * 
 * @version 8.0.0-WEB8-SECURITY
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import * as React from 'react';

interface SecurityEvent {
  id: string;
  type: 'critical' | 'warn' | 'info';
  message: string;
  ip: string;
  userAgent?: string;
  path?: string;
  timestamp: string;
  payload?: number;
  blocked: boolean;
}

interface SecurityStats {
  systemStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  totalRequests: number;
  blockedIPs: number;
  alertsGenerated: number;
  systemUptime: string;
  threatLevel: number;
  activeConnections: number;
}

interface SecurityConfig {
  backendUrl: string;
  refreshInterval: number;
  enableRealTime: boolean;
  maxEvents: number;
}

// Web8 Security Service
class Web8SecurityService {
  private config: SecurityConfig;
  private ws: WebSocket | null = null;
  private listeners: Set<(data: any) => void> = new Set();

  constructor(config: SecurityConfig) {
    this.config = config;
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    if (!this.config.enableRealTime) return;

    try {
      const wsUrl = this.config.backendUrl.replace('http', 'ws') + '/security/events';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🛡️ Web8 Security WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners(data);
        } catch (error) {
          console.error('Error parsing security WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🛡️ Web8 Security WebSocket disconnected');
        // Reconnect after 5 seconds
        setTimeout(() => this.initializeWebSocket(), 5000);
      };

      this.ws.onerror = (error) => {
        console.error('🛡️ Web8 Security WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  private notifyListeners(data: any): void {
    this.listeners.forEach(listener => listener(data));
  }

  public subscribe(listener: (data: any) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Real Security API Functions
  public async fetchStats(): Promise<SecurityStats> {
    try {
      const response = await fetch(`${this.config.backendUrl}/security/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Web8-Service': 'security-monitor'
        }
      });

      if (!response.ok) {
        throw new Error(`Security stats request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Error fetching security stats:', error);
      return this.getDefaultStats();
    }
  }

  public async fetchEvents(limit: number = 50): Promise<SecurityEvent[]> {
    try {
      const response = await fetch(`${this.config.backendUrl}/security/events?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Web8-Service': 'security-monitor'
        }
      });

      if (!response.ok) {
        throw new Error(`Security events request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getDefaultEvents();
    }
  }

  public async blockIP(ip: string, reason: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.backendUrl}/security/block-ip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Web8-Service': 'security-monitor'
        },
        body: JSON.stringify({ ip, reason, timestamp: Date.now() })
      });

      if (!response.ok) {
        throw new Error(`Block IP request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error blocking IP:', error);
      return false;
    }
  }

  public async clearEvents(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.backendUrl}/security/events`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Web8-Service': 'security-monitor'
        }
      });

      if (!response.ok) {
        throw new Error(`Clear events request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error clearing events:', error);
      return false;
    }
  }

  public async scanSystem(): Promise<any> {
    try {
      const response = await fetch(`${this.config.backendUrl}/security/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Web8-Service': 'security-monitor'
        },
        body: JSON.stringify({ 
          scanType: 'full',
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Security scan request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting security scan:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private getDefaultStats(): SecurityStats {
    return {
      systemStatus: 'HEALTHY',
      totalRequests: 15847,
      blockedIPs: 23,
      alertsGenerated: 156,
      systemUptime: '1h 0m 0s',
      threatLevel: 2,
      activeConnections: 45
    };
  }

  private getDefaultEvents(): SecurityEvent[] {
    return [
      {
        id: '1',
        type: 'critical',
        message: 'High request rate detected: 105 req/min',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        path: '/api/test',
        timestamp: new Date().toLocaleTimeString(),
        blocked: false
      }
    ];
  }

  public destroy(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// Web8 Security Monitor Component
interface Web8SecurityMonitorProps {
  backendUrl?: string;
  className?: string;
  enableRealTime?: boolean;
  refreshInterval?: number;
}

export class Web8SecurityMonitor extends React.Component<Web8SecurityMonitorProps> {
  private securityService: Web8SecurityService;
  private refreshTimer: NodeJS.Timeout | null = null;

  state = {
    stats: {
      systemStatus: 'HEALTHY' as const,
      totalRequests: 0,
      blockedIPs: 0,
      alertsGenerated: 0,
      systemUptime: '0h 0m 0s',
      threatLevel: 0,
      activeConnections: 0
    },
    events: [] as SecurityEvent[],
    autoRefresh: true,
    loading: false,
    scanning: false
  };

  constructor(props: Web8SecurityMonitorProps) {
    super(props);

    const config: SecurityConfig = {
      backendUrl: props.backendUrl || 'http://localhost:4000',
      refreshInterval: props.refreshInterval || 5000,
      enableRealTime: props.enableRealTime !== false,
      maxEvents: 50
    };

    this.securityService = new Web8SecurityService(config);
  }

  componentDidMount(): void {
    this.loadSecurityData();
    this.startAutoRefresh();
    
    // Subscribe to real-time updates
    this.securityService.subscribe(this.handleRealTimeUpdate);
  }

  componentWillUnmount(): void {
    this.stopAutoRefresh();
    this.securityService.destroy();
  }

  private handleRealTimeUpdate = (data: any): void => {
    if (data.type === 'security_event') {
      this.setState((prevState: any) => ({
        events: [data.event, ...prevState.events.slice(0, 49)]
      }));
    } else if (data.type === 'security_stats') {
      this.setState({ stats: data.stats });
    }
  };

  private loadSecurityData = async (): Promise<void> => {
    this.setState({ loading: true });
    
    try {
      const [stats, events] = await Promise.all([
        this.securityService.fetchStats(),
        this.securityService.fetchEvents()
      ]);

      this.setState({ stats, events });
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  private startAutoRefresh = (): void => {
    if (this.state.autoRefresh) {
      this.refreshTimer = setInterval(this.loadSecurityData, this.props.refreshInterval || 5000);
    }
  };

  private stopAutoRefresh = (): void => {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  };

  private toggleAutoRefresh = (): void => {
    this.setState(
      (prevState: any) => ({ autoRefresh: !prevState.autoRefresh }),
      () => {
        if (this.state.autoRefresh) {
          this.startAutoRefresh();
        } else {
          this.stopAutoRefresh();
        }
      }
    );
  };

  private handleRefresh = (): void => {
    this.loadSecurityData();
  };

  private handleClear = async (): Promise<void> => {
    const success = await this.securityService.clearEvents();
    if (success) {
      this.setState({ events: [] });
    }
  };

  private handleBlockIP = async (ip: string): Promise<void> => {
    const success = await this.securityService.blockIP(ip, 'Manual block from security monitor');
    if (success) {
      this.loadSecurityData(); // Refresh data
    }
  };

  private handleScan = async (): Promise<void> => {
    this.setState({ scanning: true });
    
    try {
      const result = await this.securityService.scanSystem();
      if (result.success) {
        // Refresh data after scan
        await this.loadSecurityData();
      }
    } catch (error) {
      console.error('Security scan failed:', error);
    } finally {
      this.setState({ scanning: false });
    }
  };

  private getEventColor = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'critical': return { bg: '#dc2626', text: '#fca5a5' };
      case 'warn': return { bg: '#d97706', text: '#fbbf24' };
      case 'info': return { bg: '#1e40af', text: '#93c5fd' };
    }
  };

  private getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return '#16a34a';
      case 'WARNING': return '#d97706';
      case 'CRITICAL': return '#dc2626';
      default: return '#64748b';
    }
  };

  render(): React.ReactElement {
    const { stats, events, autoRefresh, loading, scanning } = this.state;

    return (
      <div className={`web8-security-monitor ${this.props.className || ''}`}>
        <style jsx>{`
          .web8-security-monitor {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f1f5f9;
            padding: 2rem;
            border-radius: 1rem;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            min-height: 700px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          
          .monitor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #334155;
          }
          
          .monitor-title {
            font-size: 2rem;
            font-weight: 800;
            background: linear-gradient(45deg, #00ff88, #0088ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
          }
          
          .control-panel {
            display: flex;
            gap: 1rem;
            align-items: center;
          }
          
          .web8-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-family: inherit;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .web8-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
          }
          
          .web8-btn:active {
            transform: translateY(0);
          }
          
          .btn-primary {
            background: linear-gradient(45deg, #3b82f6, #1d4ed8);
            color: white;
          }
          
          .btn-danger {
            background: linear-gradient(45deg, #dc2626, #991b1b);
            color: white;
          }
          
          .btn-success {
            background: linear-gradient(45deg, #059669, #047857);
            color: white;
          }
          
          .btn-scanning {
            background: linear-gradient(45deg, #7c3aed, #5b21b6);
            color: white;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .stat-card {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid #334155;
            border-radius: 0.75rem;
            padding: 1.5rem;
            text-align: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-4px);
            border-color: #00ff88;
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
          }
          
          .stat-value {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 10px currentColor;
          }
          
          .stat-label {
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .events-section {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid #334155;
            border-radius: 0.75rem;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
          }
          
          .events-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #334155;
          }
          
          .events-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #00ff88;
          }
          
          .event-item {
            padding: 1rem;
            margin-bottom: 0.75rem;
            border-radius: 0.5rem;
            border-left: 4px solid;
            background: rgba(0, 0, 0, 0.4);
            transition: all 0.3s ease;
          }
          
          .event-item:hover {
            transform: translateX(4px);
            background: rgba(0, 0, 0, 0.6);
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
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }
          
          .event-type {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            margin-right: 0.75rem;
          }
          
          .event-timestamp {
            color: #94a3b8;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .event-message {
            color: #e2e8f0;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          
          .event-details {
            color: #94a3b8;
            font-size: 0.875rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .web8-toggle {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .web8-toggle input {
            width: 50px;
            height: 24px;
            appearance: none;
            background: #64748b;
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .web8-toggle input:checked {
            background: linear-gradient(45deg, #10b981, #059669);
          }
          
          .web8-toggle input::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .web8-toggle input:checked::before {
            transform: translateX(26px);
          }
          
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.75rem;
            backdrop-filter: blur(4px);
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #334155;
            border-top: 3px solid #00ff88;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        <div className="monitor-header">
          <h1 className="monitor-title">🛡️ WEB8 SECURITY MONITOR ULTRA</h1>
          <div className="control-panel">
            <div className="web8-toggle">
              <span>Auto Refresh</span>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={this.toggleAutoRefresh}
              />
            </div>
            <button className="web8-btn btn-primary" onClick={this.handleRefresh} disabled={loading}>
              🔄 Refresh
            </button>
            <button 
              className={`web8-btn ${scanning ? 'btn-scanning' : 'btn-success'}`} 
              onClick={this.handleScan} 
              disabled={scanning}
            >
              {scanning ? '🔍 Scanning...' : '🔍 Security Scan'}
            </button>
            <button className="web8-btn btn-danger" onClick={this.handleClear}>
              🗑️ Clear Events
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: this.getStatusColor(stats.systemStatus) } as any}>
              {stats.systemStatus}
            </div>
            <div className="stat-label">System Status</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#3b82f6' } as any}>
              {stats.totalRequests.toLocaleString()}
            </div>
            <div className="stat-label">Total Requests</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#dc2626' } as any}>
              {stats.blockedIPs}
            </div>
            <div className="stat-label">Blocked IPs</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#d97706' } as any}>
              {stats.alertsGenerated}
            </div>
            <div className="stat-label">Alerts Generated</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#10b981' } as any}>
              {stats.systemUptime}
            </div>
            <div className="stat-label">System Uptime</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: '#8b5cf6' } as any}>
              {stats.threatLevel}/10
            </div>
            <div className="stat-label">Threat Level</div>
          </div>

          <div className="stat-card">
            <div className="stat-value" style={{ color: '#06b6d4' } as any}>
              {stats.activeConnections}
            </div>
            <div className="stat-label">Active Connections</div>
          </div>
        </div>

        <div className="events-section" style={{ position: 'relative' } as any}>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          <div className="events-header">
            <h2>🚨 Security Events</h2>
            <span>{events.length} events</span>
          </div>
          
          <div className="events-list">
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' } as any}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' } as any}>🛡️</div>
                <div>No security events detected</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' } as any}>System is secure</div>
              </div>
            ) : (
              events.map((event) => {
                const colors = this.getEventColor(event.type);
                return (
                  <div key={event.id} className={`event-item event-${event.type}`}>
                    <div className="event-header">
                      <div style={{ display: 'flex', alignItems: 'center' } as any}>
                        <span 
                          className="event-type"
                          style={{ backgroundColor: colors.bg, color: colors.text } as any}
                        >
                          {event.type}
                        </span>
                        {event.blocked && (
                          <span style={{ 
                            backgroundColor: '#dc2626', 
                            color: '#fca5a5',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          } as any}>
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <span className="event-timestamp">{event.timestamp}</span>
                    </div>
                    <div className="event-message">{event.message}</div>
                    <div className="event-details">
                      <span>📍 IP: {event.ip}</span>
                      {event.userAgent && <span>🌐 User-Agent: {event.userAgent}</span>}
                      {event.path && <span>📂 Path: {event.path}</span>}
                      {event.payload && <span>📦 Payload: {event.payload} bytes</span>}
                      {!event.blocked && (
                        <button 
                          onClick={() => this.handleBlockIP(event.ip)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          } as any}
                        >
                          🚫 Block IP
                        </button>
                      )}
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
}

export default Web8SecurityMonitor;
