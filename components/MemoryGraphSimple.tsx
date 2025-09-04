/**
 * AGI Memory Graph - Simplified Inline Styles Version
 * Real-Time Health Monitoring & Service Visualization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

"use client";

import { useMemo } from "react";
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
const EDGE_PAIRS: Array<[string, string]> = [
  ["lora", "agieco"],
  ["agieco", "agistatistic"],
  ["agisheet", "agistatistic"],
  ["agibionature", "agistatistic"],
  ["agimed", "agistatistic"],
  ["agistatistic", "openmind"],
  ["aviation", "openmind"],
  ["agitrading", "openmind"],
  ["system", "openmind"],
];

function getNodeStatusStyle(status: HealthStatus) {
  const baseStyle = {
    position: 'absolute' as const,
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(135deg, rgba(96,165,250,0.15), rgba(139,92,246,0.1))',
    border: '1px solid rgba(148,163,184,0.3)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    padding: '12px 16px',
    minWidth: '160px',
    maxWidth: '300px',
    transition: 'all 0.3s ease',
    color: '#e2e8f0'
  };

  if (status === 'ok') {
    return { ...baseStyle, boxShadow: '0 0 0 2px rgba(34,197,94,0.5), 0 8px 32px rgba(0,0,0,0.4)' };
  } else if (status === 'degraded') {
    return { ...baseStyle, boxShadow: '0 0 0 2px rgba(245,158,11,0.5), 0 8px 32px rgba(0,0,0,0.4)' };
  } else if (status === 'down') {
    return { ...baseStyle, boxShadow: '0 0 0 2px rgba(239,68,68,0.5), 0 8px 32px rgba(0,0,0,0.4)', filter: 'grayscale(0.3)' };
  }
  return baseStyle;
}

function getBadgeStyle(status: HealthStatus) {
  const baseStyle = {
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '12px',
    border: '1px solid rgba(148,163,184,0.3)',
    background: 'rgba(0,0,0,0.3)',
    color: '#e2e8f0'
  };

  if (status === 'ok') {
    return { ...baseStyle, background: 'rgba(34,197,94,0.2)', color: '#86efac', borderColor: 'rgba(34,197,94,0.5)' };
  } else if (status === 'degraded') {
    return { ...baseStyle, background: 'rgba(245,158,11,0.2)', color: '#fde68a', borderColor: 'rgba(245,158,11,0.5)' };
  } else if (status === 'down') {
    return { ...baseStyle, background: 'rgba(239,68,68,0.2)', color: '#fecaca', borderColor: 'rgba(239,68,68,0.5)' };
  }
  return { ...baseStyle, background: 'rgba(139,92,246,0.2)', color: '#ddd6fe', borderColor: 'rgba(139,92,246,0.5)' };
}

export default function MemoryGraph() {
  const { data } = useSWR<HealthReport>("/api/health", fetcher, {
    refreshInterval: 5000,
  });

  const grouped = useMemo(() => {
    const g: Record<string, HealthItem[]> = {};
    for (const it of data?.items || []) {
      const svc = it.key.split(".")[0];
      (g[svc] ||= []).push(it);
    }
    return g;
  }, [data]);

  const services = useMemo(() => Object.keys(grouped), [grouped]);

  // Resolve service -> overall status (worst of endpoints)
  const svcStatus: Record<string, HealthStatus> = useMemo(() => {
    const out: Record<string, HealthStatus> = {};
    for (const [svc, items] of Object.entries(grouped)) {
      let s: HealthStatus = "ok";
      for (const it of items) {
        if (it.status === "down") {
          s = "down";
          break;
        }
        if (it.status === "degraded") {
          s = "degraded";
        }
      }
      out[svc] = s;
    }
    return out;
  }, [grouped]);

  // Build nodes to render
  const nodes = services.map((svc) => {
    const [x, y] = POS[svc] || [100 + Math.random() * 1200, 100 + Math.random() * 600];
    const status = svcStatus[svc] || "skipped";
    const endpoints = grouped[svc] || [];
    const lgLatency = Math.min(
      ...endpoints
        .filter((e) => typeof e.latency_ms === "number")
        .map((e) => e.latency_ms as number)
        .concat([Infinity])
    );
    return { id: svc, x, y, status, endpoints, bestLatency: isFinite(lgLatency) ? lgLatency : undefined };
  });

  // Build edges only if both services exist
  const edges = EDGE_PAIRS.filter(([a, b]) => services.includes(a) && services.includes(b));

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '80vh',
      background: '#0f172a',
      color: '#e2e8f0',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid rgba(148,163,184,0.2)'
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.2)',
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 600,
          color: '#f8fafc'
        }}>AGI Memory Graph</h3>
      </div>
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 65px)', // Adjust based on header height
      }}>
        {/* SVG edges layer */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <svg style={{ width: '100%', height: '100%', display: 'block' }}>
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
              const A = nodes.find((n) => n.id === a)!;
              const B = nodes.find((n) => n.id === b)!;
              const cx = (A.x + B.x) / 2;
              const cy = Math.min(A.y, B.y) - 120; // simple upward curve
              const d = `M ${A.x} ${A.y} C ${cx} ${cy}, ${cx} ${cy}, ${B.x} ${B.y}`;
              const worst = (s: HealthStatus) => (s === "down" ? 2 : s === "degraded" ? 1 : 0);
              const w = Math.max(worst(A.status), worst(B.status));
              const strokeGrad = w === 2 ? "url(#edge-err-grad)" : w === 1 ? "url(#edge-deg-grad)" : "url(#edge-live-grad)";
              return (
                <path 
                  key={`${a}->${b}`} 
                  d={d} 
                  stroke={strokeGrad}
                  strokeWidth={2.5}
                  fill="none"
                  style={{
                    filter: w === 2 ? 'drop-shadow(0 0 8px rgba(239,68,68,0.4))' : 
                            w === 1 ? 'drop-shadow(0 0 8px rgba(245,158,11,0.4))' : 
                            'drop-shadow(0 0 8px rgba(96,165,250,0.4))'
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* HTML nodes */}
        {nodes.map((n) => (
          <div
            key={n.id}
            style={{
              ...getNodeStatusStyle(n.status),
              left: n.x,
              top: n.y
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              borderRadius: '12px 12px 0 0',
              background: 'linear-gradient(90deg, rgba(96,165,250,0.7), rgba(139,92,246,0.7))'
            }} />
            <div style={{
              fontWeight: 700,
              fontSize: '14px',
              color: '#e2e8f0',
              marginBottom: '8px'
            }}>
              {labelFor(n.id)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8',
              marginBottom: '8px'
            }}>
              <div>Status: <b>{n.status.toUpperCase()}</b>{
                typeof n.bestLatency === "number" ? ` • ${n.bestLatency} ms` : ""
              }</div>
              <div>Endpoints: {n.endpoints.length}</div>
            </div>
            <div style={{
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              marginTop: '8px'
            }}>
              {n.endpoints.slice(0, 3).map((e) => (
                <span
                  key={e.key}
                  style={getBadgeStyle(e.status)}
                  title={`${e.key} → ${e.status}${e.latency_ms ? ` (${e.latency_ms}ms)` : ""}`}
                >
                  {e.key.split(".")[1]}
                </span>
              ))}
              {n.endpoints.length > 3 && (
                <span style={getBadgeStyle('skipped')}>
                  +{n.endpoints.length - 3}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(15,23,42,0.9)',
        border: '1px solid rgba(148,163,184,0.3)',
        borderRadius: '12px',
        padding: '16px',
        color: '#e2e8f0',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.9), rgba(34,197,94,0.3))',
            border: '1px solid rgba(34,197,94,0.5)'
          }} />
          Online
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.9), rgba(245,158,11,0.3))',
            border: '1px solid rgba(245,158,11,0.5)'
          }} />
          Degraded
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239,68,68,0.9), rgba(239,68,68,0.3))',
            border: '1px solid rgba(239,68,68,0.5)'
          }} />
          Offline
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8' }}>
          Updated: {data ? new Date(data.ts).toLocaleString() : "—"}
        </div>
      </div>
    </div>
  );
}

function labelFor(id: string) {
  switch (id) {
    case "agisheet": return "📊 AGI Sheet";
    case "agieco": return "🌱 AGI Eco";
    case "agitrading": return "💎 AGI Trading";
    case "agistatistic": return "📈 AGI Statistic";
    case "agibionature": return "🧬 BioNature";
    case "agimed": return "⚕️ AGI Med";
    case "openmind": return "🧠 Open Mind";
    case "aviation": return "✈️ Aviation";
    case "lora": return "📡 LoRa";
    case "system": return "⚙️ System";
    default: return id;
  }
}
