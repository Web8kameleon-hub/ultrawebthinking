export interface SenseModule {
  processInput(input: string): Promise<any>;
}

export interface PlannerModule {
  planNextSteps(state: any): Promise<any>;
}

export interface ResponseModule {
  generateResponse(state: any, plan: any): Promise<string>;
}

export interface MonitorModule {
  log(message: string, level: "info" | "warning" | "error", meta?: any): void;
  monitorExecution<T>(label: string, fn: () => Promise<T>): Promise<T>;
}