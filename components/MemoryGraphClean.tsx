/**
 * AGI Memory Graph - CSS Modules Version
 * Real-Time Health Monitoring & Service Visualization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

"use client";

import useSWR from "swr";
import styles from "./MemoryGraphNew.module.css";

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

type ServiceNode = {
  id: string;
  x: number;
  y: number;
  status: "ok" | "degraded" | "down";
  endpoints: HealthItem[];
  bestLatency?: number;
};

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then((r) => r.json());

// Basic position map (service -> [x,y])
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

export default function MemoryGraphClean() {
  const { data, error } = useSWR<HealthReport>('/api/health', fetcher, {
    refreshInterval: 2000,
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h3 className={styles.title}>AGI Memory Graph</h3>
        </div>
        <div className={styles.statusPanel}>
          <div className={styles.statusRow}>
            <div className={`${styles.statusIndicator} ${styles.statusError}`} />
            <span className={styles.statusText}>Failed to load health data</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h3 className={styles.title}>AGI Memory Graph</h3>
        </div>
        <div className={styles.statusPanel}>
          <div className={styles.statusRow}>
            <div className={`${styles.statusIndicator} ${styles.statusWarn}`} />
            <span className={styles.statusText}>Loading health data...</span>
          </div>
        </div>
      </div>
    );
  }

  const services = [...new Set(data.items.map((it) => it.key.split(".")[0]))];
  const nodes = services
    .map((svc) => {
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
      return { id: svc, x, y, status, endpoints, bestLatency: isFinite(lgLatency) ? lgLatency : undefined } as ServiceNode;
    })
    .filter((node) => node !== null) as ServiceNode[];

  const edges = EDGE_PAIRS.filter(([a, b]) => services.includes(a) && services.includes(b));

  const getNodeClasses = (status: "ok" | "degraded" | "down") => {
    const baseClasses = [styles.node];
    switch (status) {
      case "ok":
        baseClasses.push(styles.nodeOnline, styles.animatePulseOk);
        break;
      case "degraded":
        baseClasses.push(styles.nodeDegraded, styles.animatePulseWarn);
        break;
      case "down":
        baseClasses.push(styles.nodeDown, styles.animatePulseError);
        break;
    }
    return baseClasses.join(" ");
  };

  const getStatusClasses = (status: HealthStatus) => {
    const baseClasses = [styles.statusIndicator];
    switch (status) {
      case "ok":
        baseClasses.push(styles.statusOk);
        break;
      case "degraded":
        baseClasses.push(styles.statusWarn);
        break;
      case "down":
        baseClasses.push(styles.statusError);
        break;
    }
    return baseClasses.join(" ");
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>AGI Memory Graph</h3>
      </div>
      <div className={styles.graphContainer}>
        {/* SVG edges layer */}
        <svg className={styles.svgCanvas}>
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
            const cy = (A.y + B.y) / 2;
            const qx = cx + (Math.random() - 0.5) * 60;
            const qy = cy + (Math.random() - 0.5) * 60;
            const path = `M ${A.x + 60} ${A.y + 40} Q ${qx} ${qy} ${B.x + 60} ${B.y + 40}`;
            
            const bothOk = A.status === "ok" && B.status === "ok";
            const anyDegraded = A.status === "degraded" || B.status === "degraded";
            const anyDown = A.status === "down" || B.status === "down";
            
            let strokeUrl = "url(#edge-live-grad)";
            let connectionClass = styles.connectionLine;
            if (anyDown) {
              strokeUrl = "url(#edge-err-grad)";
              connectionClass = `${styles.connectionLine} ${styles.connectionError}`;
            } else if (anyDegraded) {
              strokeUrl = "url(#edge-deg-grad)";
            } else if (bothOk) {
              connectionClass = `${styles.connectionLine} ${styles.connectionActive}`;
            }
            
            return (
              <path
                key={`${a}-${b}`}
                d={path}
                stroke={strokeUrl}
                strokeWidth={bothOk ? 3 : 2}
                fill="none"
                opacity={bothOk ? 1 : 0.6}
                className={connectionClass}
              />
            );
          })}
        </svg>

        {/* HTML nodes */}
        {nodes.map((n) => (
          <div
            key={n.id}
            className={getNodeClasses(n.status)}
            style={{ left: n.x, top: n.y }}
          >
            <div className={styles.nodeLabel}>{labelFor(n.id)}</div>
            <div className={styles.nodeStatus}>
              Status: <b>{n.status.toUpperCase()}</b>
              {typeof n.bestLatency === "number" ? ` • ${n.bestLatency} ms` : ""}
            </div>
            <div className={styles.nodeLatency}>
              Endpoints: {n.endpoints.length}
            </div>
            
            {/* Connection ports */}
            <span className={`${styles.port} ${styles.portRight} ${n.status === 'ok' ? styles.portOnline : styles.portError}`} />
            <span className={`${styles.port} ${styles.portLeft} ${n.status === 'ok' ? styles.portOnline : styles.portError}`} />
          </div>
        ))}
      </div>

      {/* Status Panel */}
      <div className={styles.statusPanel}>
        <div className={styles.statusRow}>
          <div className={getStatusClasses(data.status)} />
          <span className={styles.statusText}>System: {data.status.toUpperCase()}</span>
        </div>
        <div className={styles.statusRow}>
          <div className={getStatusClasses("ok")} />
          <span className={styles.statusText}>Online: {nodes.filter(n => n.status === "ok").length}</span>
        </div>
        <div className={styles.statusRow}>
          <div className={getStatusClasses("degraded")} />
          <span className={styles.statusText}>Degraded: {nodes.filter(n => n.status === "degraded").length}</span>
        </div>
        <div className={styles.statusRow}>
          <div className={getStatusClasses("down")} />
          <span className={styles.statusText}>Down: {nodes.filter(n => n.status === "down").length}</span>
        </div>
        <div className={styles.statusMeta}>
          Last updated: {new Date(data.ts).toLocaleTimeString()} • 
          Services: {services.length} • Endpoints: {data.items.length}
        </div>
      </div>
    </div>
  );
}
