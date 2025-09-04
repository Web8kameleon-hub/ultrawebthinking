/**
 * Health Matrix Component - Real Services Status Grid
 * Displays live status of all service endpoints with latency and error info
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

"use client";

import React from 'react';
import useSWR from 'swr';

interface HealthItem {
  key: string;
  status: "ok" | "degraded" | "down" | "skipped";
  latency_ms?: number;
  error?: string;
  url?: string;
  method?: string;
  enabled?: boolean;
}

interface HealthReport {
  status: "ok" | "degraded" | "down";
  items: HealthItem[];
  ts: number;
}

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then(r => r.json());

export default function HealthMatrix() {
  const { data, error } = useSWR<HealthReport>("/api/health", fetcher, { refreshInterval: 5000 });

  if (error) return <Panel><ErrorBox msg={String(error)} /></Panel>;
  if (!data) return <Panel><div className="animate-pulse text-sm text-neutral-400">Loading health…</div></Panel>;

  const groups = groupByService(data.items);

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">🧭 Service Health Matrix</h2>
        <HealthBadge status={data.status} />
      </header>

      <div className="grid gap-3">
        {Object.entries(groups).map(([svc, items]) => (
          <div key={svc} className="rounded-xl border border-neutral-800 bg-neutral-950">
            <div className="flex items-center justify-between p-3 border-b border-neutral-800">
              <div className="font-medium">{svc}</div>
              <SvcBadge items={items} />
            </div>
            <div className="divide-y divide-neutral-900">
              {items.map((it) => (
                <Row key={it.key} item={it} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="text-xs text-neutral-500">Updated: {new Date(data.ts).toLocaleString()}</footer>
    </section>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      {children}
    </section>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return <div className="text-sm text-red-400">Error: {msg}</div>;
}

function HealthBadge({ status }: { status: HealthReport["status"] }) {
  const color = status === "ok" ? "bg-green-600" : status === "degraded" ? "bg-yellow-600" : "bg-red-600";
  return <span className={`px-2 py-1 rounded text-xs text-white ${color}`}>HEALTH: {status.toUpperCase()}</span>;
}

function Row({ item }: { item: HealthItem }) {
  const color = item.status === "ok" ? "text-green-400" : item.status === "degraded" ? "text-yellow-400" : item.status === "down" ? "text-red-400" : "text-neutral-500";
  return (
    <div className="grid grid-cols-6 gap-3 p-3 text-sm">
      <div className="col-span-2 font-mono truncate" title={item.key}>{item.key.split(".")[1]}</div>
      <div className={`font-medium ${color}`}>{item.status.toUpperCase()}</div>
      <div className="text-neutral-400">{item.latency_ms != null ? `${item.latency_ms} ms` : "—"}</div>
      <div className="text-neutral-400 truncate" title={item.url || ""}>{item.url || "—"}</div>
      <div className="text-neutral-500 truncate" title={item.error || ""}>{item.error || ""}</div>
    </div>
  );
}

function groupByService(items: HealthItem[]): Record<string, HealthItem[]> {
  return items.reduce((acc, it) => {
    const svc = it.key.split(".")[0] || "misc";
    (acc[svc] ||= []).push(it);
    return acc;
  }, {} as Record<string, HealthItem[]>);
}

function SvcBadge({ items }: { items: HealthItem[] }) {
  const ok = items.filter(i => i.status === "ok").length;
  const down = items.filter(i => i.status === "down").length;
  const total = items.length;
  const color = down > 0 ? "bg-red-600" : ok === total ? "bg-green-600" : "bg-yellow-600";
  return (
    <span className={`px-2 py-0.5 rounded text-xs text-white ${color}`}>{ok}/{total} OK</span>
  );
}
