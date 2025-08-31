/**
 * Server API Client
 * Funksione për komunikim me backend AGI
 * © Web8 UltraThinking – Ledjan Ahmati
 */

interface NeuralStats {
  totalNodes: number;
  activeNodes: number;
  averageActivity: number;
  throughput: number;
  latency: number;
  accuracy: number;
  learningRate: number;
  memoryUsage: number;
  networkTopology: number[];
  nodes: Array<{
    id: string;
    type: string;
    activity: number;
    pulseRate: number;
    connections: number;
    status: string;
    errors: number;
  }>;
}

interface AGIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  responseTime: number;
}

/**
 * Merr statusin real të AGI Core
 */
export async function getAGIStatus(): Promise<AGIResponse<any>> {
  const res = await fetch('/api/agi/status');
  return res.json();
}

/**
 * Merr statistikat reale të rrjetit nervor
 */
export async function getNeuralStats(): Promise<AGIResponse<NeuralStats>> {
  const res = await fetch('/api/agi/neural-status');
  return res.json();
}

/**
 * Merr të dhënat reale të memories
 */
export async function getMemoryData(): Promise<AGIResponse<any>> {
  const res = await fetch('/api/agi/memory');
  return res.json();
}

/**
 * Dërgon komandë tek AGI CommandBridge
 */
export async function sendAGICommand(command: string, input: string): Promise<AGIResponse<any>> {
  const res = await fetch('/api/agi/control', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ command, input })
  });
  return res.json();
}

/**
 * Test connection me serverin
 */
export async function testServerConnection(): Promise<boolean> {
  try {
    const res = await fetch('/api/ping');
    return res.ok;
  } catch {
    return false;
  }
}
