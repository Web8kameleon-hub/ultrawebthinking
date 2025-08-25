import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

// sample CPU usage by diff of idle vs total across cores
function snapshotCPU() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const c of cpus) {
    const t = c.times.user + c.times.nice + c.times.sys + c.times.irq + c.times.idle;
    total += t;
    idle += c.times.idle;
  }
  return { idle, total };
}

async function cpuPercent(sampleMs = 200): Promise<number> {
  const a = snapshotCPU();
  await new Promise(r => setTimeout(r, sampleMs));
  const b = snapshotCPU();
  const idle = b.idle - a.idle;
  const total = b.total - a.total;
  if (total <= 0) return 0;
  const usage = 1 - idle / total;
  return Math.max(0, Math.min(1, usage)) * 100;
}

async function gpuPercent(): Promise<number | null> {
  // Optional (Windows/Linux me NVIDIA). Në mjedise pa GPU -> null.
  try {
    const { stdout } = await execFileAsync("nvidia-smi", ["--query-gpu=utilization.gpu", "--format=csv,noheader,nounits"], { timeout: 500 });
    const lines = stdout.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!lines.length) return null;
    // nëse ka shumë GPU, merret mesatarja
    const avg = lines.map(Number).filter(n => Number.isFinite(n)).reduce((a,b)=>a+b,0) / lines.length;
    return Math.round(avg);
  } catch {
    return null;
  }
}

export async function GET() {
  const [cpu, gpu] = await Promise.all([cpuPercent(200), gpuPercent()]);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const uptimeSec = os.uptime();

  const payload = {
    time: Date.now(),
    cpu: Math.round(cpu),                // %
    gpu: gpu,                            // % | null
    memory: {
      total: totalMem,                   // bytes
      used: usedMem,                     // bytes
      free: freeMem,                     // bytes
      usedPct: +(usedMem / totalMem * 100).toFixed(1),
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cores: os.cpus().length,
      loadavg: os.loadavg(),            // [1,5,15] (0 në Windows)
      uptimeSec,
    },
    // vendi për të shtuar: rrjet/throughput nga backend-i juaj nëse keni kolektor
    network: null,
  };

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
