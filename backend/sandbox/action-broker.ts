import { assertCapability } from "./capability";
import { AuditLog } from "./audit";
import { BudgetManager, RateLimiter, budgetKey, defaultRateLimitFor, rateKey } from "./governor";
import { decide } from "./policy";
import { ActionRequest, BrokerResult } from "./types";
import { approvalQueue } from "./approval-queue";
import crypto from "node:crypto";
import os from "node:os";

type Providers = {
  READ_DB: (p: any) => Promise<unknown>;
  WRITE_DB: (p: any) => Promise<unknown>;
  NETWORK_FETCH: (p: { url: string; method?: string; body?: any; headers?: Record<string,string> }) => Promise<{ status: number; bytes: number }>;
  FILE_WRITE: (p: { path: string; data: string | Uint8Array }) => Promise<{ bytes: number }>;
  START_NODE: (p: any) => Promise<unknown>;
  SPAWN_PROCESS: (p: { cmd: string; args?: string[] }) => Promise<{ code: number }>;
  TOKEN_TRANSFER: (p: { amountALB: number; to: string; chain?: "JUNIOR"|"ALBION" }) => Promise<{ txId: string }>;
  LOG: (p: { level: "info"|"warn"|"error"; message: string }) => Promise<true>;
  CUSTOM: (p: any) => Promise<unknown>;
};

