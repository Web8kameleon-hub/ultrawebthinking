/**
 * Web8 Quick Menu - Process Manager
 * Lazy loading dhe sleep mode për të gjitha modulet
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessStatus {
  id: string;
  name: string;
  category: string;
  status: 'sleeping' | 'loading' | 'active' | 'error';
  lastUsed: number;
  memoryUsage: number;
  cpuUsage: number;
  icon: string;
  description: string;
}

interface QuickMenuProps {
  onProcessActivate?: (processId: string) => void;
  onProcessSleep?: (processId: string) => void;
}

export default function QuickMenu({ onProcessActivate, onProcessSleep }: QuickMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [processes, setProcesses] = useState<ProcessStatus[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize all Web8 processes
  useEffect(() => {
    const initialProcesses: ProcessStatus[] = [
      // Core Systems
      { id: 'neural-ai', name: 'Neural AI Engine', category: 'core', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🧠', description: 'Advanced AI processing' },
      { id: 'web-search', name: 'Ultra Web Search', category: 'core', status: 'active', lastUsed: Date.now(), memoryUsage: 45, cpuUsage: 12, icon: '🔍', description: 'Hybrid search engine' },
      { id: 'security-guardian', name: 'Guardian Security', category: 'core', status: 'active', lastUsed: Date.now() - 1000, memoryUsage: 32, cpuUsage: 8, icon: '🛡️', description: '4-layer protection' },
      
      // AI Modules
      { id: 'openmind-ai', name: 'OpenMind AI', category: 'ai', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🤖', description: 'Conversational AI' },
      { id: 'neural-planner', name: 'Neural Planner', category: 'ai', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🎯', description: 'Task planning AI' },
      { id: 'ethical-ai', name: 'Ethical Controller', category: 'ai', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '⚖️', description: 'AI ethics monitoring' },
      
      // Tools & Utilities
      { id: 'page-duplicator', name: 'Smart Duplicator', category: 'tools', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🔄', description: 'Page cloning tool' },
      { id: 'websocket-server', name: 'WebSocket Server', category: 'tools', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🔌', description: 'Real-time communication' },
      { id: 'load-tester', name: 'Performance Tester', category: 'tools', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '⚡', description: 'Load testing suite' },
      
      // Database & Storage
      { id: 'data-engine', name: 'Data Engine', category: 'data', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🗄️', description: 'Database management' },
      { id: 'cache-manager', name: 'Cache Manager', category: 'data', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '💾', description: 'Intelligent caching' },
      { id: 'backup-system', name: 'Backup System', category: 'data', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '💿', description: 'Automated backups' },
      
      // Analytics & Monitoring
      { id: 'analytics-engine', name: 'Analytics Engine', category: 'analytics', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '📊', description: 'Usage analytics' },
      { id: 'performance-monitor', name: 'Performance Monitor', category: 'analytics', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '📈', description: 'System monitoring' },
      { id: 'error-tracker', name: 'Error Tracker', category: 'analytics', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🚨', description: 'Error logging' },
      
      // Security
      { id: 'intrusion-detector', name: 'Intrusion Detector', category: 'security', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🔒', description: 'Threat detection' },
      { id: 'firewall-manager', name: 'Firewall Manager', category: 'security', status: 'sleeping', lastUsed: 0, memoryUsage: 0, cpuUsage: 0, icon: '🚧', description: 'Network protection' },
      { id: 'safekey-system', name: 'SafeKey Emergency', category: 'security', status: 'active', lastUsed: Date.now() - 500, memoryUsage: 12, cpuUsage: 2, icon: '🔑', description: 'Emergency protocols' },
    ];
    
    setProcesses(initialProcesses);
  }, []);

  // Auto sleep inactive processes
  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(process => {
        const timeSinceLastUsed = Date.now() - process.lastUsed;
        const shouldSleep = timeSinceLastUsed > 30000 && process.status === 'active' && process.id !== 'security-guardian' && process.id !== 'safekey-system';
        
        if (shouldSleep) {
          console.log(`💤 ${process.name} going to sleep mode`);
          if (onProcessSleep) onProcessSleep(process.id);
          return { ...process, status: 'sleeping', memoryUsage: 0, cpuUsage: 0 };
        }
        return process;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [onProcessSleep]);

  const activateProcess = useCallback(async (processId: string) => {
    console.log(`🚀 Activating ${processId}...`);
    
    setProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, status: 'loading' }
        : p
    ));

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    setProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { 
            ...p, 
            status: 'active', 
            lastUsed: Date.now(),
            memoryUsage: Math.floor(Math.random() * 60) + 20,
            cpuUsage: Math.floor(Math.random() * 25) + 5
          }
        : p
    ));

    if (onProcessActivate) onProcessActivate(processId);
  }, [onProcessActivate]);

  const sleepProcess = useCallback((processId: string) => {
    const process = processes.find(p => p.id === processId);
    if (process?.id === 'security-guardian' || process?.id === 'safekey-system') {
      alert('⚠️ Cannot sleep critical security processes!');
      return;
    }

    console.log(`💤 Putting ${processId} to sleep...`);
    
    setProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, status: 'sleeping', memoryUsage: 0, cpuUsage: 0 }
        : p
    ));

    if (onProcessSleep) onProcessSleep(processId);
  }, [processes, onProcessSleep]);

  const categories = ['all', 'core', 'ai', 'tools', 'data', 'analytics', 'security'];
  
  const filteredProcesses = processes.filter(process => {
    const matchesCategory = selectedCategory === 'all' || process.category === selectedCategory;
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'loading': return '#f59e0b';
      case 'sleeping': return '#6b7280';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'loading': return '🟡';
      case 'sleeping': return '😴';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  const totalMemory = processes.reduce((sum, p) => sum + p.memoryUsage, 0);
  const totalCpu = processes.reduce((sum, p) => sum + p.cpuUsage, 0);
  const activeProcesses = processes.filter(p => p.status === 'active').length;

  return (
    <>
      {/* Quick Menu Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? '❌' : '⚡'}
      </motion.button>

      {/* Quick Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            style={{
              position: 'fixed',
              top: '0',
              right: '0',
              width: '450px',
              height: '100vh',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: 'white',
              zIndex: 999,
              padding: '20px',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                ⚡ Web8 Quick Menu
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '10px',
                fontSize: '12px',
                background: 'rgba(255,255,255,0.1)',
                padding: '10px',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Active: {activeProcesses}</div>
                  <div style={{ opacity: 0.8 }}>Processes</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{totalMemory}MB</div>
                  <div style={{ opacity: 0.8 }}>Memory</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{totalCpu}%</div>
                  <div style={{ opacity: 0.8 }}>CPU</div>
                </div>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Kërko proces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none'
              }}
            />

            {/* Category Filter */}
            <div style={{ 
              display: 'flex', 
              gap: '5px', 
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '5px 12px',
                    border: 'none',
                    borderRadius: '15px',
                    background: selectedCategory === category 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Process List */}
            <div style={{ display: 'grid', gap: '10px' }}>
              {filteredProcesses.map(process => (
                <motion.div
                  key={process.id}
                  layout
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: `1px solid ${getStatusColor(process.status)}33`,
                    cursor: 'pointer'
                  }}
                  whileHover={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{process.icon}</span>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                          {process.name}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>
                          {process.description}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px' }}>
                        {getStatusIcon(process.status)}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.8 }}>
                        {process.status}
                      </div>
                    </div>
                  </div>

                  {process.status === 'active' && (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '10px',
                      fontSize: '11px',
                      marginBottom: '8px'
                    }}>
                      <div>RAM: {process.memoryUsage}MB</div>
                      <div>CPU: {process.cpuUsage}%</div>
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: '8px'
                  }}>
                    {process.status === 'sleeping' && (
                      <button
                        onClick={() => activateProcess(process.id)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '15px',
                          background: '#10b981',
                          color: 'white',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        🚀 Aktivizo
                      </button>
                    )}
                    
                    {process.status === 'active' && process.id !== 'security-guardian' && process.id !== 'safekey-system' && (
                      <button
                        onClick={() => sleepProcess(process.id)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '15px',
                          background: '#6b7280',
                          color: 'white',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        💤 Sleep
                      </button>
                    )}
                    
                    {process.status === 'loading' && (
                      <div style={{
                        padding: '6px 12px',
                        background: '#f59e0b',
                        borderRadius: '15px',
                        fontSize: '11px'
                      }}>
                        ⏳ Duke ngarkuar...
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ 
              marginTop: '20px', 
              textAlign: 'center',
              fontSize: '12px',
              opacity: 0.7
            }}>
              Web8 Process Manager v8.0.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
