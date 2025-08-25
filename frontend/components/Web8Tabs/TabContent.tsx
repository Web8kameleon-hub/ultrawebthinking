/**
 * Web8 Tab Content Component
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import React from 'react';

interface TabContentProps {
  activeTabId: string;
  agiMetrics: any;
  isConnected: boolean;
  analytics: any;
  activities: any[];
  ethics: any;
}

const TabContent: React.FC<TabContentProps> = ({ 
  activeTabId, 
  agiMetrics, 
  isConnected, 
  analytics, 
  activities, 
  ethics 
}) => {
  if (!isConnected) {
    return (
      <div className="web8-content-area">
        <div style={{ 
          padding: '60px 40px', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(99, 102, 241, 0.3)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <p style={{ 
            fontSize: '18px', 
            color: '#64748b' 
          }}>
            Connecting to AGI Systems...
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTabId) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ 
              fontSize: '28px', 
              color: '#3b82f6', 
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🧠 AGI Dashboard
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                padding: '20px', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ color: '#6366f1', marginBottom: '15px' }}>System Metrics</h3>
                <p><strong>Processing Speed:</strong> {agiMetrics.processingSpeed}</p>
                <p><strong>Memory Usage:</strong> {agiMetrics.memoryUsage}</p>
                <p><strong>CPU Load:</strong> {agiMetrics.cpuLoad}%</p>
                <p><strong>System Health:</strong> {agiMetrics.systemHealth}%</p>
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                padding: '20px', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ color: '#10b981', marginBottom: '15px' }}>Neural Analytics</h3>
                <p><strong>Neural Connections:</strong> {agiMetrics.neuralConnections.toLocaleString()}</p>
                <p><strong>Learning Rate:</strong> {agiMetrics.learningRate}</p>
                <p><strong>Active Nodes:</strong> {agiMetrics.activeNodes}</p>
                <p><strong>Ethical Compliance:</strong> {agiMetrics.ethicalCompliance}%</p>
              </div>
            </div>
          </div>
        );
      
      case 'agi-core':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ 
              fontSize: '28px', 
              color: '#3b82f6', 
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🤖 AGI Core Engine
            </h2>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)', 
              padding: '20px', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <p><strong>Security Level:</strong> {agiMetrics.securityLevel}</p>
              <p><strong>Latency:</strong> {agiMetrics.latency}ms</p>
              <p><strong>Throughput:</strong> {agiMetrics.throughput}</p>
              <div style={{ marginTop: '20px' }}>
                <h4>Recent Activities:</h4>
                {activities.slice(0, 5).map((activity, index) => (
                  <div key={index} style={{ 
                    padding: '10px', 
                    margin: '5px 0', 
                    background: '#f8fafc', 
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}>
                    {activity.action || activity.type || 'System Activity'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ 
            padding: '60px 40px', 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              fontSize: '32px', 
              color: '#3b82f6', 
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {activeTabId} Module
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#64748b', 
              marginBottom: '30px' 
            }}>
              AGI module content will be loaded here
            </p>
          </div>
        );
    }
  };

  return (
    <div className="web8-content-area">
      {renderContent()}
    </div>
  );
};

export default TabContent;
