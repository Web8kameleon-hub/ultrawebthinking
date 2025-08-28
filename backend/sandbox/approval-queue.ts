// Industrial in-memory approval queue (swap with DB when ready)
import crypto from "node:crypto";
import { ActionRequest } from "./types";

export type ReviewItem = {
  id: string;
  ts: string;
  reason: string;
  req: ActionRequest;
  status: "PENDING" | "APPROVED" | "DENIED";
};

class ApprovalQueue {
  private items = new Map<string, ReviewItem>();

  enqueue(req: ActionRequest, reason: string): ReviewItem {
    const id = crypto.randomUUID?.() ?? crypto.randomBytes(16).toString("hex");
    const item: ReviewItem = { id, ts: new Date().toISOString(), reason, req, status: "PENDING" };
    this.items.set(id, item);
    return item;
  }

  list(): ReviewItem[] {
    return [...this.items.values()].sort((a, b) => b.ts.localeCompare(a.ts));
  }

  get(id: string) { return this.items.get(id); }

  approve(id: string) {
    const it = this.items.get(id); if (!it) return undefined;
    it.status = "APPROVED"; return it;
  }

  deny(id: string) {
    const it = this.items.get(id); if (!it) return undefined;
    it.status = "DENIED"; return it;
  }
}

export const approvalQueue = new ApprovalQueue();
