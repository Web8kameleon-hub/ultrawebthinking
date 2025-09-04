import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AGIControlPanel from './AGIControlPanel';
import MemoryGraph from './MemoryGraph';
import styles from './Web8TabSystem-Clean.module.css';

// Tab type definitions
type TabType = 'dashboard' | 'agi-control' | 'neural-tools' | 'agi-eco';

interface Tab {
  id: TabType;
  title: string;
  icon: string;
}

// Button variants using cva
const buttonVariants = cva(
  'px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-accent hover:bg-accent/80 text-white',
        secondary: 'bg-card-bg border border-border-soft text-text-main hover:bg-slate-700',
        success: 'bg-success hover:bg-success/80 text-white',
        warning: 'bg-warning hover:bg-warning/80 text-white',
        error: 'bg-error hover:bg-error/80 text-white',
        info: 'bg-info hover:bg-info/80 text-white'
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

// System metrics interface
interface SystemMetrics {
  cpu: number;
  gpu: number;
  memory: number;
  neural: number;
  processing: number;
  learning: number;
  uptime: string;
  version: string;
  connections: number;
  threats: number;
  performance: number;
  network: number;
  resources: number;
  cacheHits: number;
  totalRequests: number;
  errorRate: number;
}

export function Web8TabSystemClean() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    gpu: 0,
    memory: 0,
    neural: 0,
    processing: 0,
    learning: 0,
    uptime: '0:00:00',
    version: '1.0.0',
    connections: 0,
    threats: 0,
    performance: 0,
    network: 0,
    resources: 0,
    cacheHits: 0,
    totalRequests: 0,
    errorRate: 0
  });

  const tabs: Tab[] = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊' },
    { id: 'agi-control', title: 'AGI Control', icon: '🧠' },
    { id: 'neural-tools', title: 'Neural Tools', icon: '⚡' },
    { id: 'agi-eco', title: 'AGI Eco', icon: '🌱' }
  ];

  // Real system metrics fetching
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/agi/status');
        if (response.ok) {
          const data = await response.json();
          setSystemMetrics(data);
        }
      } catch (error) {
        console.error('Failed to fetch system metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  // Real system controls
  const handleSystemControl = async (action: string) => {
    try {
      const response = await fetch('/api/agi/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        console.log(`System ${action} executed successfully`);
      }
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
    }
  };

  return (
    <div className={styles['tab-content']}>
      {/* Tab Navigation */}
      <div className="flex bg-card-bg border-b border-border-soft">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-accent text-white border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-main hover:bg-slate-700/50'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <DashboardTab metrics={systemMetrics} onControl={handleSystemControl} />}
          {activeTab === 'agi-control' && <AGIControlTab />}
          {activeTab === 'neural-tools' && <NeuralToolsTab />}
          {activeTab === 'agi-eco' && <AGIEcoTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ metrics, onControl }: { metrics: SystemMetrics; onControl: (action: string) => void }) {
  return (
    <div className={styles['dashboard-root']}>
      {/* Dashboard Header */}
      <div className={styles['dashboard-header']}>
        <div className={styles['dashboard-header-content']}>
          <h1 className={styles['dashboard-title']}>EuroWeb Ultra Dashboard</h1>
          <p className={styles['dashboard-subtitle']}>Real-time system monitoring and control</p>
          <p className={styles['dashboard-info']}>Version {metrics.version} • Uptime: {metrics.uptime}</p>
        </div>
        <div className={styles['dashboard-status']}>
          <div className={styles['dashboard-status-title']}>SYSTEM OPERATIONAL</div>
          <div className={styles['dashboard-status-subtitle']}>All systems green</div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className={styles['dashboard-metrics']}>
        <div className={clsx(styles['dashboard-metric'], styles['cpu'])}>
          <div className={styles['dashboard-metric-label']}>CPU Usage</div>
          <div className={styles['dashboard-metric-value']}>{metrics.cpu}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Real-time</div>
        </div>
        <div className={clsx(styles['dashboard-metric'], styles['gpu'])}>
          <div className={styles['dashboard-metric-label']}>GPU Performance</div>
          <div className={styles['dashboard-metric-value']}>{metrics.gpu}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Optimal</div>
        </div>
        <div className={clsx(styles['dashboard-metric'], styles['memory'])}>
          <div className={styles['dashboard-metric-label']}>Memory Usage</div>
          <div className={styles['dashboard-metric-value']}>{metrics.memory}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Available</div>
        </div>
        <div className={clsx(styles['dashboard-metric'], styles['neural'])}>
          <div className={styles['dashboard-metric-label']}>Neural Activity</div>
          <div className={styles['dashboard-metric-value']}>{metrics.neural}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Processing</div>
        </div>
        <div className={clsx(styles['dashboard-metric'], styles['processing'])}>
          <div className={styles['dashboard-metric-label']}>Task Processing</div>
          <div className={styles['dashboard-metric-value']}>{metrics.processing}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Active</div>
        </div>
        <div className={clsx(styles['dashboard-metric'], styles['learning'])}>
          <div className={styles['dashboard-metric-label']}>Learning Rate</div>
          <div className={styles['dashboard-metric-value']}>{metrics.learning}%</div>
          <div className={styles['dashboard-metric-sublabel']}>Adaptive</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className={styles['dashboard-additional-metrics']}>
        <div className={styles['dashboard-small-metric']}>
          <div className={styles['dashboard-small-metric-label']}>Connections</div>
          <div className={styles['dashboard-small-metric-value']}>{metrics.connections}</div>
          <div className={styles['dashboard-small-metric-sublabel']}>Active</div>
        </div>
        <div className={styles['dashboard-small-metric']}>
          <div className={styles['dashboard-small-metric-label']}>Cache Hits</div>
          <div className={styles['dashboard-small-metric-value']}>{metrics.cacheHits}</div>
          <div className={styles['dashboard-small-metric-sublabel']}>Efficiency</div>
        </div>
        <div className={styles['dashboard-small-metric']}>
          <div className={styles['dashboard-small-metric-label']}>Requests</div>
          <div className={styles['dashboard-small-metric-value']}>{metrics.totalRequests}</div>
          <div className={styles['dashboard-small-metric-sublabel']}>Total</div>
        </div>
        <div className={styles['dashboard-small-metric']}>
          <div className={styles['dashboard-small-metric-label']}>Error Rate</div>
          <div className={styles['dashboard-small-metric-value']}>{metrics.errorRate}%</div>
          <div className={styles['dashboard-small-metric-sublabel']}>Low</div>
        </div>
      </div>

      {/* Control Center */}
      <div className={styles['dashboard-control-center']}>
        <h3 className={styles['dashboard-control-title']}>System Control Center</h3>
        
        <div className={styles['dashboard-action-buttons']}>
          <button className={clsx(styles['dashboard-btn'], styles['scan'])} onClick={() => onControl('scan')}>
            🔍 Deep Scan
          </button>
          <button className={clsx(styles['dashboard-btn'], styles['export'])} onClick={() => onControl('export')}>
            💾 Export Data
          </button>
          <button className={clsx(styles['dashboard-btn'], styles['optimize'])} onClick={() => onControl('optimize')}>
            ⚡ Optimize
          </button>
          <button className={clsx(styles['dashboard-btn'], styles['report'])} onClick={() => onControl('report')}>
            📊 Generate Report
          </button>
          <button className={clsx(styles['dashboard-btn'], styles['reset'])} onClick={() => onControl('reset')}>
            🔄 Reset Cache
          </button>
          <button className={clsx(styles['dashboard-btn'], styles['theme'])} onClick={() => onControl('theme')}>
            🎨 Theme Toggle
          </button>
        </div>

        <div className={styles['dashboard-system-controls']}>
          <h4 className={styles['dashboard-controls-title']}>System Operations</h4>
          <div className={styles['dashboard-controls-buttons']}>
            <button className={clsx(styles['dashboard-control-btn'], styles['performance'])} onClick={() => onControl('performance')}>
              Performance Mode
            </button>
            <button className={clsx(styles['dashboard-control-btn'], styles['network'])} onClick={() => onControl('network')}>
              Network Diagnostics
            </button>
            <button className={clsx(styles['dashboard-control-btn'], styles['resource'])} onClick={() => onControl('resource')}>
              Resource Allocation
            </button>
          </div>
        </div>

        <div className={styles['dashboard-neural-tools']}>
          <h4 className={styles['dashboard-neural-title']}>Neural Tools</h4>
          <div className={styles['dashboard-neural-buttons']}>
            <button className={clsx(styles['dashboard-neural-btn'], styles['analysis'])} onClick={() => onControl('analysis')}>
              Pattern Analysis
            </button>
            <button className={clsx(styles['dashboard-neural-btn'], styles['predictions'])} onClick={() => onControl('predictions')}>
              Predictions
            </button>
            <button className={clsx(styles['dashboard-neural-btn'], styles['backup'])} onClick={() => onControl('backup')}>
              Neural Backup
            </button>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className={styles['dashboard-status-footer']}>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span>Performance: {metrics.performance}% | Network: {metrics.network}% | Resources: {metrics.resources}%</span>
        <span>EuroWeb Ultra v{metrics.version}</span>
      </div>
    </div>
  );
}

// AGI Control Tab Component
function AGIControlTab() {
  return (
    <div className={styles['agi-control']}>
      <h2>AGI Control Center</h2>
      <MemoryGraph />
      <AGIControlPanel />
    </div>
  );
}

// Neural Tools Tab Component
function NeuralToolsTab() {
  return (
    <div className={styles['neural-tools-root']}>
      <div className={styles['neural-tools-header']}>
        <h2 className={styles['neural-tools-title']}>Neural Processing Tools</h2>
        <p className={styles['neural-tools-subtitle']}>Advanced AI-powered analysis and prediction systems</p>
      </div>
      
      <div className={styles['neural-tools-grid']}>
        <div className={clsx(styles['neural-tools-card'], styles['analysis'])}>
          <h3 className={styles['neural-tools-card-title']}>Pattern Analysis</h3>
          <p className={styles['neural-tools-card-desc']}>
            Deep learning algorithms to identify complex patterns in your data streams and system behavior.
          </p>
          <button className={clsx(styles['neural-tools-btn'], styles['analysis'])}>
            Start Analysis
          </button>
        </div>

        <div className={clsx(styles['neural-tools-card'], styles['prediction'])}>
          <h3 className={styles['neural-tools-card-title']}>Predictive Modeling</h3>
          <p className={styles['neural-tools-card-desc']}>
            AI-powered forecasting models to predict system performance and resource requirements.
          </p>
          <button className={clsx(styles['neural-tools-btn'], styles['prediction'])}>
            Generate Predictions
          </button>
        </div>

        <div className={clsx(styles['neural-tools-card'], styles['backup'])}>
          <h3 className={styles['neural-tools-card-title']}>Neural Backup</h3>
          <p className={styles['neural-tools-card-desc']}>
            Intelligent backup systems that learn from your usage patterns and optimize storage.
          </p>
          <button className={clsx(styles['neural-tools-btn'], styles['backup'])}>
            Create Backup
          </button>
        </div>
      </div>
    </div>
  );
}

// AGI Eco Tab Component
function AGIEcoTab() {
  return (
    <div className={styles['agi-eco']}>
      <div className={styles['agi-eco-root']}>
        <h2 className={styles['agi-eco-title']}>AGI Ecosystem</h2>
        <p className={styles['agi-eco-desc']}>Sustainable AI solutions for environmental optimization</p>
        
        <div className={styles['agi-eco-grid']}>
          <div className={styles['agi-eco-card']}>
            <div className={styles['agi-eco-card-header']}>
              <span className={styles['agi-eco-icon']}>🌱</span>
              <h3 className={styles['agi-eco-card-title']}>Energy Optimization</h3>
            </div>
            <form className={styles['agi-eco-form']}>
              <input 
                type="text" 
 placeholder="Energy target (kWh)" 
                className={styles['agi-eco-input']}
              />
              <select 
                className={styles['agi-eco-select']}
                title="Select optimization level"
                aria-label="Optimization Level"
              >
                <option>Optimization Level</option>
                <option>Conservative</option>
                <option>Balanced</option>
                <option>Aggressive</option>
              </select>
            </form>
            <div className={styles['agi-eco-buttons']}>
              <button className={styles['agi-eco-btn']}>Optimize</button>
              <button className={clsx(styles['agi-eco-btn'], styles['report'])}>Report</button>
            </div>
            <div className={styles['agi-eco-status']}>Status: Monitoring energy consumption patterns</div>
          </div>

          <div className={styles['agi-eco-card']}>
            <div className={styles['agi-eco-card-header']}>
              <span className={styles['agi-eco-icon']}>♻️</span>
              <h3 className={styles['agi-eco-card-title']}>Resource Recycling</h3>
            </div>
            <form className={styles['agi-eco-form']}>
              <input 
                type="text" 
 placeholder="Resource type" 
                className={styles['agi-eco-input']}
              />
              <select 
                className={styles['agi-eco-select']}
                title="Select recycling strategy"
                aria-label="Recycling Strategy"
              >
                <option>Recycling Strategy</option>
                <option>Memory Pools</option>
                <option>Cache Optimization</option>
                <option>Storage Cleanup</option>
              </select>
            </form>
            <div className={styles['agi-eco-buttons']}>
              <button className={styles['agi-eco-btn']}>Recycle</button>
              <button className={clsx(styles['agi-eco-btn'], styles['report'])}>Analyze</button>
            </div>
            <div className={styles['agi-eco-status']}>Status: Identifying recyclable resources</div>
          </div>
        </div>
      </div>
    </div>
  );
}

