import crypto from "node:crypto";
import { ActionBroker } from "./action-broker";
import { signCapability } from "./capability";
import { ActionRequest, Capability } from "./types";

// Utility
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"));

export interface SandboxConfig {
  secret: string;
  agentId: string;
  scope: string; // e.g., "sandbox:web8:zone-01"
  allowLive?: boolean; // if true, policy can allow execution (not just simulate)
}

export class FreedomSandbox {
  private broker: ActionBroker;
  private cap?: Capability;

  constructor(cfg: SandboxConfig, providers: ConstructorParameters<typeof ActionBroker>[1]) {
    this.broker = new ActionBroker(cfg.secret, providers);
    // default capability: read/network; budgets 0; rate 30/min
    this.cap = signCapability({
      issuer: "PolicyEngine@web8",
      subject: cfg.agentId,
      actions: ["READ_DB", "NETWORK_FETCH", "LOG"],
      scope: cfg.scope,
      constraints: { ratePerMin: 30, budgetALB: 0 },
    }, cfg.secret);
  }

  setCapability(cap: Capability) { this.cap = cap; }

  async act(kind: ActionRequest["kind"], params: ActionRequest["params"], opts?: { dryRun?: boolean; humanGate?: boolean }) {
    if (!this.cap) throw new Error("No capability set");
    
    const meta: ActionRequest["meta"] = { 
      agentId: this.cap.subject, 
      ts: new Date().toISOString() 
    };
    
    if (opts?.dryRun !== undefined) meta.dryRun = opts.dryRun;
    if (opts?.humanGate !== undefined) meta.humanGate = opts.humanGate;

    const req: ActionRequest = {
      id: uuid(),
      kind,
      params,
      meta,
      capability: this.cap,
    };
    return this.broker.handle(req);
  }

  audit() { return this.broker.exportAudit(); }
  verifyAudit() { return this.broker.verifyAudit(); }
  budgetUsage(key: string) { return this.broker.getBudgetUsage(key); }
}
