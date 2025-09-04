'use client';

import React, { useState } from 'react';
import NavBreadcrumb from '../../components/NavBreadcrumb';

interface SystemControl {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  description: string;
  lastUpdate: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

const AdminPanel: React.FC = () => {
  const [controls, setControls] = useState<SystemControl[]>([
    {
      id: 'mesh-network',
      name: 'Mesh Network',
      status: 'active',
      description: 'Distributed network topology',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'ddos-shield',
      name: 'DDoS Shield',
      status: 'active',
      description: 'Advanced DDoS protection',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'agi-boost',
      name: 'AGI Boost',
      status: 'inactive',
      description: 'Artificial General Intelligence acceleration',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'quantum-engine',
      name: 'Quantum Engine',
      status: 'maintenance',
      description: 'Quantum computing integration',
      lastUpdate: new Date().toISOString()
    }
  ]);

  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'success',
      message: 'System initialization complete',
      source: 'CORE'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      level: 'info',
      message: 'Mesh network activated',
      source: 'MESH'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'warning',
      message: 'High CPU usage detected',
      source: 'MONITOR'
    }
  ]);

  const [selectedControl, setSelectedControl] = useState<string | null>(null);

  const toggleControl = async (controlId: string) => {
    setControls(prev => prev.map(control => {
      if (control.id === controlId) {
        const newStatus = control.status === 'active' ? 'inactive' : 'active';
        
        // Add log entry
        const newLog: SystemLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `${control.name} ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
          source: 'ADMIN'
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep only last 50 logs
        
        return {
          ...control,
          status: newStatus,
          lastUpdate: new Date().toISOString()
        };
      }
      return control;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'inactive': return 'INACTIVE';
      case 'maintenance': return 'MAINTENANCE';
      default: return 'UNKNOWN';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <NavBreadcrumb />
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
            ⚡ Admin Control Panel
          </h1>
          <p className="text-gray-400 text-lg mt-2">
            System Control & Administration • Ultra Authority Access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* System Controls */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              🎛️ System Controls
            </h2>
            
            <div className="space-y-4">
              {controls.map((control) => (
                <div 
                  key={control.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedControl === control.id 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedControl(control.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{control.name}</h3>
                      <p className="text-gray-400 text-sm">{control.description}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Last Update: {formatTime(control.lastUpdate)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(control.status)}`}>
                        {getStatusText(control.status)}
                      </div>
                      
                      {control.status !== 'maintenance' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleControl(control.id);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            control.status === 'active'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {control.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              📜 System Logs
            </h2>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {logs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs">
                          [{log.source}]
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-white text-sm mt-1">{log.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            ⚡ Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
              🔄 Restart System
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white font-medium hover:from-green-700 hover:to-teal-700 transition-colors">
              🧹 Clear Logs
            </button>
            
            <button className="p-4 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white font-medium hover:from-yellow-700 hover:to-orange-700 transition-colors">
              ⚙️ System Maintenance
            </button>
            
            <button className="p-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg text-white font-medium hover:from-red-700 hover:to-pink-700 transition-colors">
              🚨 Emergency Stop
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;
