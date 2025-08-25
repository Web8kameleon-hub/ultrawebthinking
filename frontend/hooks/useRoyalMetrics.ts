"use client";

import { useEffect, useRef, useState } from "react";

export type RoyalMetrics = {
  time: number;
  cpu: number;
  gpu: number | null;
  memory: { total: number; used: number; free: number; usedPct: number };
  system: { platform: string; arch: string; cores: number; loadavg: number[]; uptimeSec: number };
  network: any;
};

export function useRoyalMetrics(intervalMs = 2000) {
  const [data, setData] = useState<RoyalMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    async function tick() {
      try {
        const res = await fetch("/api/metrics/live", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as RoyalMetrics;
        if (active) setData(json);
        if (active) setError(null);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Fetch error");
      }
    }

    // first fetch fast
    tick();
    // interval
    timer.current = window.setInterval(tick, intervalMs) as unknown as number;

    return () => {
      active = false;
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [intervalMs]);

  return { data, error };
}
