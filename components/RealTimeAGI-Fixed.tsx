'use client';

import { useEffect, useState } from 'react';
import { fmt, safe } from '../utils/kpi';
import { useRoyalMetrics } from '../frontend/hooks/useRoyalMetrics';

interface AGIData {
  speed: number;
  speedUnit: string;
  memory: string;
  connections: number;
  lr: number;
  security: string;
  latency: number;
  throughput: number;
  throughputUnit: string;
  nodes: number;
  cpu: number;
  gpu: number;
  net: string;
  uptime: string;
  health: number;
  ethics: number;
}

interface RealTimeAGIProps {
  initialData: AGIData;
}

// KPI Component
function KPI({ title, value, sub, isLoading = false }: { 
  title: string; 
  value: string | number; 
  sub?: string; 
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-semibold">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 rounded h-8 w-16"></div>
        ) : (
          value
        )}
      </div>
      {sub && (
        <div className="text-xs opacity-60 mt-1">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 rounded h-3 w-20"></div>
          ) : (
            sub
          )}
        </div>
      )}
    </div>
  );
}

export default function RealTimeAGI({ initialData }: RealTimeAGIProps) {
  const [agi, setAgi] = useState<AGIData>(initialData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Real metrics hook
  const { data: metrics, error: metricsError } = useRoyalMetrics(2000);
  const isConnected = !metricsError && metrics !== null;

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    const fetchAGIData = async () => {
      try {
        // Fetch AGI-specific data
        const [statsResponse, stateResponse] = await Promise.allSettled([
          fetch('/api/agi/stats', { cache: 'no-store' }).then(r => r.json()),
          fetch('/api/agi/state', { cache: 'no-store' }).then(r => r.json())
        ]);

        const stats = statsResponse.status === 'fulfilled' ? statsResponse.value : {};
        const state = stateResponse.status === 'fulfilled' ? stateResponse.value : {};

        // Combine real system metrics with AGI data
        setAgi(prev => ({
          ...prev,
          // Real system metrics from useRoyalMetrics
          cpu: metrics?.cpu ?? prev.cpu,
          gpu: metrics?.gpu ?? prev.gpu,
          memory: metrics ? `${metrics.memory.usedPct.toFixed(1)}%` : prev.memory,
          uptime: metrics ? `${Math.floor(metrics.system.uptimeSec / 86400)}d ${Math.floor((metrics.system.uptimeSec % 86400) / 3600)}h` : prev.uptime,
          
          // AGI-specific data
          connections: stats.activeConnections || prev.connections,
          latency: stats.averageResponseTime || prev.latency,
          nodes: stats.activeNodes || prev.nodes,
          health: state.health?.overall || prev.health,
          ethics: state.ethics?.compliance || prev.ethics,
          security: state.security?.level || prev.security,
        }));
        
        setLastUpdate(new Date());
        
      } catch (error) {
        console.error('AGI data fetch failed:', error);
      }
    };

    // Initial fetch
    fetchAGIData();
    
    // Set up interval for AGI data updates every 5 seconds
    const interval = setInterval(fetchAGIData, 5000);
    
    return () => clearInterval(interval);
  }, [metrics, isHydrated]);

  // Format functions for display
  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)}MB`;
    return `${(bytes / 1e3).toFixed(1)}KB`;
  };

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Header with Real Status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl">👑 AGI Royal Dashboard</div>
          <div className="text-sm opacity-70">🏛️ Real-Time Intelligence System</div>
          {isHydrated && metrics && (
            <div className="text-xs opacity-60 mt-1">
              {metrics.system.platform} • {metrics.system.cores} cores • {metrics.system.arch}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className={`rounded-full px-3 py-1 text-sm border ${
            isConnected && isHydrated
              ? 'bg-emerald-600/10 text-emerald-500 border-emerald-600/20' 
              : 'bg-red-600/10 text-red-500 border-red-600/20'
          }`}>
            {isConnected && isHydrated ? '🟢 Live Metrics' : '🔴 Metrics Offline'}
          </div>
          <div className="rounded-full px-3 py-1 text-sm bg-emerald-600/10 text-emerald-500 border border-emerald-600/20">
            🛡️ Royal Secure
          </div>
        </div>
      </div>

      {/* Real-Time KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Real System Metrics */}
        <KPI
          title="CPU Load"
          value={`${safe(agi.cpu, 0)}%`}
          sub={isHydrated && metrics ? `${metrics.system.cores} cores` : '12 cores'}
          isLoading={!isHydrated}
        />
        <KPI
          title="GPU Utilization"
          value={agi.gpu !== null ? `${safe(agi.gpu, 0)}%` : "N/A"}
          sub={agi.gpu !== null ? "dedicated GPU" : "no GPU access"}
          isLoading={!isHydrated}
        />
        <KPI
          title="Memory Used"
          value={agi.memory}
          sub={isHydrated && metrics ? `${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)}` : "16GB total"}
          isLoading={!isHydrated}
        />
        
        {/* AGI Neural Metrics */}
        <KPI
          title="Neural Connections"
          value={safe(agi.connections, 92)}
          sub="active links"
          isLoading={!isHydrated}
        />
        <KPI
          title="Processing Speed"
          value={`${agi.speed.toFixed(1)} ${agi.speedUnit}`}
          sub="🧠 Core"
          isLoading={!isHydrated}
        />
        <KPI
          title="Learning Rate"
          value={agi.lr.toFixed(2)}
          sub="(0–1)"
          isLoading={!isHydrated}
        />
        <KPI
          title="Security Level"
          value={agi.security}
          sub="compliance"
          isLoading={!isHydrated}
        />
        <KPI
          title="Response Latency"
          value={`${safe(agi.latency, 13)} ms`}
          sub="avg"
          isLoading={!isHydrated}
        />
        <KPI
          title="Active Nodes"
          value={safe(agi.nodes, 28)}
          sub="mesh network"
          isLoading={!isHydrated}
        />
        <KPI
          title="System Health"
          value={`${safe(agi.health, 98)}%`}
          sub="overall"
          isLoading={!isHydrated}
        />
        <KPI
          title="Ethical Compliance"
          value={`${safe(agi.ethics, 98)}%`}
          sub="guardian ai"
          isLoading={!isHydrated}
        />
        <KPI
          title="System Uptime"
          value={agi.uptime}
          sub="operational"
          isLoading={!isHydrated}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs opacity-60">
        <div>
          Last update: {isHydrated && lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}
        </div>
        <div>Metrics: 2s intervals | AGI: 5s intervals</div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700">
          Send Query
        </button>
        <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
          Change Theme
        </button>
        <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
          Reset Memory
        </button>
      </div>
    </div>
  );
}
