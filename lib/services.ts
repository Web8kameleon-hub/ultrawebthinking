// lib/services.ts
// REAL-MODE Service Matrix loader + helpers + health checker + circuit breaker
// Requires: npm i yaml

import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import YAML from "yaml";

export type Protocol = "http" | "ws" | "mqtt" | "sql" | "json-rpc";
export type Method = "GET" | "HEAD" | "POST";

export interface ServiceEndpoint {
  endpoint?: string;            // URL or path
  url?: string;                 // Alternative URL field
  protocol?: Protocol;
  auth?: "none" | "api-key" | "bearer" | "mtls" | "service-account" | "internal";
  base?: string;                // For FHIR base URLs
  rpc?: string;                 // For JSON-RPC endpoints
  topic?: string;               // For MQTT topics
  broker?: string;              // For MQTT brokers
  ws?: string;                  // For WebSocket URLs
  storage?: string;             // For storage URLs
  health?: string | string[];   // Health check specifications
  reliability?: { 
    timeout_ms?: number; 
    retry?: number; 
    circuit_breaker?: { fail_threshold: number; cooloff_s: number } 
  };
  enabled?: boolean;
}

export interface ServiceDef {
  name: string;
  source?: string;
  endpoint?: string;
  protocol?: Protocol;
  auth?: string;
  health?: string | string[];
  status_endpoint?: string;
  ui_terms?: string[];
  // Dynamic endpoint configurations
  [key: string]: any;
}

export interface Matrix {
  version: number;
  real_mode: any;
  services: Record<string, ServiceDef>;
}

const REAL_MODE = process.env.REAL_MODE === "1";

const MATRIX_PATHS = [
  path.join(process.cwd(), "config", "services.yaml"),
  path.join(process.cwd(), "config", "services.yml"),
];

let _matrix: Matrix | null = null;

// In-memory circuit breaker state
type CBKey = `${string}.${string}`;
const FAILS = new Map<CBKey, { count: number; until?: number }>();

function must<T>(v: T | null | undefined, msg: string): T {
  if (v == null) throw new Error(msg);
  return v;
}

export function loadMatrix(force = false): Matrix {
  if (_matrix && !force) return _matrix;

  const file = MATRIX_PATHS.find(p => fs.existsSync(p));
  if (!file) {
    throw new Error("services.yaml not found in ./config");
  }
  const raw = fs.readFileSync(file, "utf8");
  const parsed = YAML.parse(raw) as Matrix;

  if (!parsed?.services || typeof parsed.services !== "object") {
    throw new Error("Invalid services.yaml: missing services{}");
  }
  _matrix = parsed;
  return _matrix!;
}

export function assertReal(serviceHint?: string) {
  if (!REAL_MODE) {
    throw new Error(`[REAL_MODE OFF] ${serviceHint ?? ""}`.trim());
  }
}

export function listServices(): string[] {
  const m = loadMatrix();
  return Object.keys(m.services);
}

export function listEndpoints(svc: string): string[] {
  const m = loadMatrix();
  const s = must(m.services[svc], `Service '${svc}' not found`);
  return Object.keys(s.endpoints || {});
}

/** Key form: "service.endpoint", e.g. "aviation.metar_taf" */
export function getService(key: string): { service: string; endpoint: string; def: ServiceEndpoint } {
  const [service, endpoint] = key.split(".");
  if (!service || !endpoint) throw new Error(`Invalid key '${key}', expected 'service.endpoint'`);

  const m = loadMatrix();
  const svc = must(m.services[service], `Service '${service}' not found`);
  
  // Handle the current YAML structure where endpoints are direct properties
  const def = svc[endpoint] as ServiceEndpoint;
  if (!def) throw new Error(`Endpoint '${endpoint}' not found in '${service}'`);

  return { service, endpoint, def };
}

function envSubstitute(url?: string): string | undefined {
  if (!url) return url;
  return url.replace(/\$\{([\w]+)\}/g, (_, name) => {
    const v = process.env[name];
    if (!v) throw new Error(`[ENV MISSING] ${name}`);
    return v;
  });
}

function parseHealthSpec(spec: string): { method: Method; url: string } {
  const s = spec.trim();
  if (s.startsWith("GET ") || s.startsWith("HEAD ")) {
    const [method, ...rest] = s.split(" ");
    const url = rest.join(" ").trim();
    return { method: method as Method, url };
  }
  // default GET
  return { method: "GET", url: s };
}

async function fetchWithTimeout(url: string, ms: number, method: Method = "GET"): Promise<Response> {
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { method, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(to);
  }
}

function cbKey(service: string, endpoint: string): CBKey {
  return `${service}.${endpoint}`;
}

function cbIsOpen(service: string, endpoint: string): boolean {
  const k = cbKey(service, endpoint);
  const s = FAILS.get(k);
  if (!s) return false;
  if (s.until && Date.now() < s.until) return true;
  if (s.until && Date.now() >= s.until) { FAILS.delete(k); return false; }
  return false;
}

