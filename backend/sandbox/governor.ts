import { ActionKind, ActionRequest } from "./types";

export class RateLimiter {
  private buckets = new Map<string, number[]>();
  constructor(private readonly windowMs = 60_000) {}

  allow(key: string, limit: number, now = Date.now()): boolean {
    const hitlist = this.buckets.get(key) ?? [];
    const cutoff = now - this.windowMs;
    const pruned = hitlist.filter(ts => ts >= cutoff);
    if (pruned.length >= limit) {
      this.buckets.set(key, pruned);
      return false;
    }
    pruned.push(now);
    this.buckets.set(key, pruned);
    return true;
  }
}

export class BudgetManager {
  private spentALB = new Map<string, number>(); // key by agent or capability scope

  spendALB(key: string, amount: number, limit: number) {
    const used = this.spentALB.get(key) ?? 0;
    if (used + amount > limit) throw new Error(`Budget exceeded: ${used + amount} > ${limit}`);
    this.spentALB.set(key, used + amount);
  }

  getUsage(key: string) {
    return this.spentALB.get(key) ?? 0;
  }
}

export function rateKey(req: ActionRequest): string {
  return `${req.meta.agentId}::${req.kind}`;
}

export function budgetKey(req: ActionRequest): string {
  return req.capability?.scope ?? req.meta.agentId;
}

export function defaultRateLimitFor(kind: ActionKind): number {
  switch (kind) {
    case "NETWORK_FETCH": return 30;
    case "READ_DB": return 120;
    case "WRITE_DB": return 30;
    case "FILE_WRITE": return 10;
    case "TOKEN_TRANSFER": return 2;
    default: return 20;
  }
}
