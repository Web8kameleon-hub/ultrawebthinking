'use client';

import React, { useState, useEffect } from 'react';

interface TabData {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  color: string;
}

const Web8TabSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('sq-AL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('sq-AL', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    };
  };

  const SearchMachine = () => {
    const [searchCount, setSearchCount] = useState(247);
    const [responseTime, setResponseTime] = useState(1.2);
    const [accuracy, setAccuracy] = useState(99.7);

    useEffect(() => {
      const interval = setInterval(() => {
        setSearchCount(prev => prev + Math.floor(Math.random() * 3));
        setResponseTime(prev => Number((prev + (Math.random() - 0.5) * 0.2).toFixed(1)));
        setAccuracy(prev => Number(Math.min(99.9, prev + (Math.random() - 0.5) * 0.1).toFixed(1)));
      }, 8000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">🔍 Web8 Search Machine</h2>
            <p className="royal-subtitle">AGI-powered universal search engine</p>
          </div>
        </div>
        
        <div className="search-interface">
          <input 
            type="text" 
            placeholder="Search anything across the web and beyond..."
            className="royal-input"
          />
          <button className="royal-button primary">⚡ Search</button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Active Queries</span>
            <span className="stat-value">{searchCount.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Response Time</span>
            <span className="stat-value">{responseTime}ms</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Accuracy Rate</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>
      </div>
    );
  };

  const DateTimePanel = () => {
    const { date, time } = formatDateTime(currentDateTime);
    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">📅 Data & Koha</h2>
            <p className="royal-subtitle">Real-time system information</p>
          </div>
        </div>
        
        <div className="datetime-display">
          <div className="datetime-section">
            <span className="datetime-label">Data:</span>
            <span className="datetime-value">{date}</span>
          </div>
          <div className="datetime-section">
            <span className="datetime-label">Ora:</span>
            <span className="datetime-value">{time}</span>
          </div>
        </div>
        
        <div className="system-grid">
          <div className="system-card">
            <span className="system-label">Uptime</span>
            <span className="system-value">247h 32m</span>
          </div>
          <div className="system-card">
            <span className="system-label">CPU Usage</span>
            <span className="system-value">12.4%</span>
          </div>
          <div className="system-card">
            <span className="system-label">Memory</span>
            <span className="system-value">8.7GB / 32GB</span>
          </div>
        </div>
      </div>
    );
  };

  const AGIStatus = () => {
    const [processingSpeed, setProcessingSpeed] = useState(1247);
    const [neuralLayers, setNeuralLayers] = useState(247);
    const [worldConnections, setWorldConnections] = useState(1847);
    const [memoryUsage, setMemoryUsage] = useState(89.7);

    useEffect(() => {
      const interval = setInterval(() => {
        setProcessingSpeed(prev => prev + Math.floor(Math.random() * 10 - 5));
        setNeuralLayers(prev => Math.max(200, prev + Math.floor(Math.random() * 6 - 3)));
        setWorldConnections(prev => prev + Math.floor(Math.random() * 20 - 10));
        setMemoryUsage(prev => Number(Math.max(85, Math.min(95, prev + (Math.random() - 0.5) * 2)).toFixed(1)));
      }, 6000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">🧠 AGI Status</h2>
          </div>
          <div className="status-indicator active">🟢 ACTIVE</div>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-icon">⚡</span>
            <div className="metric-info">
              <span className="metric-label">Processing Speed</span>
              <span className="metric-value">{processingSpeed.toLocaleString()} THz</span>
            </div>
          </div>
          
          <div className="metric-card">
            <span className="metric-icon">🧠</span>
            <div className="metric-info">
              <span className="metric-label">Neural Networks</span>
              <span className="metric-value">{neuralLayers} layers</span>
            </div>
          </div>
          
          <div className="metric-card">
            <span className="metric-icon">🔗</span>
            <div className="metric-info">
              <span className="metric-label">World Connections</span>
              <span className="metric-value">{worldConnections.toLocaleString()} active</span>
            </div>
          </div>
          
          <div className="metric-card">
            <span className="metric-icon">💾</span>
            <div className="metric-info">
              <span className="metric-label">Memory Usage</span>
              <span className="metric-value">{memoryUsage}% optimal</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AIAnalysisEngine = () => (
    <div className="royal-container">
      <div className="royal-header">
        <div>
          <h2 className="royal-title">🔬 AI Analysis Engine</h2>
        </div>
        <div className="status-indicator processing">🔄 Processing</div>
      </div>
      
      <div className="analysis-grid">
        <div className="analysis-card">
          <h3 className="analysis-title">📊 Data Analysis</h3>
          <div className="analysis-metrics">
            <span>Active Queries: 156</span>
            <span>Accuracy: 98.7%</span>
            <span>Response Time: 2.3ms</span>
          </div>
        </div>
        
        <div className="analysis-card">
          <h3 className="analysis-title">💡 Insight Generation</h3>
          <div className="analysis-metrics">
            <span>Generated Today: 2,847</span>
            <span>Success Rate: 94.2%</span>
            <span>Average Confidence: 97.1%</span>
          </div>
        </div>
        
        <div className="analysis-card">
          <h3 className="analysis-title">🎯 Pattern Recognition</h3>
          <div className="analysis-metrics">
            <span>Patterns Found: 623</span>
            <span>Anomalies: 12</span>
            <span>Predictions: 89.4% accurate</span>
          </div>
        </div>
      </div>
    </div>
  );

  const WorldSurfingEngine = () => {
    const [activeSessions, setActiveSessions] = useState(67);
    const [sitesAnalyzed, setSitesAnalyzed] = useState(12456);
    const [deepScans, setDeepScans] = useState(347);
    const [dataStreams, setDataStreams] = useState(98);

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveSessions(prev => Math.max(50, prev + Math.floor(Math.random() * 6 - 3)));
        setSitesAnalyzed(prev => prev + Math.floor(Math.random() * 20));
        setDeepScans(prev => prev + Math.floor(Math.random() * 4));
        setDataStreams(prev => Math.max(80, prev + Math.floor(Math.random() * 10 - 5)));
      }, 7000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">🌊 World Surfing Engine</h2>
          </div>
          <div className="status-indicator active">🌐 Surfing Active</div>
        </div>
        
        <div className="surfing-stats">
          <div className="surfing-card">
            <span className="surfing-icon">🌐</span>
            <div className="surfing-info">
              <span className="surfing-label">Active Sessions</span>
              <span className="surfing-value">{activeSessions}</span>
            </div>
          </div>
          
          <div className="surfing-card">
            <span className="surfing-icon">📡</span>
            <div className="surfing-info">
              <span className="surfing-label">Sites Analyzed</span>
              <span className="surfing-value">{sitesAnalyzed.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="surfing-card">
            <span className="surfing-icon">🎯</span>
            <div className="surfing-info">
              <span className="surfing-label">Deep Scans</span>
              <span className="surfing-value">{deepScans}</span>
            </div>
          </div>
          
          <div className="surfing-card">
            <span className="surfing-icon">📈</span>
            <div className="surfing-info">
              <span className="surfing-label">Data Streams</span>
              <span className="surfing-value">{dataStreams} active</span>
            </div>
          </div>
        </div>
        
        <div className="activity-section">
          <h3 className="activity-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">🔍 Scanning news.bbc.com - 2 sec ago</div>
            <div className="activity-item">📊 Analyzed reddit.com/r/technology - 5 sec ago</div>
            <div className="activity-item">🌐 Deep scan on github.com/trending - 8 sec ago</div>
            <div className="activity-item">📡 Connected to api.openai.com - 12 sec ago</div>
          </div>
        </div>
      </div>
    );
  };

  const MeshNetwork = () => {
    const [meshNodes, setMeshNodes] = useState(2847);
    const [activePeers, setActivePeers] = useState(156);
    const [dataSync, setDataSync] = useState(94.7);
    const [networkLatency, setNetworkLatency] = useState(12.3);

    useEffect(() => {
      const interval = setInterval(() => {
        setMeshNodes(prev => prev + Math.floor(Math.random() * 10 - 5));
        setActivePeers(prev => Math.max(100, prev + Math.floor(Math.random() * 8 - 4)));
        setDataSync(prev => Number(Math.max(85, Math.min(99.9, prev + (Math.random() - 0.5) * 3)).toFixed(1)));
        setNetworkLatency(prev => Number(Math.max(8, Math.min(25, prev + (Math.random() - 0.5) * 2)).toFixed(1)));
      }, 8000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">🕸️ Mesh Network</h2>
          </div>
          <div className="status-indicator active">🟢 MESH ACTIVE</div>
        </div>
        
        <div className="mesh-stats">
          <div className="mesh-card">
            <span className="mesh-icon">🕸️</span>
            <div className="mesh-info">
              <span className="mesh-label">Mesh Nodes</span>
              <span className="mesh-value">{meshNodes.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mesh-card">
            <span className="mesh-icon">👥</span>
            <div className="mesh-info">
              <span className="mesh-label">Active Peers</span>
              <span className="mesh-value">{activePeers}</span>
            </div>
          </div>
          
          <div className="mesh-card">
            <span className="mesh-icon">🔄</span>
            <div className="mesh-info">
              <span className="mesh-label">Data Sync</span>
              <span className="mesh-value">{dataSync}%</span>
            </div>
          </div>
          
          <div className="mesh-card">
            <span className="mesh-icon">⚡</span>
            <div className="mesh-info">
              <span className="mesh-label">Network Latency</span>
              <span className="mesh-value">{networkLatency}ms</span>
            </div>
          </div>
        </div>
        
        <div className="topology-section">
          <h3 className="topology-title">🗺️ Network Topology</h3>
          <div className="topology-grid">
            <div className="topology-node primary">Core Hub</div>
            <div className="topology-node">Peer A</div>
            <div className="topology-node">Peer B</div>
            <div className="topology-node">Peer C</div>
          </div>
        </div>
      </div>
    );
  };

  const LoRAAdaptation = () => {
    const [loraModels, setLoraModels] = useState(47);
    const [adaptationRate, setAdaptationRate] = useState(97.3);
    const [fineTuning, setFineTuning] = useState(89.1);
    const [memoryEfficiency, setMemoryEfficiency] = useState(94.8);

    useEffect(() => {
      const interval = setInterval(() => {
        setLoraModels(prev => Math.max(30, prev + Math.floor(Math.random() * 6 - 3)));
        setAdaptationRate(prev => Number(Math.max(90, Math.min(99.9, prev + (Math.random() - 0.5) * 2)).toFixed(1)));
        setFineTuning(prev => Number(Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 3)).toFixed(1)));
        setMemoryEfficiency(prev => Number(Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 2)).toFixed(1)));
      }, 9000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">🔬 LoRA Adaptation</h2>
          </div>
          <div className="status-indicator adapting">🧬 ADAPTING</div>
        </div>
        
        <div className="lora-stats">
          <div className="lora-card">
            <span className="lora-icon">🧬</span>
            <div className="lora-info">
              <span className="lora-label">LoRA Models</span>
              <span className="lora-value">{loraModels}</span>
            </div>
          </div>
          
          <div className="lora-card">
            <span className="lora-icon">🎯</span>
            <div className="lora-info">
              <span className="lora-label">Adaptation Rate</span>
              <span className="lora-value">{adaptationRate}%</span>
            </div>
          </div>
          
          <div className="lora-card">
            <span className="lora-icon">⚙️</span>
            <div className="lora-info">
              <span className="lora-label">Fine-Tuning</span>
              <span className="lora-value">{fineTuning}%</span>
            </div>
          </div>
          
          <div className="lora-card">
            <span className="lora-icon">💾</span>
            <div className="lora-info">
              <span className="lora-label">Memory Efficiency</span>
              <span className="lora-value">{memoryEfficiency}%</span>
            </div>
          </div>
        </div>
        
        <div className="models-section">
          <h3 className="models-title">🔬 Active LoRA Models</h3>
          <div className="models-grid">
            <div className="model-item">
              <span className="model-icon">🎨</span>
              <span className="model-name">Creative-LoRA-v2.1</span>
              <span className="model-status active">Active</span>
            </div>
            <div className="model-item">
              <span className="model-icon">📊</span>
              <span className="model-name">Analytics-LoRA-v3.0</span>
              <span className="model-status training">Training</span>
            </div>
            <div className="model-item">
              <span className="model-icon">🧠</span>
              <span className="model-name">Cognitive-LoRA-v1.8</span>
              <span className="model-status active">Active</span>
            </div>
            <div className="model-item">
              <span className="model-icon">🌐</span>
              <span className="model-name">Web-LoRA-v2.5</span>
              <span className="model-status optimizing">Optimizing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GISheet = () => {
    const [totalSheets, setTotalSheets] = useState(24847);
    const [activeUsers, setActiveUsers] = useState(15672);
    const [processingCells, setProcessingCells] = useState(8947563);
    const [memoryUsage, setMemoryUsage] = useState(847.3);
    const [selectedWorkspace, setSelectedWorkspace] = useState('corporate');

    useEffect(() => {
      const interval = setInterval(() => {
        setTotalSheets(prev => prev + Math.floor(Math.random() * 15));
        setActiveUsers(prev => prev + Math.floor(Math.random() * 50 - 25));
        setProcessingCells(prev => prev + Math.floor(Math.random() * 1000));
        setMemoryUsage(prev => Number((prev + (Math.random() - 0.5) * 50).toFixed(1)));
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const workspaces = [
      { id: 'personal', name: 'Personal Use', icon: '👤', users: '2.3M', sheets: '12.8K' },
      { id: 'corporate', name: 'Corporations', icon: '🏢', users: '847K', sheets: '156.7K' },
      { id: 'government', name: 'Government', icon: '🏛️', users: '98.4K', sheets: '45.2K' },
      { id: 'banking', name: 'Banking & Finance', icon: '🏦', users: '234.7K', sheets: '89.3K' },
      { id: 'military', name: 'Military & Defense', icon: '🛡️', users: '67.8K', sheets: '23.9K' },
      { id: 'education', name: 'Education', icon: '🎓', users: '1.2M', sheets: '78.4K' },
      { id: 'healthcare', name: 'Healthcare', icon: '🏥', users: '456.9K', sheets: '67.1K' },
      { id: 'research', name: 'R&D Labs', icon: '🔬', users: '123.5K', sheets: '34.8K' }
    ];

    const recentActivities = [
      { time: formatDateTime(new Date()).time, user: 'NATO Command', action: 'Created strategic analysis sheet', type: 'military', priority: 'high' },
      { time: '18:41:58', user: 'Goldman Sachs', action: 'Updated risk assessment models', type: 'banking', priority: 'critical' },
      { time: '18:41:23', user: 'MIT Research', action: 'Published quantum computing data', type: 'research', priority: 'medium' },
      { time: '18:40:56', user: 'US Treasury', action: 'Modified economic projections', type: 'government', priority: 'high' },
      { time: '18:40:23', user: 'Apple Inc', action: 'Analyzed supply chain metrics', type: 'corporate', priority: 'medium' },
      { time: '18:39:47', user: 'Johns Hopkins', action: 'Updated medical research data', type: 'healthcare', priority: 'high' }
    ];

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">📋 AGISheet Enterprise</h2>
          </div>
          <div className="gisheet-controls">
            <button className="royal-button primary">+ New Workspace</button>
            <button className="royal-button secondary">🔄 Auto-Integrate</button>
          </div>
        </div>

        <div className="gisheet-stats">
          <div className="gisheet-stat-card">
            <span className="gisheet-icon">📊</span>
            <div className="gisheet-info">
              <span className="gisheet-label">Total Sheets</span>
              <span className="gisheet-value">{totalSheets.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="gisheet-stat-card">
            <span className="gisheet-icon">👥</span>
            <div className="gisheet-info">
              <span className="gisheet-label">Active Users</span>
              <span className="gisheet-value">{activeUsers.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="gisheet-stat-card">
            <span className="gisheet-icon">⚡</span>
            <div className="gisheet-info">
              <span className="gisheet-label">Processing Cells</span>
              <span className="gisheet-value">{processingCells.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="gisheet-stat-card">
            <span className="gisheet-icon">💾</span>
            <div className="gisheet-info">
              <span className="gisheet-label">Memory (GB)</span>
              <span className="gisheet-value">{memoryUsage}</span>
            </div>
          </div>
        </div>

        <div className="workspace-section">
          <h3 className="workspace-title">🌍 Global Workspaces</h3>
          <div className="workspace-grid">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`workspace-card ${selectedWorkspace === workspace.id ? 'active' : ''}`}
                onClick={() => setSelectedWorkspace(workspace.id)}
              >
                <span className="workspace-icon">{workspace.icon}</span>
                <div className="workspace-info">
                  <span className="workspace-name">{workspace.name}</span>
                  <div className="workspace-stats">
                    <span>👥 {workspace.users}</span>
                    <span>📊 {workspace.sheets}</span>
                  </div>
                </div>
                {selectedWorkspace === workspace.id && (
                  <div className="workspace-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="activity-feed">
          <div className="feed-header">
            <h3 className="feed-title">📡 Global Activity Feed</h3>
            <div className="status-indicator live">🔴 LIVE</div>
          </div>
          
          <div className="feed-content">
            {recentActivities.map((activity, index) => (
              <div key={index} className={`feed-item priority-${activity.priority}`}>
                <span className="feed-time">{activity.time}</span>
                <span className={`feed-indicator ${activity.type}`}>
                  {activity.type === 'military' ? '🛡️' :
                   activity.type === 'banking' ? '🏦' :
                   activity.type === 'government' ? '🏛️' :
                   activity.type === 'corporate' ? '🏢' :
                   activity.type === 'research' ? '🔬' :
                   activity.type === 'healthcare' ? '🏥' : '●'}
                </span>
                <div className="feed-details">
                  <span className="feed-user">{activity.user}</span>
                  <span className="feed-action">{activity.action}</span>
                </div>
                <span className={`priority-badge ${activity.priority}`}>
                  {activity.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="integration-section">
          <h3 className="integration-title">🔄 Auto-Integration Status</h3>
          <div className="integration-grid">
            <div className="integration-item connected">
              <span className="integration-icon">☁️</span>
              <span className="integration-name">Cloud Systems</span>
              <span className="integration-status connected">Connected</span>
            </div>
            <div className="integration-item connected">
              <span className="integration-icon">🗄️</span>
              <span className="integration-name">Databases</span>
              <span className="integration-status connected">Synced</span>
            </div>
            <div className="integration-item connected">
              <span className="integration-icon">🌐</span>
              <span className="integration-name">Web APIs</span>
              <span className="integration-status connected">Integrated</span>
            </div>
            <div className="integration-item processing">
              <span className="integration-icon">🔒</span>
              <span className="integration-name">Security Layers</span>
              <span className="integration-status processing">Processing</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AGILiveActivityFeed = () => {
    const [activities] = useState([
      { id: 1, time: formatDateTime(currentDateTime).time, type: 'live', text: 'Neural pattern recognized in Web8 data stream' },
      { id: 2, time: '18:41:58', type: 'active', text: 'Quantum processor optimized search algorithm' },
      { id: 3, time: '18:41:23', type: 'warning', text: 'AGI generated 23 new insights from user behavior' },
      { id: 4, time: '18:40:56', type: 'success', text: 'Deep learning model updated with new parameters' },
      { id: 5, time: '18:40:23', type: 'info', text: 'New cognitive pattern discovered in user interactions' },
      { id: 6, time: '18:39:47', type: 'active', text: 'World Surfing Engine completed 50 site analyses' }
    ]);

    return (
      <div className="royal-container">
        <div className="royal-header">
          <div>
            <h2 className="royal-title">📡 AGI Live Activity Feed</h2>
          </div>
          <div className="status-indicator live">🔴 LIVE</div>
        </div>
        
        <div className="live-feed-content">
          {activities.map((activity) => (
            <div key={activity.id} className={`live-activity-item ${activity.type}`}>
              <span className="live-time">{activity.time}</span>
              <span className={`live-indicator ${activity.type}`}>●</span>
              <span className="live-text">{activity.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabs: TabData[] = [
    {
      id: 'search',
      title: 'Search Machine',
      icon: '🔍',
      component: <SearchMachine />,
      color: '#d4af37'
    },
    {
      id: 'datetime',
      title: 'Data/Dita/Ora',
      icon: '📅',
      component: <DateTimePanel />,
      color: '#d4af37'
    },
    {
      id: 'agi-status',
      title: 'AGI Status',
      icon: '🧠',
      component: <AGIStatus />,
      color: '#d4af37'
    },
    {
      id: 'analysis',
      title: 'AI Analysis Engine',
      icon: '🔬',
      component: <AIAnalysisEngine />,
      color: '#d4af37'
    },
    {
      id: 'surfing',
      title: 'World Surfing Engine',
      icon: '🌊',
      component: <WorldSurfingEngine />,
      color: '#d4af37'
    },
    {
      id: 'mesh',
      title: 'Mesh Network',
      icon: '🕸️',
      component: <MeshNetwork />,
      color: '#d4af37'
    },
    {
      id: 'lora',
      title: 'LoRA Adaptation',
      icon: '🔬',
      component: <LoRAAdaptation />,
      color: '#d4af37'
    },
    {
      id: 'gisheet',
      title: 'GISheet',
      icon: '📋',
      component: <GISheet />,
      color: '#d4af37'
    },
    {
      id: 'live-feed',
      title: 'AGI LIVE ACTIVITY FEED',
      icon: '📡',
      component: <AGILiveActivityFeed />,
      color: '#d4af37'
    }
  ];

  return (
    <div className="royal-system">
      {/* Tab Navigation */}
      <nav className="royal-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`royal-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-title">{tab.title}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main className="royal-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>

      <style jsx>{`
        .royal-system {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1d29 0%, #2d2a45 30%, #1e2a4a 70%, #243447 100%);
          color: #f8fafc;
          font-family: 'Playfair Display', 'Times New Roman', serif;
          letter-spacing: 0.4px;
        }

        .royal-navigation {
          display: flex;
          padding: 25px 35px;
          background: linear-gradient(135deg, rgba(26, 29, 41, 0.95), rgba(45, 42, 69, 0.9));
          backdrop-filter: blur(20px);
          border-bottom: 3px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          overflow-x: auto;
          gap: 20px;
        }

        .royal-tab {
          padding: 16px 30px;
          border: 2px solid rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, rgba(30, 35, 50, 0.9), rgba(45, 42, 69, 0.8));
          color: #f1f5f9;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-size: 15px;
          font-weight: 600;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 160px;
          justify-content: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .royal-tab:hover {
          background: linear-gradient(135deg, rgba(60, 70, 90, 0.95), rgba(80, 75, 100, 0.85));
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 12px 32px rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .royal-tab.active {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 152, 45, 0.15));
          border-color: rgba(212, 175, 55, 0.8);
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.25);
          color: #fbbf24;
          font-weight: 700;
        }

        .tab-icon {
          font-size: 18px;
        }

        .tab-title {
          font-size: 14px;
        }

        .royal-content {
          padding: 40px 50px;
          min-height: calc(100vh - 120px);
        }

        .royal-container {
          background: linear-gradient(135deg, rgba(30, 35, 50, 0.8), rgba(45, 42, 69, 0.7));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 35px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(15px);
        }

        .royal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .royal-title {
          font-size: 28px;
          font-weight: 700;
          color: #fbbf24;
          margin: 0;
          text-shadow: 0 3px 6px rgba(0, 0, 0, 0.6);
          font-family: 'Playfair Display', serif;
        }

        .royal-subtitle {
          font-size: 16px;
          color: #cbd5e1;
          margin: 8px 0 0 0;
          font-style: italic;
        }

        .status-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .status-indicator.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .status-indicator.processing {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .status-indicator.adapting {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
        }

        .status-indicator.live {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .search-interface {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
          align-items: center;
        }

        .royal-input {
          flex: 1;
          padding: 16px 20px;
          border: 2px solid rgba(212, 175, 55, 0.4);
          background: rgba(30, 35, 50, 0.8);
          color: #f1f5f9;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'Playfair Display', serif;
          transition: all 0.3s ease;
        }

        .royal-input:focus {
          outline: none;
          border-color: rgba(212, 175, 55, 0.8);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .royal-button {
          padding: 16px 28px;
          border: 2px solid rgba(212, 175, 55, 0.4);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Playfair Display', serif;
        }

        .royal-button.primary {
          background: linear-gradient(135deg, #d4af37, #b8982d);
          color: #1a1d29;
        }

        .royal-button.secondary {
          background: transparent;
          color: #d4af37;
        }

        .royal-button:hover {
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
          transform: translateY(-1px);
        }

        .stats-grid,
        .metrics-grid,
        .surfing-stats,
        .mesh-stats,
        .lora-stats,
        .gisheet-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card,
        .metric-card,
        .surfing-card,
        .mesh-card,
        .lora-card,
        .gisheet-stat-card {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .stat-card:hover,
        .metric-card:hover,
        .surfing-card:hover,
        .mesh-card:hover,
        .lora-card:hover,
        .gisheet-stat-card:hover {
          background: linear-gradient(135deg, rgba(60, 70, 90, 0.9), rgba(80, 90, 110, 0.7));
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 12px 32px rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }

        .stat-label,
        .metric-label,
        .surfing-label,
        .mesh-label,
        .lora-label,
        .gisheet-label {
          display: block;
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value,
        .metric-value,
        .surfing-value,
        .mesh-value,
        .lora-value,
        .gisheet-value {
          font-size: 24px;
          font-weight: 700;
          color: #fbbf24;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .metric-card,
        .surfing-card,
        .mesh-card,
        .lora-card,
        .gisheet-stat-card {
          display: flex;
          align-items: center;
          text-align: left;
          gap: 16px;
        }

        .metric-icon,
        .surfing-icon,
        .mesh-icon,
        .lora-icon,
        .gisheet-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .metric-info,
        .surfing-info,
        .mesh-info,
        .lora-info,
        .gisheet-info {
          flex: 1;
        }

        .datetime-display {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 25px;
          text-align: center;
        }

        .datetime-section {
          margin-bottom: 15px;
        }

        .datetime-label {
          font-size: 14px;
          color: #94a3b8;
          font-weight: 600;
          margin-right: 12px;
        }

        .datetime-value {
          font-size: 20px;
          font-weight: 700;
          color: #fbbf24;
        }

        .system-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .system-card {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.6), rgba(60, 70, 90, 0.4));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .system-label {
          display: block;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .system-value {
          font-size: 16px;
          font-weight: 700;
          color: #fbbf24;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 25px;
        }

        .analysis-card {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .analysis-card:hover {
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }

        .analysis-title {
          color: #fbbf24;
          font-size: 16px;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .analysis-metrics span {
          display: block;
          margin-bottom: 6px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .activity-section,
        .topology-section,
        .models-section,
        .workspace-section,
        .activity-feed,
        .integration-section {
          margin-top: 30px;
        }

        .activity-title,
        .topology-title,
        .models-title,
        .workspace-title,
        .feed-title,
        .integration-title {
          color: #fbbf24;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .activity-list,
        .live-feed-content {
          space-y: 10px;
        }

        .activity-item,
        .live-activity-item {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.6), rgba(60, 70, 90, 0.4));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 10px;
          color: #e2e8f0;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .activity-item:hover,
        .live-activity-item:hover {
          background: linear-gradient(135deg, rgba(60, 70, 90, 0.8), rgba(80, 90, 110, 0.6));
          border-color: rgba(212, 175, 55, 0.4);
          transform: translateX(3px);
        }

        .live-activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .live-time {
          font-size: 12px;
          color: #64748b;
          min-width: 60px;
        }

        .live-indicator {
          font-size: 8px;
          margin: 0 4px;
        }

        .live-indicator.live { color: #ef4444; }
        .live-indicator.active { color: #22c55e; }
        .live-indicator.warning { color: #f59e0b; }
        .live-indicator.success { color: #10b981; }
        .live-indicator.info { color: #3b82f6; }

        .live-text {
          flex: 1;
          color: #cbd5e1;
        }

        .topology-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
        }

        .topology-node {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(16, 185, 129, 0.4);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }

        .topology-node.primary {
          border-color: rgba(212, 175, 55, 0.6);
          color: #fbbf24;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 152, 45, 0.05));
        }

        .models-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .model-item {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s ease;
        }

        .model-item:hover {
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }

        .model-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .model-name {
          flex: 1;
          color: #e2e8f0;
          font-weight: 600;
          font-size: 14px;
        }

        .model-status {
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
        }

        .model-status.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .model-status.training {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        .model-status.optimizing {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid #3b82f6;
        }

        .gisheet-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .workspace-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .workspace-card {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .workspace-card:hover {
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
        }

        .workspace-card.active {
          border-color: rgba(212, 175, 55, 0.8);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 152, 45, 0.05));
        }

        .workspace-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .workspace-name {
          font-size: 14px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .workspace-stats {
          font-size: 12px;
          color: #94a3b8;
          margin-top: 4px;
        }

        .workspace-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .feed-content {
          space-y: 12px;
        }

        .feed-item {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.6), rgba(60, 70, 90, 0.4));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .feed-item:hover {
          background: linear-gradient(135deg, rgba(60, 70, 90, 0.8), rgba(80, 90, 110, 0.6));
          border-color: rgba(212, 175, 55, 0.4);
          transform: translateX(3px);
        }

        .feed-time {
          font-size: 12px;
          color: #64748b;
          min-width: 60px;
        }

        .feed-indicator {
          font-size: 16px;
          margin: 0 8px;
        }

        .feed-details {
          flex: 1;
        }

        .feed-user {
          font-weight: 600;
          color: #fbbf24;
          margin-right: 8px;
        }

        .feed-action {
          color: #cbd5e1;
        }

        .priority-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .priority-badge.critical {
          background: rgba(220, 38, 38, 0.3);
          color: #dc2626;
          border: 1px solid #dc2626;
        }

        .priority-badge.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        .integration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .integration-item {
          background: linear-gradient(135deg, rgba(45, 52, 70, 0.8), rgba(60, 70, 90, 0.6));
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s ease;
        }

        .integration-item.connected {
          border-color: rgba(34, 197, 94, 0.5);
        }

        .integration-item.processing {
          border-color: rgba(245, 158, 11, 0.5);
        }

        .integration-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .integration-name {
          flex: 1;
          font-weight: 600;
          color: #e2e8f0;
        }

        .integration-status {
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 600;
        }

        .integration-status.connected {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .integration-status.processing {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid #f59e0b;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .royal-navigation {
            padding: 20px 16px;
            gap: 12px;
          }
          
          .royal-tab {
            padding: 12px 20px;
            min-width: 140px;
            font-size: 14px;
          }
          
          .royal-content {
            padding: 25px 20px;
          }
          
          .royal-container {
            padding: 25px;
          }
          
          .search-interface {
            flex-direction: column;
            gap: 12px;
          }
          
          .stats-grid,
          .metrics-grid,
          .surfing-stats,
          .mesh-stats,
          .lora-stats,
          .gisheet-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .workspace-grid,
          .models-grid,
          .topology-grid,
          .integration-grid,
          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Web8TabSystem;