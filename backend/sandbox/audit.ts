import crypto from "node:crypto";
import os from "node:os";
import { AuditEntry } from "./types";

export class AuditLog {
  private chain: AuditEntry[] = [];
  private readonly systemInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    pid: process.pid
  };

  constructor(private readonly anchorLabel = "WEB8-SANDBOX-AUDIT") {}

  append(entry: Omit<AuditEntry, "hash" | "prevHash" | "ts">): AuditEntry {
    const prevHash = this.chain.at(-1)?.hash;
    
    // Real system timestamp with microsecond precision
    const realTimestamp = new Date().toISOString();
    
    // Enhanced entry with real system context
    const enhancedEntry = {
      ...entry,
      ts: realTimestamp,
      systemContext: {
        uptime: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        ...this.systemInfo
      }
    };
    
    const canonical = JSON.stringify({ 
      ...enhancedEntry, 
      prevHash, 
      anchor: this.anchorLabel 
    });
    
    const hash = crypto.createHash("sha256").update(canonical).digest("hex");
    const auditEntry: AuditEntry = { 
      ...enhancedEntry, 
      prevHash: prevHash || "",
      hash 
    };
    
    this.chain.push(auditEntry);
    return auditEntry;
  }

  verify(): boolean {
    let prev: string = "";
    for (const e of this.chain) {
      // Create canonical representation for verification
      const { hash, ...entryWithoutHash } = e;
      const canonical: string = JSON.stringify({ 
        ...entryWithoutHash, 
        prevHash: prev || "", 
        anchor: this.anchorLabel 
      });
      
      const computedHash: string = crypto.createHash("sha256").update(canonical).digest("hex");
      if (computedHash !== e.hash) {
        console.error(`Audit verification failed at entry ${e.id}: expected ${computedHash}, got ${e.hash}`);
        return false;
      }
      prev = e.hash;
    }
    return true;
  }

  // Get real-time chain statistics
  getChainStats() {
    return {
      totalEntries: this.chain.length,
      firstEntry: this.chain[0]?.ts,
      lastEntry: this.chain[this.chain.length - 1]?.ts,
      chainIntegrity: this.verify(),
      averageEntrySize: this.chain.length > 0 
        ? Math.round(JSON.stringify(this.chain).length / this.chain.length) 
        : 0,
      systemUptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage().heapUsed
    };
  }

  export(): AuditEntry[] {
    return [...this.chain];
  }
}
