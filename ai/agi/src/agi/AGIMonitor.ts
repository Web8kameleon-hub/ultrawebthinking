// src/agi/AGIMonitor.ts
import { monitor } from "./monitor";

export class AGIMonitor {
  private logs: { input: string; output: string; timestamp: Date }[] = [];

  logCommand(input: string, output: string) {
    const entry = {
      input,
      output,
      timestamp: new Date(),
    };
    this.logs.push(entry);
    monitor.log(`🧠 AGIMonitor: Komandë: '${input}' → '${output}'`, "info", entry);
  }

  getLogs() {
    return this.logs;
  }

  exportLogsToJSON() {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const agiMonitor = new AGIMonitor();