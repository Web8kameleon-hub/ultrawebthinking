/**
 * Modul për monitorimin e gjendjes dhe performancës së sistemit AGI.
 * Përgjegjëse për regjistrimin e ngjarjeve, ndjekjen e statistikave dhe raportimin e gjendjes.
 * 
 * Funksionalitetet kryesore:
 * - Regjistrimi i ngjarjeve me nivele të ndryshme (info, warning, error).
 * - Gjenerimi i statistikave për performancën e sistemit.
 * - Monitorimi i kohës së ekzekutimit për funksione kritike.
 * - Mbështetje për eksportimin e log-eve dhe statistikave.
 */

type LogLevel = "info" | "warning" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

interface PerformanceMetrics {
  functionName: string;
  executionTime: number; // Në milisekonda
}

export class Monitor {
  private logs: LogEntry[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];

  /**
   * Regjistron një ngjarje në sistem.
   * @param message - Mesazhi i ngjarjes.
   * @param level - Niveli i log-ut (info, warning, error).
   * @param context - Informacion shtesë për ngjarjen (opsionale).
   */
  log(message: string, level: LogLevel = "info", context?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    this.logs.push(entry);
    console[level === "error" ? "error" : "log"](`[${level.toUpperCase()}] ${message}`, context || "");
  }

  /**
   * Monitoron kohën e ekzekutimit të një funksioni.
   * @param functionName - Emri i funksionit që monitorohet.
   * @param fn - Funksioni që duhet monitoruar.
   * @returns Rezultati i funksionit të ekzekutuar.
   */
  async monitorExecution<T>(functionName: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      return result;
    } finally {
      const end = performance.now();
      const executionTime = end - start;
      this.performanceMetrics.push({ functionName, executionTime });
      this.log(`Funksioni "${functionName}" u ekzekutua për ${executionTime.toFixed(2)} ms.`, "info");
    }
  }

  /**
   * Gjeneron një raport të statistikave të performancës.
   * @returns Një listë me metrikat e performancës.
   */
  getPerformanceReport(): PerformanceMetrics[] {
    return this.performanceMetrics;
  }

  /**
   * Eksporton log-et në një skedar JSON.
   * @returns Një string JSON që përmban log-et.
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Pastron të gjitha log-et dhe metrikat e performancës.
   */
  clear(): void {
    this.logs = [];
    this.performanceMetrics = [];
    this.log("Të gjitha log-et dhe metrikat e performancës u pastruan.", "info");
  }
}

// Krijimi i një instance globale të Monitor për përdorim në sistem
export const monitor = new Monitor();

/**
 * Shembull përdorimi i modulit Monitor.
 */
async function exampleUsage() {
  monitor.log("Sistemi AGI po fillon përpunimin...", "info");

  // Monitorimi i një funksioni të simulimit
  await monitor.monitorExecution("simulateProcessing", async () => {
    return new Promise((resolve) => setTimeout(resolve, 500)); // Simulon një vonesë prej 500ms
  });

  monitor.log("Përpunimi përfundoi me sukses.", "info");

  // Shfaqja e raportit të performancës
  console.log("Raporti i Performancës:", monitor.getPerformanceReport());

  // Eksportimi i log-eve
  console.log("Log-et e Eksportuara:", monitor.exportLogs());
}

// Ekzekutimi i shembullit
exampleUsage();