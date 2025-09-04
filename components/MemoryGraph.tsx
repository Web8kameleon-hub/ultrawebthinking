/**
 * AGI Memory Graph - Real-Time Health Monitoring & Service Visualization
 * Industrial React C      if (it.status === "down") { s = "down"; break; }
      if (it.status === "degraded") s = "degraded";ponent with Live Service Health Status
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import useSWR from "swr";
import styles from "./MemoryGraph.module.css";

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

function statusClass(s: HealthStatus) {
  if (s === "ok") return styles.isOnline;
  if (s === "degraded") return styles.isDegraded;
  if (s === "down") return styles.isOffline;
  return "";
}

function nodeRole(service: string) {
  if (service === "openmind") return styles.nodeAgi; // knowledge/AI hub
  if (service === "system") return styles.nodeCore; // core infra
  if (service === "lora" || service === "agibionature" || service === "agieco") return styles.nodeSensor; // edge/sensors
  if (service === "agisheet" || service === "agistatistic") return styles.nodeStorage; // data/analytics
  if (service === "agimed") return styles.nodeSecurity; // sensitive
  return styles.nodeAgi; // default accent
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
        if (it.status === "down") { s = "down"; break; }
        if (it.status === "degraded") s = "degraded";
      }
      out[svc] = s;
    }
    return out;
  }, [grouped]);

  // Build nodes to render
  const nodes = useMemo(() => services.map((svc) => {
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
  }), [services, svcStatus, grouped]);

  const edges = useMemo(() => EDGE_PAIRS.filter(([a, b]) => services.includes(a) && services.includes(b)), [services]);

  return (
    <div className={styles.mgRoot}>
      <motion.div
        className={styles.mgViewport}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
      >
        {/* SVG edges layer */}
        <div className={styles.svgLayer}>
          <svg width="100%" height="100%">
            <defs>
              <linearGradient id="edge-live-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#84cc16" />
              </linearGradient>
              <linearGradient id="edge-deg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="edge-err-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f43f5e" />
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
              const stroke = w === 2 ? "url(#edge-err-grad)" : w === 1 ? "url(#edge-deg-grad)" : "url(#edge-live-grad)";
              return <path key={`${a}->${b}`} className={styles.edge} stroke={stroke} d={d} />;
            })}
          </svg>
        </div>

        {/* HTML nodes */}
        {nodes.map((n) => (
          <div
            key={n.id}
            className={`${styles.node} ${statusClass(n.status)} ${nodeRole(n.id)}`}
            style={{
              left: n.x,
              top: n.y,
            }}
          >
            <div className={styles.nodeTitle}>{labelFor(n.id)}</div>
            <div className={styles.nodeMeta}>
              {n.bestLatency !== undefined ? `${n.bestLatency}ms` : "N/A"}
            </div>
            <div className={styles.badges}>
              {n.endpoints.slice(0, 3).map((e) => (
                <span
                  key={e.key}
                  className={`${styles.badge} ${badgeFor(e.status)}`}
                  title={`${e.key} → ${e.status}${e.latency_ms ? ` (${e.latency_ms}ms)` : ""}`}
                >
                  {e.key.split(".")[1]}
                </span>
              ))}
              {n.endpoints.length > 3 && (
                <span className={styles.badge}>+{n.endpoints.length - 3}</span>
              )}
            </div>
            <span className={`${styles.port} ${styles.portRight} ${portFor(n.status)}`} />
          </div>
        ))}
      </motion.div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.badgeOk}`} /> Online</div>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.badgeWarn}`} /> Degraded</div>
        <div className={styles.legendRow}><span className={`${styles.legendDot} ${styles.badgeErr}`} /> Offline</div>
        <div>
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

function badgeFor(s: HealthStatus) {
  if (s === "ok") return styles.badgeOk;
  if (s === "degraded") return styles.badgeWarn;
  if (s === "down") return styles.badgeErr;
  return styles.badgeRoyal; // skipped/other
}

function portFor(s: HealthStatus) {
  if (s === "ok") return styles.portOnline;
  if (s === "degraded") return styles.portWarn;
  if (s === "down") return styles.portErr;
  return "";
}
