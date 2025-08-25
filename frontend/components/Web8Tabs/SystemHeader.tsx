/**
 * Web8 System Header Component
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import React from 'react';
import { ConnectionStatus, PerformanceMetrics } from './types';

interface SystemHeaderProps {
  isConnected: boolean;
  error: string | null;
  currentTime: string;
  analytics: any;
  getSystemHealth: () => number;
}

const SystemHeader: React.FC<SystemHeaderProps> = ({
  isConnected,
  error,
  currentTime,
  analytics,
  getSystemHealth
}) => {
  const getConnectionStatusClass = () => {
    if (error) return 'web8-connection-status error';
    if (isConnected) return 'web8-connection-status connected';
    return 'web8-connection-status connecting';
  };

  const getHealthBadgeText = () => {
    const health = getSystemHealth();
    if (health >= 90) return `Health: ${health}% Optimal`;
    if (health >= 70) return `Warning: ${health}%`;
    return `Critical: ${health}%`;
  };

  const getConnectionText = () => {
    if (error) return 'Error';
    if (isConnected) return 'Connected';
    return 'Connecting...';
  };

  return (
    <div className="web8-header">
      <div className="web8-logo">
        Web8 Browser
      </div>
      
      <div className="web8-nav">
        <button className="web8-nav-btn">AGI Dashboard</button>
        <button className="web8-nav-btn secondary">Neural Search</button>
      </div>
      
      <div className="web8-status">
        <div className={getConnectionStatusClass()}>
          <div className="web8-connection-dot" />
          {getConnectionText()}
        </div>
        
        <div className="web8-time">
          {currentTime}
        </div>
        
        <div className="web8-health-badge">
          {getHealthBadgeText()}
        </div>
      </div>
    </div>
  );
};

export default SystemHeader;