export class ActionBroker {
  private rate = new RateLimiter(60_000);
  private budget = new BudgetManager();
  private audit = new AuditLog("WEB8-FREEDOM-SANDBOX");
  private readonly startTime = Date.now();
  private readonly systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    pid: process.pid
  };

  constructor(
    private readonly secret: string,
    private readonly providers: Partial<Providers>,
  ) {}

  // Generate real precise timestamp with system context
  private getRealTimestamp(): string {
    return new Date().toISOString();
  }

  // Generate real request ID with system entropy
  private generateRealRequestId(): string {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const processInfo = `${process.pid}-${process.uptime().toFixed(0)}`;
    return `req-${timestamp}-${processInfo}-${randomBytes}`;
  }

  async handle(req: ActionRequest): Promise<BrokerResult> {
    const realTimestamp = this.getRealTimestamp();
    const realSystemState = {
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      uptime: Math.floor(process.uptime()),
      loadAverage: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    };

    // Audit: received with real system data
    this.audit.append({ 
      id: req.id, 
      actor: req.meta.agentId, 
      kind: "ACTION_REQ", 
      payload: { 
        ...req, 
        realSystemState,
        brokerUptime: Date.now() - this.startTime,
        systemInfo: this.systemInfo
      } 
    });

    // Policy decision
    const d = decide(req);
    const patched = { ...req, ...(d.patch ?? {}) };
    this.audit.append({ 
      id: req.id, 
      actor: "policy", 
      kind: "POLICY", 
      payload: { 
        ...d, 
        realDecisionTime: realTimestamp,
        systemLoad: realSystemState.loadAverage[0]
      } 
    });

    // NEW: when REVIEW is required, queue it and return reviewId
    if (d.decision === "REVIEW") {
      const item = approvalQueue.enqueue(patched, d.reason);
      return { ok: true, dryRun: true, decision: "REVIEW", data: { queued: true }, reviewId: item.id };
    }

    if (d.decision === "DENY") return { ok: false, dryRun: true, decision: d.decision, error: d.reason };

    // Capability check (required for anything except LOG/READ_DB/NETWORK in SAFE sim)
    const needsCap = !["LOG", "READ_DB", "NETWORK_FETCH"].includes(patched.kind) || d.decision === "ALLOW";
    if (needsCap) {
      try {
        assertCapability(patched.capability, this.secret, patched.meta.agentId, patched.kind);
      } catch (e: any) {
        return { ok: false, dryRun: true, decision: "DENY", error: `Capability error: ${e.message}` };
      }
    }

    // Rate limit
    const rateLimit = patched.capability?.constraints?.ratePerMin ?? defaultRateLimitFor(patched.kind as any);
    if (!this.rate.allow(rateKey(patched), rateLimit)) {
      return { ok: false, dryRun: true, decision: "DENY", error: "Rate limit exceeded" };
    }

    // TOKEN_TRANSFER specific checks
    if (patched.kind === "TOKEN_TRANSFER") {
      const lim = patched.capability?.constraints?.budgetALB ?? 0;
      const amt = Number(patched.params?.amountALB ?? 0);
      if (!(amt > 0)) return { ok: false, dryRun: true, decision: "DENY", error: "Invalid amount" };

      // Albion allowlist check
      const scope = patched.capability?.scope ?? "";
      if (scope.startsWith("wallet:albion")) {
        const allowed = (process.env.WEB8_ALBION_RECIPIENTS ?? "")
          .split(",").map(s => s.trim()).filter(Boolean);
        const to = String(patched.params?.to ?? "");
        if (allowed.length && !allowed.includes(to)) {
          return { ok: false, dryRun: true, decision: "DENY", error: "Recipient not allowlisted for Albion" };
        }
      }

      this.budget.spendALB(budgetKey(patched), amt, lim);
    }

    // Simulate if required
    const simulate = d.decision === "SIMULATE" || patched.meta.dryRun === true;
    if (simulate) {
      const sim = { 
        simulated: true, 
        kind: patched.kind, 
        params: patched.params, 
        note: d.reason,
        realSystemState: process.memoryUsage(),
        executionContext: {
          brokerUptime: Date.now() - this.startTime,
          nodeUptime: Math.floor(process.uptime()),
          ...this.systemInfo
        }
      };
      this.audit.append({ 
        id: req.id, 
        actor: "system", 
        kind: "ACTION_RES", 
        payload: sim 
      });
      return { ok: true, dryRun: true, decision: d.decision, data: sim };
    }

    // Execute via provider
    const provider = (this.providers as any)[patched.kind];
    if (!provider) {
      return { ok: false, dryRun: false, decision: "DENY", error: `No provider for ${patched.kind}` };
    }

    try {
      const res = await provider(patched.params);
      this.audit.append({ 
        id: req.id, 
        actor: "system", 
        kind: "ACTION_RES", 
        payload: {
          ...res,
          executionTime: Date.now() - Date.parse(realTimestamp),
          realSystemState: process.memoryUsage(),
          providerType: patched.kind
        }
      });
      return { ok: true, dryRun: false, decision: "ALLOW", data: res };
    } catch (e: any) {
      this.audit.append({ 
        id: req.id, 
        actor: "system", 
        kind: "ERROR", 
        payload: { 
          message: e.message,
          stack: e.stack,
          errorTimestamp: this.getRealTimestamp(),
          systemState: process.memoryUsage(),
          errorContext: {
            kind: patched.kind,
            params: patched.params,
            ...this.systemInfo
          }
        }
      });
      return { ok: false, dryRun: false, decision: "ALLOW", error: e.message };
    }
  }

  exportAudit() { return this.audit.export(); }
  verifyAudit() { return this.audit.verify(); }
  getBudgetUsage(key: string) { return this.budget.getUsage(key); }
  
  // Real system status methods
  getRealSystemStatus() {
    return {
      brokerUptime: Date.now() - this.startTime,
      processUptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      systemLoad: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      networkInterfaces: Object.keys(os.networkInterfaces()),
      auditChainIntegrity: this.audit.verify(),
      auditEntryCount: this.audit.export().length,
      ...this.systemInfo
    };
  }

  getRealPerformanceMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      timestamp: this.getRealTimestamp(),
      memory: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
        arrayBuffers: memUsage.arrayBuffers
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      system: {
        loadAverage: os.loadavg(),
        uptime: os.uptime(),
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        cpuCount: os.cpus().length
      }
    };
  }
}