function cbOnFail(service: string, endpoint: string, def?: ServiceEndpoint) {
  const k = cbKey(service, endpoint);
  const st = FAILS.get(k) || { count: 0 as number };
  st.count++;
  const cfg = def?.reliability?.circuit_breaker;
  if (cfg && st.count >= cfg.fail_threshold) {
    st.until = Date.now() + (cfg.cooloff_s * 1000);
  }
  FAILS.set(k, st);
}

function cbOnSuccess(service: string, endpoint: string) {
  FAILS.delete(cbKey(service, endpoint));
}

export type HealthStatus = "ok" | "degraded" | "down" | "skipped";

export interface HealthReportItem {
  key: string;                 // service.endpoint
  status: HealthStatus;
  latency_ms?: number;
  error?: string;
  url?: string;
  method?: Method;
  enabled?: boolean;
}

export interface HealthReport {
  status: HealthStatus;
  items: HealthReportItem[];
  ts: number;
}

export async function healthCheckAll(): Promise<HealthReport> {
  assertReal("health.check");
  const m = loadMatrix();
  const items: HealthReportItem[] = [];

  const tasks: Promise<void>[] = [];

  for (const [serviceName, svc] of Object.entries(m.services)) {
    // Find endpoint properties in the service (skip metadata like name, health, status_endpoint)
    const skipKeys = ['name', 'source', 'health', 'status_endpoint'];
    const endpointKeys = Object.keys(svc).filter(key => !skipKeys.includes(key));
    
    for (const epName of endpointKeys) {
      const def = svc[epName] as ServiceEndpoint;
      if (!def || typeof def !== 'object') continue;
      
      const key = `${serviceName}.${epName}`;
      const enabled = def.enabled !== false; // default true

      const task = (async () => {
        // skip disabled
        if (!enabled) {
          items.push({ key, status: "skipped", enabled });
          return;
        }

        // circuit breaker check
        if (cbIsOpen(serviceName, epName)) {
          items.push({ key, status: "down", error: "circuit_open", enabled });
          return;
        }

        // determine health specs - use service-level health or endpoint-specific
        let healthSpecs: string[] = [];
        if (def.health) {
          healthSpecs = Array.isArray(def.health) ? def.health : [def.health];
        } else if (svc.health) {
          healthSpecs = Array.isArray(svc.health) ? svc.health : [svc.health];
        } else if (def.protocol === "http" && (def.endpoint || def.url)) {
          const url = def.endpoint || def.url;
          healthSpecs = [`HEAD ${url}`];
        }

        if (healthSpecs.length === 0) {
          items.push({ key, status: "skipped", enabled, error: "no_health_spec" });
          return;
        }

        const timeout = def.reliability?.timeout_ms ?? 3500;
        const retry = Math.max(0, def.reliability?.retry ?? 0);

        // try each health spec until one succeeds
        let best: HealthReportItem | null = null;
        let lastErr: any = null;

        for (const spec of healthSpecs) {
          const { method, url } = parseHealthSpec(envSubstitute(spec) || "");
          let attempts = 0;

          while (attempts <= retry) {
            attempts++;
            const t0 = Date.now();
            try {
              const resp = await fetchWithTimeout(url, timeout, method);
              const dt = Date.now() - t0;
              if (resp.ok) {
                const it: HealthReportItem = { key, status: "ok", latency_ms: dt, method, url, enabled };
                best = best == null ? it : (it.latency_ms! < (best.latency_ms ?? Infinity) ? it : best);
                lastErr = null;
                break;
              } else {
                lastErr = `HTTP ${resp.status}`;
              }
            } catch (e: any) {
              lastErr = e?.name === "AbortError" ? "timeout" : String(e?.message || e);
            }
            if (attempts <= retry) await delay(120);
          }

          if (!lastErr && best) break;
        }

        if (best) {
          cbOnSuccess(serviceName, epName);
          items.push(best);
        } else {
          cbOnFail(serviceName, epName, def);
          items.push({ key, status: "down", error: lastErr || "health_failed", enabled });
        }
      })();

      tasks.push(task);
    }
  }

  await Promise.all(tasks);

  // aggregate status
  const hasDown = items.some(i => i.status === "down");
  const hasOk = items.some(i => i.status === "ok");
  const status: HealthStatus = hasDown ? (hasOk ? "degraded" : "down") : "ok";

  return { status, items, ts: Date.now() };
}

/** Utility për UI: merr statusin e një kyçi "service.endpoint" */
export async function healthOf(key: string): Promise<HealthReportItem> {
  const { service, endpoint } = getService(key);
  const report = await healthCheckAll();
  const item = report.items.find(i => i.key === `${service}.${endpoint}`);
  if (!item) return { key: `${service}.${endpoint}`, status: "skipped", error: "not_found" };
  return item;
}
