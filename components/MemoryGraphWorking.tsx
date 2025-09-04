/**
 * AGI Memory Graph - Working Inline Version
 * Real-Time Health Monitoring & Service Visualization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

"use client";

import useSWR from "swr";

// Types aligned with /api/health from lib/services.ts
type HealthStatus = "ok" | "degraded" | "down" | "skipped";

type HealthItem = {
  key: string; // service.endpoint
  status: HealthStatus;
  latency_ms?: number;
  error?: string;
  url?: string;
  enabled?: boolean;
};

type HealthReport = {
  status: HealthStatus;
  items: HealthItem[];
  ts: number;
};

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then((r) => r.json());

// Basic position map (service -> [x,y]) — tweak as you like
const POS: Record<string, [number, number]> = {
  agisheet: [180, 140],
  agieco: [180, 360],
  agitrading: [500, 140],
  agistatistic: [500, 360],
  agibionature: [820, 360],
  agimed: [820, 140],
  openmind: [1140, 140],
  aviation: [1140, 360],
  lora: [1460, 360],
  system: [1460, 140],
};

// Suggested logical edges between services
const EDGE_PAIRS: [string, string][] = [
  ["agisheet", "agitrading"],
  ["agieco", "agibionature"],
  ["agitrading", "agistatistic"],
  ["agimed", "openmind"],
  ["openmind", "aviation"],
  ["aviation", "lora"],
  ["lora", "system"],
  ["system", "agisheet"],
];

const labelFor = (svc: string) => {
  switch (svc) {
    case "agisheet": return "AGI Sheet";
    case "agieco": return "AGI Eco";
    case "agitrading": return "AGI Trading";
    case "agistatistic": return "AGI Statistic";
    case "agibionature": return "AGI BioNature";
    case "agimed": return "AGI Med";
    case "openmind": return "OpenMind";
    case "aviation": return "Aviation";
    case "lora": return "LoRa";
    case "system": return "System";
    default: return svc.toUpperCase();
  }
};

export default function MemoryGraphWorking() {
  const { data, error } = useSWR<HealthReport>('/api/health', fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)', 
        color: '#e2e8f0',
        borderRadius: '16px',
        border: '1px solid #334155'
      }}>
        <h3 style={{ color: '#8b5cf6', margin: '0 0 16px 0' }}>AGI Memory Graph</h3>
        <div style={{ color: '#ef4444' }}>Failed to load health data</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)', 
        color: '#e2e8f0',
        borderRadius: '16px',
        border: '1px solid #334155'
      }}>
        <h3 style={{ color: '#8b5cf6', margin: '0 0 16px 0' }}>AGI Memory Graph</h3>
        <div style={{ color: '#f59e0b' }}>Loading health data...</div>
      </div>
    );
  }

  const services = [...new Set(data.items.map((it) => it.key.split(".")[0]))];
  const nodes = services.map((svc) => {
    const pos = POS[svc];
    if (!pos) return null;
    const [x, y] = pos;
    const endpoints = data.items.filter((it) => it.key.startsWith(svc + "."));
    const status = endpoints.some((e) => e.status === "ok") ? "ok" : 
                  endpoints.some((e) => e.status === "degraded") ? "degraded" : "down";
    const lgLatency = Math.min(
      ...endpoints
        .filter((e) => typeof e.latency_ms === "number")
        .map((e) => e.latency_ms as number)
        .concat([Infinity])
    );
    return { id: svc, x, y, status, endpoints, bestLatency: isFinite(lgLatency) ? lgLatency : undefined };
  }).filter(Boolean);

  const edges = EDGE_PAIRS.filter(([a, b]) => services.includes(a) && services.includes(b));

  const getNodeStyle = (status: HealthStatus) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: 120,
      height: 80,
      border: '2px solid #334155',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: 12,
      fontWeight: 600,
      color: '#e2e8f0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    };

    switch (status) {
      case "ok":
        return { ...baseStyle, borderColor: '#22c55e', boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' };
      case "degraded":
        return { ...baseStyle, borderColor: '#f59e0b', boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' };
      case "down":
        return { ...baseStyle, borderColor: '#ef4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={{
      width: '100%',
      padding: 24,
      background: 'linear-gradient(135deg, #0b1220 0%, #0f172a 100%)',
      border: '1px solid #334155',
      borderRadius: 16,
      color: '#e2e8f0',
      fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid #1e293b'
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#8b5cf6', margin: 0 }}>
          AGI Memory Graph
        </h3>
      </div>
      
      <div style={{
        position: 'relative',
        width: '100%',
        height: 500,
        background: '#111827',
        border: '1px solid #1e293b',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        {/* SVG edges layer */}
        <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <linearGradient id="edge-live-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="edge-deg-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>
            <linearGradient id="edge-err-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
          {edges.map(([a, b]) => {
            const A = nodes.find((n: any) => n.id === a)!;
            const B = nodes.find((n: any) => n.id === b)!;
            const cx = (A.x + B.x) / 2;
            const cy = (A.y + B.y) / 2;
            const qx = cx + (Math.random() - 0.5) * 60;
            const qy = cy + (Math.random() - 0.5) * 60;
            const path = `M ${A.x + 60} ${A.y + 40} Q ${qx} ${qy} ${B.x + 60} ${B.y + 40}`;
            
            const bothOk = A.status === "ok" && B.status === "ok";
            const anyDegraded = A.status === "degraded" || B.status === "degraded";
            const anyDown = A.status === "down" || B.status === "down";
            
            let strokeUrl = "url(#edge-live-grad)";
            if (anyDown) strokeUrl = "url(#edge-err-grad)";
            else if (anyDegraded) strokeUrl = "url(#edge-deg-grad)";
            
            return (
              <path
                key={`${a}-${b}`}
                d={path}
                stroke={strokeUrl}
                strokeWidth={bothOk ? 3 : 2}
                fill="none"
                opacity={bothOk ? 1 : 0.6}
              />
            );
          })}
        </svg>

        {/* HTML nodes */}
        {nodes.map((n: any) => (
          <div key={n.id} style={{ ...getNodeStyle(n.status), left: n.x, top: n.y }}>
            <div style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
              {labelFor(n.id)}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>
              Status: <b>{n.status.toUpperCase()}</b>
              {typeof n.bestLatency === "number" ? ` • ${n.bestLatency} ms` : ""}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
              Endpoints: {n.endpoints.length}
            </div>
          </div>
        ))}
      </div>

      {/* Status Panel */}
      <div style={{
        marginTop: 24,
        padding: 16,
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
            background: data.status === 'ok' ? '#22c55e' : data.status === 'degraded' ? '#f59e0b' : '#ef4444',
            boxShadow: data.status === 'ok' ? '0 0 8px rgba(34, 197, 94, 0.4)' : 
                      data.status === 'degraded' ? '0 0 8px rgba(245, 158, 11, 0.4)' : '0 0 8px rgba(239, 68, 68, 0.4)'
          }} />
          <span style={{ color: '#e2e8f0', fontSize: 12 }}>
            System: {data.status.toUpperCase()}
          </span>
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: '#94a3b8' }}>
          Last updated: {new Date(data.ts).toLocaleTimeString()} • 
          Services: {services.length} • Endpoints: {data.items.length}
        </div>
      </div>
    </div>
  );
}
